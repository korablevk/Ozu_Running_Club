# ÖzÜ Running Club — Editorial & Hierarchy Polish v0.3

**Document Role:** Implementation Specification (Design & Architecture)  
**Status:** Implemented & Merged into `main` (`dc864a6`)  
**Companion Report:** [editorial-polish-v03.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/editorial-polish-v03.md) (Baseline Audit & Implementation Report)  
**Current Project State:** [PROJECT_STATUS.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/PROJECT_STATUS.md)  
**Project:** ÖzÜ Running Club Website  
**Primary goal:** Move the current website from a polished component-based sports template toward a more editorial, premium, running-culture experience without changing the existing product scope, demo content, routes, data, or brand palette.

---

## 1. Context

The v0.2 brand refactor successfully aligned the website with the current ÖzÜ Running Club visual identity:

- Club Navy / Plum / Burgundy / Crimson palette
- `WE MOVE TOGETHER.` as the primary hero slogan
- current club logo integrated into the interface
- removal of Volt / neon fitness-tech styling
- restrained use of the club gradient
- improved visual consistency across the public website

The next design problem is no longer color.

The current website is visually coherent, but too many sections still follow the same component pattern:

`section label → heading → whitespace → cards → whitespace → next section`

The objective of v0.3 is to improve:

- editorial rhythm
- hierarchy
- section differentiation
- emotional impact
- visual storytelling
- premium perception
- conversion toward the next run

The site should feel less like a UI component library and more like a modern running-culture publication/community platform.

---

# 2. Core Design Principle

## Current impression

**Component-based sports website**

The interface is clean, but too many sections rely on:

- rounded cards
- badges
- telemetry blocks
- repeated metadata patterns
- repeated mono labels
- similar section spacing
- similar card composition
- similar image overlays

## Target impression

**Editorial running-culture website**

The site should rely more on:

- photography
- typography
- composition
- intentional whitespace
- varied section rhythm
- selective use of UI chrome
- storytelling
- clear event conversion paths

The objective is not to make every section unique.

The objective is to create enough contrast between major sections that the page feels intentionally art-directed.

---

# 3. Non-Goals / Constraints

The following MUST NOT change during this refactor unless explicitly approved later:

- current brand palette
- current logo assets
- demo event data
- demo statistics
- demo runner stories
- current stock photographs
- routes
- backend architecture
- future CMS architecture
- event registration functionality
- event data model
- page information architecture
- existing Next.js / React / TypeScript stack
- current Tailwind setup
- current Motion dependency

Do not:

- redesign the website from zero
- introduce GSAP or other animation libraries
- add new UI libraries
- rewrite working components unnecessarily
- change copy simply for visual reasons
- create new fake data
- add decorative gradients beyond the existing brand strategy
- increase the number of badges, pills, cards, shadows, or effects

---

# 4. Technical Guardrails

The current codebase already has a usable component architecture.

Preserve the current separation between:

- `src/app`
- `src/components/home`
- `src/components/events`
- `src/components/layout`
- `src/components/ui`
- `src/lib`

Prefer targeted refactors inside existing components.

New shared components are allowed only if they clearly remove duplication or improve maintainability.

Use existing Motion support for interaction polish. Do not add another motion library.

All changes must remain:

- responsive
- keyboard accessible
- screen-reader compatible
- SEO-safe
- performant
- mobile-first
- type-safe

---

# 5. Phase 0 — Baseline, Branch & Visual Audit

## Objective

Create a safe implementation baseline before changing layout or hierarchy.

## Tasks

1. Create and switch to:

```bash
git checkout -b refactor/editorial-polish-v03
```

2. Start the current site locally.

3. Capture baseline screenshots at:

- Desktop: `1440px`
- Tablet: approximately `768px`
- Mobile: `390px`

4. Capture at minimum:

- Hero
- Running Streams
- Disciplines & Focus
- Upcoming Runs
- Runner Story
- Recent Recaps
- Partners & Sponsors
- Join CTA
- Footer

