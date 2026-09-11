# ÖzÜ Running Club — Backend Implementation Plan v1.0

**Status:** Planned  
**Backend stack:** Next.js App Router + Payload CMS 3 + PostgreSQL  
**Primary objective:** Convert the current frontend/demo prototype into a real club-management backend while preserving the existing public website UX and current product scope.

## 0. Executive Architecture

The backend should remain inside the existing Next.js application. Do **not** introduce a separate Django/FastAPI service for v1.

```text
Browser
  │
  ├── Public website
  │     ├── Homepage
  │     ├── Events
  │     ├── Event details
  │     ├── Join the Club
  │     └── Partners
  │
  └── Admin
        └── /admin
              │
              ▼
      Next.js + Payload CMS
              │
              ▼
          PostgreSQL
```

Public writes must go through dedicated server-side business workflows rather than allowing the browser to write directly to sensitive Payload collections.

```text
Join Form ───────► Join Service ───────► ClubMembers
RSVP Form ───────► RSVP Service ───────► EventRegistrations
Admin UI ────────► Payload Access ─────► Collections
Public pages ────► Data Access Layer ──► Payload Local API
```

## 1. Guiding Principles

### 1.1 Payload is the application backend
Payload is responsible for database-backed collections, administrator authentication, CMS/admin UI, CRUD operations, collection validation, role-based access control, media metadata, hooks and migrations.

### 1.2 PostgreSQL is the source of truth
Once read integration is complete, `src/lib/data.ts` is no longer the runtime database. Events, partners, join applications, RSVP registrations and attendance state are stored in PostgreSQL. Demo data may remain only as seed fixtures.

### 1.3 Browser code must not contain business authority
The client may collect form input, show validation feedback and display confirmation states. The client must not decide whether an event exists, RSVP is open, capacity is available, a user is already registered, a membership application is a duplicate, or whether someone has permission to access private data.

### 1.4 Keep v1 operationally simple
Do not implement member passwords/accounts, personal dashboards, Strava API, QR attendance, rewards, leaderboards, merchandise, advanced analytics or microservices in v1.

## 2. Definition of Backend v1

### Workflow A — Event lifecycle
```text
President logs into /admin
        ↓
Creates / edits an event
        ↓
Publishes the event
        ↓
Event appears on public website
        ↓
Student opens event
        ↓
Submits RSVP
        ↓
Server validates RSVP
        ↓
Registration stored in PostgreSQL
        ↓
President sees registration in /admin
        ↓
After the run, registration can be marked Attended / No-show / Cancelled
```

### Workflow B — Club membership
```text
Student opens Join the Club
        ↓
Submits application
        ↓
Server validates application
        ↓
Application stored as Pending
        ↓
President sees application in /admin
        ↓
President approves / rejects
        ↓
Approved person becomes Active
```

# 3. Phase 1 — Payload Foundation

## Goal
Make Payload CMS and PostgreSQL genuinely operational inside the existing Next.js application. Public website behavior remains unchanged.

## Responsibilities
- Install and configure Payload 3.
- Configure the PostgreSQL adapter.
- Add Payload routes to the existing App Router application.
- Create an authenticated admin user collection.
- Make `/admin` operational.
- Connect the application to the existing Docker PostgreSQL service.
- Establish environment configuration.
- Establish migration workflow.
- Confirm development and production build compatibility.

## Environment strategy
Use PostgreSQL in both development and production to reduce differences in data types, constraints, transactions and migrations.

Required environment contract:
- database connection
- Payload secret
- canonical server URL
- environment mode

Secrets must never be committed. Local Docker defaults are development-only and must not become production credentials.

## Admin authentication model
Create a Payload auth-enabled `Users` collection for staff/admin users only.

### `admin`
For club president / technical owner.
Can manage all content, members, registrations, partners and admin users.

### `editor`
For future committee/content/event managers.
Can manage events, partners and media, and only operational member/registration data explicitly allowed by access rules.
Cannot manage admin users or security-sensitive settings.

Do not create member login in this phase.

## Migration policy
Development may iterate quickly, but production schema changes must be represented by committed migrations. No manual production table editing.

