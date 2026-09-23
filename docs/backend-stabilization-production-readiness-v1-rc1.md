# ÖzÜ Running Club — Backend Stabilization & Production Readiness v1.0-RC1

**Document Role:** Authoritative Technical Plan & Architecture Blueprint  
**Status:** Ready for Execution (Pending User Approval)  
**Target Branch:** `main` (feature branches per phase)  
**Historical Basis:** [OZU_Backend_Implementation_Plan_v1.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/OZU_Backend_Implementation_Plan_v1.md)  
**Current Baseline State:** [PROJECT_STATUS.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/PROJECT_STATUS.md)

---

## Executive Summary

The initial backend implementation (Phases 1–6) successfully introduced Payload CMS 3 and PostgreSQL 16 into the Next.js App Router, established core collections, populated seed data, wired server-side Data Access Layer reads, and established baseline mutation endpoints for Join and RSVP.

However, an empirical audit reveals critical production gaps:
1. **P0 Functional Disconnect**: The RSVP modal on Event Cards (`src/components/events/RSVPModal.tsx`) still runs a prototype `setTimeout` simulation rather than calling the real backend.
2. **P0 Concurrency Flaw**: The RSVP capacity check and insertion (`src/app/(app)/api/events/[slug]/rsvp/route.ts`) are non-atomic, allowing concurrent requests to exceed `maxParticipants`.
3. **P1 Security & Persistence Gaps**: Overly permissive Editor role permissions on member PII, ephemeral local disk media storage (`public/media`), hardcoded fallback secrets in configuration, and the complete absence of automated tests, CI, and database backup routines.

This Release Candidate 1 (RC1) plan defines the exact engineering work required to stabilize, harden, and transition the existing backend into a production-ready system.

---

## Priority Classification

| Priority | Focus Area | Phases |
| :--- | :--- | :--- |
| **P0 (Critical)** | Core Data Invariants & Functional Integrity | Phase 0 (Baseline), Phase 1 (RSVP Unification), Phase 2 (Transaction-Safe Capacity) |
| **P1 (High)** | Security, Data Privacy, Cloud Persistence & Release Gates | Phase 3 (RBAC), Phase 4 (API Hardening), Phase 5 (Persistent Media), Phase 6 (Secrets), Phase 7 (Automated Tests), Phase 9 (Backups) |
| **P2 (Medium)** | Operational Resilience, Automation & Deployment | Phase 8 (CI), Phase 10 (Deployment), Phase 11 (Smoke Test), Phase 12 (Definition of Done) |

### Explicitly Deferred (Out of Scope for RC1)
To maintain focus on stabilization and release integrity, the following product expansions remain deferred:
- Member self-service accounts / login portals
- Member profile dashboards
- QR-code automated check-in systems
- Strava API synchronization
- Running leaderboards, point systems, and digital badges
- Club merchandise store / payment gateway
- Advanced cohort analytics
- Automated email newsletters and push notifications
- Native mobile applications

---

## Phase Breakdown

### PHASE 0 — Baseline & Gap Verification

#### Objective
Establish an empirical, reproducible baseline of the existing codebase, schema, and API contracts before executing any modifications.

#### Why It Matters
Eliminates unverified assumptions. Ensures subsequent changes are benchmarked against tested system behavior rather than documentation memory.

#### Current Problem
The repository has progressed through 6 initial phases, but discrepancies exist between the original specification and reality (e.g. `RSVPModal.tsx` being disconnected).

#### Target State
A verified inventory of all endpoints, database tables, collections, and component bindings documented with zero ambiguity.

#### Scope
- Audit database schema tables, columns, indexes, and constraints in PostgreSQL.
- Verify migration replayability from a clean state.
- Validate local environment reproducibility across dev ports (3000/3001) and Docker host port (5433).
- Inventory all public and private network endpoints.

#### Out of Scope
- Code changes, refactoring, or new dependencies.

#### Dependencies
- Running PostgreSQL container (`ozu_running_club_db`).

#### Risks
- Hidden uncommitted schema changes in local PostgreSQL not captured in existing migrations.

#### Verification Strategy
- Inspect `pg_tables`, execute `payload.find()` across all collections, and run `npm run type-check`.

