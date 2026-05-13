import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Critical = 4,
}

type LoggerConfig = {
  minLevel?: LogLevel;
  logToFile?: boolean;
  enableTimestamp?: boolean;
  prettyPrint?: boolean;
};

export class Logger {
  private static output: vscode.OutputChannel | null = null;
  private static context: vscode.ExtensionContext | null = null;

  private static config: LoggerConfig = {
    minLevel: LogLevel.Info,
    logToFile: true,
    enableTimestamp: true,
    prettyPrint: true,
  };

  /**
   * Must be called once in activate()
   */
  static init(context: vscode.ExtensionContext) {
    this.context = context;
  }

  static configure(config: LoggerConfig) {
    this.config = { ...this.config, ...config };
  }

  static setOutputChannel(name: string) {
    if (!this.output) {
      this.output = vscode.window.createOutputChannel(name);
    }
  }

  static debug(msg: unknown) {
    this.log(LogLevel.Debug, msg);
  }

  static info(msg: unknown) {
    this.log(LogLevel.Info, msg);
  }

  static warn(msg: unknown) {
    this.log(LogLevel.Warn, msg);
  }

  static error(msg: unknown) {
    this.log(LogLevel.Error, msg);
  }

  static critical(msg: unknown) {
    this.log(LogLevel.Critical, msg);
  }

  private static log(level: LogLevel, msg: unknown) {
    if (level < (this.config.minLevel ?? LogLevel.Info)) return;

    const timestamp = new Date().toISOString();
    const levelLabel = LogLevel[level];

    const message = this.format(msg);

    const formatted = this.config.enableTimestamp
      ? `[${timestamp}] [${levelLabel}] ${message}`
      : `[${levelLabel}] ${message}`;

    this.writeOutput(formatted, levelLabel);

    if (this.config.logToFile) {
      this.writeFile(formatted);
    }
  }

  private static format(msg: unknown): string {
    if (typeof msg === "string") return msg;

    if (msg instanceof Error) {
      return `${msg.message}\n${msg.stack ?? ""}`;
    }

    try {
      return this.config.prettyPrint
        ? JSON.stringify(msg, null, 2)
        : JSON.stringify(msg);
    } catch {
      return String(msg);
    }
  }

  private static writeOutput(formatted: string, level: string) {
    if (!this.output) {
      this.output = vscode.window.createOutputChannel("SaC Language Support");
    }

    const prefix =
      level === "ERROR" || level === "CRITICAL"
        ? "❌"
        : level === "WARN"
          ? "⚠️"
          : level === "DEBUG"
            ? "🐛"
            : "ℹ️";

    this.output.appendLine(`${prefix} ${formatted}`);
  }

  private static writeFile(formatted: string) {
    if (!this.context) {
      return;
    }

    const baseDir = path.join(this.context.globalStorageUri.fsPath, "logs");
    const filePath = path.join(baseDir, "extension.log");

    try {
      fs.mkdirSync(baseDir, { recursive: true });

      fs.appendFile(filePath, formatted + "\n", "utf8", () => {
        // intentionally ignore errors (logging must never break extension)
      });
    } catch {
      // ignore filesystem failures
    }
  }

  static show() {
    this.output?.show(true);
  }

  static clear() {
    this.output?.clear();
  }

  static dispose() {
    this.output?.dispose();
    this.output = null;
  }
}