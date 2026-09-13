# AvSafety Cloudflare Deployment

## 1. Prerequisites
- GitHub access to `amaechiu-del/AvSafety`
- Cloudflare account with access to `domislink.com`
- Node.js 22+ (matches the checked-in Wrangler toolchain)
- `npm` and Wrangler CLI access (`npm install` already provides `npx wrangler`)

## 2. Target architecture
- **Cloudflare Pages** serves the Vite frontend build from `dist/`
- **Cloudflare Worker** serves `/api/*` routes from `worker.ts`
- **Cloudflare KV** stores the summit JSON state under a single `AVSAFETY_KV` binding
- **GitHub Actions** runs lint/build checks and deploys preview or production automatically

## 3. Initial Cloudflare setup
1. Create or confirm the Cloudflare Pages project:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
2. Create two KV namespaces:
   - Production: `avsafety-kv-production`
   - Preview: `avsafety-kv-preview`
3. Add or confirm the Worker route:
   - Production: `summit.domislink.com/api/*`
   - Preview: adjust `preview.summit.domislink.com` in `wrangler.toml` if you use a different preview hostname
4. Ensure the Pages custom domain remains `summit.domislink.com`

### KV creation commands
```bash
npx wrangler kv namespace create avsafety-kv-production
npx wrangler kv namespace create avsafety-kv-preview --preview
```
Copy the returned namespace IDs into the GitHub repository variables described below.

## 4. GitHub secrets and variables
Configure these in **Settings → Secrets and variables → Actions**.

### Secrets
- `CLOUDFLARE_API_TOKEN`
- `ADMIN_API_TOKEN`
- `GEMINI_API_KEY`
- `PAYSTACK_SECRET_KEY`

### Variables
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `CLOUDFLARE_WORKER_NAME`
- `CLOUDFLARE_KV_NAMESPACE_ID`
- `CLOUDFLARE_KV_PREVIEW_NAMESPACE_ID`
- `PAYSTACK_PUBLIC_KEY`

> `PAYSTACK_PUBLIC_KEY` is safe as a repository variable, while the secret key must stay in GitHub Secrets.

## 5. Repository files added for Cloudflare
- `.github/workflows/deploy-cloudflare.yml` — CI/CD workflow for preview and production
- `wrangler.toml` — Worker, route, KV, and observability configuration
- `worker.ts` — Cloudflare Worker API adapter with KV-backed persistence, CORS, and asset fallback
- `.env.example` — local and CI variable template

## 6. Local development workflow
1. Install dependencies:
   ```bash
   npm ci
   ```
2. Create a local `.env` from `.env.example` and supply your keys.
3. Build the SPA once so Worker asset serving has a fresh `dist/` directory:
   ```bash
   npm run build
   ```
4. Start the Worker locally:
   ```bash
   npm run worker:dev
   ```

### Important note about `worker:build`
Wrangler v4 no longer exposes a standalone `wrangler build` command. In this repository, `npm run worker:build` uses `wrangler deploy --dry-run --outdir .wrangler/build` to compile and validate the Worker bundle without uploading it.

## 7. CI/CD behavior
### Pull requests to `main`
- `npm ci`
- `npm run lint`
- `npm run build`
- `npm run worker:build`
- Deploys a **Pages preview** and **Worker preview** when the PR is not from a fork and Cloudflare credentials are present
- Posts a workflow summary and a PR comment with preview guidance

### Pushes to `main`
- Runs the same validation steps
- Deploys the latest frontend to Cloudflare Pages production
- Deploys the latest backend Worker to production
- Publishes a deployment summary in the workflow run

## 8. Manual deployment commands
### Production Worker
```bash
npm run deploy
```

### Preview Worker
```bash
npm run deploy:preview
```

### Manual Pages deploy
```bash
npx wrangler pages deploy dist --project-name "$CLOUDFLARE_PAGES_PROJECT_NAME" --branch main
```

## 9. Environment management
### Worker runtime variables
Set these in Cloudflare or sync them from GitHub Actions:
- `ADMIN_API_TOKEN`
- `APP_URL`
- `CORS_ORIGIN`
- `API_ORIGIN` (optional hybrid fallback if you want the Worker to proxy unported routes)
- `NODE_ENV`
- `GEMINI_API_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_PUBLIC_KEY`

`ADMIN_API_TOKEN` protects Worker admin-only routes such as full registration export and destructive database reset/update operations. Send it either as a bearer token in the `Authorization` header or in the `x-admin-token` header.

### Pages variables
The frontend currently reads relative `/api/*` URLs, so no separate frontend API base URL is required for Cloudflare Pages.

## 10. Monitoring and logs
- **Pages deployments:** Cloudflare dashboard → Pages → Deployments
- **Worker logs:**
  ```bash
  npx wrangler tail
  ```
- **Worker analytics and observability:** enabled in `wrangler.toml`
- **GitHub Actions logs:** repository → Actions → `Deploy to Cloudflare`

## 11. Troubleshooting
### Build fails in GitHub Actions
- Confirm `npm ci`, `npm run lint`, and `npm run build` pass locally
- Confirm all repository variables are set, especially both KV namespace IDs

### Worker deploy fails with KV binding errors
- Recreate the namespaces and update `CLOUDFLARE_KV_NAMESPACE_ID` / `CLOUDFLARE_KV_PREVIEW_NAMESPACE_ID`
- Confirm `wrangler.toml` route and zone name match the Cloudflare zone

### Pages deploy succeeds but API returns 404
- Confirm the Worker deployed successfully
- Confirm the route `summit.domislink.com/api/*` is attached to the Worker
- Check `https://summit.domislink.com/api/health`

### Gemini or Paystack endpoints fail
- Recheck `GEMINI_API_KEY` and `PAYSTACK_SECRET_KEY`
- Use `npx wrangler tail` to inspect upstream API errors returned by the Worker

### Preview deploys do not run on PRs
- GitHub does not expose repository secrets to forked pull requests
- Re-run from a branch in the main repository or use `workflow_dispatch`

## 12. Rollback and recovery
### Worker rollback
```bash
npx wrangler rollback
```
You can also select a prior Worker deployment from the Cloudflare dashboard.

### Pages rollback
Use the Cloudflare Pages dashboard to promote a previous successful deployment.

### KV recovery
- Export the current KV-backed JSON record before destructive changes
- Keep a copy of `data/db.json` as the known-good seed used by the Worker when KV is empty

## 13. Post-deploy validation checklist
- Frontend loads at `https://summit.domislink.com`
- `https://summit.domislink.com/api/health` returns `ok: true`
- Registration, memo, stakeholder, and marketplace CRUD flows persist in KV
- Gemini-backed features respond when `GEMINI_API_KEY` is set
- Paystack initialize/verify succeeds with live credentials
- PWA assets still build from Vite and load from the deployed frontend
