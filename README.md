# AvSafety - Aviation Safety Summit 2026 Portal

![Aviation Safety Summit 2026](https://img.shields.io/badge/Event-17%20November%202026-blue)
![License](https://img.shields.io/badge/License-Apache%202.0-green)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![React](https://img.shields.io/badge/Framework-React%2019-blue)
![Hosted](https://img.shields.io/badge/Hosted-Cloudflare-orange)

## Overview

**AvSafety** is a comprehensive digital platform for the **Aviation Safety Summit 2026**, scheduled for **17 November 2026** at the **Marriott Hotel, Ikeja, Lagos, Nigeria**.

**Live Site:** [summit.domislink.com](https://summit.domislink.com)

### Summit Theme
> "EVERYBODY IS INVOLVED IN AVIATION SAFETY — An accident does not select a tribe, profession, company or class."

**Organizer:** Domislink International Services Ltd  
**Brand:** The Digital Empire  
**Symbol:** Golden Crown

## Key Features

### 🎫 Core Functionality
- **Event Management** - Multi-session summit coordination with speaker scheduling
- **Speaker Management** - Verified speakers with AI-powered topic suggestions
- **Stakeholder Management** - Comprehensive invitation system with AI support
- **Registration System** - NDPA-compliant delegate registration
- **Commercial Marketplace** - Ad positions, sponsorship packages, and orders
- **Payment Processing** - Secure Paystack integration
- **Business Memo System** - Anonymized aviation safety lessons and case studies
- **Analytics Dashboard** - Revenue metrics and sponsorship analytics

### 🤖 AI-Powered Features
- **AI Summit Advertising Assistant** - Smart recommendations for sponsorship packages
- **AI Stakeholder Brainstorm** - Intelligent candidate suggestions for invitations
- **AI Invitation Letter Generator** - Professional invitation letter generation
- **AI Speaker Topic Suggester** - Context-aware topic recommendations
- **AI Speaker Assistant** - Natural language Q&A about speakers
- **AI Creative Request Handler** - Advertising concept generation
- **AI Sponsorship Proposal Generator** - Custom sponsorship propositions
- **Gemini Chat Assistant** - General attendee Q&A

### 📱 Progressive Web App (PWA)
- Works offline with service worker support
- Installable on desktop and mobile devices
- App-like experience with standalone mode
- Push notification support

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Build tool and dev server
- **Tailwind CSS 4.1** - Styling
- **Motion 12** - Animations
- **Lucide React** - Icons
- **Firebase 12.19** - Backend services (optional)

### Backend
- **Express 4.21** - HTTP server framework
- **Node.js** - Runtime environment
- **File-based JSON DB** - Data persistence (data/db.json)

### AI Integration
- **Google Gemini API** - LLM for AI features (gemini-2.5-flash)
- **@google/genai 2.22** - Gemini SDK

### Payment
- **Paystack** - Payment gateway integration

### Hosting
- **Cloudflare Pages** - Frontend hosting with automatic deployments
- **Cloudflare Workers** - Serverless backend functions
- **Cloudflare KV** - Key-value storage for data persistence

### Utilities
- **ESBuild** - Code bundling for production
- **Vite PWA Plugin** - Progressive Web App configuration

## Project Structure

```
AvSafety/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── data/              # Data files (speakers, stakeholders, marketplace)
│   ├── hooks/             # Custom React hooks
│   ├── App.tsx            # Main application component
│   └── index.css           # Global styles
├── data/
│   └── db.json            # JSON database (auto-generated)
├── functions/             # Cloudflare Workers functions (optional)
├── server.ts              # Express server and API endpoints
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── wrangler.toml          # Cloudflare Wrangler configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js 18+ (recommended: 20 LTS)
- npm or yarn
- Git
- Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/amaechiu-del/AvSafety.git
   cd AvSafety
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment configuration**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials (see Environment Variables section)

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx  # or sk_live_xxxxxxxxxxxx for production
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx  # or pk_live_xxxxxxxxxxxx for production

# Firebase Configuration (Optional)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id

# Environment
NODE_ENV=development  # or production
```

### Getting API Keys

**Gemini API:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy and paste into `.env.local`

**Paystack:**
1. Create account at [Paystack](https://paystack.com/)
2. Go to Settings → API Keys & Webhooks
3. Copy your Test or Live keys

## API Documentation

### Authentication
Admins use the `x-admin-mode: true` header or `?admin=true` query parameter for sensitive endpoints.

### Core Endpoints

#### Event Management

**GET `/api/health`** - Health check
```bash
curl http://localhost:3000/api/health
```

**GET `/api/db`** - Get full database (privacy-protected)
```bash
curl http://localhost:3000/api/db
```

**GET `/api/db?admin=true`** - Get full database (admin mode)
```bash
curl http://localhost:3000/api/db?admin=true
```

#### Speaker Management

**POST `/api/speakers/ai-suggest-topics`** - AI topic suggestions for a speaker
```bash
curl -X POST http://localhost:3000/api/speakers/ai-suggest-topics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Capt. Kunle Adebayo",
    "position": "Captain (B737-800)",
    "organisation": "Air Peace",
    "industry": "Airlines",
    "role": "Keynote Speaker"
  }'
```

**POST `/api/speakers/ai-assistant`** - Q&A about speakers
```bash
curl -X POST http://localhost:3000/api/speakers/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Who is speaking about airline operations?"
  }'
```

#### Stakeholder Management

**GET `/api/stakeholders`** - List stakeholders
```bash
curl "http://localhost:3000/api/stakeholders?category=AIRLINES&status=CONFIRMED"
```

**POST `/api/stakeholders`** - Add new stakeholder/nominee
```bash
curl -X POST http://localhost:3000/api/stakeholders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "position": "CEO",
    "organisation": "AeroTech Solutions",
    "category": "TECHNOLOGY",
    "eventRole": "PANELIST",
    "proposedTopic": "Aviation Safety Technology"
  }'
```

**PUT `/api/stakeholders/:id`** - Update stakeholder
```bash
curl -X PUT http://localhost:3000/api/stakeholders/stk-xxx \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

**POST `/api/stakeholders/ai-brainstorm`** - AI-suggested candidates
```bash
curl -X POST http://localhost:3000/api/stakeholders/ai-brainstorm \
  -H "Content-Type: application/json" \
  -d '{}'
```

**POST `/api/stakeholders/ai-letter`** - Generate invitation letter
```bash
curl -X POST http://localhost:3000/api/stakeholders/ai-letter \
  -H "Content-Type: application/json" \
  -d '{
    "recipientName": "Dr. John Smith",
    "recipientPosition": "CEO",
    "recipientOrg": "AeroTech Solutions",
    "recipientEmail": "john@aerotech.com",
    "category": "TECHNOLOGY",
    "proposedTopic": "Aviation Safety Technology",
    "eventRole": "PANELIST"
  }'
```

**POST `/api/stakeholders/ai-sponsorship-proposal`** - Sponsorship proposal
```bash
curl -X POST http://localhost:3000/api/stakeholders/ai-sponsorship-proposal \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "AeroTech Solutions",
    "industry": "Aviation Technology",
    "executiveName": "Dr. John Smith",
    "executivePosition": "CEO"
  }'
```

**POST `/api/stakeholders/dispatch-letter`** - Record invitation sent
```bash
curl -X POST http://localhost:3000/api/stakeholders/dispatch-letter \
  -H "Content-Type: application/json" \
  -d '{
    "inviteeId": "stk-xxx",
    "recipientEmail": "john@aerotech.com",
    "subject": "OFFICIAL INVITATION: Aviation Safety Summit 2026",
    "method": "GMAIL"
  }'
```

#### Marketplace & Commercial

**GET `/api/marketplace/inventory`** - View ad positions and packages
```bash
curl http://localhost:3000/api/marketplace/inventory
```

**POST `/api/marketplace/ai-assistant`** - AI sponsorship advisor
```bash
curl -X POST http://localhost:3000/api/marketplace/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "organisation": "AeroTech Solutions",
    "promotionGoal": "Brand visibility",
    "targetAudience": "Aviation directors",
    "message": "We want a booth and logo placement",
    "currency": "NGN"
  }'
```

**POST `/api/marketplace/orders`** - Create commercial order
```bash
curl -X POST http://localhost:3000/api/marketplace/orders \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "AeroTech Solutions",
    "contactPerson": "John Smith",
    "email": "john@aerotech.com",
    "items": [{"positionId": "ad-exhibit-standard", "quantity": 1}],
    "totalAmount": 2200000,
    "currency": "NGN"
  }'
