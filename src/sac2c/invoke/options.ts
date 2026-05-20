/**
 * Compiler messaging and runtime options
 */

import type { CompilerChannel, CompilerTraceLevel } from "$sac2c/invoke/types";

/** Compiler version/channel selection */
export const COMPILER_CHANNELS = ["system", "stable", "develop"] as const;

/** Execution backend */
export const EXECUTION_BACKENDS = ["local", "wsl", "docker"] as const;
export type ExecutionBackendType = (typeof EXECUTION_BACKENDS)[number];

/** Compiler output trace level */
export const COMPILER_TRACE_LEVELS = ["off", "messages", "verbose"] as const;

/**
 * Messaging flags for structured compiler output
 * Controls how the compiler formats error/warning messages
 */
export const MESSAGING_FLAGS = {
  noColor: "-cti-no-color",
  noSource: "-cti-no-source",
  noHint: "-cti-no-hint",
  noExplain: "-cti-no-explain",
  messageLength: "-cti-message-length",
  primaryHeaderFormat: "-cti-primary-header-format",
  continuationHeaderFormat: "-cti-continuation-header-format",
} as const;

export type MessagingFlag = (typeof MESSAGING_FLAGS)[keyof typeof MESSAGING_FLAGS];

/**
 * Default messaging arguments for structured output
 * Used to ensure consistent, parseable compiler diagnostics
 */
export const DEFAULT_MESSAGING_ARGS = [
  MESSAGING_FLAGS.noColor,
  MESSAGING_FLAGS.noSource,
  MESSAGING_FLAGS.noHint,
  MESSAGING_FLAGS.noExplain,
  MESSAGING_FLAGS.messageLength,
  "0",
  MESSAGING_FLAGS.primaryHeaderFormat,
  "%s: ",
  MESSAGING_FLAGS.continuationHeaderFormat,
  "%.0s",
] as const;

/**
 * Type guard: check if value is a valid compiler channel
 */
export function isCompilerChannel(value: unknown): value is CompilerChannel {
  return typeof value === "string" && (COMPILER_CHANNELS as readonly string[]).includes(value);
}

/**
 * Type guard: check if value is a valid execution backend
 */
export const isExecutionBackend = (value: unknown): value is ExecutionBackendType =>
  typeof value === "string" && (EXECUTION_BACKENDS as readonly string[]).includes(value);

/** Type guard alias for backward compatibility */
export const isCompilerBackend = isExecutionBackend;

/**
 * Type guard: check if value is a valid trace level
 */
export function isCompilerTraceLevel(value: unknown): value is CompilerTraceLevel {
  return typeof value === "string" && (COMPILER_TRACE_LEVELS as readonly string[]).includes(value);
}

// Re-export types from types.ts for convenience
export type { CompilerChannel, CompilerTraceLevel } from "$sac2c/invoke/types";

/**
 * Normalizes an unknown value to a string array
 */
export function normalizeStringArray(value: unknown, fallback: readonly string[]): string[] {
  if (!Array.isArray(value)) {
    return [...fallback];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}
