// POST /api/generate-concept
// Recebe a descrição de um negócio e devolve um conceito de website em JSON.
// A chave da IA (AI_API_KEY) existe só aqui, no servidor.

import type { IncomingMessage, ServerResponse } from "node:http";
import Anthropic from "@anthropic-ai/sdk";
import { CONCEPT_SCHEMA, SYSTEM_PROMPT, buildUserMessage, sanitizeConcept, validateInput } from "./_lib/concept";
import { createLimiter } from "./_lib/ratelimit";

const MAX_BODY_BYTES = 8 * 1024;
const DEFAULT_MODEL = "claude-opus-5-5";
const DEFAULT_ORIGINS = ["https://www.bagatela.pt", "https://bagatela.pt"];

/** Pedido/resposta Node (o Vercel acrescenta `body`). */
export type ApiRequest = IncomingMessage & { body?: unknown };
export type ApiResponse = ServerResponse;

const limiter = createLimiter({
  perWindow: Number(process.env.RATE_LIMIT_PER_HOUR) || 5,
  perDay: Number(process.env.RATE_LIMIT_PER_DAY) || 400,
});

function allowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ORIGINS;
}

function originAllowed(req: ApiRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true; // pedido do mesmo site / ferramentas de servidor
  try {
    const host = new URL(origin).host;
    if (host === req.headers.host) return true; // mesmo domínio (ex.: tudo no Vercel)
    if (process.env.NODE_ENV !== "production" && /^localhost(:\d+)?$/.test(host)) return true;
  } catch {
    return false;
  }
  return allowedOrigins().includes(origin);
}

function send(res: ApiResponse, status: number, payload: unknown, extraHeaders: Record<string, string> = {}): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(payload));
}

async function readJson(req: ApiRequest): Promise<unknown> {
  if (typeof req.body === "string") {
    if (Buffer.byteLength(req.body) > MAX_BODY_BYTES) throw Object.assign(new Error("too_large"), { code: "too_large" });
    return JSON.parse(req.body);
  }
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body; // já tratado pela plataforma
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("too_large"), { code: "too_large" });
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(text);
}

/** Fabrica o handler; o cliente da IA é injetável para testes. */
export interface AiClient { messages: { create: (args: Anthropic.MessageCreateParamsNonStreaming) => Promise<Anthropic.Message> } }

export function createHandler({ getClient }: { getClient?: () => AiClient } = {}) {
  const makeClient: () => AiClient =
    getClient ||
    (() =>
      new Anthropic({
        apiKey: process.env.AI_API_KEY,
        timeout: 45_000,
        maxRetries: 1,
      }));

  return async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
    // CORS: só os domínios da Bagatela
    const origin = req.headers.origin;
    if (origin && originAllowed(req)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Max-Age", "600");
    }
    if (req.method === "OPTIONS") {
      res.statusCode = originAllowed(req) ? 204 : 403;
      res.end();
      return;
    }
    if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" }, { Allow: "POST, OPTIONS" });
    if (!originAllowed(req)) return send(res, 403, { error: "forbidden" });

    if (!process.env.AI_API_KEY && !getClient) {
      console.error("[generate-concept] AI_API_KEY não definida");
      return send(res, 503, { error: "unavailable" });
    }

    let body: unknown;
    try {
      body = await readJson(req);
    } catch (e) {
      return send(res, (e as { code?: string } | null)?.code === "too_large" ? 413 : 400, { error: "invalid_input" });
    }

    const input = validateInput(body);
    if (!input.ok) return send(res, 400, { error: input.code });

    const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    const ip = fwd || (req.socket && req.socket.remoteAddress) || "unknown";
    const rl = limiter.check(ip);
    if (!rl.ok) return send(res, 429, { error: "rate_limited" }, { "Retry-After": String(rl.retryAfter || 60) });

    try {
      const client = makeClient();
      let lastReason = "bad_output";
      for (let attempt = 0; attempt < 2; attempt++) {
        const message = await client.messages.create({
          model: process.env.AI_MODEL || DEFAULT_MODEL,
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: buildUserMessage(input.descricao, input.lang) }],
          output_config: { effort: "low", format: { type: "json_schema", schema: CONCEPT_SCHEMA } },
        });

        if (message.stop_reason === "refusal") return send(res, 422, { error: "not_business" });
        const block = (message.content || []).find((b) => b.type === "text");
        let raw = null;
        try {
          raw = block ? JSON.parse(block.text) : null;
        } catch {
          raw = null;
        }
        const result = sanitizeConcept(raw);
        if (result.ok) return send(res, 200, { concept: result.concept, plan: result.plan });
        lastReason = result.reason;
        if (result.reason === "not_business") break; // decisão do modelo, não vale a pena repetir
      }
      return send(res, lastReason === "not_business" ? 422 : 502, { error: lastReason });
    } catch (err) {
      // Nunca devolvemos detalhes técnicos ao browser.
      const e = err as { status?: number; name?: string } | null;
      console.error("[generate-concept] erro da IA:", e?.status ? `status ${e.status}` : e?.name);
      return send(res, 503, { error: "unavailable" });
    }
  };
}

export default createHandler();
