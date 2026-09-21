# ÖzÜ Running Club — Editorial & Hierarchy Polish v0.3: Baseline & Visual Audit Report

**Document Role:** Implementation & Audit Report  
**Date:** September 11, 2026  
**Status:** Audit Completed; Phases 1–6 Implemented & Merged into `main` (`dc864a6`)  
**Specification Reference:** [editorial-hierarchy-polish-v0.3.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/editorial-hierarchy-polish-v0.3.md)  
**Current Project State:** [PROJECT_STATUS.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/PROJECT_STATUS.md)  
**Target URL:** `http://localhost:3000/`  

---

## 1. Executive Summary

This audit establishes the empirical baseline for the **v0.3 Editorial & Hierarchy Polish**. The primary objective is to transition the ÖzÜ Running Club website from a **component-based sports template / dashboard** into an **editorial running-culture publication and community platform** without changing routes, data models, brand palette, or core libraries.

### Current State
- The v0.2 brand identity (*Deep Navy, Plum, Burgundy, Crimson*, slogan `WE MOVE TOGETHER.`) is active and clean.
- However, the user experience suffers from **mechanical uniformity**:
  - Zebra-striped section cadence (`white` $\rightarrow$ `canvas-subtle + border-y` $\rightarrow$ `white`).
  - Ubiquitous `rounded-2xl` card containers with identical borders and drop shadows.
  - Over-indexing on `font-mono` (over 45 instances, including marketing copy and buttons).
  - Upcoming Runs cards exposing 11+ database fields per card.
  - Partners section visually mimicking SaaS pricing tier cards.
  - Recent Recaps duplicating the layout and telemetry grid of Upcoming Runs.
  - Hero bottom cluttered with stacked horizontal UI layers (Next Run badge, CTA row, telemetry bar, ticker).

---

## 2. Baseline Visual Inventory Across Breakpoints

The local application (`http://localhost:3000`) was thoroughly audited and photographed across three standard responsive breakpoints.

### Summary of Captured Evidence

| Viewport | Dimensions | Sections Audited | Key Visual Findings |
| :--- | :--- | :--- | :--- |
| **Desktop** | `1440 × 900 px` | Header, Hero, Ticker, Streams, Disciplines, Upcoming, Story, Recaps, Partners, CTA, Footer | Strong brand palette; excessive horizontal layering at base of Hero; Upcoming Runs feels like a data table; Partners section looks like SaaS pricing cards; mechanical section padding. |
| **Tablet** | `768 × 1024 px` | All sections + bottom touch navigation bar | Disciplines layout stacks vertically; Streams and Upcoming Runs adapt into swipe carousels with progress bars; bottom bar (`Runs`, `Next Run`, `+ Join`, `Menu`) activates. |
| **Mobile** | `390 × 844 px` | MobileTopBar, Hero, Swipers, Menu Drawer, MobileBottomBar | Hero height takes ~92vh with dense stacked buttons; event cards have 440px+ height; swipe peek (`w-[82vw]`) functions cleanly; full-screen drawer menu provides clear touch navigation. |

### Baseline Screenshot Archive
All baseline screenshots were recorded and cataloged in the audit workspace:
- **Desktop (1440px):**
  - `desktop_hero_top_1789143447567.png`
  - `desktop_running_streams_1789143477046.png`
  - `desktop_disciplines_1789143488307.png`
  - `desktop_upcoming_runs_1789143496871.png`
  - `desktop_upcoming_cards_1789143509184.png`
  - `desktop_runner_story_recaps_1789143521173.png`
  - `desktop_recaps_partners_1789143536463.png`
  - `desktop_partners_cta_1789143566167.png`
  - `desktop_footer_1789143581461.png`
  - `desktop_footer_bottom_1789143597259.png`
  - `desktop_footer_copyright_1789143615458.png`
- **Tablet (768px):**
  - `tablet_hero_1789143679096.png`
  - `tablet_streams_disciplines_1789143700298.png`
  - `tablet_disciplines_1789143720654.png`
  - `tablet_upcoming_runs_1789143738514.png`
  - `tablet_runner_story_1789143769799.png`
  - `tablet_recaps_partners_1789143802050.png`
  - `tablet_recaps_partners_cards_1789143834389.png`
  - `tablet_footer_1789143867828.png`
- **Mobile (390px):**
  - `mobile_top_hero_1789143980340.png`
  - `mobile_hero_1789143945250.png`
  - `mobile_streams_1789144009739.png`
  - `mobile_menu_open_1789144041505.png`
  - `mobile_disciplines_1789144091065.png`
  - `mobile_upcoming_runs_1789144122619.png`
  - `mobile_event_card_1789144152247.png`
  - `mobile_runner_story_1789144183642.png`
  - `mobile_recaps_partners_1789144214077.png`
  - `mobile_footer_1789144246955.png`
  - `mobile_bottom_footer_1789144280383.png`

