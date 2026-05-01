# Expressions Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the full Expressions monorepo with Next.js PWA frontend, Cloud Run Express backend, Firebase Auth, Vertex AI (Gemini), Cloudflare Pages deployment, and a passing smoke test confirming the end-to-end stack works.

**Architecture:** pnpm monorepo with Turborepo. Next.js 14 (App Router) frontend deploys to Cloudflare Pages via `@cloudflare/next-on-pages`. Express backend deploys to Cloud Run with Firebase Admin + Vertex AI SDK. Frontend calls the backend with Firebase ID tokens for auth. All secrets stored in Google Secret Manager.

**Tech Stack:** pnpm, Turborepo, Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Express 5, Firebase Admin SDK, Firebase Client SDK v10, `@google-cloud/vertexai`, `@cloudflare/next-on-pages`, Cloud Run, GitHub Actions, Vitest

**GCP Project:** `gen-lang-client-0010416291`
**GitHub Repo:** `https://github.com/hondapowersr/Expressions.git`
**Branches:** `main` → production, `test` → staging preview

---

## File Map

```
Expressions/
├── apps/
│   ├── web/                          # Next.js 14 PWA → Cloudflare Pages
│   │   ├── app/
│   │   │   ├── layout.tsx            # Root layout, Firebase Auth provider
│   │   │   ├── page.tsx              # Placeholder home (role selector comes in Plan 2)
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   └── ui/                   # shadcn/ui components (auto-generated)
│   │   ├── lib/
│   │   │   ├── firebase.ts           # Firebase client SDK init
│   │   │   ├── auth-context.tsx      # React auth context + useAuth hook
│   │   │   └── api-client.ts         # Typed fetch wrapper for Cloud Run API
│   │   ├── public/
│   │   │   ├── manifest.json         # PWA manifest
│   │   │   └── icons/                # PWA icons (placeholder PNGs)
│   │   ├── next.config.js
│   │   ├── wrangler.toml             # Cloudflare Pages config
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── api/                          # Express → Cloud Run
│       ├── src/
│       │   ├── index.ts              # Express app entry, port 8080
│       │   ├── routes/
│       │   │   ├── health.ts         # GET /health → { status: 'ok' }
│       │   │   └── ai.ts             # POST /ai/chat → Gemini stream
│       │   ├── services/
│       │   │   ├── firebase-admin.ts # Firebase Admin SDK singleton
│       │   │   └── vertex-ai.ts      # Vertex AI / Gemini service
│       │   └── middleware/
│       │       └── auth.ts           # Verify Firebase ID token → req.user
│       ├── Dockerfile
│       ├── .dockerignore
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   └── shared/                       # Shared TypeScript types
│       ├── src/
│       │   └── types.ts
│       ├── tsconfig.json
│       └── package.json
├── .github/
│   └── workflows/
│       ├── deploy-test.yml           # Push to test → Cloudflare preview + Cloud Run staging
│       └── deploy-main.yml           # Push to main → Cloudflare prod + Cloud Run prod
├── docs/superpowers/plans/
│   └── 2026-05-01-foundation.md      # This file
├── .gitignore
├── package.json                      # Root workspace (pnpm)
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Task 1: Initialize pnpm monorepo

**Files:**
- Create: `package.json` (root)
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`

- [ ] **Step 1: Install pnpm and Turborepo globally**

```bash
npm install -g pnpm turbo
```

Expected: `pnpm --version` prints `9.x.x`, `turbo --version` prints `2.x.x`

- [ ] **Step 2: Create root package.json**

Create `C:\Users\Ian\Documents\repos\Expressions\package.json`:

```json
{
  "name": "expressions",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 3: Create pnpm-workspace.yaml**

Create `C:\Users\Ian\Documents\repos\Expressions\pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

- [ ] **Step 4: Create turbo.json**

Create `C:\Users\Ian\Documents\repos\Expressions\turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 5: Create .gitignore**

Create `C:\Users\Ian\Documents\repos\Expressions\.gitignore`:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
dist/
.cloudflare/

# Environment
.env
.env.local
.env*.local
!.env.example

# Testing
coverage/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Turbo
.turbo/

# IDE
.vscode/
.idea/
```

