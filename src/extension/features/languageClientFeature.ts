import * as path from "path";
import * as vscode from "vscode";
import {
  LanguageClient,
  Trace,
  TransportKind,
} from "vscode-languageclient/node";

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

/**
 * Language-client feature wrapper to keep extension entrypoint minimal.
 */
export class LanguageClientFeature implements FeatureLifecycle {
  private client: LanguageClient | undefined;

  constructor(private readonly context: vscode.ExtensionContext) { }

  public async activate(): Promise<void> {
    const config = vscode.workspace.getConfiguration("sac");
    const enabled = config.get<boolean>("languageServer.enable", true);
    if (!enabled) {
      return;
    }

    const serverModule = this.context.asAbsolutePath(path.join("out", "server", "server.js"));
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
        extensionPath: this.context.extensionPath,
      },
    };

    this.client = new LanguageClient(
      "sacLanguageServer",
      "SaC Language Server",
      serverOptions,
      clientOptions,
    );

    try {
      await this.client.start();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`Failed to start SaC language server: ${message}`);

      // I clear the reference to avoid later stop calls on a failed client state.
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
      // I intentionally ignore stop errors for failed/starting states during shutdown.
    }

    this.client = undefined;
  }
}

export type { FeatureLifecycle };
