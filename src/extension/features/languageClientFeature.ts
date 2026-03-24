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
      },
    };

    this.client = new LanguageClient(
      "sacLanguageServer",
      "SaC Language Server",
      serverOptions,
      clientOptions,
    );

    await this.client.start();
  }

  public async deactivate(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.stop();
    this.client = undefined;
  }
}

export type { FeatureLifecycle };
