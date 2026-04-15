"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/copilot/mcp/sac2c-mcp.ts
var import_child_process = require("child_process");
var path = __toESM(require("path"));
var readBuffer = Buffer.alloc(0);
var nextRequestId = 1;
function writeMessage(message) {
  const json = JSON.stringify(message);
  const payload = Buffer.from(json, "utf8");
  const header = Buffer.from(`Content-Length: ${payload.length}\r
\r
`, "utf8");
  process.stdout.write(Buffer.concat([header, payload]));
}
function writeError(id, code, message, data) {
  writeMessage({
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      data
    }
  });
}
function asArrayOfStrings(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((entry) => typeof entry === "string");
}
function parseTimeoutMs(value) {
  const timeout = Number(value);
  if (!Number.isFinite(timeout)) {
    return 1e4;
  }
  return Math.max(100, Math.min(12e4, Math.floor(timeout)));
}
function resolveExecutable(requestedPath) {
  if (typeof requestedPath === "string" && requestedPath.trim().length > 0) {
    return requestedPath.trim();
  }
  if (typeof process.env.SAC2C_PATH === "string" && process.env.SAC2C_PATH.trim().length > 0) {
    return process.env.SAC2C_PATH.trim();
  }
  return "sac2c";
}
function parseDefaultArgs() {
  const raw = typeof process.env.SAC2C_DEFAULT_ARGS === "string" ? process.env.SAC2C_DEFAULT_ARGS : "";
  if (raw.trim().length === 0) {
    return [];
  }
  return raw.split(/\s+/).filter((entry) => entry.length > 0);
}
function runProcess(command, args, cwd, timeoutMs) {
  return new Promise((resolve2) => {
    const child = (0, import_child_process.spawn)(command, args, {
      cwd,
      env: process.env,
      shell: false
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const killTimer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(killTimer);
      resolve2({ code: null, stdout, stderr, error: error.message, timedOut });
    });
    child.on("close", (code) => {
      clearTimeout(killTimer);
      resolve2({ code, stdout, stderr, error: null, timedOut });
    });
  });
}
function textContent(text) {
  return [{ type: "text", text }];
}
async function handleToolsCall(params) {
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
      error: result.error
    };
    return {
      content: textContent(JSON.stringify(payload, null, 2)),
      structuredContent: payload,
      isError: result.code !== 0 || result.timedOut || Boolean(result.error)
    };
  }
  if (toolName === "sac2c_run") {
    if (typeof args.file !== "string" || args.file.trim().length === 0) {
      return {
        content: textContent("Missing required argument: file"),
        isError: true
      };
    }
    const executable = resolveExecutable(args.executable);
    const cwd = typeof args.cwd === "string" && args.cwd.trim().length > 0 ? path.resolve(args.cwd) : process.cwd();
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
      error: result.error
    };
    return {
      content: textContent(JSON.stringify(payload, null, 2)),
      structuredContent: payload,
      isError: result.code !== 0 || result.timedOut || Boolean(result.error)
    };
  }
  return {
    content: textContent(`Unknown tool: ${String(toolName)}`),
    isError: true
  };
}
function handleRequest(message) {
  const { id, method, params } = message;
  if (method === "initialize") {
    writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {
            listChanged: false
          }
        },
        serverInfo: {
          name: "sac2c-mcp",
          version: "0.1.0"
        }
      }
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
                timeoutMs: { type: "number", description: "Optional timeout in milliseconds." }
              }
            }
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
                  description: "Additional sac2c arguments."
                },
                cwd: { type: "string", description: "Working directory for process execution." },
                executable: { type: "string", description: "Optional sac2c executable path." },
                timeoutMs: { type: "number", description: "Optional timeout in milliseconds." }
              },
              required: ["file"]
            }
          }
        ]
      }
    });
    return;
  }
  if (method === "tools/call") {
    const toolCallParams = params ?? {};
    handleToolsCall(toolCallParams).then((result) => {
      writeMessage({
        jsonrpc: "2.0",
        id,
        result
      });
    }).catch((error) => {
      writeError(id, -32e3, "Tool execution failed", String(error));
    });
    return;
  }
  writeError(id, -32601, `Method not found: ${method}`);
}
function processBuffer() {
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
    let message;
    try {
      message = JSON.parse(body);
    } catch (error) {
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
process.stdin.on("data", (chunk) => {
  readBuffer = Buffer.concat([readBuffer, chunk]);
  processBuffer();
});
process.stdin.resume();