## Phase 1 acceptance criteria
- PostgreSQL starts successfully.
- Next.js starts successfully.
- Payload initializes successfully.
- `/admin` loads.
- First admin can authenticate.
- Test collection can be read/written.
- Restart does not lose PostgreSQL data.
- Type-check passes.
- Production build passes.

# 4. Phase 2 — Collections, Data Model & Media

## Goal
Define the stable v1 domain model before connecting public UI.

## 4.1 Users
Purpose: authenticated staff who use Payload Admin.
Core concepts: name, email, password/auth fields, role, active/inactive status.

`Users` and `ClubMembers` are separate domains. A runner does not need a Payload account.

## 4.2 Media
Purpose: central upload collection for public website assets.
Support image/file, alt text, optional caption and basic metadata.
Referenced by Events, Partners and future Recaps/team content.

Development may use local storage. Production must use object storage or explicitly persistent media storage. Do not rely on an ephemeral application-container filesystem.

## 4.3 Events
Purpose: authoritative record for each run/session.

Core identity:
- title
- slug
- event type
- description
- cover image

Schedule/location:
- start date/time
- meeting point
- map URL
- optional registration deadline

Running metadata:
- distance
- elevation
- target pace
- estimated duration if retained
- pace groups

Capacity:
- max participants

Do **not** treat `registeredCount` as manually editable source-of-truth data. Registered participants must be derived from registration records.

### Event lifecycle
Separate concepts:

Lifecycle:
- scheduled
- completed
- cancelled

Publication:
- draft
- published

Registration availability is derived from publication, lifecycle, deadline, capacity and an optional registration-enabled flag.

`full` is a computed condition, not a lifecycle state.

Allow `isFeatured` for homepage selection.

## 4.4 Pace groups
For v1, pace groups may remain embedded inside Event.
Fields: name, target pace, pacer, optional capacity.
Do not persist `slotsRemaining`; derive it from registrations.
If group capacity is not needed at launch, omit it and enforce only event-level capacity.

## 4.5 ClubMembers
Purpose: Join-the-Club applications and approved members.

Core fields:
- full name
- normalized email
- student ID
- phone
- faculty/department
- experience level
- motivation
- optional preferences already collected by UI
- status
- created/updated timestamps

Membership statuses:
- pending
- active
- rejected
- inactive
- alumni

New applications always start as `pending`.

At minimum email must be unique; student ID should normally be unique if required by club policy. Normalize identity fields before duplicate checks.

## 4.6 EventRegistrations
Purpose: participation decision for one Event.

Fields/concepts:
- relationship to Event
- optional relationship to ClubMember
- full name snapshot
- normalized email
- student ID
- phone
- selected pace group
- registration status
- created/updated timestamps

Keep identity snapshot fields even when linked to a member so the registration remains historically meaningful if the profile later changes.

Statuses:
- confirmed
- waitlist
- cancelled
- attended
- no_show

Duplicate invariant: one active registration per `event + normalized email`.

## 4.7 Partners
Fields: name, tier/category, logo, website URL, perk summary, optional discount code, published flag/order.
Public pages read only published partners.

## 4.8 Attendance decision for v1
Do not introduce a separate Attendance collection yet. Use EventRegistration status `attended` / `no_show`. Introduce a dedicated model only when QR check-in, timestamps or richer attendance analytics become real requirements.

## 4.9 Data integrity rules
Define required fields, unique fields, relationship rules, deletion behavior, defaults, indexes and validation. Important indexed concepts include event slug/date/publication state, normalized member email, registration event relationship, normalized registration email and registration status.

## Phase 2 acceptance criteria
- All collections appear correctly in Admin.
- Relationships work.
- Media upload works.
- Admin can manually create Event, Member and Registration.
- Invalid records are rejected.
- Uniqueness rules are enforced.
- Migrations are committed.
- Build/type-check pass.

# 5. Phase 3 — Seed & Read Integration

## Goal
Switch the public website from hardcoded runtime data to PostgreSQL without redesigning the frontend.

