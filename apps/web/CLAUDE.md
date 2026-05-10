@AGENTS.md

## Knowledge Base
Local expertise store at `/home/droid/repos/knowledge-base/` — check before web-fetching.
- `projects/expressions.md` — this project's full summary, env vars, stack details
- `apis/cloudflare-pages-functions.md` — CF Workers deployment via opennextjs

## Stack Notes
- Next.js 16 + React 19 + TypeScript — see AGENTS.md for breaking changes
- Deployed to Cloudflare Workers via opennextjs-cloudflare (not standard CF Pages)
- Backend API is separate Express.js app in `apps/api/`
- AI via Google Vertex AI (not Gemini direct) — see `apps/api/src/services/vertex-ai.ts`
- Auth via Firebase Admin SDK — see `apps/api/src/middleware/auth.ts`
- GCP project: `gen-lang-client-0010416291`

## Branch Policy
- `main` — live, always working. CI/CD auto-deploys on push.
- `test` — all development.