#### Acceptance Criteria
- Complete baseline audit recorded with zero untested assumptions.

---

### PHASE 1 — RSVP Flow Unification — ✅ COMPLETED (2026-09-23)

> **Implementation Artifacts**:
> - `src/lib/useRSVP.ts` (shared RSVP mutation hook)
> - `src/components/events/RSVPModal.tsx` (real backend wiring, error banner, waitlist UI)
> - `src/app/(app)/events/[slug]/EventDetailsRSVP.tsx` (parity hook consumer)
> - `src/lib/data.ts` (`CLUB_LINKS` centralized configuration)
> - Commits: `9dd1345` (core refactor), `f15dfe6` (verified social and chat links)
>
> **Verification Summary**:
> - Modal RSVP submission created real record in `event_registrations` (Murat Demir).
> - Duplicate registration properly rejected with HTTP 409 and user-friendly inline notification.
> - Verified in Payload Admin roster view (`/admin/collections/event-registrations`).
> - `npm run type-check`: 0 errors.

#### Objective
Ensure every visible user-facing RSVP interface routes through the authoritative backend endpoint (`POST /api/events/[slug]/rsvp`).

#### Why It Matters
Currently, users clicking "RSVP for Run" on event cards (on the homepage or `/events` catalog) receive a false confirmation dialog generated by `setTimeout()`. No database registration is created, misleading participants and corrupting attendance planning.

#### Current Problem
`src/components/events/RSVPModal.tsx` contains simulated latency (`setTimeout(() => setStep("confirmed"), 600)`) and fails to call the network. Only the event detail page (`src/app/(app)/events/[slug]/EventDetailsRSVP.tsx`) is wired to the backend.

#### Target State
A unified, shared RSVP mutation hook or utility that powers both `EventDetailsRSVP.tsx` and `RSVPModal.tsx`. Both flows must handle:
- Confirmed registrations
- Waitlist transitions
- Duplicate active registration rejection (HTTP 409)
- Event lifecycle restrictions (cancelled, completed, registration disabled, deadline expired)
- Validation and network error banners
- Calendar integration (.ICS and Google Calendar) using real persisted data

#### Scope
- Extract RSVP submission logic into a typed client utility or hook.
- Wire `src/components/events/RSVPModal.tsx` to `POST /api/events/[slug]/rsvp`.
- Add inline error banners, loading states, and waitlist confirmation UI to `RSVPModal.tsx`.
- Ensure all entry points on homepage carousel, event catalog, and event detail pages behave identically.

#### Out of Scope
- Redesigning the visual styling of EventCard or RSVP modal.
- Adding member login or authentication to the RSVP flow.

#### Dependencies
- Phase 0 verification.

#### Risks
- Modal state management bugs causing modal to close prematurely on API error.

#### Verification Strategy
- Browser automation: Submit RSVP via homepage card, verify record in PostgreSQL `event_registrations`.
- Submit duplicate from modal, verify 409 error banner displays.
- Submit to full event from modal, verify waitlist confirmation displays.

#### Acceptance Criteria
- [x] Zero mock `setTimeout` calls in any event or RSVP component.
- [x] All RSVP submissions create real records in `event_registrations`.
- [x] Modal and detail pages have 100% parity in error handling, waitlist transitions, and calendar export.

---

### PHASE 2 — Transaction-Safe Capacity — ✅ COMPLETED (2026-09-23)

> **Implementation Artifacts**:
> - `src/lib/rsvpService.ts` (atomic transactional RSVP mutation with `SELECT ... FOR UPDATE` row lock)
> - `src/migrations/20260923_140000_event_registrations_unique_active.ts` (PostgreSQL partial unique index `event_registrations_active_unique_idx`)
> - `src/app/(app)/api/events/[slug]/rsvp/route.ts` (refactored to delegate to `executeAtomicRSVP`)
> - `src/scripts/test-capacity-concurrency.ts` (automated concurrency verification harness)
> - Commit: `a339735`
>
> **Verification Summary**:
> - 10 simultaneous concurrent requests against an event with `maxParticipants = 1` produced **exactly 1 confirmed** and **9 waitlist** responses.
> - Database verified: `confirmedCount = 1`, `waitlist = 9`. Zero overbooking.
> - 5 simultaneous duplicate requests with identical email produced **1 success** and **4 rejected with HTTP 409 DUPLICATE_REGISTRATION**.
> - Database verified: Exactly 1 record persisted for the duplicate email.
> - `npm run type-check`: 0 errors.

