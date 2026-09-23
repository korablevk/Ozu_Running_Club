# ÖzÜ Running Club — Project Status

**Last Updated:** September 23, 2026  
**Source of Truth:** Authoritative repository audit of `main` branch (`f15dfe6`)  
**Main URL (Local Dev):** `http://localhost:3001` (Dev Port) / `http://localhost:3000` (Default Port)  
**Admin URL (Local Dev):** `http://localhost:3001/admin`

---

## 1. Current Release State

### Frontend
| Component / Module | Status | Notes |
| :--- | :---: | :--- |
| **Brand Identity (v0.2)** | ✅ | Collegiate Navy/Plum/Burgundy/Crimson palette active across all views; slogan *WE MOVE TOGETHER.* integrated. |
| **Editorial Polish (v0.3)** | ✅ | Asymmetric storytelling, photography-driven dispatch, refined section pacing and typography rhythm implemented. |
| **Mobile & Responsive UX** | ✅ | Dedicated `MobileTopBar`, full-screen `MobileMenuDrawer`, and persistent `MobileBottomBar` verified across breakpoints. |
| **Public RSVP Modal** | ✅ | Fully unified via `src/lib/useRSVP.ts`. Both `RSVPModal.tsx` and `EventDetailsRSVP.tsx` route directly through `POST /api/events/[slug]/rsvp`, handling confirmed status, waitlists, HTTP 409 duplicate rejection, and real calendar export. |

### Backend
| Capability / Layer | Status | Notes |
| :--- | :---: | :--- |
| **Payload Foundation** | ✅ | Payload CMS 3.89.0 embedded in Next.js 15 App Router; initialized with PostgreSQL adapter. |
| **Collections & Schema** | ⚠️ | 6 collections configured (`Users`, `Media`, `Events`, `ClubMembers`, `EventRegistrations`, `Partners`), but field-level security and atomic locking hooks are absent. |
| **Database Reads (DAL)** | ✅ | `src/lib/dal.ts` queries published events and partners via Payload Local API; derives real-time capacity and waitlist metrics dynamically. |
| **Join Workflow** | ✅ | `POST /api/join` enforces payload limits, input validation, identity normalization, duplicate protection, and creates `pending` members. |
| **RSVP Workflow** | ⚠️ | `POST /api/events/[slug]/rsvp` operational from event detail page, but capacity evaluation is non-atomic (race condition under concurrency). |
| **Admin Panel UX** | ✅ | Grouped navigation (`Activities & Events`, `Community`, `Media & Assets`, `Administration`) with tailored default column views. |
| **Role-Based Access (RBAC)**| 🟡 | Basic Admin vs Editor roles implemented; Editor delete blocked and Users collection hidden, but Editor has overly broad access to sensitive member PII and approval status. |

### Infrastructure & Operations
| Component / Area | Status | Notes |
| :--- | :---: | :--- |
| **PostgreSQL** | ✅ | PostgreSQL 16 Alpine running in Docker container (`ozu_running_club_db`) mapped to host port `5433`. |
| **Docker Containerization**| 🟡 | `Dockerfile` and `docker-compose.yml` present with `.dockerignore`; production image build tested but lacks multi-stage secrets handling. |
| **Media Storage** | ⚠️ | Uploads write to local disk (`public/media`); ephemeral and wiped on container rebuild or serverless deploy. |
| **Deployment Strategy** | 🟡 | Target identified (VPS / Coolify), but no staging/production environment configuration or automated release script exists. |
| **Database Backups** | 🔴 | No automated backup schedule, pg_dump scripts, or verified restore procedures exist. |
| **CI / CD Pipeline** | 🔴 | No GitHub Actions workflow or automated pre-merge checks (`type-check`, `lint`, test suite) configured. |
| **Monitoring & Telemetry** | 🔴 | No error logging sink (e.g. Sentry), uptime monitoring, or structured health check endpoint configured. |

---

## 2. Current Architecture

```text
Browser Client
  │
  ├── Public Website Reads ────────► Server Components (Next.js 15)
  │                                       │
  │                                       ▼
  │                                 Data Access Layer (src/lib/dal.ts)
  │                                       │
  │                                       ▼
  │                                 Payload Local API
  │                                       │
  │                                       ▼
  │                                 PostgreSQL 16 (Port 5433)
  │
  ├── Public Write Workflows
  │     ├── Join Form ─────────────► POST /api/join ───────────────► Payload Local API (overrideAccess) ──► ClubMembers
  │     ├── Event Detail RSVP ─────► POST /api/events/[slug]/rsvp ─► Payload Local API (overrideAccess) ──► EventRegistrations
  │     └── Event Card Modal ──────► POST /api/events/[slug]/rsvp ─► Payload Local API (overrideAccess) ──► EventRegistrations (via useRSVP)
  │
  └── Administrative Control
        └── /admin ────────────────► Payload Admin UI ────────────► Collection Access Control ──────────► PostgreSQL 16
```

