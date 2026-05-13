# MirrorFit AI

Production-focused multi-model virtual try-on platform built with Next.js, Firebase, and OpenAI.

## Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Firebase Auth (Email/Password + Google)
- Firestore + Firebase Storage (real-time)
- OpenAI Images API (server-side route)

## Features Implemented
- User authentication and session persistence
- Onboarding consent checkpoint (authorization + adult policy)
- Model Library with reusable profiles
- Multi-reference model image upload manager
- Garment Library with metadata + image uploads
- Try-On Studio with:
  - Prompt Helper / Style Guide
  - Main preview canvas
  - In-canvas generation loader
  - Subtle drop-shadow on generated preview
- Generation history with live updates
- Global theme engine with custom creative toggle and full-app theme coverage
- Server-side generation API with:
  - token auth verification
  - safety classifier
  - rate-limiting
  - OpenAI generation
  - output persistence to Storage + Firestore
- Firestore + Storage rules for strict per-user ownership

## Environment Setup
1. Copy `.env.example` to `.env.local`.
2. Fill Firebase client variables (`NEXT_PUBLIC_*`).
3. Fill Firebase admin/service variables (`FIREBASE_*`).
4. Add `OPENAI_API_KEY`.
5. Optionally set `OPENAI_IMAGE_MODEL` (default: `gpt-image-1`).

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

## API Routes
- `POST /api/generations` (auth required)
- `GET /api/generations/:id` (auth required)
- `POST /api/uploads/sign` (auth required)

## Important Notes
- This app expects all user-owned/authorized model references.
- Safety layer allows commercial adult fashion categories but rejects explicit/unsafe requests.
- For production, configure monitoring/alerts in your hosting provider and Firebase project.
