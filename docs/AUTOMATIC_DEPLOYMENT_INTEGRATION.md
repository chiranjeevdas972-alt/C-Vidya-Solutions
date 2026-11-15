# Automatic Software & AI Agent Deployment Integration

This system keeps every **Software Solution card**, **AI Agent card**, **product landing page**, **carousel**, **Try Now / Launch link**, and **Live Embedded Viewer** on `https://www.cvidyasolutions.com` automatically synchronized whenever a product is updated in Google AI Studio, pushed to GitHub (`main`), and deployed to Cloudflare Workers or Cloudflare Pages.

---

## 1. End-to-End Architecture

```
Google AI Studio (App Updated)
        │
        ▼
GitHub Repo (Push to `main`)
        │
        ▼
GitHub Actions (`cvidya-cloudflare-deploy-sync.yml`)
   ├── Deploy to Cloudflare Workers (`wrangler deploy`) OR Cloudflare Pages (`pages-action`)
   └── POST https://www.cvidyasolutions.com/api/deployments/register
         ├── Header: Authorization: Bearer <SECRET>
         └── Header: X-CVidya-Signature-256: sha256=<HMAC-SHA256>
        │
        ▼
Main Website Registry API (`server.ts` / `src/worker.js` + `src/shared/deploymentRegistry.ts`)
   ├── Timing-safe Bearer + HMAC-SHA256 signature verification
   ├── Production-only guard (branch === main, environment === production)
   ├── Repo allowlist & bound-repo ownership verification
   ├── Rejects HTTP, localhost, private IPs, credentials, preview `.pages.dev` hashes & staging domains
   ├── Idempotent `buildId` replay guard
   └── Stores updated entry + history + security audit log
         (Express runtime + Cloudflare Workers KV + Cloud Firestore sync)
        │
        ▼
Dynamic Public Registry Feed (`GET /api/deployments/registry` + Firestore `cvidya_deployment_registry`)
        │
        ▼
Website UI (`useDeploymentRegistry()` in `src/services/deploymentRegistrySync.ts`)
   ├── App.tsx & ProductLandingPage (`/software/*`, `/ai-agents/*`)
   ├── HomePage & ServicesPage ("Try Now" & Launch Arrows)
   ├── SoftwareDirectoryPage & AiAgentsDirectoryPage
   ├── ServicesSection & SoftwareCarousel
   └── LiveSoftwareApp (Automatically activates new URLs, preserves Coming Soon when unconnected)
```

---

## 2. Canonical Product ID Mapping (All 14 Products)

Use the exact `productId` below for `CVIDYA_PRODUCT_ID` in each software repository's GitHub workflow:

### Software Solutions (10)
| # | Canonical `productId` | Legacy ID | Default Production URL | Initial Status |
|---|---|---|---|---|
| 1 | `cvidya-library-management` | `library` | `https://v.cvidyasolutions.workers.dev/` | Active |
| 2 | `cvidya-fitness-zone` | `fitness` | `https://fitzone.cvidyasolutions.workers.dev/` | Active |
| 3 | `cvidya-institutes-management` | `institutes` | *(Unconnected — Coming Soon)* | Coming Soon |
| 4 | `cvidya-coaching-management` | `coaching` | `https://coaching.cvidyasolutions.workers.dev/` | Active |
| 5 | `cvidya-enterprise-crm` | `crm` | `https://crm.cvidyasolutions.workers.dev/` | Active |
| 6 | `cvidya-petrol-pump` | `petrol-pump` | `https://c-vidya-cloud-petrol-pump.cvidyasolutions.workers.dev/` | Active |
| 7 | `cvidya-agrifusion` | `farming` | `https://fresh.cvidyasolutions.workers.dev/` | Active |
| 8 | `cvidya-jewellers-management` | `members` | `https://jewelry.cvidyasolutions.workers.dev/` | Active |
| 9 | `cvidya-care-plus` | `care-plus` | `https://care-plus.cvidyasolutions.workers.dev/` | Active |
| 10 | `cvidya-pdf-media-tools` | `pdf-media-tools` | `https://c-vidya-pdf-saas-tools.cvidyasolutions.workers.dev/` | Active |

### Autonomous AI Agents (4)
| # | Canonical `productId` | Legacy ID | Default Production URL | Initial Status |
|---|---|---|---|---|
| 11 | `cvidya-ai-social-media-agent` | `ai-social` | `https://c-vidya-ai-social-media-agent.cvidyasolutions.workers.dev/` | Active |
| 12 | `cvidya-ai-customer-support-agent` | `ai-support` | `https://c-vidya-ai-customer-support-saas.cvidyasolutions.workers.dev/` | Active |
| 13 | `cvidya-salesflow-ai-agent` | `ai-salesflow` | `https://c-vidya-solutions-salesflow-ai-agent.cvidyasolutions.workers.dev/` | Active |
| 14 | `cvidya-b2b-saas-growth-agent` | `ai-marketing` | `https://c-vidya-ai-marketing-b2b-saas-companies.cvidyasolutions.workers.dev/` | Active |

---

## 3. Required Secrets & Environment Variables

**Never commit secrets or tokens to source control.**

### Main Website Runtime (`server.ts` / Cloudflare Worker Secrets)
- `DEPLOYMENT_WEBHOOK_SECRET` — Strong random 32+ byte secret used to authenticate webhook calls (`Bearer` + HMAC-SHA256).
  - Set on Cloudflare Worker: `npx wrangler secret put DEPLOYMENT_WEBHOOK_SECRET`
- `DEPLOYMENT_ALLOWED_REPOS` *(Optional comma-separated allowlist)* — e.g. `cvidyasolutions/*,chiranjeev972/*`.
- **Cloudflare Workers KV Binding** *(Recommended for Edge persistence across worker restarts)*:
  - Create a KV namespace (`npx wrangler kv namespace create DEPLOYMENT_REGISTRY_KV`) and bind it in `wrangler.jsonc` / `wrangler.toml` as binding name `DEPLOYMENT_REGISTRY_KV`. Both `src/worker.js` and `cloudflare-worker.js` automatically persist registry entries, history, and audit logs to `env.DEPLOYMENT_REGISTRY_KV` whenever bound.

### Each Product GitHub Repository
Add these GitHub Repository Secrets (`Settings → Secrets and variables → Actions`):
- `CLOUDFLARE_API_TOKEN` — Scoped Cloudflare Workers/Pages deploy token.
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account identifier.
- `CVIDYA_DEPLOY_WEBHOOK_SECRET` — Must match `DEPLOYMENT_WEBHOOK_SECRET` on the main website server/worker.

And add Repository Variables:
- `CVIDYA_PRODUCT_ID` — Exact canonical `productId` from Section 2.
- `CVIDYA_HOSTING_PLATFORM` — `cloudflare-workers` or `cloudflare-pages`.
- `CVIDYA_PRODUCTION_URL` — Final HTTPS production URL (`https://...`).

---

## 4. API Endpoints & Contracts

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/deployments/registry` | Public | Returns sanitized active deployment registry (`items`, `etag`, `registryVersion`). Secrets and admin notes are stripped. |
| `POST /api/deployments/register` | Webhook Secret + HMAC | Receives production deploy events from GitHub Actions (`success` updates live URL/version; `failed` logs alert without overwriting active URL). |
| `GET /api/admin/deployments` | Admin Google/Vault Bearer Token | Full snapshot of all 14 entries, deployment history, audit logs, and failure alert counts. |
| `PATCH /api/admin/deployments/:productId` | Admin Google/Vault Bearer Token | Enable/disable product, override production URL, bind GitHub repo, update hosting/version, or clear failure alerts. |

---

## 5. Firestore Collections & Security Rules (`firestore.rules`)

1. `cvidya_deployment_registry/{productId}` — Public read (`get`, `list`), Admin-only create/update, delete forbidden.
2. `cvidya_deployment_history/{entryId}` — Admin-only read/create/update, delete forbidden.
3. `cvidya_deployment_audit_logs/{logId}` — Admin-only read/create, update/delete forbidden.

---

## 6. Verification Checklist (Manual `curl` Test)

Replace `<WEBHOOK_SECRET>` with your configured server secret and run against a local or staging webhook test before pushing:

```bash
PAYLOAD='{"productId":"cvidya-enterprise-crm","hostingPlatform":"cloudflare-workers","githubRepository":"cvidyasolutions/crm","branch":"main","environment":"production","deploymentUrl":"https://crm.cvidyasolutions.workers.dev/","version":"2.1.0","commitSha":"abcdef123456","buildId":"manual-test-001","status":"success","deployedBy":"cli-test"}'
SIG=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "<WEBHOOK_SECRET>" | awk '{print $2}')

curl -i -X POST https://www.cvidyasolutions.com/api/deployments/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <WEBHOOK_SECRET>" \
  -H "X-CVidya-Signature-256: sha256=$SIG" \
  -d "$PAYLOAD"
```