## Seed strategy
Convert current demo data into deterministic seed fixtures for events, partners and optional test members/registrations.
Seed must be repeatable in a clean development database and must never automatically repopulate production on startup.

## Data access layer
Do not scatter raw Payload queries through React components. Introduce centralized server-side domain reads such as:
- get published upcoming events
- get featured events
- get event by slug
- get public partners
- get registration count
- get spots remaining

The UI should depend on domain operations, not storage details.

## Payload Local API strategy
Server-side Next.js code should use Payload Local API for internal reads. Client components must not import Payload config/server-only APIs.

## Migration sequence from `data.ts`
1. Events list
2. Event details
3. Homepage upcoming events
4. Homepage featured/ticker event info
5. Partners
6. remaining CMS-owned public data

Use a mapper/adapter if needed so existing UI component props remain stable during migration.

## Event detail behavior
Resolve `/events/[slug]` from DB. Unpublished/missing content returns 404. Drafts must never be visible publicly just because the slug is known.

## Registration counts
Public counts are derived from registrations. Capacity-consuming statuses are centralized in backend rules. Cancelled and waitlisted records do not consume capacity.

## Caching
For v1, prioritize correctness over sophisticated caching. Fresh server-side queries are acceptable for expected club scale. Add cache invalidation only when measurements justify it.

## Phase 3 acceptance criteria
- Admin changes propagate to public site.
- New published event appears without code deploy.
- Drafts remain private.
- Event slug pages read DB data.
- Partners are DB-backed.
- Counts are derived from DB.
- Seed can rebuild demo environment.
- Build/type-check pass.

# 6. Phase 4 — Join Backend

## Goal
Convert Join the Club from simulated success into a real membership-application workflow.

## Public boundary
Browser submits to a dedicated server-side Join workflow. Anonymous users must not have unrestricted direct create/read access to `ClubMembers`.

## Join workflow
```text
Client submits final form
        ↓
Server validates request shape
        ↓
Normalize identity fields
        ↓
Check duplicate member/application
        ↓
Apply business rules
        ↓
Create ClubMember(status=pending)
        ↓
Return safe success response
        ↓
UI displays Application received
```

## Validation
Server validates required fields, email format, enum values, reasonable lengths, student ID/phone rules and unexpected fields. Client validation is UX only.

## Duplicate policy
- Existing pending: no duplicate, explain application already exists.
- Existing active: no duplicate, explain already a member.
- Existing rejected: re-application policy must be explicit.
- Existing inactive/alumni: do not overwrite history; require review/reactivation policy.

## Privacy
Public users never receive other member records, emails, phone numbers, internal notes or admin-only fields.

## Admin workflow
Pending applications shown newest first. President can approve → active, reject → rejected, later mark inactive/alumni. No public account is created.

## Abuse protection
Add request-size limits, throttling/rate limiting appropriate to deployment, duplicate protection and server validation. CAPTCHA/honeypot only if needed or launch policy requires it.

## Phase 4 acceptance criteria
Test valid application, duplicate pending, duplicate active, malformed data, repeated submissions, DB failure, network failure, approval flow and public inability to read the collection. UI shows success only after persistence succeeds.

# 7. Phase 5 — RSVP Backend

## Goal
Create a reliable event-registration workflow with capacity, duplicate and status rules.

## API boundary
Browser uses a dedicated RSVP workflow. Do not allow unrestricted anonymous writes directly to EventRegistrations.

## Authoritative RSVP sequence
```text
Receive RSVP
   ↓
Validate request
   ↓
Normalize email
   ↓
Load event
   ↓
Verify published + eligible lifecycle
   ↓
Verify deadline
   ↓
Check duplicate registration
   ↓
Calculate capacity
   ↓
Resolve confirmed vs waitlist
   ↓
Resolve optional member link
   ↓
Create registration
   ↓
Return confirmation
```

## Event checks
Event must exist, be published, not cancelled/completed, allow registration and be before deadline.

## Duplicate rule
Primary v1 identity is `event + normalized email`. Do not create another active registration. Cancelled-registration reactivation policy must be explicit and consistent.