5. Inspect the current implementation and record:

- repeated card patterns
- repeated border radii
- excessive mono typography
- excessive metadata
- repeated section padding
- duplicated UI language
- visual hierarchy problems
- mobile density issues

6. Store the audit in:

`docs/editorial-polish-v03.md`

## Acceptance Criteria

- No visual changes yet
- Baseline screenshots captured
- Affected components identified
- Current responsive behavior documented
- No code regressions introduced

---

# 6. Phase 1 — Hero Hierarchy Cleanup

## Priority

**P1**

The hero is already one of the strongest sections. This phase should refine it, not redesign it.

## Current Issues

The bottom of the hero currently stacks too many horizontal information layers:

- next-run badge
- hero content
- telemetry bar
- ticker

This makes the first screen more informational than necessary.

## Target

The hero should communicate in this order:

1. `WE MOVE TOGETHER.`
2. ÖzÜ Running Club identity
3. short supporting copy
4. primary CTA
5. next-run information
6. secondary statistics only if they still support the composition

## Tasks

Primary files:

- `src/components/home/HeroSection.tsx`
- `src/components/ui/Ticker.tsx`

Refactor so that:

- `WE MOVE TOGETHER.` remains dominant
- hero photography remains dominant
- Next Run remains visible
- CTA remains immediately discoverable
- telemetry and ticker no longer compete with each other

Preferred direction:

- keep the telemetry bar OR significantly simplify it
- reduce simultaneous text density
- treat ticker as a transition into the next section rather than part of the hero itself
- preserve brand tint and current brand palette
- avoid adding new effects

## Acceptance Criteria

- First screen feels simpler
- Hero headline is clearly dominant
- CTA is visible without competing UI
- No loss of useful Next Run information
- Mobile hero is not taller because of stacked UI
- No horizontal overflow

---

# 7. Phase 2 — Upcoming Runs Simplification

## Priority

**P0 — highest priority**

This is the most important design refactor in v0.3.

## Current Problem

Upcoming event cards expose too much structured information on the homepage:

- event type badge
- remaining spots
- date/time
- title
- description
- location
- distance
- pace
- elevation
- RSVP
- details

This makes events feel like dashboard entities rather than experiences.

## Product Goal

The homepage should make a visitor think:

**“I want to go to this run.”**

Not:

**“I understand every field in this event record.”**

## Target Information Hierarchy

Each homepage card should prioritize:

1. photograph
2. date / event identity
3. event title
4. essential location / time
5. primary RSVP action

Secondary metrics should move to the Event Detail page.

Suggested visual hierarchy:

```text
[IMAGE]

SEP 19
CADDEBOSTAN

10K SOCIAL RUN

08:30 · Caddebostan

RSVP →
```

## Tasks

Primary files:

- `src/components/home/UpcomingRunsCarousel.tsx`
- `src/components/events/EventCard.tsx`

Refactor homepage event presentation:

- reduce visible metadata
- remove unnecessary telemetry grid from homepage cards
- retain data internally; do not delete data model fields
- simplify card footer
- make image and title visually dominant
- keep RSVP obvious
- make `Details` secondary or convert the full card into the detail link
- preserve carousel behavior
- preserve event registration functionality
- preserve mobile swipe behavior

Do not remove telemetry from Event Detail pages unless separately requested.

## Acceptance Criteria

- Homepage events are visually simpler
- At least ~65–70% of event-card emphasis is image/title/emotion
- RSVP remains obvious
- Core event information remains understandable
- Full detail data remains accessible from event pages
- No event data is deleted
- Mobile cards remain comfortably readable

---

# 8. Phase 3 — Partners & Sponsors Redesign

## Priority

**P0**

## Current Problem

The Partners section currently resembles:

- pricing cards
- SaaS plan cards
- enterprise feature cards

That visual language weakens the lifestyle / running identity.

## Target

Sponsors should feel like part of the club ecosystem, not software subscriptions.