#### Objective
Guarantee the core capacity invariant: `confirmed occupancy <= event.maxParticipants` under concurrent requests.

#### Why It Matters
In high-demand runs (e.g. Belgrad Forest with limited van seats), simultaneous submissions for the final slot currently execute independent `SELECT count(*)` queries before inserting, resulting in overbooking beyond safety thresholds.

#### Current Problem
`src/app/(app)/api/events/[slug]/rsvp/route.ts` reads confirmed registrations, evaluates `confirmedCount < maxCapacity`, and then creates a record in two decoupled queries without transactional locking.

#### Target State
Atomic capacity evaluation and insertion within a PostgreSQL transaction boundary using appropriate concurrency control:
- Option A: PostgreSQL transaction with row-level locking (`SELECT ... FOR UPDATE` on the target `events` row).
- Option B: Serializable transaction isolation with automatic retry on serialization failure.
- Option C: Database constraint or trigger enforcing capacity invariant.

#### Scope
- Wrap RSVP capacity verification, duplicate check, and registration insert in an atomic database transaction.
- Explicitly handle race conditions: the first request gets `confirmed`; the concurrent second request receives `waitlist` or is serialized cleanly.
- Ensure rollback consistency on failure.

#### Out of Scope
- Distributed lock managers (Redis Redlock) — PostgreSQL transaction primitives are sufficient and native.

#### Dependencies
- Phase 1 (unified RSVP contract).

#### Risks
- Database deadlocks if locks are acquired out of order; lock timeouts under burst loads.

#### Verification Strategy
- Implement an automated concurrency test script that dispatches `N = 10` simultaneous HTTP requests against an event with `maxParticipants = 1`.
- Verify that exactly 1 registration is `confirmed` and `N - 1` registrations are `waitlist`.

#### Acceptance Criteria
- [x] Concurrency test passes with 100% reliability.
- [x] Invariant `confirmedCount <= maxParticipants` holds under all concurrent burst loads.
- [x] Database partial unique constraint blocks race-condition duplicate inserts at the engine level.

---

### PHASE 3 — RBAC Hardening

#### Objective
Enforce the principle of least privilege across all collections and API endpoints for Anonymous, Editor, and Admin roles.

#### Why It Matters
Normal content editors currently possess overly broad update permissions on `ClubMembers` (including student IDs, phone numbers, and approval status). Privileged actions must be strictly partitioned.

#### Current Problem
Collection-level access rules rely on coarse `Boolean(user)` checks for read/create/update. Field-level restrictions and separation between Content Editing and Membership/Staff Administration are incomplete.

#### Target State
A formal, tested RBAC matrix:

| Collection | Anonymous | Editor | Admin |
| :--- | :--- | :--- | :--- |
| **Users** | No access | Read own profile only (`id === user.id`); hidden from admin UI | Full CRUD; manage roles and staff accounts |
| **ClubMembers** | No direct access (Join via `/api/join`) | Read operational summary (name, experience, stream); **cannot** view studentId/phone; **cannot** approve/reject members | Full CRUD; approve/reject members; view full PII; edit admin notes |
| **EventRegistrations** | No direct access (RSVP via API) | Read registrations; update attendance (`attended`, `no_show`); **cannot** delete | Full CRUD; manage status; delete |
| **Events** | Read published events | Full CRUD on event content; publish/unpublish; **cannot** delete | Full CRUD; delete |
| **Partners** | Read published partners | Full CRUD on partner content; upload logos; **cannot** delete | Full CRUD; delete |
| **Media** | Read media files | Upload & update media assets; **cannot** delete | Full CRUD; delete |

#### Scope
- Implement field-level access control on `ClubMembers` (`studentId`, `phone`, `status`, `adminNotes`).
- Restrict member status mutation (`pending` ➔ `active` / `rejected`) to `role === "admin"`.
- Ensure Payload Local API calls on behalf of users respect context authorization.
- Verify direct REST endpoints (`/api/club-members`, `/api/event-registrations`) enforce role boundaries.

