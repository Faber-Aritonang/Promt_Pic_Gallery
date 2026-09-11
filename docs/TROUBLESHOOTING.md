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

---

## Firestore-backed routes 500 on the deployed app

`/gallery/[id]`, `/chat/[templateId]`, `/api/templates`, `/api/templates/[id]` all return **500** on Vercel while `npm run dev` / `npm start` work. Same root cause as above, one layer deeper: these are the routes that import `firebase-admin`.

### The verified cause

`lib/firebase-admin.ts` imported `firebase-admin/auth` at module scope. That pulls in `jwks-rsa`, whose CommonJS build `require()`s `jose` — an ES module only. The Vercel function runtime refuses `require()` of an ES module:

```
ERR_REQUIRE_ESM: require() of ES Module /var/task/node_modules/jwks-rsa/node_modules/jose/dist/webapi/index.js
from /var/task/node_modules/jwks-rsa/src/utils.js not supported
```

So **every** route whose import graph touched that file died at import time, before its own error handling could run: an empty `500` body from a Route Handler, the Next.js error page from a page. Node 22 (and `npm start`) supports `require(esm)` by default, so the same build loads fine locally — which is exactly why this looked inexplicable.

| # | Cause | Fix |
| --- | --- | --- |
| 7 | `firebase-admin/auth` imported at module scope (see above), so a dependency of *Auth* crashed every *Firestore* route. | `getAdminAuth()` is now `async` and does `await import("firebase-admin/auth")`, so only token verification loads it. |
| 8 | `jwks-rsa` requires `jose@^6`, which ships no CommonJS build. | `package.json` → `overrides` pins `jose` to the CJS-compatible `^5.9.6` for `jwks-rsa`. |
| 9 | `FIREBASE_SERVICE_ACCOUNT` present but rejected (e.g. a private key with escaped `\n`, or truncated) silently fell back to Application Default Credentials, which waits on an unreachable metadata server. | `lib/firebase-admin.ts` parses the key defensively (`\n` → newline) and **fails fast** with a clear message instead of falling back, so the seed-data fallbacks in `lib/services/*` keep the pages working. |
| 10 | `firebase-admin`'s gRPC/`google-gax` tree bundled into the server build. | `serverExternalPackages: ["firebase-admin"]` in `next.config.ts`. |

### Reading the real error without dashboard access

When a route 500s with an empty body, ask a route that still works to run the failing code path for you:

```bash
curl "https://<deployment>/api/chat?probe=1"
```

```json
{ "firebase-admin/auth": "loaded", "getAdminDb": "ok in 3ms",
  "listTemplates": "ok in 411ms, total=20" }
```

Any `Error: …` string in that output is the same exception the broken route is swallowing.

### Verifying locally before redeploying

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run build       # production build
npm start           # serve the production build on http://localhost:3000
```

A local `npm start` cannot reproduce platform-level timeouts, so always double-check the Vercel **Logs** tab for the request that failed.

---

## "Generate Image" fails per model (Replicate)

`Replicate API error (404): The requested resource could not be found.` — Playground v2.5 returned this while the other models worked, and **locally it looked like a plain 404 from the provider** rather than anything the app did wrong.

### The verified cause

Two Replicate endpoints can start a prediction, and a given model may work on only one of them:

| Endpoint | Picks the version via | Playground v2.5 | FLUX.1 Schnell |
| --- | --- | --- | --- |
| `POST /v1/models/{owner}/{name}/predictions` | owner's default version | **404** "The requested resource could not be found." | **201** (~4s) |
| `POST /v1/predictions` `{ version, input }` | pinned version hash | **201** (~0.5s) | hangs, no response |

Playground v2.5 is public and its pinned version runs normally — it simply has no default version exposed to the API, so the model-path endpoint 404s. FLUX.1 Dev is the opposite extreme: **both** endpoints accept the connection and never answer, so it only fails on our own timeout.

### Fix

- `lib/services/replicate.ts` tries the model endpoint first and **falls back to the pinned version when it answers 404**, so either kind of model works.
- Prediction creation is bounded by a 12s timeout with one retry, and the polling deadline is measured from the start of the whole call (not from after creation), keeping the total inside the route's `maxDuration = 60`.
- 429 is expected on accounts with less than $5 credit (6 requests/minute, burst of 1): the create call now retries honouring Replicate's `retry_after` instead of failing immediately.
- Models the API refuses to run are kept in the catalog but hidden from the dropdown via `available: false` (`/api/models` and the model picker both honour it). FLUX.1 Dev is currently hidden this way.

### Checking a model by hand

```bash
TOKEN=$(grep -E '^REPLICATE_API_TOKEN=' .env.local | cut -d= -f2- | tr -d '"')
# model path (fast 201 = usable this way)
curl -sS -o /dev/null -w '%{http_code} %{time_total}s\n' -X POST \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"input":{"prompt":"test","width":1024,"height":1024}}' \
  https://api.replicate.com/v1/models/playgroundai/playground-v2.5-1024px-aesthetic/predictions
```

Swap `/models/{owner}/{name}/predictions` for `/v1/predictions` with `{"version":"<hash>","input":{…}}` to test the pinned-version path. Anything other than `201` (or a hang) means that model cannot be used with the current account.

---

## "Save to Gallery" does not upload

The upload dialog opens, but saving fails — or appears to succeed while no template ever shows up in the gallery.

### Causes found and fixed

| # | Cause | Fix |
| --- | --- | --- |
| 11 | `handleUpload` in `components/gallery/TemplateUpload.tsx` read `formData` without listing it as a `useCallback` dependency. The callback kept the values captured when the image was picked, so filling the form *after* choosing the image made it post stale (usually empty) fields — the client-side validation then rejected a form that looked complete. | `formData` is now a dependency, and `handleOpenChange` is wrapped in `useCallback` so the handler is rebuilt only when it really changes. |
| 12 | The dialog read the response with `response.json()`, so a platform-level failure (body over the ~4.5MB Vercel limit, function cut off) surfaced as "Unexpected end of JSON input" instead of the real cause. | The response is read as text and reported with its HTTP status. The client also caps uploads at 4MB locally, below the platform limit, with a message naming the file size. |
| 13 | The upload route swallowed Firestore write errors and still answered `success: true` with `id: ""`, so the template never appeared in the gallery and nothing said so. | A failed database write now answers `500` with the reason; the response also carries `saved_to_firestore`. |
| 14 | `listTemplates` returned *only* Firestore documents once the collection was non-empty, so the 20 seed templates shown before the first upload disappeared the moment one template was stored. | Stored templates are merged with the seed ones (`lib/services/templates.ts`), with stored documents winning on id collisions. Covered by `tests/lib/services/templates-firestore.test.ts`. |

### Checking the upload path

```bash
# Fails with 400 "Missing required fields" — proves the route is reachable
curl -sS -X POST -F "title=t" https://<deployment>/api/templates/upload

# Full upload from the command line
curl -sS -X POST \
  -F "image=@image.png;type=image/png" \
  -F "title=Test" -F "description=Test" -F "original_prompt=Test" \
  -F "original_image_generated_with=Playground v2.5" \
  https://<deployment>/api/templates/upload
```

The response's `data.id` is the Firestore document id. `GET /api/templates` should then list it.
