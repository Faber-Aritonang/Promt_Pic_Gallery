# 🔧 Troubleshooting

Production-only failures that do not reproduce locally, and how to diagnose them.

---

## Chat works locally but fails on the deployed app

### Symptom

- `npm run dev` → the AI refinement chat streams answers normally.
- On Vercel → the assistant bubble shows:

  ```
  ⚠️ Error: Request failed with HTTP 500 (empty response body)
  ```

  (older builds showed `Failed to execute 'json' on 'Response': Unexpected end of JSON input`)

- Browser DevTools → **Network** → `POST /api/chat` returns **500 (Internal Server Error)** with an **empty response body** (sometimes `504`).
- The bubble now automatically appends `Server diagnostics: {…}` plus any `x-vercel-error` header, so the failing request explains itself.

### Why that message is misleading

`Failed to execute 'json' on 'Response': …` is added by the **browser** when `response.json()` runs on an empty body — Node's own JSON errors do not carry that prefix (verified: `new Response("").json()` in Node throws a bare `SyntaxError: Unexpected end of JSON input`).

So the message never came from Anthropic and it is **not** an API-key problem: a missing `ANTHROPIC_API_KEY` is returned as a normal JSON error (and streamed as an SSE `{ "error": … }` frame), with its own readable text. An empty non-OK body means the function died (or was killed) before it could reply.

### Causes found and fixed

| # | Cause | Fix |
| --- | --- | --- |
| 1 | `setInterval()` at module scope in `lib/utils/rate-limit.ts` kept the Node.js event loop alive, so the serverless invocation never closed and the platform eventually killed it. | Replaced with a lazy sweep in `checkRateLimit()`. |
| 2 | `/api/chat` and `/api/generate` had no `maxDuration`, so a slow streamed LLM/image response could be cut off at the platform default. | Added `export const runtime = "nodejs"` and `export const maxDuration = 60` to both routes. |
| 3 | Default model id `claude-haiku-4-5-20250501` does not exist. With `LLM_MODEL` unset on Vercel, every Anthropic call failed. | Default is now `claude-haiku-4-5` (`lib/services/llm.ts`, `.env.example`, README). |
| 4 | An unhandled crash produced an empty 500 body, which the client could only report as an unparseable response. | The whole `/api/chat` handler (rate limiting included) now returns a JSON error body; the client reads the body as text and reports `HTTP <status>`. |
| 5 | `/api/chat` imported `firebase-admin` at module scope (via `lib/services/templates`), so any Firestore/credential problem there took the whole chat route down. | The templates service is now imported lazily, only when a `templateId` is sent, and a failure only costs the template context. |
| 6 | If the outbound Anthropic call never answers, the platform kills the invocation and the browser gets an empty response. | `lib/services/llm.ts` aborts the call after 45 s and reports "timed out"/"could not reach" instead. |

### Self-diagnostic endpoints

`GET /api/chat` reports what the deployed function sees — no dashboard needed:

```json
{ "vercelEnv": "production", "model": "claude-haiku-4-5",
  "anthropicKey": { "present": true, "length": 108, "prefix": "sk-ant-api03-…", "suffix": "…" } }
```

`GET /api/chat?ping=1` additionally calls the Anthropic API and returns the HTTP status, latency, and error body. Compare `anthropicKey.length` with your local `.env.local` (a real key is ~108 characters); a short value means the key was truncated when it was pasted into Vercel.

### Checklist when it breaks again

1. **Vercel → project → Environment Variables** — `ANTHROPIC_API_KEY` and `LLM_MODEL=claude-haiku-4-5` must exist for **Production *and*** Preview, then redeploy (env changes need a new build).
2. **Vercel → Logs** — find `POST /api/chat` and read the stack trace. The handler logs failures with `console.error("[/api/chat] Error:", error)`; a crash outside the handler appears as `FUNCTION_INVOCATION_FAILED`.
3. **Retry in the browser** — the assistant bubble now prints the real `HTTP <status>` (and the server's message when there is one) instead of a JSON parse error.
4. **Deployment Protection** — if Vercel Authentication is enabled, requests without a Vercel session get `401 {"error":{"code":"401","message":"Protected deployment"}}`. Tools like `curl`, Postman, or any external client cannot reach the app until it is disabled for that environment (Settings → Deployment Protection).

### Verifying locally before redeploying

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run build       # production build
npm start           # serve the production build on http://localhost:3000
```

A local `npm start` cannot reproduce platform-level timeouts, so always double-check the Vercel **Logs** tab for the request that failed.
