import { SAC_CONFIG_SECTION, SAC_FILE_GLOB, SAC_LANGUAGE_ID, SAC_URI_FILE_SCHEME } from "$constants/language";
import { provideHoverFallback } from "$extension/fallback/hover-info/hoverProvider";
import { provideDefinitionFallback } from "$extension/fallback/navigation/definitionProvider";
import { Logger } from "$util/logging";
import * as path from "path";
import * as vscode from "vscode";
import { LanguageClient, Trace, TransportKind } from "vscode-languageclient/node";

interface FeatureLifecycle {
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}

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

export class LanguageClientFeature implements FeatureLifecycle {
  private client: LanguageClient | undefined;

  constructor(private readonly context: vscode.ExtensionContext) { }

  public async activate(): Promise<void> {
    const config = vscode.workspace.getConfiguration(SAC_CONFIG_SECTION);
    const legacyEnabled = config.get<boolean>("languageServer.enable", true);
    const enabled = config.get<boolean>("features.languageServer.enable", legacyEnabled);
    if (!enabled) {
      return;
    }

    const serverModule = this.context.asAbsolutePath(path.join("out", "lsp-server", "server.js"));
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
      documentSelector: [{ scheme: SAC_URI_FILE_SCHEME, language: SAC_LANGUAGE_ID }],
      middleware: {
        provideHover: async (document: any, position: any, token: any, next: any) => {
          const result = await next(document, position, token);
          if (result) {
            return result;
          }

          const uri = vscode.Uri.parse(String(document.uri));
          if (uri.scheme !== "file") {
            return result;
          }

          Logger.info(`[lsp-client] Hover fallback for ${uri.toString()}`);
          const fallbackDocument = await vscode.workspace.openTextDocument(uri);
          return provideHoverFallback(fallbackDocument, position);
        },
        provideDefinition: async (document: any, position: any, token: any, next: any) => {
          const result = await next(document, position, token);
          if (result) {
            return result;
          }

          const uri = vscode.Uri.parse(String(document.uri));
          if (uri.scheme !== "file") {
            return result;
          }

          Logger.info(`[lsp-client] Definition fallback for ${uri.toString()}`);
          const fallbackDocument = await vscode.workspace.openTextDocument(uri);
          return provideDefinitionFallback(fallbackDocument, position);
        },
      },
      synchronize: {
        configurationSection: SAC_CONFIG_SECTION,
        fileEvents: vscode.workspace.createFileSystemWatcher(SAC_FILE_GLOB),
      },
      traceOutputChannel: vscode.window.createOutputChannel("SaC Language Server Trace"),
      outputChannel: vscode.window.createOutputChannel("SaC Language Server"),
      initializationOptions: {
        trace: toClientTraceLevel(traceSetting),
        extensionPath: this.context.extensionPath,
      },
    };

    this.client = new LanguageClient("sacLanguageServer", "SaC Language Server", serverOptions, clientOptions);

    try {
      await this.client.start();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`Failed to start SaC language server: ${message}`);
      this.client = undefined;
      return;
    }
  }

  public async deactivate(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      await this.client.stop();
    } catch {
      // Ignore stop errors during shutdown.
    }

    this.client = undefined;
  }
}

export type { FeatureLifecycle };
