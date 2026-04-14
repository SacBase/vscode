import * as fs from "fs";
import * as path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * Checks whether an LSP text document points to a local file URI.
 */
export function isFileDocument(document: TextDocument): boolean {
  return document.uri.startsWith("file://");
}

/**
 * Converts file URI to platform-specific filesystem path.
 */
export function uriToFsPath(uri: string): string {
  return fileURLToPath(uri);
}

/**
 * Normalizes paths for stable string comparisons across platforms.
 */
export function normalizePathForCompare(filePath: string): string {
  const normalized = path.normalize(filePath);
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

/**
 * Checks whether path points to a SaC source file.
 */
export function isSacFilePath(filePath: string): boolean {
  return filePath.toLowerCase().endsWith(".sac");
}

/**
 * Recursively collects .sac files, skipping excluded directories.
 */
export function collectSacFiles(rootDir: string, excludedDirNames: Set<string>): string[] {
  const files: string[] = [];

  const visit = (dirPath: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (!excludedDirNames.has(entry.name)) {
          visit(fullPath);
        }
        continue;
      }

      if (entry.isFile() && isSacFilePath(fullPath)) {
        files.push(fullPath);
      }
    }
  };

  visit(rootDir);
  return files;
}

/**
 * Creates ephemeral document from disk for files not currently opened.
 */
export function createDocumentFromFile(fsPath: string): TextDocument | null {
  try {
    const content = fs.readFileSync(fsPath, "utf8");
    return TextDocument.create(pathToFileURL(fsPath).toString(), "sac", 0, content);
  } catch {
    return null;
  }
}
