# Implementation Plan: ÖzÜ Running Club

> **Core Objective**: Deliver a production-ready, mobile-first web application for Özyeğin University's Running Club, translating On.com's high-performance editorial aesthetic into an authentic running community hub.

---

## 1. Technical Stack & Architecture

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server Components for instant LCP, SEO, native metadata, dynamic routing |
| **Language** | TypeScript (Strict Mode) | Strict typing across Payload models, API contracts, and component props |
| **Styling** | Tailwind CSS + Custom CSS Variables | Fluid clamp tokens, typography scales, zero-runtime utility performance |
| **Kinetic Motion** | Motion (`motion/react` / Framer Motion) | Spring-physics transitions, layout animations, touch drag gestures |
| **CMS & Data** | Payload CMS 3.x + SQLite (dev) / PostgreSQL (prod) | Native App Router embedding, zero-latency Local API, clean `/admin` panel |
| **Media Storage** | Cloudflare R2 / AWS S3 / Local Media Engine | High-resolution photography, GPX route files, partner vector logos |
| **Calendar Engine** | Custom `.ics` / Google Calendar Link Generator | 1-click calendar sync for students upon RSVP |
| **Icons** | Lucide React | Clean, athletic geometric iconography matching On.com utility icons |

---

## 2. Directory & Module Structure

```
├── docs/
│   ├── on-reference-audit.md       # Deconstructed On.com analysis
│   ├── design-system.md           # Tokens, typography, layout, components
│   └── implementation-plan.md     # This architectural blueprint
├── reference/                     # Read-only reference assets (untouched)
├── src/
│   ├── app/
│   │   ├── (site)/                # Public Website Route Group
│   │   │   ├── layout.tsx         # Global layout (Header, BottomBar, Footer)
│   │   │   ├── page.tsx           # Home: Hero, Pace Streams, Carousel, Recaps
│   │   │   ├── events/
│   │   │   │   ├── page.tsx       # Events Hub (Upcoming & Past filter)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Event Details, Route Map, RSVP Form
│   │   │   ├── join/
│   │   │   │   └── page.tsx       # "Join the Club" Multi-step Form
│   │   │   ├── recaps/
│   │   │   │   └── page.tsx       # Gallery & Results
│   │   │   ├── about/
│   │   │   │   └── page.tsx       # Philosophy, Pacers, FAQ
│   │   │   ├── partners/
│   │   │   │   └── page.tsx       # Runaway Zone & Sponsor perks
│   │   │   └── api/
│   │   │       ├── rsvp/route.ts  # Event RSVP handler
│   │   │       ├── join/route.ts  # Membership application handler
│   │   │       └── calendar/      # .ics dynamic export
│   │   ├── (payload)/             # Payload CMS Native Route Group
│   │   │   ├── admin/[[...segments]]/page.tsx
│   │   │   └── api/[[...segments]]/route.ts
│   │   ├── globals.css            # Design tokens & fluid typography
│   │   └── layout.tsx             # Root HTML & Fonts
│   ├── collections/               # Payload CMS Collections
│   │   ├── Events.ts
│   │   ├── EventRegistrations.ts
│   │   ├── ClubMembers.ts
│   │   ├── Recaps.ts
│   │   ├── Partners.ts
│   │   └── Media.ts
│   ├── components/
│   │   ├── ui/                    # Base atoms (Button, Badge, Input, Modal)
│   │   ├── layout/                # DesktopNav, MobileBottomBar, MobileDrawer, Footer
│   │   ├── home/                  # HeroSection, PaceStreamsGrid, DisciplineSplit, UpcomingCarousel
│   │   ├── events/                # EventCard, TelemetryBadge, RSVPModal, RouteMapPreview
│   │   └── forms/                 # JoinClubForm, QuickRSVPForm
│   ├── payload.config.ts          # Payload CMS configuration
│   └── lib/                       # Utilities, seed data, mock runners
```

---

## 3. Data Schema & Collections Specification

### 3.1. `Events` Collection
- `title`: Text (e.g. *"Sunrise Çekmeköy Campus Loop"*)
- `slug`: Text (unique, generated from title)
- `eventType`: Select (`campus_social`, `tempo_track`, `long_run`, `competition_race`, `recovery_session`)
- `status`: Select (`upcoming`, `open_rsvp`, `completed`, `cancelled`)
- `date`: DateTime (event start time)
- `meetingPoint`: Text (e.g. *"ÖzÜ Athletic Center Steps"*)
- `googleMapsUrl`: Text
- `distanceKm`: Number (e.g. `8.5`)
- `elevationGain`: Number (e.g. `140`)
- `estimatedPace`: Text (e.g. `5:30 - 6:00 /km`)
- `maxParticipants`: Number (e.g. `40`)
- `registeredCount`: Number (computed / tracked)
- `coverImage`: Upload (Media)
- `description`: RichText / Markdown
- `paceGroups`: Array of `{ name: string, pacer: string, targetPace: string }`

