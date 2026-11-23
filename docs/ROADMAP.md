# Roadmap — MacroDetails

> Executable backlog for the portfolio demo and the first commercial MVP.
> The product vision, business model and long-term phases live in [PRODUCT-PLAN.md](PRODUCT-PLAN.md).
>
> **Goal:** a **public, working demo** of an AI gift concierge on top of a curated marketplace of
> local artisans in Campeche: browse, get recommendations, schedule a delivery and pay (Stripe test
> mode), with automated tests, CI and documented architecture.
>
> **Conventions**
>
> - Every item becomes a GitHub issue and a small PR: `type(scope): description` (Conventional Commits). See [CONTRIBUTING.md](../CONTRIBUTING.md).
> - Area tags: `[API]` `apps/api` · `[WEB]` `apps/web` · `[CONTRACTS]` `packages/contracts` · `[INFRA]` `infra/` + AWS · `[DOCS]` · `[ALL]` cross-cutting.
> - Priority: **P0** blocks the demo · **P1** required to look professional · **P2** differentiator.
> - A milestone is closed only when it meets its **Definition of Done (DoD)**.
> - Status: `[x]` done · `[ ]` pending · ⏳ in progress · ⛔ blocked.

---

## Scope decisions

| Keep                                                   | Frozen (out of the demo)               | Remove                                                                |
| ------------------------------------------------------ | -------------------------------------- | --------------------------------------------------------------------- |
| Catalog, vendors, delivery slots, orders               | WhatsApp channel and reminders         | Legacy repos `macrodetails-modules-back` and `portal-macro` (archive) |
| Stripe Checkout in test mode                           | Real payments, refunds, CFDI invoicing | DigitalOcean Spaces                                                   |
| AI concierge, hybrid search, vision for vendor uploads | Google OAuth                           | Code comments (replaced by OpenAPI docs and JSDoc)                    |
| Demo accounts (customer, vendor)                       | Microservices extraction               |                                                                       |
| `es-MX` UI copy in JSON dictionaries                   | `en-US` locale, multi-city             |                                                                       |
| Monolith with hexagonal modules                        | Multiple vendors in one order          |                                                                       |

---

## Proposed timeline

| Milestone                      | Target                    |
| ------------------------------ | ------------------------- |
| M0 Foundations                 | ✅ Nov 18                 |
| M1 Catalog & storefront        | Nov 27                    |
| M2 Accounts, checkout & orders | Dec 4                     |
| M3 AI concierge                | Dec 9                     |
| M4 Quality & documentation     | continuous, closed Dec 10 |
| M5 Deploy & public demo        | Dec 12                    |

The original target (Dec 1) assumed the full vertical slice in two weeks; M2 and M3 are larger than
planned, so the public demo moves to mid-December. Cut order if late: AI-05 → AI-04 → WEB-11 → AI-06 reduced to 10 scenarios.

---

## M0 — Foundations

**DoD:** a fresh clone runs web + API + MongoDB locally by following the README; CI runs format, lint, types, unit, e2e and build on every PR.