- [ ] **Step 6: Create app and package directories**

```bash
mkdir -p apps/web apps/api packages/shared
```

- [ ] **Step 7: Verify workspace structure**

```bash
ls apps/ packages/
```

Expected: `api  web` and `shared`

---

## Task 2: Scaffold Next.js frontend

**Files:**
- Create: `apps/web/` (full Next.js scaffold)
- Modify: `apps/web/package.json` (add deps)

- [ ] **Step 1: Scaffold Next.js app**

From `C:\Users\Ian\Documents\repos\Expressions`:

```bash
cd apps && pnpm create next-app@latest web --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm
```

When prompted: accept all defaults.

- [ ] **Step 2: Install additional frontend dependencies**

```bash
cd apps/web && pnpm add firebase @cloudflare/next-on-pages && pnpm add -D wrangler vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Replace apps/web/package.json scripts**

Open `apps/web/package.json` and replace the `"scripts"` section with:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "build:cf": "npx @cloudflare/next-on-pages",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest",
  "clean": "rm -rf .next dist"
}
```

- [ ] **Step 4: Write vitest config**

Create `apps/web/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 5: Write vitest setup file**

Create `apps/web/vitest.setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Write failing smoke test for frontend**

Create `apps/web/__tests__/smoke.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';

describe('Frontend smoke test', () => {
  it('environment has required config', () => {
    // These will fail until .env.local is created in Task 12
    expect(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

```bash
cd apps/web && pnpm test
```

Expected: FAIL — `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is undefined (correct, env not set yet)

---

## Task 3: Configure Next.js for Cloudflare Pages

**Files:**
- Modify: `apps/web/next.config.js`
- Create: `apps/web/wrangler.toml`

- [ ] **Step 1: Replace next.config.js**

Overwrite `apps/web/next.config.js`:

```js
const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === 'development') {
  (async () => {
    await setupDevPlatform();
  })();
}

module.exports = nextConfig;
```

- [ ] **Step 2: Create wrangler.toml**

Create `apps/web/wrangler.toml`:

```toml
name = "expressions"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

- [ ] **Step 3: Add edge runtime to root layout**

Open `apps/web/app/layout.tsx` and add at the top (before imports):

```typescript
export const runtime = 'edge';
```

So the full file is:

```typescript
export const runtime = 'edge';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expressions',
  description: 'AI-powered creative multi-tool for artists',
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Create PWA manifest**

Create `apps/web/public/manifest.json`:

```json
{
  "name": "Expressions",
  "short_name": "Expressions",
  "description": "AI-powered creative multi-tool for artists",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 5: Create placeholder PWA icons directory**

```bash
mkdir -p apps/web/public/icons
```

Note: Add actual icon PNGs (192x192 and 512x512) to `apps/web/public/icons/` before first public deployment. Use any placeholder PNG for now.

---

## Task 4: Scaffold Express API backend

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/index.ts`

- [ ] **Step 1: Create apps/api/package.json**

Create `apps/api/package.json`:

```json
{
  "name": "@expressions/api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc --project tsconfig.json",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "express": "^5.0.0",
    "cors": "^2.8.5",
    "firebase-admin": "^12.0.0",
    "@google-cloud/vertexai": "^1.0.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.4.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 2: Install API dependencies**

```bash
cd apps/api && pnpm install
```

- [ ] **Step 3: Create apps/api/tsconfig.json**

Create `apps/api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create src/index.ts (Express app)**

Create `apps/api/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { healthRouter } from './routes/health';
import { aiRouter } from './routes/ai';

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:3000',
  'https://expressions.pages.dev',
  'https://test.expressions.pages.dev',
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

app.use('/health', healthRouter);
app.use('/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Expressions API running on port ${PORT}`);
});

export default app;
```

- [ ] **Step 5: Create vitest config for api**

Create `apps/api/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

---

