<div align="center">

# 🏙️ Prompt Gallery

**A prompt template gallery for text-to-image AI — browse templates, refine prompts with an AI sparring partner (Zhipu GLM-3), and generate images with the model of your choice.**

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
- [Roadmap](#-roadmap)
- [Deployment](#-deployment)
- [Versioning & Process Tracking](#-versioning--process-tracking)
- [Glossary](#-glossary)
- [Contact](#-contact)

---

## 📌 Overview

**Prompt Gallery** is a free web platform that helps content creators, designers, and AI enthusiasts master **prompt engineering** for text-to-image generation. It provides:

1. A browsable **repository of ready-to-use prompt templates** with preview images.
2. An interactive **AI refinement chat** (Zhipu GLM-3) that improves prompts turn-by-turn while tracking each iteration.
3. A **model selector** so the finished prompt can be sent to the user's preferred image generator (DALL·E, Flux, Stable Diffusion, and more).
4. **Save & share** flows for refined "user versions" of any template.

Full product specification: see `PRD_Prompt_Gallery_App.md` (referenced by section throughout this project, e.g. "PRD §4.1").

### Design Goals

| Goal | Description |
| --- | --- |
| 🎓 Education | Teach good prompt-writing through real, curated examples |
| 🧩 Template Repository | Inspiring, ready-to-use prompts across categories |
| 💬 Interactive Refinement | Real-time AI assistance improving prompt quality |
| 🎛️ Multi-Model Support | Users pick the generator that fits their workflow |
| 💸 Zero Cost | Free for both users and developers |

---

## ✨ Key Features

| Feature | Status | Phase |
| --- | --- | --- |
| 🖼️ Gallery browse (search, category filter, sort, pagination) | Planned | 2 |
| 📝 Template customize view + live prompt progression | Planned | 2–3 |
| 💬 GLM-3 chat refinement with iteration history | Planned | 3 |
| 🎨 Multi-model image generation (Hugging Face / Replicate) | Planned | 4 |
| ⭐ Favorites, history, custom "My Versions" | Planned | 2–4 |
| 🔗 Save / share / export custom prompts | Planned | 3–4 |
| 🏗️ Foundation: design system, API skeleton, env, rules | **✅ Done** | 1 |

> **You are here:** Phase 1 (Foundation) is complete. See the [Roadmap](#-roadmap).

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router) · React 19 | UI framework |
| **Styling** | Tailwind CSS 3 · shadcn/ui (Radix primitives) | Design system, dark-first theme per PRD §9.1 |
| **State** | @tanstack/react-query | Server-state & data fetching |
| **Realtime** | socket.io-client | Live chat (Phase 3) |
| **Backend** | Next.js Route Handlers (`/api/*`) | Serverless endpoints |
| **Database** | Firebase Firestore | Templates, users, versions, sessions |
| **Storage** | Firebase Storage | Generated + template images |
| **Auth** | Firebase Auth / Google OAuth | Planned (Phase 2) |
| **LLM** | Zhipu GLM-3 (`glm-3-5-turbo`) | Prompt refinement assistant (Phase 3) |
| **Image Gen** | Hugging Face API + Replicate | Free-tier image generation (Phase 4) |
| **Deployment** | Vercel (free tier) | Production hosting |

### Version note

The original spec targeted Next.js 14. This project was upgraded to **Next.js 16 (React 19, ESLint 9 flat config)** so it stays on a security-supported line — the production dependency tree reports **0 vulnerabilities** (`npm audit --omit=dev`). See commit `70fbb50` ("Phase 1: Project foundation setup") and its history for the migration details.

---

## 🏗️ Architecture

```text
┌────────────────────────── User Browser ──────────────────────────┐
│  Gallery (browse) ──► Customize View ──► Chat with AI ──► Image  │
└──────────────┬────────────────────────────────────────┬───────────┘
               │ HTTP /api/*                            │
┌──────────────▼────────────────────────────────────────▼───────────┐
│                      Next.js 16 (Vercel)                          │
│  Route Handlers:  /api · /api/auth · /api/templates ·             │
│                   /api/chat · /api/generate · /api/user-versions  │
└──────┬──────────────────┬──────────────────────┬──────────────────┘
       │ Firebase SDK     │ GLM-3 API            │ HF / Replicate
┌──────▼─────────┐ ┌──────▼───────────┐ ┌────────▼─────────────────┐
│ Firestore +    │ │ Zhipu GLM-3      │ │ Hugging Face · Replicate │
│ Storage + Auth │ │ (Phase 3)        │ │ (Phase 4)                │
└────────────────┘ └──────────────────┘ └──────────────────────────┘
```

---

## 📂 Project Structure

```text
.
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + metadata (dark theme)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Tailwind + PRD color tokens
│   └── api/                      # Route Handlers (serverless)
│       ├── route.ts              # GET /api → health check (live ✅)
│       ├── auth/                 # Auth endpoints (Phase 2+)
│       ├── templates/            # Gallery CRUD (Phase 2)
│       ├── chat/                 # GLM-3 refinement (Phase 3)
│       ├── generate/             # Image generation (Phase 4)
│       └── user-versions/        # Saved custom prompts (Phase 2/3)
├── components/
│   ├── ui/                       # shadcn/ui (button, card, dialog, …)
│   ├── layouts/                  # Nav, footer, shells (Phase 2)
│   ├── gallery/                  # Gallery cards & filters (Phase 2)
│   └── customize/                # Customize + chat view (Phase 3)
├── lib/
│   ├── firebase.ts               # Firebase client (guarded init)
│   ├── types/index.ts            # Domain types mirroring PRD §4
│   ├── utils.ts                  # cn() classname helper
│   ├── services/                 # Data services (Phase 2)
│   └── types/                    # Domain types
├── public/images/                # Local assets
├── components.json               # shadcn/ui config
├── next.config.ts                # Image domains (Firebase, HF, Replicate)
├── tailwind.config.ts            # Theme + PRD palette
├── eslint.config.mjs             # ESLint 9 flat config
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Firebase Storage rules
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
{ "status": "ok", "message": "Prompt Gallery API is running", "phase": "1", "timestamp": "…" }
```

### 4. Verify

```bash
npm run lint        # ESLint (flat config)
npm run typecheck   # TypeScript (tsc --noEmit)
npm run build       # Production build
```

---

## 🔑 Environment Variables

Copy `.env.example` → `.env.local`. All variables are required before enabling the related feature; placeholder values keep the app running in the meantime (`lib/firebase.ts` skips initialization until real credentials are present).

| Variable | Needed for | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase (client) | Firebase console → Web app |
| `NEXT_PUBLIC_API_URL` | Client API calls | Default `http://localhost:3000/api` |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs / OG | Default `http://localhost:3000` |
| `GLM_API_KEY` | GLM-3 chat (Phase 3) | [open.bigmodel.cn](https://open.bigmodel.cn/) |
| `GLM_API_ENDPOINT` | GLM-3 chat (Phase 3) | Default endpoint in `.env.example` |
| `HUGGING_FACE_API_KEY` | Image gen (Phase 4) | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `REPLICATE_API_TOKEN` | Image gen (Phase 4) | [replicate.com/account](https://replicate.com/account) |
| `ENVIRONMENT` | Runtime mode | `development` / `production` |

> 🔒 `.env*.local` is git-ignored — never commit real keys. `.env.example` holds placeholders only.

---

## 🔌 API Reference

Base URL: `/api` (local: `http://localhost:3000/api`). All responses follow the `ApiResponse<T>` envelope (`lib/types/index.ts`):

```json
{ "success": true, "data": { }, "message": "optional" }
```

| Method | Endpoint | Description | Status |
| --- | --- | --- | --- |
| GET | `/api` | Health check / uptime probe | ✅ Live |
| POST | `/api/auth` | Auth actions (login / logout / register / me) | 🚧 Phase 2 |
| GET | `/api/templates` | List templates (+ `?category=` / `?q=` filters) | 🚧 Phase 2 |
| GET | `/api/templates/:id` | Single template | 🚧 Phase 2 |
| POST | `/api/user-versions` | Create a saved custom prompt | 🚧 Phase 2/3 |
| GET | `/api/user-versions` | List the caller's versions | 🚧 Phase 2/3 |
| POST | `/api/chat` | Send message → GLM-3 refinement | 🚧 Phase 3 |
| POST | `/api/generate` | Generate image with selected model | 🚧 Phase 4 |
| GET | `/api/models` | List supported image models | 🚧 Phase 4 |

Endpoint stubs return `501` with `{ "success": false, "error": "Not implemented yet" }` until their phase lands.

---

## 🔥 Firebase Setup

The Firebase layer (client SDK, security rules, storage rules) is **already wired into the repo** — it only needs a real project to point at.

### 1. Create the project

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add project**.
2. Add a **Web app** and copy the six `NEXT_PUBLIC_FIREBASE_*` values into `.env.local`.
3. Enable **Firestore Database**, **Storage**, and **Authentication** (Google sign-in).

### 2. Deploy security rules (PRD §1.7 / §11)

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,storage
```

The rules enforce:

- `templates/` → public read, admin-only write.
- `users/` → profile readable, writes restricted to the owner (`request.auth.uid == userId`).
- `user_versions/` → owner write; public versions readable by everyone.
- `chat_sessions/` → owner only.
- `generated_images/` → owner write; public images readable by everyone.

### 3. Local emulators (optional)

`firebase.json` already defines Auth/Firestore/Storage emulator ports:

```bash
npx firebase-tools emulators:start
```

---

## 🗄️ Database Schema

Domain types in `lib/types/index.ts` mirror the PRD collections (PRD §4):

| Collection | Document | Notes |
| --- | --- | --- |
| `templates` | `Template` | Prompt + preview image, category/tags, stats (views, favorites, rating) |
| `user_versions` | `UserVersion` | A user's refined copy with `refinement_steps[]` history |
| `chat_sessions` | `ChatSession` | Message log per template session |
| `generated_images` | `GeneratedImage` | Model used, params, output URL, timing, usage |
| `users` | `User` | Profile + aggregate stats |

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

---

## 🗺️ Roadmap

Development is executed in **phases** so progress can be reviewed and resumed easily (see the master build prompt / PRD). Each phase ends with a tagged, documented commit.

| Phase | Scope | Status |
| --- | --- | --- |
| **1** | Foundation & setup — scaffold, design system, Firebase wiring, env, API skeleton, rules | ✅ **Done** (commit `70fbb50`) |
| **2** | Gallery & database — template schema + seeds, browse UI, search/filter, template endpoints | ⏳ Next |
| **3** | AI chat — GLM-3 integration, chat UI, session management, prompt progression | Planned |
| **4** | Image generation — Hugging Face / Replicate, model selector, results & storage | Planned |
| **5** | Testing & deployment — unit/integration tests, perf, security audit, launch | Planned |

> Process history lives in the git log — every phase, decision (e.g. the Next.js 16 upgrade) and follow-up is committed for traceability.

---

## 🌐 Deployment

The project ships with a **GitHub Actions workflow** (`.github/workflows/deploy.yml`) that auto-deploys the `main` branch to **Vercel (free tier)** — every push runs `lint` + `typecheck`, then builds and publishes to production. Vercel is the intended host (PRD §7.1 / §12) because it runs Next.js serverless Route Handlers (`/api/*`) natively.

### Why not GitHub Pages?

This repository is the GitHub home of the project (source control, issue tracking, CI). But the app needs a Node.js server — Next.js Route Handlers, Firebase, and external LLM/image APIs cannot run on static-only GitHub Pages. A static GitHub Pages preview of the landing page could be added later, but the **working app deploys to a free Node-capable host**, i.e. Vercel.

### Activate auto-deploy (one-time setup)

1. **Create the Vercel project** — sign up at [vercel.com](https://vercel.com) and **Import Project** → this GitHub repository (or run `npx vercel link` inside the repo after logging in with `npx vercel login`).
2. **Create an API token** — [vercel.com/account/tokens](https://vercel.com/account/tokens) → *Create Token* (e.g. `prompt-gallery-ci`).
3. **Add GitHub secrets** — in this repo → *Settings → Secrets and variables → Actions*, create:

   | Secret | Value |
   | --- | --- |
   | `VERCEL_TOKEN` | The API token from step 2 |
   | `VERCEL_ORG_ID` | Your Vercel team/user ID (see `.vercel/project.json` after `vercel link`) |
   | `VERCEL_PROJECT_ID` | The project ID (see `.vercel/project.json`) |

4. **Add environment variables** in the Vercel project (*Settings → Environment Variables*) — copy every key from `.env.example`. ⚠️ Production secrets live in Vercel, **not** in the repository.
5. **Push to `main`** — the workflow runs automatically; the production URL appears in the run log and on the Vercel dashboard.
6. **Verify** — open `https://<your-app>.vercel.app/api`; it should return the health JSON (`{"status":"ok",…}`).

You can also trigger a deploy manually from the *Actions* tab (**Run workflow**). The `vercel` CLI is pinned as a devDependency for reproducible builds.

### Local link workflow (alternative to dashboard import)

```bash
npx vercel login          # once
npx vercel link           # once — creates .vercel/project.json (git-ignored)
cp .env.example .env.local
npx vercel dev            # local dev with env from Vercel
```

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

---

## 📬 Contact

Maintained by **Faber Aritonang** — issues & feature requests via the [GitHub Issues](https://github.com/Faber-Aritonang/Promt_Pic_Gallery/issues) tab of this repository.

---

<div align="center"><sub>Prompt Gallery · Phase 1 Foundation · Built with the 100% free stack</sub></div>
