import { TextDocument } from "vscode-languageserver-textdocument";
import type {
	Definition,
	DefinitionParams,
	Hover,
	HoverParams,
	TextDocumentPositionParams,
} from "vscode-languageserver/node";
import {
	createConnection,
	ProposedFeatures,
	TextDocuments,
	TextDocumentSyncKind,
} from "vscode-languageserver/node";

import { getDefaultSettings, type SacSettings, updateSettings } from "$extension/settings";
import { createDiagnosticsWorkflow } from "$lsp-server/diagnostics/workflow";
import { provideHover } from "$lsp-server/hover-info/hover";
import { provideDefinition } from "$lsp-server/navigation/provider";
import { getCompilerNavigationRuntime } from "$sac2c/runtime/compilerRuntime";
import { uriToFsPath } from "$util/documentUtils";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
let workspaceRoot = process.cwd();
let workspaceRoots: string[] = [workspaceRoot];
let extensionInstallRoot = "";
let settings: SacSettings = getDefaultSettings();
const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

const diagnosticsWorkflow = createDiagnosticsWorkflow({
	connection,
	documents,
	pendingTimers,
	getSettings: () => settings,
	getWorkspaceRoot: () => workspaceRoot,
	getWorkspaceRoots: () => workspaceRoots,
	runSafely,
});

function runSafely(work: Promise<void>, context: string): void {
	work.catch((error) => {
		const message = error instanceof Error ? error.stack || error.message : String(error);
		connection.console.error(`[sac-server] ${context} failed: ${message}`);
	});
}

function createHoverDebugLogger(
	enabled: boolean,
	prefix: string,
): ((message: string, payload?: Record<string, unknown>) => void) | undefined {
	if (!enabled) {
		return undefined;
	}

	return (message: string, payload?: Record<string, unknown>): void => {
		const serialized = payload ? ` ${JSON.stringify(payload)}` : "";
		connection.console.error(`[${prefix}] ${message}${serialized}`);
	};
}

connection.onInitialize((params) => {
	console.error("[server] Initializing LSP server...");
	const init = params.initializationOptions as { extensionPath?: unknown; trace?: string } | undefined;
	extensionInstallRoot = typeof init?.extensionPath === "string" ? init.extensionPath : "";

	if (params.workspaceFolders && params.workspaceFolders.length > 0) {
		workspaceRoot = uriToFsPath(params.workspaceFolders[0].uri);
		workspaceRoots = params.workspaceFolders.map((folder) => uriToFsPath(folder.uri));
	} else if (params.rootUri) {
		workspaceRoot = uriToFsPath(params.rootUri);
		workspaceRoots = [workspaceRoot];
	} else {
		workspaceRoots = [workspaceRoot];
	}

	console.error(`[server] Workspace root: ${workspaceRoot}`);
	console.error(`[server] Workspace folders: ${workspaceRoots.length}`);
	console.error(`[server] Extension install root: ${extensionInstallRoot}`);
	console.error("[server] Server capabilities: hover, definition, incremental-sync");

	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			diagnosticProvider: undefined,
			hoverProvider: true,
			definitionProvider: true,
		},
	};
});

connection.onHover(async (params: HoverParams & TextDocumentPositionParams): Promise<Hover | null> => {
	const document = documents.get(params.textDocument.uri);
	if (!document) {
		return null;
	}

	try {
		const hoverResult = await provideHover(
			document,
			params.position,
			workspaceRoot,
			extensionInstallRoot,
			settings.navigationBackend,
			getCompilerNavigationRuntime(settings, workspaceRoot),
			createHoverDebugLogger(settings.compilerTrace !== "off", "hover"),
		);

		return hoverResult;
	} catch (error) {
		const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
		connection.console.error(`[hover] provider crashed: ${message}`);
		return null;
	}
});

connection.onDefinition(async (params: DefinitionParams): Promise<Definition | null> => {
	const document = documents.get(params.textDocument.uri);
	if (!document) {
		return null;
	}

	const result = await provideDefinition({
		document,
		position: params.position,
		workspaceRoot,
		workspaceRoots,
		openDocuments: documents.all(),
		excludedDirNames: new Set(settings.workspaceScanExcludeDirectories),
		navigationBackend: settings.navigationBackend,
		runtime: getCompilerNavigationRuntime(settings, workspaceRoot),
	});

	return result;
});

connection.onInitialized(() => {
	runSafely(
		(async () => {
			console.error("[server] Initialized, loading configuration...");
			const sacConfig = await connection.workspace.getConfiguration("sac");
			settings = updateSettings({ sac: sacConfig as unknown });
			console.error(`[server] Configuration loaded. Navigation backend: ${settings.navigationBackend}, Diagnostics mode: ${settings.diagnosticsMode}`);
			if (settings.workspaceScanOnInitialize) {
				console.error("[server] Initiating workspace scan on startup...");
				await diagnosticsWorkflow.validateAllWorkspaceSacFiles();
			}
		})(),
		"onInitialized",
	);
});

connection.onDidChangeConfiguration((change) => {
	settings = updateSettings(change.settings as unknown);

	if (settings.workspaceScanOnConfigurationChange) {
		runSafely(diagnosticsWorkflow.validateAllWorkspaceSacFiles(), "configuration workspace scan");
		return;
	}

	for (const document of documents.all()) {
		runSafely(diagnosticsWorkflow.validateDocument(document), `configuration document validate (${document.uri})`);
	}
});

documents.onDidOpen((event) => {
	if (settings.diagnosticsMode === "manual") {
		console.error(`[diagnostics] Manual mode: skipping validation for ${event.document.uri}`);
		return;
	}

	if (settings.diagnosticsMode === "onType") {
		console.error(`[diagnostics] Scheduling onType validation for ${event.document.uri}`);
		diagnosticsWorkflow.scheduleOnTypeValidation(event.document);
		return;
	}

	console.error(`[diagnostics] Validating on open: ${event.document.uri}`);
	runSafely(diagnosticsWorkflow.validateDocument(event.document), `open document validate (${event.document.uri})`);
});

documents.onDidChangeContent((event) => {
	if (settings.diagnosticsMode !== "onType") {
		return;
	}

	diagnosticsWorkflow.scheduleOnTypeValidation(event.document);
});

documents.onDidSave((event) => {
	if (settings.diagnosticsMode === "onSave") {
		console.error(`[diagnostics] Validating on save: ${event.document.uri}`);
		runSafely(diagnosticsWorkflow.validateDocument(event.document), `save document validate (${event.document.uri})`);
	}
});

documents.onDidClose((event) => {
	diagnosticsWorkflow.handleDocumentClose(event.document.uri);
});

documents.listen(connection);
connection.listen();