### 3.2. `EventRegistrations` Collection
- `event`: Relationship -> `Events`
- `fullName`: Text
- `email`: Email
- `studentId`: Text
- `phone`: Text
- `paceGroup`: Text
- `emergencyContact`: Text
- `status`: Select (`confirmed`, `waitlist`, `cancelled`)
- `createdAt`: DateTime

### 3.3. `ClubMembers` Collection
- `fullName`: Text
- `email`: Email
- `department`: Text
- `runnerRole`: Select (`student`, `alumni`, `faculty`, `guest`)
- `fitnessLevel`: Select (`beginner_0_to_5k`, `intermediate_5_to_15k`, `half_marathon_plus`)
- `motivation`: Text

### 3.4. `Recaps` Collection
- `event`: Relationship -> `Events`
- `title`: Text
- `totalRunners`: Number
- `totalDistanceKm`: Number
- `highlightPhotos`: Array of Uploads (Media)
- `stravaActivityUrl`: Text

### 3.5. `Partners` Collection
- `name`: Text (e.g. *"Runaway Zone"*, *"ÖzÜ Sports Directorate"*)
- `tier`: Select (`title_partner`, `gear_sponsor`, `hydration`, `university`)
- `logo`: Upload (Media)
- `websiteUrl`: Text
- `perkSummary`: Text (e.g. *"20% student discount on running gear"*)

---

## 4. Execution Phases

```
┌─────────────────────────────────────────────────────────────┐
│ EXPLORE (Done)                                              │
│ - Live Browser Audit of On.com (Desktop & Mobile)           │
│ - CSS & Asset Inspection in reference/                      │
│ - Design System & Translation Strategy Defined              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ PLAN (Current)                                              │
│ - docs/on-reference-audit.md                                │
│ - docs/design-system.md                                     │
│ - docs/implementation-plan.md                               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ IMPLEMENT (Step-by-Step Milestones)                         │
│                                                             │
│ Milestone 1: App Setup & Styling Architecture               │
│ - Next.js 15, TypeScript, Tailwind, Design Tokens           │
│ - Font configuration, Global CSS, Layout wrappers           │
│                                                             │
│ Milestone 2: Core Components & Mobile-First Navigation      │
│ - Sticky Desktop Header + Ergonomic Mobile Bottom Bar       │
│ - Fullscreen Mobile Menu Drawer                             │
│ - Pill Buttons, Telemetry Badges, Progress Bars             │
│ - Responsive Horizontal Touch Carousel with peek & snap     │
│                                                             │
│ Milestone 3: Homepage with On-Inspired Editorial Narrative  │
│ - Cinematic Hero + Live Next Run Ticker                     │
│ - 3-Column Running Streams (Pace Groups)                    │
│ - Interactive Discipline Split List                         │
│ - Upcoming Runs Swiper Carousel                             │
│ - Community Stories & Recent Recaps Gallery                 │
│ - Partners Grid (Runaway Zone) & Join CTA                   │
│                                                             │
│ Milestone 4: Event Engine & RSVP Experience                 │
│ - Events Hub (`/events`), Details (`/events/[slug]`)        │
│ - Interactive RSVP Modal with Instant Confirmation          │
│ - Add to Google Calendar / Download .ics                    │
│                                                             │
│ Milestone 5: Club Membership & Community Pages              │
│ - Multi-step Join Form (`/join`) with Runner Profile        │
│ - Recaps Hub (`/recaps`), About & Pacers (`/about`)         │
│ - Partners page (`/partners`)                               │
│                                                             │
│ Milestone 6: Payload CMS Integration & Seed Data            │
│ - Payload CMS 3.x setup in Next.js App Router               │
│ - Realistic seed data for ÖzÜ Çekmeköy campus runs          │
│ - Working Admin Portal (`/admin`)                           │
│                                                             │
│ Milestone 7: Optimization, Accessibility & Verification     │
│ - Mobile viewport testing (390px, 768px, 1440px)            │
│ - Typecheck (`tsc --noEmit`), Build (`next build`)          │
│ - Accessibility (ARIA, keyboard nav, contrast)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Quality & Compliance Standards

- **Mobile-First Priority**: Everything designed and verified first at `390px` width before expanding to tablet and desktop.
- **Zero AI-Slop**: No gratuitous glassmorphism, no rainbow gradients, no template cards.
- **Performance**: High-efficiency CSS, Next.js `<Image>` optimization, deferred offscreen swipers.
- **Accessibility**: Strict WCAG 2.1 AA color contrast, explicit keyboard focus rings, screen reader landmarks.