**Status:** DoD met (PR #1, PR #2).

- [x] **BASE-01** `[ALL]` pnpm + Turborepo monorepo: `apps/web`, `apps/api`, `packages/contracts`, `packages/config`.
- [x] **BASE-02** `[API]` NestJS 12 (ESM) with env validation (Zod), helmet, CORS, `/api/v1` versioning and `GET /health`.
- [x] **BASE-03** `[WEB]` Next.js 16 with Cache Components and `es-MX` dictionaries.
- [x] **BASE-04** `[CONTRACTS]` Shared Zod contracts consumed by web and API.
- [x] **BASE-05** `[ALL]` Docker Compose: `mongodb-atlas-local` with authentication + Redis.
- [x] **BASE-06** `[ALL]` GitHub Actions: format, lint, typecheck, unit tests, build, API e2e with MongoDB service.
- [x] **BASE-07** `[INFRA]` AWS Organization, IAM Identity Center (SSO profile, no static keys), budgets, workload region `us-east-2` (ADR 0004).
- [x] **BASE-08** `[DOCS]` ADRs 0001–0004 and README.

---

## M1 — Catalog & storefront

**DoD:** locally, a visitor goes home → catalog with filters and search → product detail, and the price updates with the chosen options; the same pricing function is unit-tested in `contracts`; CI green and a Vercel preview builds.

**Status:** API and media infrastructure done; web foundation ready for review (`feat/m1-web-01-storefront-foundation`); pages in progress.

### Catalog API

- [x] **CAT-01** `[API]` `vendors` and `catalog` modules (ports and adapters): list with filters, Spanish text search, sorting, pagination; product and vendor detail.
- [x] **CAT-02** `[API]` Idempotent seed: 6 demo vendors and 42 products validated against the contracts.
- [x] **CAT-03** `[API]` `storage` port + S3 adapter with pre-signed uploads (no public endpoint until auth exists).
- [x] **CAT-04** `[INFRA]` Deploy the media stack (private S3 + CloudFront with OAC) in `us-east-2`. _(Smoke-tested: pre-signed upload, CDN read with immutable caching, direct S3 access denied, HTTP→HTTPS redirect, CORS limited to the allowed origins.)_
- [ ] **CAT-05** `[API]` Real product photos in `seed-assets/` uploaded by the seed. _(Infrastructure ready; waiting for the vendor's photos.)_
- [ ] **CAT-06** `[CONTRACTS]` **P0** `calculateUnitPrice` and `validateSelections`, shared by web and API, with unit tests.

### Storefront

- [x] **WEB-01** `[WEB]` UI foundation: shadcn/ui (Radix), brand theme, header with search, mobile menu, footer.
- [x] **WEB-02** `[WEB]` Typed and cached API client (`'use cache'`), `formatPrice`, product card, grid and image placeholder.
- [x] **WEB-03** `[WEB]` Global error boundary with retry; dev script waits for the API before starting Next.
- [ ] **WEB-04** `[WEB]` **P0** Catalog page: filters (category, occasion, price), sort, pagination and search in the URL; filters in a sheet on mobile; empty state.
- [ ] **WEB-05** `[WEB]` **P0** Product detail page `/products/[slug]` with metadata for link previews.
- [ ] **WEB-06** `[WEB]` **P0** Product options form with live price (uses CAT-06).
- [ ] **WEB-07** `[WEB]` **P0** Home: hero, occasions grid, featured products.

### Conventions

- [ ] ⏳ **CHORE-01** `[ALL]` PR template and `CONTRIBUTING.md` (branches, commits, docs policy).
- [ ] **CHORE-02** `[ALL]` **P1** Remove inline comments; keep JSDoc only where a decorator cannot document the contract.
- [ ] **DOC-01** `[API]` **P1** OpenAPI with `@nestjs/swagger`: schemas generated from the Zod contracts (`z.toJSONSchema`), Swagger UI at `/api/docs`.

---

## M2 — Accounts, checkout & orders

**DoD:** locally, a demo customer adds products from one vendor, picks zone, date and slot, pays in Stripe test mode and follows the order; the demo vendor moves it to "delivered". An e2e test covers the full flow, and another proves a user cannot read or change someone else's orders.

- [ ] **AUTH-01** `[API]` **P0** `users` module: registration, password hashing (`scrypt`), unique email.
- [ ] **AUTH-02** `[API]` **P0** Short-lived access token + rotating refresh token with reuse detection; logout revokes.
- [ ] **AUTH-03** `[API]` **P0** Global auth guard with public allowlist, roles (`customer`, `vendor`, `admin`), `@CurrentUser`.
- [ ] **AUTH-04** `[API]` **P0** Demo accounts (customer, vendor) and one-click demo login.
- [ ] **AUTH-05** `[API]` **P1** Rate limiting on `/auth/*`.
- [ ] **DLV-01** `[API]` **P0** Delivery zones with fees.
- [ ] **DLV-02** `[API]` **P0** Slot availability: business time zone (`America/Merida`), lead time and daily vendor capacity.
- [ ] **DLV-03** `[API]` **P0** Idempotent capacity reservations owned by `delivery` (no dependency on `orders`).
- [ ] **ORD-01** `[API]` **P0** `Order` aggregate with an explicit state machine and domain events (pure TypeScript, TDD).
- [ ] **ORD-02** `[API]` **P0** Checkout quote: server-side pricing, issues instead of exceptions, one vendor per order.
- [ ] **ORD-03** `[API]` **P0** Place order: reservation + payment session with compensation on failure; optimistic concurrency.
- [ ] **ORD-04** `[API]` **P0** Customer endpoints (`/me/orders`) and vendor endpoints (`/vendor/orders`, status transitions); 404 for foreign orders.
- [ ] **PAY-01** `[API]` **P0** `PaymentGateway` port + fake adapter for tests and local dev.
- [ ] **PAY-02** `[API]` **P0** Stripe Checkout adapter (MXN, test mode).
- [ ] **PAY-03** `[API]` **P0** Stripe webhook: signature verification, raw body, idempotency by event id.
- [ ] **PAY-04** `[API]` **P1** Local payment simulator when Stripe is not configured.
- [ ] **CON-01** `[CONTRACTS]` **P0** Contracts for auth, delivery, checkout and orders. _(Draft exists in `git stash`.)_
- [ ] **WEB-08** `[WEB]` **P0** Session with the BFF pattern: tokens only in `httpOnly` cookies on the web domain; login page with demo buttons.
- [ ] **WEB-09** `[WEB]` **P0** Cart persisted in the browser, one vendor per cart, server quote.
- [ ] **WEB-10** `[WEB]` **P0** Checkout form with zones and available slots; redirect to Stripe.
- [ ] **WEB-11** `[WEB]` **P1** Order tracking with status timeline; vendor panel to advance orders.
- [ ] **DOC-02** `[DOCS]` ADRs: authentication via BFF, payments and order state machine.

---

## M3 — AI concierge

**DoD:** the concierge recommends only products that exist, respect the budget and can be delivered on the requested date, proven by an eval suite that runs in CI; every conversation is traced with cost and latency; public usage is rate-limited with a daily spend cap.

- [ ] **AI-01** `[API]` **P0** Product embeddings pipeline (re-embed on product change).
- [ ] **AI-02** `[API]` **P0** Hybrid search: Atlas Vector Search + text search with rank fusion.
- [ ] **AI-03** `[API]` **P0** Concierge agent with tools (`search_catalog`, `check_availability`, `add_to_cart` draft) and structured outputs; it never charges.
- [ ] **AI-04** `[API]` **P1** Vendor photo → title, description, tags and allergens (vision), reviewed by the vendor before saving.
- [ ] **AI-05** `[API]` **P2** Gift card message helper.
- [ ] **AI-06** `[API]` **P0** Evals in CI (25–30 scenarios): catalog grounding, budget, deliverability, relevance.
- [ ] **AI-07** `[API]` **P1** LLM observability (Langfuse): traces, tokens, cost per conversation.
- [ ] **AI-08** `[API]` **P0** Guardrails: per-IP rate limit, daily budget cap, prompt-injection test cases.
- [ ] **WEB-12** `[WEB]` **P0** Streaming concierge chat with product cards and "why this gift".

---

## M4 — Quality & documentation

**DoD:** CI green on every PR with coverage ≥ 80 % in `domain/` and `application/`; Playwright covers the happy path; the API is fully documented in Swagger.

- [ ] **QA-01** `[WEB]` **P1** Playwright e2e: browse → detail → cart → checkout (fake payment).
- [ ] **QA-02** `[API]` **P1** Coverage thresholds for `domain/` and `application/`.
- [ ] **QA-03** `[ALL]` **P1** commitlint + Husky + lint-staged.
- [ ] **QA-04** `[ALL]` **P2** Renovate/Dependabot and CodeQL.
- [ ] **QA-05** `[API]` **P1** Multi-stage Dockerfile for the API.

---

## M5 — Deploy & public demo

**DoD:** a recruiter opens a public URL, enters with a demo account, completes a test purchase and understands the project from the README alone.

- [ ] **OPS-01** `[INFRA]` **P0** MongoDB Atlas M0 on AWS `us-east-2`, network access and Vector Search index.
- [ ] **OPS-02** `[INFRA]` **P0** API on AWS with CDK (ECS Fargate behind a load balancer, or Lambda after a cost comparison); secrets in Secrets Manager.
- [ ] **OPS-03** `[INFRA]` **P0** Vercel production and preview environments with `API_URL`.
- [ ] **OPS-04** `[INFRA]` **P0** Stripe test webhook pointing to the deployed API.
- [ ] **DEMO-01** `[API]` **P1** Demo data reset on a schedule.
- [ ] **DEMO-02** `[DOCS]` **P0** Final README: architecture diagram, badges, GIF, decisions, lessons learned.
- [ ] **DEMO-03** `[DOCS]` **P1** 2–3 minute video walkthrough.
- [ ] **DEMO-04** `[ALL]` **P1** `v0.1.0` release and `CHANGELOG.md`.

---

## After the demo (P2, see PRODUCT-PLAN)

WhatsApp channel and reminders · recipient profiles and occasion calendar · B2B with CFDI invoicing ·
subscriptions · group gifts · gifts from abroad · extraction of notifications and AI into services ·
MCP server and agentic commerce · demand forecasting for vendors · Ciudad del Carmen and Mérida.
