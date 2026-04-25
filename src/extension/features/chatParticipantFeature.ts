import * as vscode from "vscode";

import type { FeatureLifecycle } from "$extension/features/languageClientFeature";

const PARTICIPANT_ID = "sac-language-support.sac";

/**
 * Builds chat result metadata used by follow-up provider.
 *
 * @param command Executed command name.
 * @returns Chat result with metadata payload.
 */
function chatResult(command: string): vscode.ChatResult {
  return {
    metadata: {
      command,
    },
  };
}

/**
 * Builds default participant response when no command is provided.
 *
 * @param prompt User prompt text.
 * @returns Markdown response text.
 */
function buildDefaultResponse(prompt: string): string {
  const normalizedPrompt = prompt.trim();
  if (normalizedPrompt.length === 0) {
    return "Share what you want to do with SaC code, for example format guards, explain diagnostics, or review overloading.";
  }

  return [
    "I can help with SaC-specific workflows:",
    "",
    "- `/sac-diagnose`: explain likely compiler issues and suggest targeted fixes",
    "- `/sac-format`: apply SaC formatting conventions (including multiline guard style)",
    "- `/sac-overload`: design or review overload changes safely",
    "",
    `Prompt summary: ${normalizedPrompt}`,
  ].join("\n");
}

/**
 * Registers extension-native @sac chat participant and slash commands for F5 extension host testing.
 */
export class ChatParticipantFeature implements FeatureLifecycle {
  private participant: vscode.ChatParticipant | undefined;

  /**
   * Registers chat participant and command handlers.
   */
  public async activate(): Promise<void> {
    const enabled = vscode.workspace.getConfiguration("sac").get<boolean>("features.chatParticipant.enable", true);
    if (!enabled) {
      return;
    }

    const handler: vscode.ChatRequestHandler = async (request, _context, stream): Promise<vscode.ChatResult> => {
      if (request.command === "sac-diagnose") {
        stream.markdown(
          "SaC diagnostics workflow:\n\n1. Run `sac2c` with minimal flags first.\n2. Fix the first parser/type error before secondary errors.\n3. Re-run and iterate until the first blocking error is resolved.",
        );
        return chatResult("sac-diagnose");
      }

      if (request.command === "sac-format") {
        stream.markdown(
          "SaC guard formatting:\n\n```sac\nint safe_div(int a, int b)\n    | b != 0\n    , a >= 0\n{\n    return a / b;\n}\n```\n",
        );
        return chatResult("sac-format");
      }

      if (request.command === "sac-overload") {
        stream.markdown(
          "Overloading checklist:\n\n- Keep overload family semantics aligned.\n- Add the narrowest overload needed.\n- Call out ambiguous conversion risks.",
        );
        return chatResult("sac-overload");
      }

      stream.markdown(buildDefaultResponse(request.prompt));
      return chatResult("default");
    };

    this.participant = vscode.chat.createChatParticipant(PARTICIPANT_ID, handler);
    this.participant.iconPath = new vscode.ThemeIcon("symbol-key");
    this.participant.followupProvider = {
      provideFollowups(result: vscode.ChatResult): vscode.ChatFollowup[] {
        const command = typeof result.metadata?.command === "string" ? result.metadata.command : "default";

        if (command === "sac-diagnose") {
          return [{ prompt: "show a minimal fix strategy", label: "Suggest a minimal fix strategy" }];
        }

        if (command === "sac-format") {
          return [{ prompt: "apply guard formatting to my function", label: "Format guard lines" }];
        }

        return [
          { prompt: "diagnose this SaC compiler error", label: "Diagnose compiler error" },
          { prompt: "format this SaC function", label: "Format SaC function" },
        ];
      },
    };
  }

  /**
   * Disposes chat participant registration.
   */
  public async deactivate(): Promise<void> {
    this.participant?.dispose();
    this.participant = undefined;
  }
}