```

**POST `/api/paystack/initialize`** - Initialize Paystack payment
```bash
curl -X POST http://localhost:3000/api/paystack/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "amount": 2200000,
    "currency": "NGN",
    "orderId": "ord-xxx"
  }'
```

**POST `/api/paystack/verify`** - Verify payment
```bash
curl -X POST http://localhost:3000/api/paystack/verify \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "pstk_ref_xxx",
    "orderId": "ord-xxx"
  }'
```

#### Creative Services

**POST `/api/marketplace/creative-request`** - AI advertising concept
```bash
curl -X POST http://localhost:3000/api/marketplace/creative-request \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "AeroTech Solutions",
    "contactPerson": "John Smith",
    "email": "john@aerotech.com",
    "message": "Create a professional ad concept",
    "targetAudience": "Aviation executives",
    "preferredSizeFormat": "A4 landscape",
    "deadline": "2026-10-31"
  }'
```

#### Registration

**POST `/api/registrations`** - Register delegate
```bash
curl -X POST http://localhost:3000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Capt. Kunle Adebayo",
    "email": "kunle@airpeace.com",
    "organisation": "Air Peace",
    "position": "Captain",
    "industry": "Airlines",
    "attendanceCategory": "Verified Speaker",
    "consentNDPA": true
  }'
