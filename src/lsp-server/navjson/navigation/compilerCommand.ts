import { spawn } from "child_process";
import type { Position } from "vscode-languageserver/node";

export function runCompilerCommand(executable: string, args: string[], cwd: string, timeoutMs: number): Promise<string | null> {
  return new Promise((resolve) => {
    const child = spawn(executable, args, {
      cwd,
      env: process.env,
      shell: false,
    });

    let stdout = "";
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        child.kill("SIGKILL");
        resolve(null);
      }
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += String(chunk);
    });

    child.on("error", () => {
      if (resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeout);
      resolve(null);
    });

    child.on("close", () => {
      if (resolved) {
        return;
      }
      resolved = true;
      clearTimeout(timeout);
      resolve(stdout);
    });
  });
}

export function buildNavArgs(mode: "definition" | "hover", documentFsPath: string, position: Position, extraArgs: string[]): string[] {
  return [
    "-v0",
    "-navjson",
    "-nav-mode",
    mode,
    "-nav-file",
    documentFsPath,
    "-nav-line",
    `${position.line}`,
    "-nav-col",
    `${position.character}`,
    ...extraArgs,
    documentFsPath,
  ];
}