#### Out of Scope
- Custom third-party identity providers or OAuth.

#### Dependencies
- Phase 0 baseline verification.

#### Risks
- Breaking legitimate admin workflows if field-level permissions hide required UI inputs.

#### Verification Strategy
- Automated RBAC test script verifying HTTP status codes and returned JSON fields for Anonymous, Editor, and Admin tokens across all collections.

#### Acceptance Criteria
- Editors cannot view member student IDs or phone numbers.
- Editors cannot alter member status (`pending` to `active`).
- Admins retain full operational authority.
- Hard delete is universally blocked for non-admins.

---

### PHASE 4 — Public API & Error Hardening

#### Objective
Harden public mutation endpoints (`/api/join` and `/api/events/[slug]/rsvp`) against abuse, malformed input, and information disclosure.

#### Why It Matters
Public endpoints accept untrusted internet traffic. Internal database errors, uncaught exceptions, or excessive payloads can degrade availability or leak server internals.

#### Current Problem
While validation exists, error formatting in catch blocks can expose raw error messages (`error?.message`), request size limits are checked after reading body text, and structured error codes are not fully unified.

#### Target State
- Consistent, sanitized public error responses across all failure modes:
  - `VALIDATION_ERROR` (400)
  - `RATE_LIMITED` (429)
  - `PAYLOAD_TOO_LARGE` (413)
  - `DUPLICATE_ENTRY` (409)
  - `RESOURCE_NOT_FOUND` (404)
  - `EVENT_CLOSED` (400)
  - `INTERNAL_ERROR` (500) — generic public message with internal correlation UUID.
- Request payload size limits enforced before reading full stream into memory.
- Server-side error logging including correlation ID, endpoint name, timestamp, and sanitized error context (no personal data logged).
- Operational rate limit strategy documented with production recommendations.

#### Scope
- Standardize response envelopes across `/api/join` and `/api/events/[slug]/rsvp`.
- Implement a centralized request validation and sanitization utility.
- Add structured console logging with redaction for PII (email, phone, studentId).

#### Out of Scope
- Cloudflare WAF configuration (managed at DNS layer).

#### Dependencies
- Phase 2 (RSVP route hardening).

#### Risks
- Over-sanitizing errors, making frontend debugging difficult if correlation IDs are missing.

#### Verification Strategy
- Send oversized payloads (>32KB), malformed JSON, SQL injection probes, and verify standardized response envelopes.

#### Acceptance Criteria
- Zero raw database or stack trace leaks in API responses.
- Structured logging captures errors with correlation IDs.

---

### PHASE 5 — Persistent Production Media

#### Objective
Transition Payload Media storage from ephemeral local disk (`public/media`) to persistent cloud object storage.

#### Why It Matters
In containerized environments (Docker/Coolify) or serverless deployments, any application redeployment creates a fresh container layer, deleting all locally uploaded media assets (event covers, partner logos).

#### Current Problem
`src/collections/Media.ts` writes uploads directly to `public/media` on the local file system.

#### Target State
Payload Media configured with an S3-compatible cloud storage adapter (Cloudflare R2 recommended for zero egress fees):
- Local development: Can fallback to local disk or a dedicated development R2 bucket.
- Production: Uploads streamed directly to Cloudflare R2 bucket.
- Media URLs resolved via CDN domain (e.g. `https://media.ozurunningclub.com/...`).
- Upload sizes and image optimization handled via `sharp`.

#### Scope
- Evaluate `@payloadcms/storage-s3` plugin integration in `src/payload.config.ts`.
- Configure bucket, access keys, endpoint, and public CDN URL via environment variables.
- Provide a migration utility to copy existing seed/test media (`public/media/*`) to the bucket.
- Ensure responsive image sizes (`thumbnail`, `card`, `hero`) generate properly in object storage.

#### Out of Scope
- Video streaming or transcoding infrastructure.

#### Dependencies
- Environment configuration (Phase 6).

#### Risks
- Cloudflare R2 credential misconfiguration causing upload failures in production.

#### Verification Strategy
- Upload image via `/admin/collections/media`.
- Verify asset appears in R2 bucket and is accessible via public CDN URL.
- Restart application container; verify image continues to render without 404.