---

## 3. Code-Level Component Diagnostics

### 3.1. Repetitive Card Container Patterns (`rounded-2xl` & Nested Panels)

Every single homepage section wraps content into identical `rounded-2xl` cards with heavy borders and nested pill elements:

```text
[Section]
  └─ rounded-2xl (Card Container)
       ├─ rounded-full / rounded-sm (Badges & Chips)
       └─ rounded-xl (Nested Telemetry Container)
```

**Specific Line Audits:**
- `src/components/events/EventCard.tsx:25`: `rounded-2xl bg-club-deepNavy border border-club-navy/60 hover:shadow-xl`
  - Line 45: `rounded-full` spots pill
  - Line 75: nested `rounded-xl border border-white/15` telemetry container
- `src/components/home/RecapsGrid.tsx:36`: `rounded-2xl overflow-hidden bg-club-deepNavy border border-club-navy/60`
  - Line 52: `rounded-full` date badge
  - Line 75: nested `rounded-xl border border-white/15` telemetry grid
- `src/components/home/PaceStreamsGrid.tsx:89`: `rounded-2xl overflow-hidden bg-club-deepNavy border border-neutral-200/80`
  - Line 105: `rounded-md` telemetry pill
- `src/components/home/DisciplineSplit.tsx:41`: `rounded-2xl` on every button in the vertical navigation list
  - Line 89: `rounded-2xl overflow-hidden bg-club-deepNavy border border-neutral-800` on the right preview card
  - Line 125: nested `rounded-xl border border-white/10` telemetry box
- `src/components/home/PartnersSection.tsx:29`: `rounded-2xl p-6 sm:p-8 flex flex-col justify-between border`
- `src/components/home/RunnerStories.tsx:13`: `rounded-2xl overflow-hidden shadow-lg border border-neutral-200`

**Recommendation for v0.3:**
Reduce heavy border radii. Transition toward sharper, editorial media framing, letting typography, negative space, and image compositions establish separation rather than nested rounded boxes.

---

### 3.2. Monospaced Typography Overuse (`font-mono`)

Monospace type is currently applied indiscriminately across 45+ locations, eroding its technical value and giving the site a developer/dashboard aesthetic.

**Misused `font-mono` Examples:**
- `Badge.tsx:30`: Base badge component forces `font-mono uppercase font-semibold tracking-telemetry` on **all badges**.
- `UpcomingRunsCarousel.tsx:35` & `RecapsGrid.tsx:14` & `PartnersSection.tsx:11`: Section index labels (`03 • Schedule & RSVP`, `04 • Past Sessions`, `05 • Ecosystem`).
- `UpcomingRunsCarousel.tsx:46` & `RecapsGrid.tsx:24`: Action text links (`View All (4)`, `Explore All Recaps`).
- `JoinCtaBanner.tsx:28`: Marketing checkmarks (`100% Free For Students`, `All Fitness Levels`, `20% Gear Discount`) are set in `font-mono`.
- `MobileTopBar.tsx:37`: `Join Club` button text is styled in `font-mono`.
- `ClubLogo.tsx:92`: "Running Club" subtitle is styled in `font-mono`.

**Target Usage for v0.3:**
- **Strictly retain `font-mono` for factual running telemetry:** Pace (`5:45 /km`), Distance (`10.0 KM`), Splits (`1:48:12`), Elevation (`+85M`), and Technical timestamps.
- **Convert to clean, modern Sans-serif:** Navigation labels, CTA buttons, marketing bullet points, partner tags, and general editorial captions.

---

### 3.3. Upcoming Runs vs. Recaps Structural Duplication

The code reveals that `EventCard.tsx` and `RecapsGrid.tsx` share virtually the same structural pattern:

```tsx
// EventCard.tsx (Lines 75-94)
<div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-club-deepNavy/80 backdrop-blur-md rounded-xl border border-white/15 text-center font-mono">
  <div><span>DIST</span><span>{event.distanceKm} KM</span></div>
  <div><span>PACE</span><span>{event.targetPace}</span></div>
  <div><span>ELEV</span><span>+{event.elevationGainM}M</span></div>
</div>

// RecapsGrid.tsx (Lines 75-91)
<div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-club-deepNavy/80 backdrop-blur-md rounded-xl border border-white/15 text-center font-mono text-xs mt-1">
  <div><span>RUNNERS</span><span>{recap.totalRunners}</span></div>
  <div><span>TOTAL KM</span><span>{recap.totalKm} KM</span></div>
  <div><span>AVG PACE</span><span>{recap.avgPace}</span></div>
</div>
```