```

**POST `/api/memos`** - Submit aviation memo
```bash
curl -X POST http://localhost:3000/api/memos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Capt. Kunle Adebayo",
    "isAnonymous": false,
    "profession": "Captain (B737-800)",
    "organisation": "Air Peace",
    "memoTitle": "Critical Safety Lesson",
    "memoContent": "During approach...",
    "lessonLearned": "Key takeaway...",
    "recommendedImprovement": "Suggestion...",
    "consent": true
  }'
```

#### Analytics

**GET `/api/marketplace/revenue-metrics`** - Revenue analytics
```bash
curl http://localhost:3000/api/marketplace/revenue-metrics
```

## AI Agent Functions Documentation

### Overview
All AI agent functions use Google's Gemini API with graceful fallback implementations. They maintain anti-hallucination guards and are fully grounded in real summit data.

### 1. AI Summit Advertising Assistant

**Endpoint:** `POST /api/marketplace/ai-assistant`

**Purpose:** Recommends sponsorship packages and ad positions based on company profile and goals.

**Parameters:**
```typescript
{
  message: string;              // Customer's specific request
  organisation: string;         // Company name
  promotionGoal: string;       // What they want to achieve
  targetAudience: string;      // Who they want to reach
  estimatedBudget?: string;    // Budget range
  visibilityTypes?: string[];  // Preferred visibility channels
  currency?: 'NGN' | 'USD';   // Currency preference
}
```

**Response:**
```typescript
{
  success: boolean;
  aiGenerated: boolean;  // true if Gemini API used, false if fallback
  advisorGreeting: string;
  recommendedPackages: Array<{
    id: string;
    name: string;
    priceNGN: number;
    priceUSD: number;
    reason: string;  // Why this is recommended
    expectedImpact: string;
    safetyCompliance: string;
  }>;
  strategicAdvice: string;
  nextSteps: string;
}
```

**Key Features:**
- Grounded in real catalogue data (no invented packages)
- Keyword-based intelligent matching
- Fallback rule engine when API unavailable
- Never promises non-existent benefits

### 2. AI Stakeholder Brainstorm

**Endpoint:** `POST /api/stakeholders/ai-brainstorm`

**Purpose:** Suggests high-impact candidates in under-represented sectors.

**Parameters:**
```typescript
{}  // No parameters required
```

**Response:**
```typescript
{
  success: boolean;
  suggestions: Array<{
    name: string;  // Real person or verified role
    position: string;
    organisation: string;
    category: string;  // AVIATION, GOVERNMENT, BANKING, etc.
    whyRelevant: string;
    proposedTopic: string;
    proposedRole: string;  // KEYNOTE_SPEAKER, PANELIST, etc.
    verificationStatus: string;  // Always marked as NOT YET VERIFIED
    suggestedSponsorship?: string;
  }>;
  disclaimer: string;
}
```

**Key Features:**
- Analyzes current stakeholder representation
- Suggests real, verifiable candidates only
- Clearly marks all suggestions as unverified
- Prevents fabrication with strict validation
- Includes fallback with curated Nigerian leaders

### 3. AI Invitation Letter Generator

**Endpoint:** `POST /api/stakeholders/ai-letter`

**Purpose:** Generates professional, personalized invitation letters.

**Parameters:**
```typescript
{
  recipientName: string;           // Full name
  recipientPosition: string;       // Current position
  recipientOrg: string;           // Organization
  recipientEmail: string;         // Email address
  category: string;               // Sector/category
  proposedTopic?: string;         // Discussion topic
  eventRole?: string;             // Role at summit
  sponsorshipOption?: string;     // Sponsorship tier
  specialMessage?: string;        // Custom note
}
```

**Response:**
```typescript
{
  success: boolean;
  letter: {
    id: string;
    recipientName: string;
    recipientPosition: string;
    recipientOrg: string;
    recipientEmail: string;
    subject: string;  // Email subject line
    formalSalutation: string;
    formalInvitationText: string;
    eventDetailsText: string;
    sectorRelevanceText: string;  // Why their sector matters
    proposedRoleText: string;
    callToActionText: string;
    signatureBlock: string;
    gmailDraftUrl: string;  // Pre-filled Gmail compose URL
    mailtoUrl: string;      // mailto: link for email clients
    createdAt: string;      // ISO timestamp
  }
}
```

**Key Features:**
- Generates formal, aristocratic tone
- Explains sector relevance
- Pre-generates Gmail and mailto links
- Suitable for immediate sending
- Respects diplomatic protocol

### 4. AI Speaker Topic Suggester

**Endpoint:** `POST /api/speakers/ai-suggest-topics`

**Purpose:** Suggests relevant summit discussion topics for speakers.

**Parameters:**
```typescript
{
  name: string;            // Speaker name (required)
  position: string;        // Current position
  organisation: string;    // Organization (required)
  industry: string;        // Industry sector
  role: string;           // Role at summit
}
```

**Response:**
```typescript
{
  success: boolean;
  topics: string[];  // Array of 3 topic suggestions
  disclaimer: string;  // "AI-GENERATED SUGGESTIONS — NOT OFFICIAL"
}
```

**Key Features:**
- Context-aware based on executive profile
- Ensures topics are relevant to aviation safety
- Returns 3 distinct, professional topics
- Includes fallback with realistic alternatives
- Marked clearly as AI-generated

### 5. AI Speaker Assistant

**Endpoint:** `POST /api/speakers/ai-assistant`

**Purpose:** Answers questions about summit speakers using verified data.

**Parameters:**
```typescript
{
  question: string;  // Natural language question
}
```

**Response:**
```typescript
{
  success: boolean;
  answer: string;  // Natural language answer
  timestamp: string;  // ISO timestamp
}
```

**Key Features:**
- Grounded in verified speaker database
- No fabrication of people or positions
- Clear about verification status
- Fallback keyword matching if API unavailable
- Professional, structured responses

### 6. AI Creative Request Handler

**Endpoint:** `POST /api/marketplace/creative-request`

**Purpose:** Generates advertising concepts and creative direction.

**Parameters:**
```typescript
{
  companyName: string;          // Company name
  contactPerson: string;        // Contact name
  email: string;               // Email address
  phone: string;               // Phone number
  message: string;             // Creative brief
  targetAudience: string;      // Target audience description
  preferredSizeFormat: string; // Format e.g., "A4 landscape"
  deadline: string;            // Deadline date
  logoUrl?: string;            // Optional logo URL
}
```

**Response:**
```typescript
{
  success: boolean;
  request: {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    message: string;
    targetAudience: string;
    preferredSizeFormat: string;
    deadline: string;
    logoProvided: boolean;
    logoUrl: string;
    aiDraftConcept: string;  // AI-generated concepts
    status: string;  // CONCEPT_DRAFTED
    createdAt: string;
  }
}
```

**Key Features:**
- Generates 2 distinct creative concepts
- Respects aviation safety standards
- Includes headline, body copy, and CTA
- Provides visual composition notes
- Status tracking for creative workflow

### 7. Gemini Chat Assistant

**Endpoint:** `POST /api/gemini/chat`

**Purpose:** General Q&A about the summit for attendees.

**Parameters:**
```typescript
{
  message: string;   // Attendee question
  context?: string;  // Optional context
}
```

**Response:**
```typescript
{
  text: string;  // Assistant's response
}
```

**Key Features:**
- Grounded in official programme data
- Only provides confirmed information
- Polite deflection for unknown queries
- Professional, helpful tone
- Uses speaker and session data

### 8. AI Sponsorship Proposal Generator

**Endpoint:** `POST /api/stakeholders/ai-sponsorship-proposal`

**Purpose:** Generates tailored sponsorship propositions.

**Parameters:**
```typescript
{
  companyName: string;        // Company name (required)
  industry?: string;          // Industry sector
  executiveName?: string;     // Target executive name
  executivePosition?: string; // Executive position
}
```

**Response:**
```typescript
{
  success: boolean;
  proposal: {
    headline: string;
    whySectorMatters: string;  // Industry relevance
    howParticipationSupportsSafety: string;
    recommendedTiers: Array<{
      tier: string;  // PLATINUM_SAFETY_BENEFACTOR, GOLD_SECTOR_CHAMPION, etc.
      feeNGN: string;
      feeUSD: string;
      benefits: string[];  // List of sponsorship benefits
    }>;
    callToAction: string;
  }
}
```

**Key Features:**
- Sector-specific value propositions
- Real, approved sponsorship tiers only
- Honest benefit descriptions
- Clear pricing in NGN and USD
- High-converting language

## Deployment

### Cloudflare Pages + Workers Deployment

This application is currently hosted on Cloudflare at **summit.domislink.com**.

#### Setup Cloudflare Account

1. **Create Cloudflare Account**
   - Visit [Cloudflare](https://dash.cloudflare.com/)
   - Sign up or log in

2. **Connect Your Domain**
   - Add your domain to Cloudflare
   - Update domain nameservers to Cloudflare's
   - Configure DNS records

3. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   # Or use npx
   npx wrangler --version
   ```

