import { spawn } from "child_process";
import * as path from "path";

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: unknown;
}

interface ToolCallParams {
  name?: string;
  arguments?: Record<string, unknown>;
}

interface ProcessRunResult {
  code: number | null;
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
}

let readBuffer = Buffer.alloc(0);
let nextRequestId = 1;

function writeMessage(message: unknown): void {
  const json = JSON.stringify(message);
  const payload = Buffer.from(json, "utf8");
  const header = Buffer.from(`Content-Length: ${payload.length}\r\n\r\n`, "utf8");
  process.stdout.write(Buffer.concat([header, payload]));
}

function writeError(id: string | number | null | undefined, code: number, message: string, data?: unknown): void {
  writeMessage({
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      data,
    },
  });
}

function asArrayOfStrings(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

function parseTimeoutMs(value: unknown): number {
  const timeout = Number(value);
  if (!Number.isFinite(timeout)) {
    return 10_000;
  }

  return Math.max(100, Math.min(120_000, Math.floor(timeout)));
}

function resolveExecutable(requestedPath: unknown): string {
  if (typeof requestedPath === "string" && requestedPath.trim().length > 0) {
    return requestedPath.trim();
  }

  if (typeof process.env.SAC2C_PATH === "string" && process.env.SAC2C_PATH.trim().length > 0) {
    return process.env.SAC2C_PATH.trim();
  }

  return "sac2c";
}

function parseDefaultArgs(): string[] {
  const raw = typeof process.env.SAC2C_DEFAULT_ARGS === "string" ? process.env.SAC2C_DEFAULT_ARGS : "";
  if (raw.trim().length === 0) {
    return [];
  }

  return raw.split(/\s+/).filter((entry) => entry.length > 0);
}

function runProcess(command: string, args: string[], cwd: string, timeoutMs: number): Promise<ProcessRunResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      shell: false,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const killTimer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += String(chunk);
    });

    child.on("error", (error: Error) => {
      clearTimeout(killTimer);
      resolve({ code: null, stdout, stderr, error: error.message, timedOut });
    });

    child.on("close", (code: number | null) => {
      clearTimeout(killTimer);
      resolve({ code, stdout, stderr, error: null, timedOut });
    });
  });
}

function textContent(text: string): Array<{ type: "text"; text: string }> {
  return [{ type: "text", text }];
}

async function handleToolsCall(params: ToolCallParams): Promise<unknown> {
  const toolName = params.name;
  const args = params.arguments ?? {};

  if (toolName === "sac2c_version") {
    const executable = resolveExecutable(args.executable);
    const result = await runProcess(executable, ["--version"], process.cwd(), parseTimeoutMs(args.timeoutMs));

    const payload = {
      executable,
      code: result.code,
      timedOut: result.timedOut,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    };

    return {
      content: textContent(JSON.stringify(payload, null, 2)),
      structuredContent: payload,
      isError: result.code !== 0 || result.timedOut || Boolean(result.error),
    };
  }

  if (toolName === "sac2c_run") {
    if (typeof args.file !== "string" || args.file.trim().length === 0) {
      return {
        content: textContent("Missing required argument: file"),
        isError: true,
      };
    }

    const executable = resolveExecutable(args.executable);
    const cwd = typeof args.cwd === "string" && args.cwd.trim().length > 0
      ? path.resolve(args.cwd)
      : process.cwd();
    const filePath = path.isAbsolute(args.file) ? args.file : path.resolve(cwd, args.file);
    const defaultArgs = parseDefaultArgs();
    const userArgs = asArrayOfStrings(args.args);
    const processArgs = [...defaultArgs, ...userArgs, filePath];
    const result = await runProcess(executable, processArgs, cwd, parseTimeoutMs(args.timeoutMs));

    const payload = {
      executable,
      cwd,
      file: filePath,
      args: processArgs,
      code: result.code,
      timedOut: result.timedOut,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error,
    };

    return {
      content: textContent(JSON.stringify(payload, null, 2)),
      structuredContent: payload,
      isError: result.code !== 0 || result.timedOut || Boolean(result.error),
    };
  }

  return {
    content: textContent(`Unknown tool: ${String(toolName)}`),
    isError: true,
  };
}

function handleRequest(message: JsonRpcRequest): void {
  const { id, method, params } = message;

  if (method === "initialize") {
    writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {
            listChanged: false,
          },
        },
        serverInfo: {
          name: "sac2c-mcp",
          version: "0.1.0",
        },
      },
    });
    return;
  }

  if (method === "notifications/initialized") {
    return;
  }

  if (method === "tools/list") {
    writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [
          {
            name: "sac2c_version",
            description: "Get sac2c version output and availability status.",
            inputSchema: {
              type: "object",
              properties: {
                executable: { type: "string", description: "Optional sac2c executable path." },
                timeoutMs: { type: "number", description: "Optional timeout in milliseconds." },
              },
            },
          },
          {
            name: "sac2c_run",
            description: "Run sac2c for one SaC file with explicit flags.",
            inputSchema: {
              type: "object",
              properties: {
                file: { type: "string", description: "Target SaC file path." },
                args: {
                  type: "array",
                  items: { type: "string" },
                  description: "Additional sac2c arguments.",
                },
                cwd: { type: "string", description: "Working directory for process execution." },
                executable: { type: "string", description: "Optional sac2c executable path." },
                timeoutMs: { type: "number", description: "Optional timeout in milliseconds." },
              },
              required: ["file"],
            },
          },
        ],
      },
    });
    return;
  }

  if (method === "tools/call") {
    const toolCallParams = (params ?? {}) as ToolCallParams;

    handleToolsCall(toolCallParams)
      .then((result) => {
        writeMessage({
          jsonrpc: "2.0",
          id,
          result,
        });
      })
      .catch((error: unknown) => {
        writeError(id, -32000, "Tool execution failed", String(error));
      });
    return;
  }

  writeError(id, -32601, `Method not found: ${method}`);
}

function processBuffer(): void {
  while (true) {
    const headerEnd = readBuffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      return;
    }

    const header = readBuffer.slice(0, headerEnd).toString("utf8");
    const lengthMatch = header.match(/Content-Length:\s*(\d+)/i);
    if (!lengthMatch) {
      readBuffer = Buffer.alloc(0);
      return;
    }

    const bodyLength = Number(lengthMatch[1]);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + bodyLength;
    if (readBuffer.length < messageEnd) {
      return;
    }

    const body = readBuffer.slice(messageStart, messageEnd).toString("utf8");
    readBuffer = readBuffer.slice(messageEnd);

    let message: JsonRpcRequest;
    try {
      message = JSON.parse(body) as JsonRpcRequest;
    } catch (error: unknown) {
      writeError(nextRequestId++, -32700, "Parse error", String(error));
      continue;
    }

    if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
      writeError(message?.id ?? nextRequestId++, -32600, "Invalid Request");
      continue;
    }

    handleRequest(message);
  }
}

process.stdin.on("data", (chunk: Buffer) => {
  readBuffer = Buffer.concat([readBuffer, chunk]);
  processBuffer();
});

process.stdin.resume();