## Capacity logic
`maxParticipants` lives on Event. Confirmed occupancy is derived from registrations. Capacity state is determined server-side.

When space exists: `confirmed`.
When full: `waitlist`.

## Concurrency and atomicity
Capacity-sensitive RSVP must be atomic. Two simultaneous requests for the last place must not both become confirmed. Use PostgreSQL transaction semantics plus appropriate locking/isolation for the implementation.

## Member linking
Lookup ClubMember by normalized email. If found, optionally link registration to member while retaining submitted identity snapshot. Member login is not required.

## Pace-group validation
Chosen pace group must belong to Event. Never accept arbitrary client-submitted group values. If group capacity is added, calculate it server-side.

## Cancellation
For v1, admin cancellation is sufficient. Cancelled records remain in history and stop consuming capacity.

## Waitlist
Initial policy: full event → waitlist. Promotion can remain admin-controlled until notifications exist. Do not auto-promote silently without notification.

## Attendance
After event, president updates status to attended/no_show. Historical participation remains queryable.

## Calendar behavior
Google Calendar/.ics may remain client-generated, but show confirmation tools only after real backend result.

## Phase 5 acceptance criteria
Test valid RSVP, duplicate, full event, waitlist, cancelled/completed/unpublished event, expired deadline, invalid pace group, concurrent last-slot submissions, cancellation, attendance update, DB failure and malformed input. Counts must remain correct across transitions.

# 8. Phase 6 — Admin UX, RBAC & Operational Control

## Goal
Make the backend usable by a non-technical club president.

## Admin information architecture
Expose clearly:
- Events
- Registrations
- Club Members
- Partners
- Media
- Admin Users (admin-only)

## Events admin UX
Useful columns: title, date, type, lifecycle, publication, capacity, registration summary.
Useful filters: upcoming, completed, cancelled, published/draft, event type.
Default sort: nearest upcoming first for operational views.

## Registrations admin UX
Columns: participant, email, event, pace group, status, registration date.
Filters: event, confirmed, waitlist, attended, no-show, cancelled.
The president should quickly answer: who is coming, who is waitlisted, who attended, how many spaces remain.

## Club Members admin UX
Columns: name, email, faculty, experience, status, application date.
Default operational focus: pending first.
Approve/reject should not require editing unrelated fields.

## Partners admin UX
Create/update partner, upload logo, update benefit text, published state and ordering without deploy.

## RBAC
### Anonymous/public
Can read published content through public app, submit Join/RSVP through controlled workflows. Cannot browse private collections or access admin.

### Editor
Can manage Events, Partners and Media, and only explicitly allowed operational member/registration data. Cannot manage Users or elevate own role.

### Admin
Can manage all operational collections, roles/users and destructive actions allowed by policy.

## Payload access-control rule
Admin UI visibility is not security. Enforce create/read/update/delete on server. Payload Local API can bypass access control by default, so any operation acting on behalf of an authenticated user must explicitly enforce intended authorization. Privileged internal workflows may bypass only after their own server-side business validation and only in server-only code.

## Destructive actions
Prefer state transitions over deletion for members, registrations and events. Use inactive/rejected/cancelled/completed rather than routine hard delete.

## Phase 6 acceptance criteria
Test anonymous, editor and admin roles for create/read/update/delete and admin visibility across all collections. Also test direct API access, not only UI buttons.

# 9. Cross-Cutting Backend Rules

## Service-layer boundary
Business rules must not live in React components or be duplicated across handlers. Maintain clear domain workflows for membership application, RSVP, event public reads and registration-capacity calculations.

## Normalize at boundaries
Normalize email and relevant identifiers before duplicate checks, persistence and business comparisons.

## Derived values stay derived
Do not manually maintain registered count, spots remaining, fullness or waitlist size unless later performance requires intentional denormalization with reconciliation rules.

## Timestamps/time zones
Persist canonical event timestamps consistently and render them in intended event timezone. Do not maintain competing manually edited display date/time strings as source of truth.

## Error model
Distinguish validation error, duplicate, unavailable event, full/waitlist result, unauthorized, not found and temporary server error. Never expose raw DB/Payload errors to client.

