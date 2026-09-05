# 🏠 Prompt Gallery

Text-to-image **prompt template gallery** with AI-powered refinement (Zhipu GLM-3). Browse prompt templates, chat with an AI assistant to refine them, then generate images with the model of your choice. See `PRD_Prompt_Gallery_App.md` for the full spec.

> **Phase 1 — Foundation** ✅ (this snapshot)
> Running on **Next.js 16** (upgraded from the PRD's Next.js 14 to stay on a security-supported line — see commit history).

## Tech Stack

| Layer     | Choice                                             |
| --------- | -------------------------------------------------- |
| Frontend  | Next.js 16 (App Router) · Tailwind CSS · shadcn/ui |
| State     | @tanstack/react-query                              |
| Database  | Firebase Firestore                                 |
| Auth      | Firebase Auth (Google OAuth, planned)              |
| LLM       | Zhipu GLM-3 (Phase 3)                              |
| Image gen | Hugging Face / Replicate (Phase 4)                 |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The health check endpoint lives at [http://localhost:3000/api](http://localhost:3000/api).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

Placeholders keep the app running before Firebase/GLM keys exist — `lib/firebase.ts` skips initialization until real credentials are present.

| Variable                     | Where to get it                                                        |
| ---------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_*`     | [Firebase console](https://console.firebase.google.com) → web app      |
| `GLM_API_KEY`                | [Zhipu open.bigmodel.cn](https://open.bigmodel.cn/) (Phase 3)          |
| `HUGGING_FACE_API_KEY`       | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) (Phase 4) |
| `REPLICATE_API_TOKEN`        | [replicate.com/account](https://replicate.com/account) (Phase 4)       |

## Project Structure

```
app/
├── layout.tsx / page.tsx / globals.css
└── api/                  # Next.js API routes
    ├── route.ts          # GET /api — health check
    ├── auth/             # Phase 2+: Firebase Auth
    ├── templates/        # Phase 2: gallery CRUD
    ├── chat/             # Phase 3: GLM-3 refinement
    ├── generate/         # Phase 4: image generation
    └── user-versions/    # Phase 2/3: saved custom prompts
components/
├── ui/                   # shadcn/ui components
├── layouts/ gallery/ customize/   # Phase 2/3 feature components
lib/
├── firebase.ts           # Firebase client (guarded init)
├── types/index.ts        # PRD domain types
└── utils.ts              # cn() helper
firestore.rules           # Firestore security rules (deploy when DB exists)
storage.rules             # Firebase Storage rules
```

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run lint       # eslint (flat config)
npm run typecheck  # tsc --noEmit
```

## Firestore Security Rules

When the Firestore project exists, deploy the rules (Phase 1.7):

```bash
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

## Phase Status

| Phase | Scope                              | Status    |
| ----- | ---------------------------------- | --------- |
| 1     | Foundation & Setup                 | ✅ Done   |
| 2     | Gallery & Database                 | ⏳ Next   |
| 3     | AI Chat Integration (GLM-3)        | Planned   |
| 4     | Image Generation Backend           | Planned   |
| 5     | Testing & Deployment               | Planned   |
