# AvSafety — Aviation Safety Summit 2026 Platform

AvSafety is a full-stack React + Express application for managing the Aviation Safety Summit 2026 experience: event pages, speaker workflows, stakeholder engagement, registration, commercial marketplace, publishing workflows, and AI-assisted summit operations.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind-style utility classes
- **Backend:** Express (TypeScript, `server.ts`)
- **AI:** Google Gemini (`@google/genai`) with deterministic fallbacks when API keys are unavailable
- **Storage:** JSON file database at `/home/runner/work/AvSafety/AvSafety/data/db.json`
- **Payments:** Paystack (initialize + verify endpoints)

## Core Capabilities

- Summit landing experience, sessions, and schedule
- Speaker profile management and AI-powered speaker Q&A/topic suggestion
- Stakeholder nomination pipeline with AI brainstorming, invitation letter generation, and sponsorship proposal generation
- Marketplace inventory, quote requests, order workflow, proof-of-display evidence, and revenue metrics
- Publishing suite:
  - AI transcription for speaker recordings
  - AI handbook draft generation
  - AI podcast episode metadata generation
  - AI podcast producer assistant notes
- Summit assistant chat endpoint grounded on official summit records

## Project Structure

```text
/home/runner/work/AvSafety/AvSafety
├── src/
│   ├── components/              # UI modules (summit, marketplace, publishing, admin, PWA)
│   ├── data/                    # Seed/static domain data
│   ├── services/                # Google integration and utility services
│   └── types.ts                 # Shared frontend types
├── data/db.json                 # Runtime JSON database
├── server.ts                    # Express API + Vite integration
├── public/                      # Static and PWA assets
└── package.json                 # Scripts and dependencies
```

## Environment Variables

Copy `.env.example` into `.env` and set:

- `GEMINI_API_KEY` — Enables all AI routes
- `APP_URL` — Application base URL
- `PAYSTACK_SECRET_KEY` — Required for payment initialization/verification
- `PAYSTACK_PUBLIC_KEY` — Exposed for client checkout flow

## Local Development

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Build and Run

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` — Start full-stack dev server (`tsx server.ts`)
- `npm run lint` — Type check (`tsc --noEmit`)
- `npm run build` — Build frontend + bundle backend
- `npm run start` — Run production server bundle
- `npm run clean` — Remove build outputs and generated DB artifacts

## API Overview (Selected)

- System:
  - `GET /api/health`
  - `GET /api/db`
  - `POST /api/db/update`
- Summit assistant:
  - `POST /api/gemini/chat`
- Speakers:
  - `POST /api/speakers/ai-suggest-topics`
  - `POST /api/speakers/ai-assistant`
- Publishing agents:
  - `POST /api/publishing/ai-transcribe`
  - `POST /api/publishing/ai-generate-handbook`
  - `POST /api/publishing/ai-generate-podcast-episode`
  - `POST /api/publishing/ai-podcast-producer`
- Stakeholders:
  - `GET/POST/PUT/DELETE /api/stakeholders`
  - `POST /api/stakeholders/ai-brainstorm`
  - `POST /api/stakeholders/ai-letter`
  - `POST /api/stakeholders/ai-sponsorship-proposal`
- Marketplace:
  - `GET /api/marketplace/inventory`
  - `POST /api/marketplace/ai-assistant`
  - `POST /api/marketplace/orders`
  - `GET /api/marketplace/revenue-metrics`
- Payments:
  - `POST /api/paystack/initialize`
  - `POST /api/paystack/verify`

## Notes

- AI routes are designed with strict grounding/fallback logic to reduce hallucinated content.
- If Gemini is unavailable, the app still returns deterministic fallback content for agent workflows.
