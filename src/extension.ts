import * as path from "path";
import * as vscode from "vscode";
import {
  LanguageClient,
  Trace,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

/**
 * Maps user-facing trace settings to the language client trace enum.
 *
 * !NOTE: Unknown values are intentionally treated as "off" to avoid noisy output.
 *
 * @param value Trace setting read from extension configuration.
 * @returns The trace level expected by the language client.
 */
function toClientTraceLevel(value: string): Trace {
  switch (value) {
    case "messages":
      return Trace.Messages;
    case "verbose":
      return Trace.Verbose;
    case "off":
    default:
      return Trace.Off;
  }
}

/**
 * Activates the extension and starts the SaC language client.
 *
 * !IMPORTANT: The server module is loaded from compiled output under out/server.
 * ?TODO: Add a startup self-check command that validates configured backend availability
 *        (local, WSL, Docker) and reports actionable guidance to users.
 *
 * @param context VS Code extension activation context.
 * @returns Promise resolved once the language client has started.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration("sac");
  const enabled = config.get<boolean>("languageServer.enable", true);

  if (!enabled) {
    return;
  }

  const serverModule = context.asAbsolutePath(path.join("out", "server", "server.js"));

  const serverOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: { execArgv: ["--nolazy", "--inspect=6010"] },
    },
  };

  const traceSetting = config.get<string>("compiler.trace", "off");

  const clientOptions = {
    documentSelector: [{ scheme: "file", language: "sac" }],
    synchronize: {
      configurationSection: "sac",
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.sac"),
    },
    traceOutputChannel: vscode.window.createOutputChannel("SaC Language Server Trace"),
    outputChannel: vscode.window.createOutputChannel("SaC Language Server"),
    initializationOptions: {
      trace: toClientTraceLevel(traceSetting),
    },
  };

  client = new LanguageClient(
    "sacLanguageServer",
    "SaC Language Server",
    serverOptions,
    clientOptions,
  );

  await client.start();
}

/**
 * Deactivates the extension and stops the language client if running.
 *
 * @returns Promise resolved when shutdown is complete.
 */
export async function deactivate(): Promise<void> {
  if (!client) return;
  await client.stop();
}