#### Acceptance Criteria
- Media survives container destruction and recreation.
- Public website displays CDN-hosted images cleanly.

---

### PHASE 6 — Production Configuration & Secrets

#### Objective
Eliminate insecure defaults, hardcoded fallbacks, and establish fail-fast environment validation.

#### Why It Matters
Hardcoded secrets in source control allow anyone with repository read access to forge authentication tokens or compromise database access if fallbacks remain active in production.

#### Current Problem
`src/payload.config.ts` falls back to `"8f83c18c7e92384a6b29d891b988f910"` and `"postgres://postgres:ozu_running_secret@..."`. `docker-compose.yml` mirrors these defaults.

#### Target State
A strict configuration module that validates environment variables at startup:
- Required in Production:
  - `DATABASE_URI` (must not contain default credentials)
  - `PAYLOAD_SECRET` (minimum 32 random characters; rejects fallback string)
  - `NEXT_PUBLIC_SERVER_URL` (valid HTTPS URL)
  - `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_ENDPOINT`
- If any required variable is missing or insecure when `NODE_ENV === "production"`, the application logs a fatal startup error and terminates immediately (`process.exit(1)`).
- Clear, sanitized `.env.example` documenting all configuration keys.

#### Scope
- Create `src/lib/env.ts` with strict schema validation.
- Update `payload.config.ts` to consume validated environment variables.
- Clean `docker-compose.yml` to require environment injection.

#### Out of Scope
- Third-party vault integrations (HashiCorp Vault, AWS Secrets Manager) — standard environment variable injection is standard for Coolify/Docker.

#### Dependencies
- None.

#### Risks
- Build failures in CI if dummy build secrets are not supplied during static asset collection.

#### Verification Strategy
- Attempt starting app with `NODE_ENV=production` and missing `PAYLOAD_SECRET`; verify process aborts immediately.
- Supply valid secrets; verify clean boot.

#### Acceptance Criteria
- Zero hardcoded fallback secrets in application source code.
- Startup fails immediately on missing or insecure production configuration.

---

### PHASE 7 — Automated Backend Tests

#### Objective
Establish an automated integration test suite verifying critical business logic, domain invariants, and security boundaries.

#### Why It Matters
Without automated tests, regressions in duplicate prevention, capacity calculation, waitlist assignment, or RBAC cannot be detected prior to production deployment.

#### Current Problem
The repository has 0 automated tests (`package.json` contains no test runner or test scripts).

#### Target State
A lightweight, fast integration test suite using **Vitest** (native ESM and TypeScript support):
1. **Join Test Suite**:
   - Valid application submission ➔ 201 Created with status `pending`.
   - Duplicate pending submission ➔ 409 Conflict.
   - Duplicate active submission ➔ 409 Conflict.
   - Malformed data (invalid email, short student ID) ➔ 400 Bad Request.
2. **Events & DAL Test Suite**:
   - Published events visible via `getPublishedEvents()`.
   - Draft events hidden from public queries (`getEventBySlug()` returns null).
   - Dynamic capacity counter matches real `event_registrations` records.
3. **RSVP Test Suite**:
   - Successful confirmed RSVP ➔ 201 Confirmed, decrements remaining spots.
   - Duplicate active RSVP ➔ 409 Conflict.
   - Event closed / deadline expired ➔ 400 Bad Request.
   - Full capacity event ➔ 201 Waitlist.
   - Concurrency test: 10 concurrent requests for 1 slot ➔ exactly 1 confirmed, 9 waitlist.
4. **RBAC Test Suite**:
   - Anonymous access to `/api/users`, `/api/club-members` ➔ 403 Forbidden.
   - Editor access to member student IDs or approval mutation ➔ 403 Forbidden.
   - Editor deletion attempt ➔ 403 Forbidden.
   - Admin access ➔ 200 OK.

#### Scope
- Configure `vitest` in `package.json`.
- Create test helpers for authenticating Admin and Editor sessions.
- Implement tests against PostgreSQL test database.

#### Out of Scope
- Heavy browser-based end-to-end testing (Playwright) — focus on fast, deterministic API/database integration tests.