#### Deploy Frontend to Cloudflare Pages

1. **Create GitHub Repository**
   ```bash
   git remote add origin https://github.com/yourusername/AvSafety.git
   git push -u origin main
   ```

2. **Connect Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Pages → Connect to Git
   - Select your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Environment variables:
       - `GEMINI_API_KEY`
       - `PAYSTACK_SECRET_KEY`
       - `PAYSTACK_PUBLIC_KEY`

3. **Automatic Deployments**
   - Cloudflare Pages automatically deploys on push to main branch
   - Preview deployments for pull requests

#### Deploy Backend to Cloudflare Workers (Optional)

If you want to run the Express backend on Cloudflare Workers instead of locally:

1. **Configure `wrangler.toml`**
   ```toml
   name = "avsafety-api"
   main = "worker.ts"
   type = "service"
   
   [env.production]
   route = "https://summit.domislink.com/api/*"
   zone_id = "your_zone_id"
   
   [[kv_namespaces]]
   binding = "STORAGE"
   id = "your_kv_id"
   
   [env.production.kv_namespaces]
   binding = "STORAGE"
   id = "your_production_kv_id"
   ```

2. **Create Worker Adapter**
   ```bash
   npm install wrangler
   ```

3. **Deploy**
   ```bash
   npx wrangler deploy --env production
   ```