## Task 5: Create shared types package

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/types.ts`

- [ ] **Step 1: Create packages/shared/package.json**

Create `packages/shared/package.json`:

```json
{
  "name": "@expressions/shared",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/types.js",
  "types": "./dist/types.d.ts",
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create packages/shared/tsconfig.json**

Create `packages/shared/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create packages/shared/src/types.ts**

Create `packages/shared/src/types.ts`:

```typescript
// AI
export type ArtistRole = 'tutor' | 'guide' | 'critic' | 'freestyle';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  messages: ChatMessage[];
  artistRole: ArtistRole;
  sessionContext?: string;
}

export interface ChatResponse {
  message: string;
  sessionContext?: string;
}

// User
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  artistRole?: ArtistRole;
}

// Gallery
export interface ArtworkEntry {
  id: string;
  uid: string;
  title: string;
  storageUrl: string;
  thumbnailUrl: string;
  createdAt: number;
  tags: string[];
  emotionalIntent?: string;
}

// API responses
export interface ApiError {
  error: string;
  code?: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: number;
  version: string;
}
```

- [ ] **Step 4: Build shared package**

```bash
cd packages/shared && pnpm install && pnpm build
```

Expected: `dist/types.js` and `dist/types.d.ts` created

- [ ] **Step 5: Add shared package as dependency to web and api**

```bash
# From repo root
cd apps/web && pnpm add @expressions/shared
cd ../api && pnpm add @expressions/shared
```

---

## Task 6: Firebase Admin SDK (backend)

**Files:**
- Create: `apps/api/src/services/firebase-admin.ts`

- [ ] **Step 1: Write failing test**

Create `apps/api/src/__tests__/firebase-admin.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('firebase-admin service', () => {
  it('exports an initialized app', async () => {
    // Set required env before import
    process.env.GCP_PROJECT_ID = 'gen-lang-client-0010416291';
    const { getFirebaseAdmin } = await import('../services/firebase-admin');
    const admin = getFirebaseAdmin();
    expect(admin).toBeDefined();
    expect(typeof admin.auth).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && pnpm test
```

Expected: FAIL — `Cannot find module '../services/firebase-admin'`

- [ ] **Step 3: Create apps/api/src/services/firebase-admin.ts**

```typescript
import * as admin from 'firebase-admin';

let app: admin.app.App;

export function getFirebaseAdmin(): admin.app.App {
  if (app) return app;

  const projectId = process.env.GCP_PROJECT_ID || 'gen-lang-client-0010416291';

  if (admin.apps.length > 0) {
    app = admin.apps[0]!;
    return app;
  }

  // On Cloud Run, uses the attached service account automatically.
  // Locally, uses Application Default Credentials (gcloud auth application-default login).
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
    storageBucket: `${projectId}.appspot.com`,
  });

  return app;
}

export function getFirestore(): admin.firestore.Firestore {
  return getFirebaseAdmin().firestore();
}

export function getAuth(): admin.auth.Auth {
  return getFirebaseAdmin().auth();
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && pnpm test
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/services/firebase-admin.ts apps/api/src/__tests__/firebase-admin.test.ts
git commit -m "feat(api): add Firebase Admin SDK service"
```

---

## Task 7: Vertex AI service (backend)

**Files:**
- Create: `apps/api/src/services/vertex-ai.ts`

- [ ] **Step 1: Write failing test**

Create `apps/api/src/__tests__/vertex-ai.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';

vi.mock('@google-cloud/vertexai', () => ({
  VertexAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContentStream: vi.fn(),
      generateContent: vi.fn(),
    }),
  })),
}));