The hierarchy should distinguish:

- primary / featured partner
- supporting partners
- university / institutional support

## Preferred Direction

Example:

```text
SUPPORTED BY

RUNAWAY ZONE
Official Running Partner

[featured partner treatment]

ÖZÜ ATHLETICS       ÇEKMEKÖY TRAIL
```

Possible layout:

- one featured partner with larger visual weight
- secondary partners as simpler logo/name rows or compact blocks
- fewer borders
- less card chrome
- more whitespace
- strong hierarchy rather than equal boxes

## Tasks

Primary files:

- `src/components/home/PartnersSection.tsx`
- `src/app/partners/page.tsx` only if shared design consistency requires it

Refactor:

- remove equal pricing-card appearance
- reduce unnecessary borders and icon containers
- establish primary vs secondary hierarchy
- retain all current demo partner content
- keep external links functional
- preserve responsive stacking

## Acceptance Criteria

- Section no longer resembles SaaS pricing
- Main partner has obvious hierarchy
- Secondary partners remain readable
- Visual language matches editorial/lifestyle direction
- No demo sponsor information is removed

---

# 9. Phase 4 — Card Language Reduction

## Priority

**P1**

## Objective

Reduce the feeling that every piece of content must live inside a rounded card.

## Components to Review

- `PaceStreamsGrid.tsx`
- `DisciplineSplit.tsx`
- `UpcomingRunsCarousel.tsx`
- `RunnerStories.tsx`
- `RecapsGrid.tsx`
- `PartnersSection.tsx`
- event cards
- CTA containers

## Review Questions

For each block:

- Does this need a visible border?
- Does this need a shadow?
- Does this need rounded corners?
- Does this need a badge?
- Does this need an overlay container?
- Could typography and spacing create the hierarchy instead?

## Direction

Do not flatten every component.

Instead:

- keep cards where they communicate interaction
- reduce excessive rounding
- use sharper editorial media blocks where appropriate
- remove purely decorative shadows
- avoid nesting rounded panels inside rounded cards
- preserve visual clarity

## Running Streams

Keep the three-item concept but reduce template repetition.

Possible refinements:

- slightly reduce border radius
- vary crop / composition
- reduce unnecessary metadata styling
- use image + type as the dominant visual language

## Disciplines

Keep overall structure.

This section is already strong.

Only simplify small nested UI surfaces if necessary.

## Acceptance Criteria

- Fewer repeated card patterns
- Fewer nested rounded elements
- Interactivity remains obvious
- No reduction in accessibility
- Site feels more editorial without feeling unfinished

---

# 10. Phase 5 — Recaps as Editorial Stories

## Priority

**P1**

## Current Problem

Recent Recaps visually resembles Upcoming Runs too closely.

But their product purpose is different:

**Upcoming Runs:** make me attend  
**Recaps:** show me what I missed / make me want to join the next one

## Target

Recaps should feel closer to:

- magazine stories
- club reportage
- event memories
- visual documentation

Less like event registration cards.

## Tasks

Primary file:

- `src/components/home/RecapsGrid.tsx`

Refactor:

- reduce telemetry-heavy appearance
- increase emphasis on event photography
- separate date/title/statistics hierarchy
- retain runner count / total distance / average pace if useful
- avoid using exactly the same structure as Upcoming Runs
- preserve links to recap pages

Possible direction:

```text
AUG 28

CADDEBOSTAN 10K
SOCIAL RUN

54 RUNNERS · 540 KM

[PHOTO]
```

or an image-led editorial layout.

## Acceptance Criteria

- Recaps clearly feel different from upcoming events
- Photo/story is dominant
- Stats support the story rather than dominate it
- Links remain obvious

---

# 11. Phase 6 — Section Rhythm & Composition

## Priority

**P1**

## Current Problem

The homepage currently has a predictable cadence:

`label → heading → cards → large gap`

repeated across many sections.

## Target