#### Dependencies
- Phase 2 (capacity atomicity) and Phase 3 (RBAC).

#### Risks
- Database state pollution between test runs if cleanup hooks are not atomic.

#### Verification Strategy
- Run `npm test` and verify all suites execute and pass within <15 seconds.

#### Acceptance Criteria
- Test command `npm test` exits with code 0.
- All 4 core suites (Join, Events, RSVP, RBAC) pass.

---

### PHASE 8 — Continuous Integration (CI)

#### Objective
Establish an automated GitHub Actions CI pipeline executing quality checks on every pull request and push to `main`.

#### Why It Matters
Prevents broken code, failing tests, or type errors from being merged into production.

#### Current Problem
Zero CI configuration exists in the repository.

#### Target State
A GitHub Actions workflow `.github/workflows/ci.yml`:
1. **Checkout & Setup**: Node.js 22 LTS, npm caching.
2. **Type Check**: `npm run type-check`.
3. **Lint**: `npm run lint`.
4. **Service Container**: Ephemeral PostgreSQL 16 service for test execution.
5. **Automated Tests**: Run integration test suite (`npm test`).
6. **Production Build**: Verify `npm run build` completes successfully.

#### Scope
- Create `.github/workflows/ci.yml`.
- Configure environment variables and PostgreSQL service in GitHub Actions.

#### Out of Scope
- Automated production CD deployment triggers (kept manual or webhook-based for RC1).

#### Dependencies
- Phase 7 (automated test suite).

#### Risks
- Flaky tests failing in CI due to timing differences in GitHub Actions runners.

#### Verification Strategy
- Trigger workflow on GitHub and verify green checkmark on all steps.

#### Acceptance Criteria
- CI runs automatically on PRs and passes all stages in under 3 minutes.

---

### PHASE 9 — Database Operations & Backup Procedures

#### Objective
Document, automate, and verify backup and disaster-recovery procedures for PostgreSQL.

#### Why It Matters
A database backup that has never been tested for restoration is not a backup. Hardware failures or accidental data corruption require a deterministic recovery plan.

#### Current Problem
No backup scripts, retention policies, or restore verification steps are documented or automated.

#### Target State
- Script `scripts/backup-db.sh`:
  - Executes `pg_dump` with custom compressed format.
  - Timestamps backup archives (`ozu_running_db_YYYYMMDD_HHMMSS.dump`).
  - Implements retention policy (keep daily for 7 days, weekly for 4 weeks).
- Script `scripts/restore-db.sh`:
  - Validates archive integrity.
  - Drops and recreates clean database schema.
  - Restores tables, sequences, and indexes via `pg_restore`.
- Verified Disaster Recovery runbook in `docs/operations/backup-restore.md`.

#### Scope
- Write shell scripts for backup and restore.
- Test backup and restore on local development container.
- Document cron/systemd schedule for VPS deployment.

#### Out of Scope
- Point-in-time recovery (WAL archiving) — standard daily snapshot backups are sufficient for club operational scale.

#### Dependencies
- None.

#### Risks
- Accidental restore onto a live production database without confirmation prompt.

#### Verification Strategy
- Create backup, insert a dummy record, restore backup, verify dummy record is gone and original state is intact.

#### Acceptance Criteria
- Backup script executes cleanly in <5 seconds.
- Restore script restores complete database state with verified sequence alignment.

---

### PHASE 10 — Production Deployment Architecture

#### Objective
Finalize the production hosting and deployment specification for the application.

#### Why It Matters
Ambiguity in hosting models (e.g. attempting Vercel serverless without persistent media or database connection pooling) leads to deployment failure.

#### Current Problem
The repository contains a `Dockerfile` and `docker-compose.yml`, but lacks a documented target infrastructure topology.

