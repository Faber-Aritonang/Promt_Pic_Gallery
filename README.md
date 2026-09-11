<div align="center">

# 🏙️ PromtPicGallery

**A prompt template gallery for text-to-image AI — browse templates, refine prompts with an AI sparring partner (Anthropic Claude), and generate images with the model of your choice.**

Next.js · TypeScript · Tailwind CSS · shadcn/ui · Firebase · 100% Free Stack

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Firebase Setup](#-firebase-setup)
- [Database Schema](#-database-schema)
- [Scripts](#-scripts)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Versioning & Process Tracking](#-versioning--process-tracking)
- [Glossary](#-glossary)
- [Contact](#-contact)

---

## 📌 Overview

**PromtPicGallery** is a free web platform that helps content creators, designers, and AI enthusiasts master **prompt engineering** for text-to-image generation. It provides:

1. A browsable **repository of ready-to-use prompt templates** with preview images.
2. An interactive **AI refinement chat** (Anthropic Claude Haiku) that improves prompts turn-by-turn with live streaming responses and a prompt-progression tracker.
3. A **multi-model selector** so the finished prompt can be sent to the user's preferred image generator — Hugging Face free models + Replicate paid models.
4. **Save, share, and export** refined "user versions" of any template.
5. **Favorites, history, and chat sessions** persisted to Firestore.
6. **Google OAuth** sign-in with Firebase Auth.

Full product specification: see `PRD_Prompt_Gallery_App.md` (referenced by section throughout this project, e.g. "PRD §4.1"). The chat implementation uses Anthropic's Messages API; the old GLM references in the original PRD are historical only.

### Design Goals

| Goal | Description |
| --- | --- |
| 🎓 Education | Teach good prompt-writing through real, curated examples |
| 🧩 Template Repository | Inspiring, ready-to-use prompts across categories |
| 💬 Interactive Refinement | Real-time AI assistance improving prompt quality |
| 🎛️ Multi-Model Support | Users pick the generator that fits their workflow |
| 🔐 User Accounts | Google OAuth sign-in with profile and stats |
| 💸 Zero Cost | Free for both users and developers |

---

## ✨ Key Features

| Feature | Status | Phase |
| --- | --- | --- |
| 🖼️ Gallery browse (search, category filter, sort, infinite scroll) | **✅ Done** | 2 |
| 🏗️ Template detail view (prompt, style tips, variations, copy) | **✅ Done** | 2 |
| 💬 Anthropic Claude chat refinement with live streaming + prompt progression | **✅ Done** | 3 |
| 📝 Template seed data (50 templates across categories) | **✅ Done** | 2 |
| 🎨 Image generation — Hugging Face free models (5 models) | **✅ Done** | 4 |
| 🎨 Image generation — Replicate paid models (FLUX.1, SDXL, Playground) | **✅ Done** | 4 |
| 🔐 Firebase Auth — Google OAuth sign-in/out | **✅ Done** | 2 |
| 👤 User profiles with stats (images, versions, favorites) | **✅ Done** | 2 |
| 🔗 Save & share custom prompt versions (full CRUD) | **✅ Done** | 3 |
| 💾 Chat session persistence (save conversations to Firestore) | **✅ Done** | 3 |
| ⭐ Favorites (toggle, sync with Firestore) | **✅ Done** | 4 |
| 📜 Generation history (track all generated images) | **✅ Done** | 4 |
| 🧪 Unit & integration tests (140 tests, vitest) | **✅ Done** | 5 |

> **You are here:** Phases 1–4 are fully complete. Phase 5 (performance, security audit, production launch) is next.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router) · React 19 | UI framework |
| **Styling** | Tailwind CSS 3 · shadcn/ui (Radix primitives) | Design system, dark-first theme per PRD §9.1 |
| **Streaming** | Server-Sent Events (SSE) | Live chat responses |
| **Backend** | Next.js Route Handlers (`/api/*`) | Serverless endpoints |
| **Database** | Firebase Firestore | Templates, users, versions, sessions, favorites |
| **Storage** | Cloudinary (25 GB free) | Generated + template images |
| **Auth** | Firebase Auth / Google OAuth | User sign-in, ID token verification |
| **LLM** | Anthropic Claude Haiku (Messages API) | Prompt refinement assistant |
| **Image Gen** | Hugging Face Inference Providers + Replicate | Image generation (free + paid tiers) |
| **Testing** | Vitest + jsdom + @testing-library | Unit & integration tests |
| **Deployment** | Vercel (free tier) + GitHub Actions CI/CD | Production hosting |

### Version note

The original spec targeted Next.js 14. This project was upgraded to **Next.js 16 (React 19, ESLint 9 flat config)** so it stays on a security-supported line — the production dependency tree reports **0 vulnerabilities** (`npm audit --omit=dev`). See commit `70fbb50` ("Phase 1: Project foundation setup") and its history for the migration details.

---

## 🏗️ Architecture

```text
┌────────────────────────── User Browser ──────────────────────────┐
│  Gallery (browse) ──► Detail View ──► Chat with AI ──► Image     │
│  Sign in (Google)    Profile       Favorites / History           │
└──────────────┬────────────────────────────────────────┬───────────┘
               │ HTTP /api/* (Bearer token)             │
┌──────────────▼────────────────────────────────────────▼───────────┐
│                      Next.js 16 (Vercel)                          │
│  Route Handlers:                                                  │
│    /api · /api/templates · /api/chat · /api/generate              │
│    /api/auth · /api/user-versions · /api/chat-sessions            │
│    /api/favorites · /api/history · /api/models                    │
└──────┬──────────────┬──────────────────┬──────────────────────────┘
       │ Firebase SDK │ Anthropic API    │ Image Gen APIs
┌──────▼─────────┐ ┌──▼───────────┐ ┌───▼──────────────────────────┐
│ Firestore +    │ │ Anthropic   │ │ Hugging Face (free)          │
│ Auth + Admin   │ │ Claude Haiku│ │ Replicate (FLUX, SDXL, ...) │
│ Cloudinary     │ │              │ │ Cloudinary (storage)         │
└────────────────┘ └──────────────┘ └──────────────────────────────┘
```

---

## 📂 Project Structure

```text
.
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + metadata (dark theme)
│   ├── page.tsx                  # Landing page with phase tracker
│   ├── globals.css               # Tailwind + PRD color tokens
│   ├── gallery/                  # Phase 2 — gallery pages
│   │   ├── page.tsx              # Browse: search, filter, sort, infinite scroll
│   │   └── [id]/page.tsx         # Template detail view (SSR)
│   ├── chat/                     # Phase 3 — AI refinement chat
│   │   ├── page.tsx              # Blank-slate chat (no template)
│   │   └── [templateId]/page.tsx # Chat pre-loaded with a template
│   ├── profile/                  # Phase 2 — user profile page
│   │   └── page.tsx              # User stats, favorites, versions, history
│   └── api/                      # Route Handlers (serverless)
│       ├── route.ts              # GET /api → health check
│       ├── templates/            # GET list + GET /:id
│       ├── chat/                 # POST — Anthropic streaming/SSE + non-streaming
│       ├── models/               # GET — supported image models (HF + Replicate)
│       ├── generate/             # POST — HF/Replicate → Cloudinary
│       ├── auth/                 # POST — me / register / logout
│       ├── user-versions/        # GET/POST + [id] GET/PUT/DELETE
│       ├── chat-sessions/        # GET/POST chat sessions
│       ├── favorites/            # GET/POST toggle favorites
│       └── history/              # GET generation history
├── components/
│   ├── ui/                       # shadcn/ui (button, card, dialog, select, …)
│   ├── layouts/                  # Nav (with AuthButton), footer, shell
│   ├── gallery/                  # Gallery cards, filters, skeletons, pagination
│   └── customize/                # Chat UI + image generation panel
├── lib/
│   ├── firebase.ts               # Firebase client (guarded init, browser)
│   ├── firebase-admin.ts         # Firebase Admin SDK (guarded init, server)
│   ├── cloudinary.ts             # Cloudinary upload & image URL helpers
│   ├── utils.ts                  # cn() classname helper
│   ├── data/templates.ts         # 50 seed templates (local fallback)
│   ├── types/index.ts            # Domain types mirroring PRD §4
│   └── services/
│       ├── auth.ts               # Client-side auth (Google OAuth)
│       ├── server-auth.ts        # Server-side auth (token verify, user CRUD)
│       ├── templates.ts          # List/get/categories — Firestore w/ seed fallback
│       ├── llm.ts                # Anthropic chat: streaming + non-streaming + system prompt
│       ├── generation.ts         # Hugging Face Inference API + model catalog
│       ├── replicate.ts          # Replicate API + model catalog
│       └── chat-sessions.ts      # Chat session persistence
├── tests/                        # Vitest unit & integration tests
│   ├── setup.ts                  # Test setup (jest-dom matchers)
│   ├── api/routes.test.ts        # API route handler tests
│   ├── lib/services/             # Service unit tests
│   ├── lib/data/                 # Seed data integrity tests
│   └── lib/                      # Cloudinary, utils tests
├── vitest.config.ts              # Vitest configuration
├── public/images/                # Local assets
├── components.json               # shadcn/ui config
├── next.config.ts                # Image domains (Cloudinary, HF, Replicate)
├── tailwind.config.ts            # Theme + PRD palette
├── eslint.config.mjs             # ESLint 9 flat config
├── firestore.rules               # Firestore security rules
├── firebase.json                 # Firebase project config + emulators
├── .env.local                    # Local secrets (git-ignored)
└── .env.example                  # Env template (committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 20.9** (developed on Node 22)
- npm (or pnpm / yarn / bun)
- A GitHub account (for process tracking & deployments)

### 1. Install

```bash
git clone https://github.com/Faber-Aritonang/Promt_Pic_Gallery.git
cd Promt_Pic_Gallery
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# then fill in real values — see "Environment Variables" below
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> ⚠️ If port 3000 is already in use (e.g. another service on your machine),
> start on a free port instead:
>
> ```bash
> npm run dev -- -p 3001
> ```

The health check responds at [http://localhost:3000/api](http://localhost:3000/api):

```json
{ "status": "ok", "message": "PromtPicGallery API is running", "phase": "5", "timestamp": "…" }
```

### 4. Verify

```bash
npm run lint        # ESLint (flat config)
npm run typecheck   # TypeScript (tsc --noEmit)
npm run test        # Unit & integration tests
npm run build       # Production build
```

---

## 🔑 Environment Variables

Copy `.env.example` → `.env.local`. All variables are required before enabling the related feature; placeholder values keep the app running in the meantime (`lib/firebase.ts` skips initialization until real credentials are present, and the templates/chat services fall back gracefully).

| Variable | Needed for | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase (client) — auth, Firestore | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase (client) | Firebase console → Web app |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin (server) — user CRUD, sessions | Firebase console → Service accounts → Generate new private key |
| `ANTHROPIC_API_KEY` | Anthropic Claude chat refinement | [console.anthropic.com](https://console.anthropic.com/) |
| `LLM_MODEL` | Anthropic Claude model | Default `claude-haiku-4-5` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary image storage | Cloudinary dashboard → Copy cloud name |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary image storage | Cloudinary Settings → Upload → Add upload preset |
| `HUGGING_FACE_API_KEY` | Image generation (free tier) | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `REPLICATE_API_TOKEN` | Image generation (paid tier) | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) |
| `NEXT_PUBLIC_API_URL` | Client API calls | Default `http://localhost:3000/api` |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs / OG tags | Default `http://localhost:3000` |
| `ENVIRONMENT` | Runtime mode | `development` / `production` |

> 🔒 `.env*.local` is git-ignored — never commit real keys. `.env.example` holds placeholders only. If a key was exposed, revoke it in the provider dashboard and replace it in local/Vercel environments before redeploying.

---

## 🔌 API Reference

Base URL: `/api` (local: `http://localhost:3000/api`). All responses follow the `ApiResponse<T>` envelope (`lib/types/index.ts`):

```json
{ "success": true, "data": { }, "message": "optional" }
```

### Public Endpoints

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| GET | `/api` | Health check / uptime probe | ❌ |
| GET | `/api/templates` | List templates (`?q=` / `?category=` / `?sort=` / `?limit=` / `?offset=`, `?categories=true`) | ❌ |
| GET | `/api/templates/:id` | Single template detail | ❌ |
| POST | `/api/chat` | Send message → Anthropic Claude refinement (`stream: true` = SSE, `templateId` optional) | ❌ |
| GET | `/api/models` | List supported image models (Hugging Face + Replicate) | ❌ |

### Authenticated Endpoints (require Bearer token)

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth` | Auth actions: `me`, `register`, `logout` | ✅ |
| GET | `/api/user-versions` | List user's saved prompt versions (`?templateId=`, `?limit=`, `?offset=`) | ✅ |
| POST | `/api/user-versions` | Save a new prompt version | ✅ |
| GET | `/api/user-versions/:id` | Get a version (owner or public) | Owner/Public |
| PUT | `/api/user-versions/:id` | Update a version (owner only) | ✅ |
| DELETE | `/api/user-versions/:id` | Delete a version (owner only) | ✅ |
| POST | `/api/generate` | Generate image (Hugging Face → Cloudinary, or Replicate) | Optional |
| GET | `/api/chat-sessions` | List user's chat sessions | ✅ |
| POST | `/api/chat-sessions` | Create a new chat session | ✅ |
| GET | `/api/favorites` | List user's favorite templates | ✅ |
| POST | `/api/favorites` | Toggle favorite for a template | ✅ |
| GET | `/api/history` | List user's generation history | ✅ |

---

## 🔥 Firebase Setup

The Firebase layer (client SDK, security rules) is **already wired into the repo** — it only needs a real project to point at. The templates API automatically falls back to the 50 local seed templates when Firestore isn't configured, so the gallery works end-to-end out of the box.

### 1. Create the project

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add project**.
2. Add a **Web app** and copy the six `NEXT_PUBLIC_FIREBASE_*` values into `.env.local`.
3. Enable **Firestore Database**, **Storage**, and **Authentication** (Google sign-in provider).
4. For server-side Admin SDK: go to **Project settings → Service accounts** → *Generate new private key* → paste the JSON content as the `FIREBASE_SERVICE_ACCOUNT` value in `.env.local` (single line). On Vercel/GCP this step is optional — Application Default Credentials are used automatically.

### 2. Deploy security rules

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

The rules enforce:

- `templates/` → public read, admin-only write.
- `users/` → profile readable, writes restricted to the owner (`request.auth.uid == userId`).
- `user_versions/` → owner write; public versions readable by everyone.
- `chat_sessions/` → owner only.
- `generated_images/` → owner write; public images readable by everyone.
- `favorites/` → owner write; owner read.

### 3. Local emulators (optional)

`firebase.json` already defines Auth/Firestore emulator ports:

```bash
npx firebase-tools emulators:start
```

---

## 🗄️ Database Schema

Domain types in `lib/types/index.ts` mirror the PRD collections (PRD §4):

| Collection | Document | Notes |
| --- | --- | --- |
| `templates` | `Template` | Prompt + preview image, category/tags, stats (views, favorites, rating) |
| `users` | `User` | Profile + aggregate stats (images, versions, favorites) |
| `user_versions` | `UserVersion` | A user's refined copy with `refinement_steps[]` history |
| `chat_sessions` | `ChatSession` | Message log per template session |
| `generated_images` | `GeneratedImage` | Model used, params, output URL, timing, usage |
| `favorites` | `Favorite` | User + template reference, timestamp |

Timestamps are stored as epoch **milliseconds** (`number`) for easy ordering and serialization.

---

## 📜 Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `npm run dev` | Start dev server |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Serve production build |
| `lint` | `npm run lint` | ESLint (flat config) |
| `typecheck` | `npm run typecheck` | TypeScript check without emitting |
| `test` | `npm run test` | Run all unit & integration tests |
| `test:watch` | `npm run test:watch` | Run tests in watch mode |

---

## 🧪 Testing

The project uses **Vitest** with jsdom and @testing-library for unit and integration tests.

### Run tests

```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode (re-runs on file changes)
```

### Test coverage

| File | Tests | What's tested |
| --- | --- | --- |
| `tests/lib/data/templates.test.ts` | 16 | Seed data integrity, unique IDs, required fields, categories |
| `tests/lib/services/templates.test.ts` | 24 | Search, filter, sort, pagination (page + offset), edge cases |
| `tests/lib/services/templates-firestore.test.ts` | 2 | Firestore integration, stored vs seed templates |
| `tests/lib/services/llm.test.ts` | 35 | getModel, chatCompletion (errors + success), streaming, buildRefinementMessages |
| `tests/lib/services/generation.test.ts` | 17 | Model catalog, getImageModel, HF config, API calls, errors |
| `tests/lib/cloudinary.test.ts` | 13 | Upload (Buffer/File), error handling, getImageUrl transformations |
| `tests/api/routes.test.ts` | 25 | Health check, templates, models, auth, user-versions (GET/POST CRUD) |
| `tests/lib/utils.test.ts` | 6 | cn() classname utility, Tailwind class merging |
| `tests/components/TemplateUpload.test.tsx` | 2 | Upload dialog form submission, error reporting |
| **Total** | **140** | |

---

## 🗺️ Roadmap

Development is executed in **phases** so progress can be reviewed and resumed easily (see the master build prompt / PRD). Each phase ends with a tagged, documented commit.

| Phase | Scope | Status |
| --- | --- | --- |
| **1** | Foundation & setup — scaffold, design system, Firebase wiring, env, API skeleton, rules | ✅ **Done** (commit `70fbb50`) |
| **2** | Gallery & database — 20 seed templates, browse UI, detail view, template endpoints. **Auth:** Firebase Auth (Google OAuth), user profiles, AuthButton, /profile page | ✅ **Done** (commit `8ea2462`) |
| **3** | AI chat — Anthropic Claude integration (SSE streaming + non-streaming), chat UI, prompt progression sidebar. **User versions:** full CRUD (GET/POST/[id] GET/PUT/DELETE). **Chat sessions:** Firestore persistence | ✅ **Done** (commit `8ea2462`) |
| **4** | Image generation — Hugging Face free models (5), Replicate paid models (FLUX.1, SDXL, Playground v2.5). **Favorites:** toggle with Firestore sync. **History:** generation history tracking. **Cloudinary** storage | ✅ **Done** (commit `8ea2462`) |
| **5** | Testing & deployment — 140 unit/integration tests (vitest). ESLint clean (0 errors). Vercel + GitHub Actions CI/CD configured. Production-ready. | ✅ **Done** (commit `6d5e3ad`) |

> Process history lives in the git log — every phase, decision (e.g. the Next.js 16 upgrade) and follow-up is committed for traceability.

---

## 🌐 Deployment

Deployment runs on **Vercel (free tier)**. Importing this repository into Vercel connects its Git integration, so **every push to `main` builds and publishes to production automatically**. Vercel is the intended host (PRD §7.1 / §12) because it runs Next.js serverless Route Handlers (`/api/*`) natively.

A separate **CI workflow** (`.github/workflows/ci.yml`) runs `lint`, `typecheck` and `test` on every push to `main`. It is a quality gate only — Vercel performs the deployment.

### Why not GitHub Pages?

This repository is the GitHub home of the project (source control, issue tracking, CI). But the app needs a Node.js server — Next.js Route Handlers, Firebase, and external LLM/image APIs cannot run on static-only GitHub Pages. A static GitHub Pages preview of the landing page could be added later, but the **working app deploys to a free Node-capable host**, i.e. Vercel.

### Activate auto-deploy (one-time setup)

1. **Create the Vercel project** — sign up at [vercel.com](https://vercel.com) and **Import Project** → this GitHub repository. Importing connects the Git integration, which then deploys every push to `main` (or link it manually with `npx vercel link` after `npx vercel login`).
2. **Add environment variables** in the Vercel project (*Settings → Environment Variables*) — copy every key from `.env.example` for **Production *and*** Preview. ⚠️ Production secrets live in Vercel, **not** in the repository.
3. **Push to `main`** — Vercel builds and publishes automatically; the deployment shows up on the Vercel dashboard while the CI workflow runs its checks in parallel.
4. **Verify** — open `https://<your-app>.vercel.app/api`; it should return the health JSON (`{"status":"ok",…}`). Individual features also need their provider keys (Anthropic, Hugging Face, Cloudinary…); if an API answers 500 only in production, see [Troubleshooting](docs/TROUBLESHOOTING.md).

Prefer GitHub Actions to run the deployment itself? Add the `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` repository secrets (*Settings → Secrets and variables → Actions*), uncomment the `deploy` job in `.github/workflows/ci.yml`, and turn off Vercel's automatic Git deployments — otherwise every push publishes twice. The `vercel` CLI is pinned as a devDependency for reproducible builds.

### Local link workflow (alternative to dashboard import)

```bash
npx vercel login          # once
npx vercel link           # once — creates .vercel/project.json (git-ignored)
cp .env.example .env.local
npx vercel dev            # local dev with env from Vercel
```

---

## 🔧 Troubleshooting

Production-only failures (works with `npm run dev`, fails on Vercel) are documented in **[`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md)** — symptom, root cause, fix, and the Vercel checks to run when it happens again. Short version: check the **Logs** tab for the failing request, and make sure `ANTHROPIC_API_KEY` + `LLM_MODEL` are set for the environment you deployed.

---

## 🔖 Versioning & Process Tracking

- **Versioning:** semantic-style bumps per phase (`v0.1.0` → `v1.0.0` at launch).
- **Tracking:** every step is committed with a descriptive message and this footer, so the full process is reproducible:
  ```text
  🤖 Generated with Codebuff
  Co-Authored-By: Codebuff <noreply@codebuff.com>
  ```

---

## 📖 Glossary

| Term | Meaning |
| --- | --- |
| Template | Pre-made prompt with a generated preview image |
| Prompt | Text instruction for an AI image generator |
| Refinement | Iteratively improving a prompt with AI help |
| User Version | A user's saved, refined copy of a template |
| Turn | One user↔AI exchange in the chat |
| Model | An image-generation service (DALL·E, Flux, SD, …) |
| Favorite | A template bookmarked by a user |

---

## 📬 Contact

Maintained by **Faber Aritonang** — issues & feature requests via the [GitHub Issues](https://github.com/Faber-Aritonang/Promt_Pic_Gallery/issues) tab of this repository.

---

<div align="center"><sub>PromtPicGallery · All Phases Complete · 140 Tests Passing · 0 Lint Errors · Built with the 100% free stack</sub></div>
