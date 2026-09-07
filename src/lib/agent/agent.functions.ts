// Server-side reasoning engine for BuyBuddy AI (Gemini).
// The API key never leaves the server; the model only *chooses* tools.
import { createServerFn } from "@tanstack/react-start";
import { AGENT_SYSTEM_PROMPT, TOOL_DECLARATIONS } from "./tools";

export type AgentPart =
  | { text: string }
  | { functionCall: { name: string; args: Record<string, unknown> } }
  | { functionResponse: { name: string; response: Record<string, unknown> } };

export type AgentTurn = { role: "user" | "model"; parts: AgentPart[] };

export type AgentDecision = {
  status: "act" | "done" | "error";
  message?: string;
  headline?: string;
  calls: { name: string; args: Record<string, unknown> }[];
};

const MODEL = "gemini-2.5-flash";

function validateTurns(input: unknown): { turns: AgentTurn[] } {
  if (typeof input !== "object" || input === null) throw new Error("Invalid agent input");
  const turns = (input as { turns?: unknown }).turns;
  if (!Array.isArray(turns) || turns.length === 0 || turns.length > 60) throw new Error("Invalid agent transcript");
  for (const t of turns) {
    const role = (t as AgentTurn)?.role;
    const parts = (t as AgentTurn)?.parts;
    if (role !== "user" && role !== "model") throw new Error("Invalid turn role");
    if (!Array.isArray(parts) || parts.length === 0) throw new Error("Invalid turn parts");
  }
  return { turns: turns as AgentTurn[] };
}

export const runAgentStep = createServerFn({ method: "POST" })
  .inputValidator(validateTurns)
  .handler(async ({ data }): Promise<AgentDecision> => {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      return {
        status: "error",
        calls: [],
        message: "BuyBuddy AI is not connected yet — the Gemini key is missing on the server.",
      };
    }

    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: AGENT_SYSTEM_PROMPT }] },
            contents: data.turns,
            tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 1400 },
          }),
        },
      );
    } catch {
      return { status: "error", calls: [], message: "Could not reach the reasoning engine. Please try again." };
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Gemini error", res.status, detail.slice(0, 500));
      const message =
        res.status === 429
          ? "BuyBuddy AI is rate limited right now — try again in a few seconds."
          : res.status === 401 || res.status === 403
            ? "The Gemini key was rejected. Please check the key configured for this app."
            : `The reasoning engine failed (${res.status}).`;
      return { status: "error", calls: [], message };
    }

    const json = (await res.json()) as {
      candidates?: { content?: { parts?: AgentPart[] } }[];
    };
    const parts = json.candidates?.[0]?.content?.parts ?? [];

    const calls = parts
      .filter((p): p is { functionCall: { name: string; args: Record<string, unknown> } } => "functionCall" in p)
      .map((p) => ({ name: p.functionCall.name, args: p.functionCall.args ?? {} }));
    const text = parts
      .filter((p): p is { text: string } => "text" in p && typeof p.text === "string")
      .map((p) => p.text)
      .join(" ")
      .trim();

    if (calls.length > 0) {
      return { status: "act", calls, headline: text || undefined };
    }
    return { status: "done", calls: [], message: text || "Done." };
  });
