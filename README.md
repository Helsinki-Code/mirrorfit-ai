# MirrorFit AI

Production-focused chat-first virtual try-on platform built with Next.js, Firebase, and fal-hosted image models.

## Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Firebase Auth (Email/Password + Google)
- Firestore + Firebase Storage (real-time)
- fal APIs (server-side orchestration with retry + fallback)

## Features Implemented
- User authentication and session persistence
- Onboarding consent checkpoint (authorization + adult policy)
- Model Library with reusable profiles
- Multi-reference model image upload manager
- Garment Library with metadata + image uploads
- Shoot Inbox + Chat Shoot Room flow
- Missing Info Cards for required inputs/references
- Result message thread + Quick Fix Chips
- Brand Memory defaults + Share/Approval event log
- In-canvas generation loader and preview depth shadow
- Global theme engine with custom creative toggle and full-app theme coverage
- Server-side generation API with:
  - token auth verification
  - safety classifier
  - rate-limiting
  - multi-agent orchestration (intent cleaner, ref packager, router, judge, repair, QA)
  - retry/fallback execution (cap=8 by default)
  - output persistence to Storage + Firestore
- Firestore + Storage rules for strict per-user ownership

## Environment Setup
1. Copy `.env.example` to `.env.local`.
2. Fill Firebase client variables (`NEXT_PUBLIC_*`).
3. Fill Firebase admin/service variables (`FIREBASE_*`).
4. Add `FAL_KEY`.
5. Optional orchestration flags:
   - `ORCH_RETRY_CAP`
   - `ORCH_PASS_THRESHOLD`
   - `ORCH_PRIMARY_ENGINE_ATTEMPTS`
   - `ORCH_SECONDARY_ENGINE_ATTEMPTS`

## Firebase Setup
- Enable Authentication:
  - Email/Password
  - Google
- Create Firestore and Storage.
- Deploy security rules:
  - `firestore.rules`
  - `storage.rules`
- Create indexes using `firestore.indexes.json`.

## Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes (chat-first)
- `POST /api/generations` (auth required)
- `GET /api/generations/:id` (auth required)
- `POST /api/uploads/sign` (auth required)

## Important Notes
- This app expects all user-owned/authorized model references.
- Model references required for generation: `face`, `front_body`, `side_body`.
- Garment references required for generation: `front` or `flat_lay`.
- Provider/model names are backend-only and hidden from frontend UX.
- Safety layer allows commercial adult fashion categories but rejects explicit/unsafe requests.
- For production, configure monitoring/alerts in your hosting provider and Firebase project.