## Logging
Log workflow name, relevant event ID, error category and server timestamp. Avoid unnecessary personal-data logging.

## Personal-data minimization
Collect only fields the club intends to use. Sensitive member/registration data must never appear in public API responses.

# 10. Production / Release Gate

## Database
- persistent PostgreSQL storage
- tested production migrations
- backup strategy
- documented restore procedure

## Media
Object storage or explicit persistent storage. No dependence on ephemeral container filesystem.

## Secrets
DB connection, Payload secret, server URL and storage credentials stay in deployment environment. No production secret committed.

## Security
- admin auth required
- RBAC verified
- private collections do not leak data
- public forms rate-limited appropriately
- request payloads validated
- direct collection APIs tested against unauthorized use
- HTTPS enabled
- reasonable admin password policy

## Quality gates
- TypeScript type-check
- lint
- production build
- migrations on clean/staging DB
- seed on clean dev DB
- browser smoke tests

# 11. End-to-End Acceptance Scenarios

## Scenario 1 — Publish Event
Draft is private, publish makes it public, slug page resolves.

## Scenario 2 — Join Club
New application creates exactly one pending ClubMember; president can approve to active.

## Scenario 3 — Duplicate Join
Same normalized email does not create duplicate.

## Scenario 4 — RSVP
Valid submission becomes confirmed, affects capacity, visible to admin.

## Scenario 5 — Duplicate RSVP
Same email + event cannot create another active registration.

## Scenario 6 — Capacity
Two concurrent submissions for one remaining spot cannot both confirm.

## Scenario 7 — Cancellation
Cancelled registration remains historical and no longer consumes capacity.

## Scenario 8 — Attendance
After event, president marks attended/no_show and state persists.

## Scenario 9 — Permissions
Anonymous cannot read private data or mutate content; editor cannot manage admin users; admin has approved operational access.

# 12. Implementation Order

```text
Phase 1  Payload Foundation
        ↓
Phase 2  Collections + Media
        ↓
Phase 3  Seed + Read Integration
        ↓
Phase 4  Join Backend
        ↓
Phase 5  RSVP Backend
        ↓
Phase 6  Admin UX + Access Control
        ↓
Production / Release Gate
```

Do not attempt all phases in one agent turn.

Recommended engineering loop:
```text
Read current repo
   ↓
Read current phase specification
   ↓
Write phase-specific implementation plan
   ↓
Implement only that phase
   ↓
Type-check / build / relevant tests
   ↓
Inspect diff
   ↓
Update documentation
   ↓
Commit
   ↓
Proceed to next phase
```

# 13. Phase Dependencies

| Phase | Depends on | Must not begin before |
|---|---|---|
| 1. Foundation | current Next.js app | — |
| 2. Collections | Phase 1 | Payload + PostgreSQL work |
| 3. Read Integration | Phase 2 | schema + seed stable |
| 4. Join Backend | Phase 2 | ClubMembers stable |
| 5. RSVP Backend | Phase 2 + core Event reads | Events/Registrations stable |
| 6. Admin/RBAC | Phases 2–5 | real workflows exist |
| Release | all above | permission + E2E tests pass |

# 14. Explicit Scope for v1

## Included
Payload CMS, PostgreSQL, admin auth, Events CMS, Media, Partners CMS, Join applications, membership approval, RSVP, capacity, waitlist, attendance via registration status, RBAC, migrations, seed data, production persistence, validation/security.

## Deferred
Member authentication, member dashboard, QR attendance, automated waitlist notifications, email campaigns, Strava API, leaderboards, rewards, merchandise, advanced analytics, complex pace-group management, mobile app.

# 15. Final Product Principle

The backend is successful when it is invisible to normal visitors and operationally simple for club leadership.

Students should experience reliable events, simple registration, clear confirmation and simple membership application.

The president should experience one admin panel, no code edits, no manual database work, clear member/event/registration status and predictable operations.

The engineering team should experience one source of truth, explicit business rules, minimal duplicated state, safe migrations, testable workflows and clear boundaries between UI, domain logic and persistence.