#### Evaluation & Recommendation
- **Option A (Vercel)**: Requires external managed Postgres (Supabase/Neon), external S3 storage, and serverless cold start management. Expensive and fragmented for a student club budget.
- **Option B (Recommended: Single-Node VPS with Coolify or Docker Compose)**:
  - **Host**: Hetzner Cloud or DigitalOcean VPS ($5–$10/month).
  - **Orchestration**: Coolify or Docker Compose running:
    - Next.js + Payload web container
    - PostgreSQL 16 container with persistent named volume
  - **Media Storage**: Cloudflare R2 bucket (free tier: 10GB storage, $0 egress).
  - **Reverse Proxy / SSL**: Traefik or Caddy (automated Let's Encrypt certificates).
  - **Pros**: Zero-latency database connection, unified environment, predictable costs, total data ownership.

#### Scope
- Document deployment architecture in `docs/operations/deployment-guide.md`.
- Ensure `Dockerfile` and `docker-compose.prod.yml` reflect production topology.
- Define environment variable handover checklist.

#### Out of Scope
- Multi-region Kubernetes clustering.

#### Dependencies
- Phase 5 (media storage) and Phase 6 (secrets).

#### Risks
- Host downtime if VPS memory is constrained (mitigated with 1GB swap configuration).

#### Verification Strategy
- Deploy to a staging VPS instance; verify all public and admin routes respond over HTTPS.

#### Acceptance Criteria
- Complete deployment guide written and validated against container configuration.

---

### PHASE 11 — Production Smoke Test

#### Objective
Execute an exhaustive end-to-end operational verification across Admin, Public, Security, and Infrastructure layers before public launch.

#### Why It Matters
Verifies the complete assembled system in its real production environment.

#### Scope Checklist
1. **Admin Verification**:
   - Log in as Admin (`admin@ozurunning.com`).
   - Create a new event in Draft mode with cover image upload.
   - Verify draft event returns HTTP 404 on public `/events/[slug]`.
   - Publish the event; verify it immediately appears on `/` and `/events`.
2. **Public User Verification**:
   - Submit "Join the Club" application; verify confirmation screen and `pending` state in admin.
   - Submit RSVP from homepage Event Card (Modal flow); verify real database record.
   - Submit RSVP from Event Detail page; verify real database record.
   - Submit duplicate RSVP; verify friendly error banner.
3. **Capacity & Waitlist**:
   - Set event `maxParticipants = 2`. Register 2 attendees ➔ both `confirmed`.
   - Register 3rd attendee ➔ assigned `waitlist`.
   - Cancel 1 attendee in admin ➔ remaining spot updates correctly.
4. **Security & RBAC**:
   - Anonymous access to `/admin` redirects to login.
   - Anonymous access to `/api/club-members` returns 403.
   - Log in as Editor (`editor@ozurunning.com`); verify `Administration` / `Users` is hidden.
   - Editor attempts deletion of an event ➔ rejected with 403.
5. **Infrastructure Integrity**:
   - Restart web container; verify uploaded event cover images still render from Cloudflare R2.
   - Trigger backup script; verify dump created.

#### Acceptance Criteria
- 100% of smoke test checklist items pass with documented visual and API evidence.

---

### PHASE 12 — RC1 Definition of Done

The ÖzÜ Running Club Backend v1 is considered **Production-Ready (Release Candidate 1)** only when all the following criteria are met:

1. **Functional Integrity**:
   - Every visible RSVP entry point (card modal and detail page) writes directly to PostgreSQL through `/api/events/[slug]/rsvp`.
   - Zero mock `setTimeout` simulation calls remain in application code.
2. **Data & Domain Invariants**:
   - Capacity evaluation is transaction-safe: `confirmed occupancy <= maxParticipants` at all times under concurrent load.
   - Event lifecycle and deadline restrictions are enforced server-side.
   - Member duplicate policies (`pending`, `active`, `rejected`) operate strictly on normalized email and student ID.
3. **Security & RBAC**:
   - Roles (`admin`, `editor`, `anonymous`) adhere strictly to least-privilege matrix.
   - Editor role cannot view member student IDs, phone numbers, or alter member approval status.
   - Zero hardcoded fallback secrets or default passwords remain in source control.
4. **Persistence**:
   - Media uploads persist to Cloudflare R2 object storage and survive container destruction.
   - Automated database backup scripts exist, are scheduled, and have verified restore tests.
5. **Quality & Operations**:
   - Automated integration tests pass with 100% success (`npm test`).
   - TypeScript compilation passes with 0 errors (`npm run type-check`).
   - Production build compiles cleanly (`npm run build`).
   - Continuous Integration workflow is green on `main`.
   - Production smoke test checklist is executed and documented.