describe('vertex-ai service', () => {
  it('exports getGeminiModel function', async () => {
    const { getGeminiModel } = await import('../services/vertex-ai');
    expect(typeof getGeminiModel).toBe('function');
  });

  it('returns a model instance', async () => {
    const { getGeminiModel } = await import('../services/vertex-ai');
    const model = getGeminiModel();
    expect(model).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && pnpm test
```

Expected: FAIL — `Cannot find module '../services/vertex-ai'`

- [ ] **Step 3: Create apps/api/src/services/vertex-ai.ts**

```typescript
import { VertexAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import type { ChatMessage, ArtistRole } from '@expressions/shared';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'gen-lang-client-0010416291';
const LOCATION = 'us-central1';
const GEMINI_MODEL = 'gemini-2.0-flash-001';

let vertexAI: VertexAI;
let geminiModel: GenerativeModel;

export function getGeminiModel(): GenerativeModel {
  if (geminiModel) return geminiModel;

  if (!vertexAI) {
    vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  }

  geminiModel = vertexAI.getGenerativeModel({
    model: GEMINI_MODEL,
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  return geminiModel;
}

const ROLE_SYSTEM_PROMPTS: Record<ArtistRole, string> = {
  tutor: 'You are an art tutor for Expressions, an AI-powered creative platform. Guide the artist with patient, educational responses. Explain concepts clearly, offer step-by-step guidance, and celebrate progress. Always encourage artistic growth.',
  guide: 'You are a creative guide for Expressions. Help the artist find their direction without prescribing it. Ask thoughtful questions, offer multiple paths, and help them trust their instincts.',
  critic: 'You are a constructive art critic for Expressions. Offer honest, specific, and actionable feedback. Balance encouragement with candid observations. Focus on craft, intention, and effect — never be dismissive.',
  freestyle: 'You are a creative collaborator for Expressions. Be a brainstorming partner, a sounding board, and an enthusiastic ally. Match the artist\'s energy and help them think freely without constraints.',
};

export function buildSystemPrompt(role: ArtistRole, emotionalIntent?: string): string {
  let prompt = ROLE_SYSTEM_PROMPTS[role];
  if (emotionalIntent) {
    prompt += `\n\nThe artist has set an emotional intent for this session: "${emotionalIntent}". Keep this in mind and gently reference it when relevant.`;
  }
  return prompt;
}

export function mapToVertexHistory(messages: ChatMessage[]) {
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd apps/api && pnpm test
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/services/vertex-ai.ts apps/api/src/__tests__/vertex-ai.test.ts
git commit -m "feat(api): add Vertex AI / Gemini service"
```

---

## Task 8: Auth middleware (backend)

**Files:**
- Create: `apps/api/src/middleware/auth.ts`

- [ ] **Step 1: Write failing test**

Create `apps/api/src/__tests__/auth.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

const mockVerifyIdToken = vi.fn();

vi.mock('../services/firebase-admin', () => ({
  getAuth: () => ({ verifyIdToken: mockVerifyIdToken }),
}));

describe('auth middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('returns 401 when no Authorization header', async () => {
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', async () => {
    req.headers = { authorization: 'Bearer bad-token' };
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.user when token is valid', async () => {
    req.headers = { authorization: 'Bearer valid-token' };
    mockVerifyIdToken.mockResolvedValue({ uid: 'user-123', email: 'test@example.com' });
    const { requireAuth } = await import('../middleware/auth');
    await requireAuth(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual({ uid: 'user-123', email: 'test@example.com' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd apps/api && pnpm test
```

Expected: FAIL — `Cannot find module '../middleware/auth'`

- [ ] **Step 3: Create apps/api/src/middleware/auth.ts**

```typescript
import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../services/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd apps/api && pnpm test
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/middleware/auth.ts apps/api/src/__tests__/auth.test.ts
git commit -m "feat(api): add Firebase Auth middleware"
```

---

## Task 9: API routes (backend)

**Files:**
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/routes/ai.ts`

- [ ] **Step 1: Write failing test for health route**

Create `apps/api/src/__tests__/health.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { healthRouter } from '../routes/health';

// pnpm add -D supertest @types/supertest  (run this before the test)
const app = express();
app.use('/health', healthRouter);

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('number');
  });
});
```

- [ ] **Step 2: Install supertest**

```bash
cd apps/api && pnpm add -D supertest @types/supertest
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd apps/api && pnpm test
```

Expected: FAIL — `Cannot find module '../routes/health'`

- [ ] **Step 4: Create apps/api/src/routes/health.ts**

```typescript
import { Router } from 'express';
import type { HealthResponse } from '@expressions/shared';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: Date.now(),
    version: process.env.npm_package_version || '0.0.1',
  };
  res.json(response);
});
```

- [ ] **Step 5: Create apps/api/src/routes/ai.ts**

```typescript
import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getGeminiModel, buildSystemPrompt, mapToVertexHistory } from '../services/vertex-ai';
import type { ChatRequest } from '@expressions/shared';

export const aiRouter = Router();

aiRouter.post('/chat', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { messages, artistRole, sessionContext } = req.body as ChatRequest;

  if (!messages || !artistRole) {
    res.status(400).json({ error: 'messages and artistRole are required' });
    return;
  }

  try {
    const model = getGeminiModel();
    const systemPrompt = buildSystemPrompt(artistRole, sessionContext);
    const history = mapToVertexHistory(messages.slice(0, -1));
    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
      history,
    });

    // Stream the response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of stream.stream) {
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('AI chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI service error' });
    }
  }
});
```

- [ ] **Step 6: Run all tests**

```bash
cd apps/api && pnpm test
```

Expected: PASS (health route test passes; auth and vertex tests still pass)

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/routes/ apps/api/src/__tests__/health.test.ts
git commit -m "feat(api): add health and AI chat routes"
```

---

## Task 10: Firebase Client SDK + Auth context (frontend)

**Files:**
- Create: `apps/web/lib/firebase.ts`
- Create: `apps/web/lib/auth-context.tsx`
- Create: `apps/web/lib/api-client.ts`

- [ ] **Step 1: Write failing test for API client**

Create `apps/web/__tests__/api-client.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('api-client', () => {
  it('exports a createApiClient function', async () => {
    const mod = await import('../lib/api-client');
    expect(typeof mod.createApiClient).toBe('function');
  });
});
```

- [ ] **Step 2: Create apps/web/lib/firebase.ts**

```typescript
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app: FirebaseApp;
let auth: Auth;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}
```

- [ ] **Step 3: Create apps/web/lib/auth-context.tsx**

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    await signOut(getFirebaseAuth());
  }

  async function getIdToken(): Promise<string | null> {
    if (!user) return null;
    return user.getIdToken();
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 4: Create apps/web/lib/api-client.ts**

```typescript
import type { ChatRequest, ChatResponse, HealthResponse } from '@expressions/shared';

export function createApiClient(getToken: () => Promise<string | null>) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  async function authHeaders(): Promise<HeadersInit> {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return {
    async health(): Promise<HealthResponse> {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return res.json();
    },

    async *chat(req: ChatRequest): AsyncGenerator<string> {
      const headers = await authHeaders();
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data) as { text: string };
              yield parsed.text;
            } catch { /* skip malformed chunks */ }
          }
        }
      }
    },
  };
}
```

- [ ] **Step 5: Wrap root layout with AuthProvider**

Update `apps/web/app/layout.tsx`:

```typescript
export const runtime = 'edge';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expressions',
  description: 'AI-powered creative multi-tool for artists',
  manifest: '/manifest.json',
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Run frontend tests**

```bash
cd apps/web && pnpm test
```

Expected: api-client test PASSES; smoke test still FAILS (env vars not set yet — correct)

- [ ] **Step 7: Commit**

```bash
git add apps/web/lib/ apps/web/app/layout.tsx apps/web/__tests__/api-client.test.ts
git commit -m "feat(web): add Firebase Auth context and API client"
```

---

## Task 11: Environment variables setup

**Files:**
- Create: `apps/web/.env.example`
- Create: `apps/web/.env.local` (not committed)
- Create: `apps/api/.env.example`
- Create: `apps/api/.env.local` (not committed)

- [ ] **Step 1: Get Firebase web app config**

Run Firebase init to link to the GCP project and get the web app config:

```bash
npm install -g firebase-tools
firebase login
firebase use gen-lang-client-0010416291
firebase apps:create WEB Expressions
firebase apps:sdkconfig WEB
```

Copy the output config values — you'll need them for `.env.local`.

- [ ] **Step 2: Create apps/web/.env.example**

Create `apps/web/.env.example`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gen-lang-client-0010416291.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-lang-client-0010416291
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gen-lang-client-0010416291.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:8080
```

- [ ] **Step 3: Create apps/web/.env.local with real values**

Create `apps/web/.env.local` — fill in the real values from Step 1:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=<from firebase apps:sdkconfig output>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gen-lang-client-0010416291.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-lang-client-0010416291
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gen-lang-client-0010416291.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<from firebase apps:sdkconfig output>
NEXT_PUBLIC_FIREBASE_APP_ID=<from firebase apps:sdkconfig output>
NEXT_PUBLIC_API_URL=http://localhost:8080
```

- [ ] **Step 4: Create apps/api/.env.example**

Create `apps/api/.env.example`:

```bash
GCP_PROJECT_ID=gen-lang-client-0010416291
PORT=8080
NODE_ENV=development
```

- [ ] **Step 5: Create apps/api/.env.local**

Create `apps/api/.env.local`:

```bash
GCP_PROJECT_ID=gen-lang-client-0010416291
PORT=8080
NODE_ENV=development
```

- [ ] **Step 6: Update API index.ts to load .env.local**

At the top of `apps/api/src/index.ts`, add before any other imports:

```typescript
import { config } from 'dotenv';
config({ path: '.env.local' });
```

Install dotenv:

```bash
cd apps/api && pnpm add dotenv && pnpm add -D @types/dotenv
```

- [ ] **Step 7: Set up ADC for local Vertex AI access**

```bash
gcloud auth application-default login --project=gen-lang-client-0010416291
```

This allows the local API to call Vertex AI without a service account key file.

- [ ] **Step 8: Re-run frontend smoke test**

```bash
cd apps/web && pnpm test
```

Expected: ALL PASS — env vars are now defined

- [ ] **Step 9: Commit env examples (not .env.local)**

```bash
git add apps/web/.env.example apps/api/.env.example
git commit -m "chore: add .env.example files for web and api"
```

---

## Task 12: Git init + connect to GitHub + create test branch

**Files:** none (git operations)

- [ ] **Step 1: Initialize git repo**

From repo root:

```bash
git init
git add .
git commit -m "feat: initial monorepo scaffold — Next.js, Express, Firebase, Vertex AI"
```

- [ ] **Step 2: Connect to GitHub remote**

```bash
git remote add origin https://github.com/hondapowersr/Expressions.git
git branch -M main
```

- [ ] **Step 3: Pull existing GitHub history (has README)**

```bash
git pull origin main --allow-unrelated-histories --no-rebase
```

Resolve any conflict (the remote only has a README.md — keep both files):

```bash
git add README.md
git commit -m "chore: merge initial GitHub README"
```

- [ ] **Step 4: Push main branch**

```bash
git push -u origin main
```

- [ ] **Step 5: Create and push test branch**

```bash
git checkout -b test
git push -u origin test
```

- [ ] **Step 6: Verify branches on GitHub**

```bash
gh repo view hondapowersr/Expressions --json defaultBranchRef,branches 2>/dev/null || gh api repos/hondapowersr/Expressions/branches --jq '.[].name'
```

Expected: `main` and `test` listed

---

## Task 13: Cloudflare Pages setup

**Files:** none (CLI/dashboard operations)

- [ ] **Step 1: Install Wrangler CLI**

```bash
npm install -g wrangler
wrangler login
```

- [ ] **Step 2: Create Cloudflare Pages project connected to GitHub**

```bash
wrangler pages project create expressions --production-branch main
```

- [ ] **Step 3: Configure build settings in Cloudflare dashboard**

Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) → Pages → `expressions` → Settings → Build:

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Build command | `cd apps/web && pnpm run build:cf` |
| Build output directory | `apps/web/.vercel/output/static` |
| Root directory | `/` |
| Node.js version | `20` |

- [ ] **Step 4: Add environment variables in Cloudflare dashboard**

Go to Pages → `expressions` → Settings → Environment variables.

Add all `NEXT_PUBLIC_*` vars from `apps/web/.env.example` with real values. Set them for both **Production** (main) and **Preview** (test), with `NEXT_PUBLIC_API_URL` pointing to the Cloud Run URL for each.

- [ ] **Step 5: Configure branch alias for test branch**

In Cloudflare Pages dashboard → Custom domains → Add a branch alias:
- Branch: `test`
- Alias: `test.expressions.pages.dev`

---

## Task 14: Cloud Run service account + Dockerfile

**Files:**
- Create: `apps/api/Dockerfile`
- Create: `apps/api/.dockerignore`

- [ ] **Step 1: Create service account for Cloud Run**

```bash
gcloud iam service-accounts create expressions-api \
  --display-name="Expressions API Service Account" \
  --project=gen-lang-client-0010416291

gcloud projects add-iam-policy-binding gen-lang-client-0010416291 \
  --member="serviceAccount:expressions-api@gen-lang-client-0010416291.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding gen-lang-client-0010416291 \
  --member="serviceAccount:expressions-api@gen-lang-client-0010416291.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding gen-lang-client-0010416291 \
  --member="serviceAccount:expressions-api@gen-lang-client-0010416291.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"
```

- [ ] **Step 2: Create apps/api/Dockerfile**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

- [ ] **Step 3: Create apps/api/.dockerignore**

```
node_modules
dist
.env*
*.test.ts
__tests__
coverage
.turbo
```

- [ ] **Step 4: Build Docker image locally to verify**

```bash
cd apps/api && docker build -t expressions-api:local .
```

Expected: Build succeeds with no errors

- [ ] **Step 5: Deploy to Cloud Run (staging)**

```bash
gcloud builds submit apps/api \
  --tag gcr.io/gen-lang-client-0010416291/expressions-api:latest \
  --project=gen-lang-client-0010416291

gcloud run deploy expressions-api-staging \
  --image gcr.io/gen-lang-client-0010416291/expressions-api:latest \
  --platform managed \
  --region us-central1 \
  --service-account expressions-api@gen-lang-client-0010416291.iam.gserviceaccount.com \
  --set-env-vars GCP_PROJECT_ID=gen-lang-client-0010416291 \
  --allow-unauthenticated \
  --project=gen-lang-client-0010416291
```

Copy the Cloud Run URL from output (e.g. `https://expressions-api-staging-xxxx-uc.a.run.app`)

- [ ] **Step 6: Test health endpoint**

```bash
curl https://expressions-api-staging-xxxx-uc.a.run.app/health
```

Expected: `{"status":"ok","timestamp":...}`

- [ ] **Step 7: Commit Dockerfile**

```bash
git add apps/api/Dockerfile apps/api/.dockerignore
git commit -m "feat(api): add Dockerfile for Cloud Run deployment"
```

---

## Task 15: GitHub Actions CI/CD workflows

**Files:**
- Create: `.github/workflows/deploy-test.yml`
- Create: `.github/workflows/deploy-main.yml`

- [ ] **Step 1: Add GitHub repository secrets**

Go to GitHub → `hondapowersr/Expressions` → Settings → Secrets → Actions. Add:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | From Cloudflare dashboard → My Profile → API Tokens → Create Token (use "Edit Cloudflare Workers" template) |
| `CLOUDFLARE_ACCOUNT_ID` | From Cloudflare dashboard → right sidebar |
| `GCP_SA_KEY` | Service account JSON: `gcloud iam service-accounts keys create - --iam-account=expressions-api@gen-lang-client-0010416291.iam.gserviceaccount.com --project=gen-lang-client-0010416291` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_API_URL_STAGING` | Cloud Run staging URL |
| `NEXT_PUBLIC_API_URL_PROD` | Cloud Run prod URL (same as staging until prod deploy) |

- [ ] **Step 2: Create .github/workflows/deploy-test.yml**

Create `.github/workflows/deploy-test.yml`:

```yaml
name: Deploy Test Branch

on:
  push:
    branches: [test]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build shared package
        run: cd packages/shared && pnpm build

      - name: Run all tests
        run: pnpm test

      - name: Build API
        run: cd apps/api && pnpm build

      - name: Deploy API to Cloud Run staging
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: expressions-api-staging
          region: us-central1
          source: apps/api
          env_vars: |
            GCP_PROJECT_ID=gen-lang-client-0010416291
            NODE_ENV=production
        env:
          GOOGLE_CREDENTIALS: ${{ secrets.GCP_SA_KEY }}

      - name: Build Next.js for Cloudflare
        run: cd apps/web && pnpm run build:cf
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: gen-lang-client-0010416291.firebaseapp.com
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: gen-lang-client-0010416291
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: gen-lang-client-0010416291.appspot.com
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL_STAGING }}

      - name: Deploy to Cloudflare Pages (preview)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: expressions
          directory: apps/web/.vercel/output/static
          branch: test
```

- [ ] **Step 3: Create .github/workflows/deploy-main.yml**

Create `.github/workflows/deploy-main.yml`:

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build shared package
        run: cd packages/shared && pnpm build

      - name: Run all tests
        run: pnpm test

      - name: Build API
        run: cd apps/api && pnpm build

      - name: Deploy API to Cloud Run production
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: expressions-api-prod
          region: us-central1
          source: apps/api
          env_vars: |
            GCP_PROJECT_ID=gen-lang-client-0010416291
            NODE_ENV=production
        env:
          GOOGLE_CREDENTIALS: ${{ secrets.GCP_SA_KEY }}

      - name: Build Next.js for Cloudflare
        run: cd apps/web && pnpm run build:cf
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: gen-lang-client-0010416291.firebaseapp.com
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: gen-lang-client-0010416291
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: gen-lang-client-0010416291.appspot.com
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL_PROD }}

      - name: Deploy to Cloudflare Pages (production)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: expressions
          directory: apps/web/.vercel/output/static
          branch: main
```

- [ ] **Step 4: Commit workflows**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflows for test and main deploys"
```

---

## Task 16: End-to-end smoke test

- [ ] **Step 1: Start API locally**

```bash
cd apps/api && pnpm dev
```

Expected: `Expressions API running on port 8080`

- [ ] **Step 2: Test health endpoint locally**

In a new terminal:

```bash
curl http://localhost:8080/health
```

Expected: `{"status":"ok","timestamp":...,"version":"0.0.1"}`

- [ ] **Step 3: Start frontend locally**

```bash
cd apps/web && pnpm dev
```

Expected: Next.js dev server running on `http://localhost:3000`

- [ ] **Step 4: Open browser and verify**

Navigate to `http://localhost:3000`. Expected: Next.js default page loads with no console errors.

- [ ] **Step 5: Run full test suite from root**

```bash
# From repo root
pnpm test
```

Expected: All tests PASS across api and web packages

- [ ] **Step 6: Push test branch and verify CI**

```bash
git checkout test
git merge main
git push origin test
```

Go to GitHub → Actions and watch the `Deploy Test Branch` workflow. Expected: All steps green, deployment to Cloudflare Pages preview succeeds.

- [ ] **Step 7: Verify live test deployment**

Navigate to `https://test.expressions.pages.dev`. Expected: Page loads, no 404, no console errors.

- [ ] **Step 8: Verify Cloud Run health from Cloudflare**

```bash
curl https://expressions-api-staging-xxxx-uc.a.run.app/health
```

Expected: `{"status":"ok",...}`

- [ ] **Step 9: Final commit + push to main**

After test branch CI is green and all checks pass:

```bash
git checkout main
git merge test
git push origin main
```

Expected: Production deploy workflow runs and succeeds.

---

## Self-Review

**Spec coverage:**
- ✅ pnpm monorepo + Turborepo
- ✅ Next.js 14 App Router frontend
- ✅ Express backend on Cloud Run
- ✅ Firebase Auth (client + admin)
- ✅ Vertex AI / Gemini service
- ✅ Shared types package
- ✅ Environment variable setup
- ✅ Git init + GitHub connection
- ✅ test + main branch strategy
- ✅ Cloudflare Pages configuration
- ✅ GitHub Actions CI/CD for both branches
- ✅ Service account with correct IAM roles
- ✅ Dockerfile + Cloud Run deployment
- ✅ End-to-end smoke test

**Not in this plan (in Phase 1 Features plan):**
- Role selector UI
- Idea Factory (multi-turn chat)
- Color Tools
- Emotional intent entry flow
- shadcn/ui component library population
- Firestore data models
- Firebase Storage for gallery

**Placeholder scan:** No TBD, TODO, or "similar to Task N" references. All commands and code are complete.

**Type consistency:** `ArtistRole`, `ChatMessage`, `ChatRequest`, `HealthResponse` defined in `packages/shared/src/types.ts` and used consistently across `vertex-ai.ts`, `ai.ts` route, and `api-client.ts`.