#### Using Cloudflare KV for Data Persistence

Instead of file-based JSON storage, use Cloudflare KV:

1. **Create KV Namespace**
   ```bash
   npx wrangler kv:namespace create "DB"
   npx wrangler kv:namespace create "DB" --preview
   ```

2. **Update Code**
   ```typescript
   // In server.ts or worker.ts
   async function readDb() {
     const data = await STORAGE.get('db', 'json') || defaultDb;
     return data;
   }
   
   async function writeDb(data: any) {
     await STORAGE.put('db', JSON.stringify(data));
   }
   ```

### Docker Deployment

For self-hosted environments:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t avsafety .
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_key \
  -e PAYSTACK_SECRET_KEY=your_key \
  avsafety
```

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: avsafety
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (frontend + backend)
- `npm run start` - Run production build
- `npm run clean` - Remove build artifacts and database
- `npm run lint` - Type check with TypeScript

## Data Persistence

### Local Development
The application uses a JSON file database at `data/db.json`. This includes:
- Event details
- Speakers and stakeholders
- Registrations
- Commercial orders
- Quotations
- Memos and submissions

**Important:** Always backup `data/db.json` before major operations.

### Production (Cloudflare)
Use Cloudflare KV for distributed, persistent data storage:
- KV namespaces for event data
- Automatic replication across Cloudflare's edge network
- 1000 transactions per second per key
- Eventually consistent reads

## Privacy & Compliance

### NDPA 2023 Compliance
- Registrations marked with Nigeria Data Protection Act 2023 jurisdiction
- Explicit consent collection for data processing
- Registration data hidden from public API
- Admin-only access to sensitive information

### Anti-Hallucination Measures
- All AI recommendations grounded in real data
- Explicit anti-fabrication guards on stakeholder suggestions
- Fallback implementations prevent data loss
- Verification status always disclosed

## Contributing

Contributions welcome! Please:

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Submit a pull request

## Troubleshooting

### Gemini API Issues

**Problem:** "Gemini API not configured"
- **Solution:** Add `GEMINI_API_KEY` to environment variables
- **Cloudflare:** Add via Pages → Settings → Environment variables

**Problem:** AI features falling back to defaults
- **Solution:** Verify API key is valid and not expired
- **Check:** `npm run dev` and look for initialization errors in console

### Payment Issues

**Problem:** "Payment verification failed"
- **Solution:** Verify `PAYSTACK_SECRET_KEY` is correct
- **Note:** Test keys won't process real payments
- **Check:** Ensure key matches live/test environment

### Database Issues

**Problem:** "Error reading DB"
- **Solution:** Delete `data/db.json` to regenerate
- **Warning:** This will clear all custom data
- **Backup:** Always maintain backups before operations

### Cloudflare Deployment Issues

**Problem:** "Build failed on Cloudflare Pages"
- **Solution:** Check build logs in Cloudflare Dashboard
- **Ensure:** Node version is 18+ in settings
- **Verify:** Environment variables are set correctly

**Problem:** "Worker deployment failed"
- **Solution:** Verify Wrangler authentication: `npx wrangler login`
- **Check:** `wrangler.toml` configuration is valid
- **Ensure:** KV namespace bindings match your account

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a detailed issue report
3. Include error messages and environment details
4. Specify if running locally or on Cloudflare

## License

Licensed under Apache License 2.0. See LICENSE file for details.

## Credits

**Project:** Aviation Safety Summit 2026  
**Organizer:** Domislink International Services Ltd  
**Platform:** AvSafety  
**Hosted on:** Cloudflare Pages + Workers  
**Built with:** React, TypeScript, Express, Gemini AI  
**Created:** 2026

---

**Live Site:** [summit.domislink.com](https://summit.domislink.com)  
**Theme:** "EVERYBODY IS INVOLVED IN AVIATION SAFETY"  
An accident does not select a tribe, profession, company or class.