Introduce intentional variation without changing information architecture.

Possible rhythm:

1. cinematic Hero
2. compact transition / ticker
3. visual Running Streams
4. asymmetric interactive Disciplines
5. compact Upcoming Runs carousel
6. editorial Runner Story
7. image-led Recaps
8. restrained Partners
9. full-width gradient Join CTA
10. Footer

## Tasks

Review section-level:

- `padding-top`
- `padding-bottom`
- container width
- full-width vs contained media
- heading alignment
- image width
- text width
- section background

Do not randomly vary every section.

Use 2–3 spacing levels such as:

- compact
- standard
- major transition

Reduce unnecessary large blank zones.

Keep large whitespace only around major editorial transitions.

## Acceptance Criteria

- Scroll feels more dynamic
- Sections remain coherent
- No random spacing
- Important transitions receive more breathing room
- Utility sections are more compact

---

# 12. Phase 7 — Typography & Mono Usage

## Priority

**P2**

## Current Strength

The system of:

- bold geometric display type
- clean body sans
- mono telemetry

is strong.

## Current Problem

Mono typography appears too frequently and starts to create a dashboard / technical-product aesthetic.

## Target

Reserve mono primarily for factual running information:

- pace
- distance
- dates
- times
- section numbering
- small technical metadata

Use normal sans-serif for:

- navigation
- partner labels where technical styling is unnecessary
- descriptive labels
- community messaging
- general CTAs

## Tasks

Audit all `font-mono` usage.

Do not eliminate mono.

Reduce decorative usage by approximately 20–30% where visually appropriate.

## Acceptance Criteria

- Running metrics retain technical character
- General content feels warmer and more editorial
- Typography hierarchy remains consistent

---

# 13. Phase 8 — Header / Brand Lockup Refinement

## Priority

**P2**

## Current Problem

The current header combines:

- circular club logo
- `ÖZÜ RC`
- `RUNNING CLUB`

This creates some redundant branding.

## Objective

Simplify the brand lockup without losing recognition.

## Options to Test

### Option A

```text
[logo] ÖZÜ RUNNING CLUB
```

### Option B

```text
[logo] ÖZÜ RC
```

Do not create a new logo mark.

Use the existing club asset.

## Tasks

Files:

- `src/components/layout/DesktopHeader.tsx`
- `src/components/layout/MobileTopBar.tsx`
- potentially reusable `ClubLogo` component

Evaluate:

- desktop width
- mobile legibility
- alignment with navigation
- visual balance with Join button

## Acceptance Criteria

- Brand is easier to scan
- Header has less visual noise
- Logo remains readable
- Desktop nav still fits cleanly at intended breakpoints

---

# 14. Phase 9 — Restrained Motion Polish

## Priority

**P2**

## Principle

Motion should express running, momentum, and responsiveness.

It must not become a showcase.

Use existing Motion / CSS only.

## Candidate Interactions

### Discipline switching

Suggested behavior:

- opacity `0 → 1`
- translateY `8px → 0`
- optional scale `1.01 → 1`
- duration `350–450ms`

### Image hover

Subtle image scale only:

- approximately `1 → 1.02/1.03`
- avoid dramatic zoom

### Carousel

Keep native/smooth interaction.

Do not add heavy scroll hijacking.

### Section reveal

Only if needed:

- restrained opacity / translate reveal
- no stagger on every text line
- honor `prefers-reduced-motion`

## Acceptance Criteria

- Motion improves perceived quality
- No animation blocks interaction
- No large layout shifts
- Reduced-motion users retain full usability
- Mobile performance remains smooth

---

# 15. Phase 10 — Mobile-First Refinement

## Priority

**P0 before release**

Desktop polish is not enough.

Inspect all refactored sections at:

- 390px
- approximately 430px
- approximately 768px

## Specific Checks

### Hero

- crop
- headline line breaks
- CTA width
- next-run visibility
- total first-screen height

### Running Streams

- swipe affordance
- card peek
- text density