**Problem:** Both sections look like clones despite serving opposite user journeys:
- **Upcoming Runs:** Action-oriented conversion (*"I want to RSVP and run"*).
- **Recent Recaps:** Narrative and community proof (*"Look what happened, see the crew, feel the culture"*).

---

### 3.4. Partners & Sponsors: SaaS Pricing Card Syndrome

`PartnersSection.tsx` currently renders a 3-column equal-width grid with:
1. Top tier badge (`OFFICIAL RUNNING PARTNER`, `NUTRITION PARTNER`).
2. Top-right arrow in a circular button.
3. Bold uppercase headline.
4. Perk description.
5. Bottom divider with discount tag badge (`CODE: OZU20`) or affiliate shield + "Visit Partner" text link.

This directly evokes a SaaS pricing table (`Basic / Pro / Enterprise`). It lacks club personality and fails to convey that Runaway Zone is the core community running partner while ÖzÜ Athletics is an institutional university body.

---

### 3.5. Mechanical Cadence & Zebra-Striping

The root homepage layout (`src/app/page.tsx`) shows strict mechanical padding and alternating backgrounds:

| Component | Background | Border | Padding |
| :--- | :--- | :--- | :--- |
| `PaceStreamsGrid` | `bg-white` | none | `py-16 sm:py-24` |
| `DisciplineSplit` | `bg-canvas-subtle` | `border-y border-neutral-200` | `py-16 sm:py-24` |
| `UpcomingRunsCarousel` | `bg-white` | none | `py-16 sm:py-24` |
| `RunnerStories` | `bg-canvas-subtle` | `border-y border-neutral-200` | `py-16 sm:py-24` |
| `RecapsGrid` | `bg-white` | none | `py-16 sm:py-24` |
| `PartnersSection` | `bg-canvas-subtle` | `border-y border-neutral-200` | `py-16 sm:py-24` |

This exact alternation (`white` $\rightarrow$ `grey + border` $\rightarrow$ `white` $\rightarrow$ `grey + border`) produces an unvarying rhythm that flattens visual interest.

---

### 3.6. Hero Bottom Stacking & Header Brand Lockup

1. **Hero Stacking:** In `HeroSection.tsx` and `page.tsx`, the bottom 40% of the viewport stacks:
   - Next Run Live Pill Badge (Lines 34-45)
   - Primary and secondary CTAs (Lines 61-78)
   - Bottom Telemetry Bar with 3 metrics and bounce arrow (Lines 81-107)
   - Full-bleed animated Ticker marquee immediately below (Ticker.tsx)
   
   *Result:* The user is presented with multiple competing information strips before leaving the fold.
2. **Brand Lockup:** `DesktopHeader.tsx` and `MobileTopBar.tsx` display the circular emblem with text `ÖZÜ RC` on top of `RUNNING CLUB`. This duplicates "RC" and "Running Club" in a compact space.

---

## 4. Phase-by-Phase Implementation Roadmap

With Phase 0 complete and baseline metrics locked, execution follows the sequential order specified in the design plan:

```text
[Phase 0: Baseline & Audit] ✅ COMPLETE
       │
       ▼
[Phase 1: Hero Hierarchy Cleanup] (P1)
       │
       ▼
[Phase 2: Upcoming Runs Simplification] (P0 - Highest Priority)
       │
       ▼
[Phase 3: Partners & Sponsors Redesign] (P0)
       │
       ▼
[Phase 4: Card Language Reduction] (P1)
       │
       ▼
[Phase 5: Recaps as Editorial Stories] (P1)
       │
       ▼
[Phase 6: Section Rhythm & Composition] (P1)
       │
       ▼
[Phase 7: Typography & Mono Cleanup] (P2)
       │
       ▼
[Phase 8: Header / Brand Lockup Refinement] (P2)
       │
       ▼
[Phase 9: Restrained Motion Polish] (P2)
       │
       ▼
[Phase 10: Mobile-First Refinement] (P0 before release)
       │
       ▼
[Phase 11: Accessibility & Performance QA] (P0)
       │
       ▼
[Phase 12: Final Browser QA & Comparison]
```

---

## 5. Acceptance Verification for Phase 0

- [x] Dedicated branch `refactor/editorial-polish-v03` created and checked out.
- [x] Next.js dev server operational on port 3000 (HTTP 200).
- [x] Baseline screenshots recorded across Desktop (1440px), Tablet (768px), and Mobile (390px).
- [x] Zero regressions or accidental code changes introduced into `src/`.
- [x] TypeScript validation passing cleanly (`npm run type-check`).
- [x] Detailed audit findings recorded in `docs/editorial-polish-v03.md`.