### Public Mutation Workflows
1. **Join Submission**: `src/app/(app)/join/page.tsx` ➔ `POST /api/join` ➔ Normalization & validation ➔ Rate limit check (in-memory) ➔ Status duplicate policy check ➔ Creates `club-members` document with status `pending`.
2. **Event Detail RSVP**: `src/app/(app)/events/[slug]/EventDetailsRSVP.tsx` ➔ `src/lib/useRSVP.ts` ➔ `POST /api/events/[slug]/rsvp` ➔ Rate limit check ➔ Lifecycle & deadline check ➔ Non-atomic capacity count ➔ Creates `event-registrations` document with status `confirmed` or `waitlist`.
3. **Card RSVP Modal**: `src/components/events/EventCard.tsx` ➔ `src/components/events/RSVPModal.tsx` ➔ `src/lib/useRSVP.ts` ➔ `POST /api/events/[slug]/rsvp` ➔ Identical backend routing, duplicate rejection, and persistence.

---

## 3. Current Top Risks

### P0 (Critical — Functional & Data Invariant Blockers)
1. **[RESOLVED — Phase 1] RSVP Modal Mock Simulation**:
   - *Status*: ✅ Resolved via `src/lib/useRSVP.ts`. Modal and detail views now use identical backend mutation logic and real PostgreSQL persistence.
2. **Non-Atomic Event Capacity Check (Concurrency Race Condition)**:
   - *Impact*: Simultaneous requests for the final open slot both read `confirmedCount < maxParticipants`, resulting in `confirmedCount > maxParticipants` (overbooking beyond physical safety limits).
   - *Fix*: Enforce database-level serializable isolation or row-level locking (`SELECT ... FOR UPDATE`) inside a transaction boundary (Phase 2 target).

### P1 (High — Security, Persistence & Release Integrity)
3. **Ephemeral Media Storage**:
   - *Impact*: Images uploaded via `/admin` are saved to local filesystem (`public/media`). In containerized or VPS deployments without persistent mounts, redeploys erase all uploaded media.
   - *Fix*: Implement persistent S3-compatible cloud storage (Cloudflare R2 recommended).
4. **Hardcoded Secrets & Insecure Fallbacks**:
   - *Impact*: `src/payload.config.ts` and `docker-compose.yml` contain fallback secrets (`8f83c18c7e92384a6b29d891b988f910`, `ozu_running_secret`). If deployed without environment variables, the system runs with compromised defaults.
   - *Fix*: Implement fail-fast validation in production (`process.exit(1)` if `PAYLOAD_SECRET` or `DATABASE_URI` are missing or default).
5. **Overly Permissive Editor RBAC on Member PII**:
   - *Impact*: Any account with `editor` role can read and update all `ClubMembers` records (including student IDs, personal phone numbers, and approval status), violating least privilege.
   - *Fix*: Scope Editor permissions to content/events/partners; reserve member PII and approval transitions to Admin.
6. **Zero Automated Test Coverage**:
   - *Impact*: No automated unit, integration, or regression tests exist in the repository. Schema or route regressions can only be caught manually.
   - *Fix*: Establish an automated integration test suite covering Join, RSVP, capacity invariants, and RBAC.
7. **No Backup / Disaster Recovery Procedure**:
   - *Impact*: A corrupted volume or VPS failure would result in total data loss of club members and registrations.
   - *Fix*: Implement automated `pg_dump` backup scripts with verified restore verification.

### P2 (Medium — Operational & Infrastructure Polish)
8. **In-Memory Rate Limiting**:
   - *Impact*: `rateLimitMap` in `src/lib/rateLimit.ts` is in-memory. Node process restarts or multi-worker clustering reset limits immediately.
   - *Fix*: Acceptable for single-instance VPS MVP; evaluate Redis or PostgreSQL token-bucket for horizontal scaling.
9. **Missing CI Pipeline**:
   - *Impact*: Pull requests cannot be automatically validated for type safety, build integrity, or test pass rates before merge.
   - *Fix*: Add minimal GitHub Actions workflow for `type-check`, `lint`, and integration tests.
10. **Absence of Structured Logging & Telemetry**:
    - *Impact*: API exceptions write generic console errors without correlation IDs, alerting, or structured log aggregation.
    - *Fix*: Implement structured JSON application logging and health check endpoint `/api/health`.