### Disciplines

- interaction model without mouse hover
- active state
- image height

### Upcoming Runs

- simplified card information
- thumb reach
- RSVP tap target
- carousel behavior

### Partners

- stacking
- partner hierarchy

### Join CTA

- readable gradient
- button hierarchy

### Footer

- avoid excessive scroll length
- simplify columns if necessary

## Acceptance Criteria

- No horizontal overflow
- minimum comfortable touch targets
- no tiny metadata
- headings do not create awkward orphan lines
- cards do not become excessively tall
- interactions do not depend on hover

---

# 16. Phase 11 — Accessibility & Performance QA

## Accessibility

Verify:

- semantic heading order
- focus-visible states
- keyboard navigation
- aria labels
- image alt text
- CTA labels
- color contrast
- modal focus behavior
- reduced motion

## Performance

Verify:

- Next/Image behavior
- image `sizes`
- priority only where justified
- no new unnecessary client components
- no unnecessary animation listeners
- no layout shift introduced

## Commands

Run:

```bash
npm run type-check
npm run lint
npm run build
```

If the current lint command is unsupported by the existing Next.js configuration, document the issue rather than introducing unnecessary dependencies.

---

# 17. Phase 12 — Final Browser QA & Comparison

Use Browser Agent to inspect the final version.

## Viewports

- Desktop 1440px
- Tablet 768px
- Mobile 390px

## Review Entire Homepage

Evaluate:

- Hero
- section transitions
- event conversion
- card density
- editorial rhythm
- typography
- partner presentation
- recaps
- final CTA
- footer

## Final Design Questions

1. Does the site still feel like a generic AI-generated running template?
2. Are there too many cards?
3. Are there too many rounded containers?
4. Is too much information exposed on the homepage?
5. Is the next run easy to discover?
6. Does the site feel like a community rather than a dashboard?
7. Does the brand palette remain coherent?
8. Is the gradient still used intentionally?
9. Does every major homepage section have a clear product purpose?
10. Does mobile feel intentionally designed?

If an issue is found, make one restrained final refinement pass.

Do not start another redesign cycle.

---

# 18. Recommended Implementation Order

Execute the work in this order:

```text
Phase 0  Baseline & audit
Phase 1  Hero cleanup
Phase 2  Upcoming Runs simplification
Phase 3  Partners redesign
Phase 4  Card-language reduction
Phase 5  Recaps editorial treatment
Phase 6  Section rhythm & spacing
Phase 7  Typography / mono cleanup
Phase 8  Header lockup refinement
Phase 9  Motion polish
Phase 10 Mobile refinement
Phase 11 Accessibility + build QA
Phase 12 Final browser QA
```

Do not implement all phases in a single agent turn.

Recommended Antigravity workflow:

```text
one phase
→ implementation
→ browser inspection
→ build/type check where appropriate
→ review diff
→ approve
→ next phase
```

---

# 19. Definition of Done

Editorial & Hierarchy Polish v0.3 is complete when:

- `WE MOVE TOGETHER.` remains the dominant brand message
- current brand palette remains intact
- Upcoming Runs is significantly simpler and more emotional
- Partners no longer resembles SaaS pricing cards
- Upcoming and Recap sections have clearly different visual purposes
- repeated rounded-card language is reduced
- section rhythm is visibly more varied
- mono typography is used more intentionally
- hero has less competing UI
- header brand lockup is cleaner
- motion is restrained and purposeful
- mobile experience is intentionally designed
- accessibility is preserved
- type-check passes
- production build passes
- no data, routes, demo content, or backend behavior is changed
- the site feels closer to an editorial running-community experience than a component-based sports template

---

# 20. Final Design Target

The final visual character should be:

**Editorial + Athletic + Community + University + Istanbul + Premium**

Not:

**SaaS + Fitness Dashboard + Neon Performance App**

The website should make a student think:

> “I want to be part of this club.”

before they think:

> “This website has many features.”
