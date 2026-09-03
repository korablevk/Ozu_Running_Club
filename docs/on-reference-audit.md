# Reference Audit: On.com (en-ch) & Translation to ÖzÜ Running Club

> **Scope**: Visual & structural audit of `https://www.on.com/en-ch/` across desktop (1440×900) and mobile (390×844) viewports, compared against extracted assets and style tokens in `reference/on/`.  
> **Rule**: On.com serves strictly as a **structural and visual reference**. No proprietary code, trademarks, logos, copy, or fonts are copied into the final product.

---

## 1. Executive Summary & Core Observations

On.com is one of the most refined examples of modern Swiss sports design:
1. **Extreme Clarity & Confidence**: Zero decorative clutter, zero generic "AI glassmorphism" or neon gradients. The design relies on bold editorial typography, tactile photography, and generous whitespace.
2. **Dual Viewport Strategy**:
   - **Desktop**: Full-bleed cinematic hero, 3-to-4 column modular grids, interactive split-pane lists, and inline swiper carousels with arrow controls and line-progress bars.
   - **Mobile-First Experience**: Top bar reduces to a clean floating brand mark; primary utilities and hamburger trigger live in an ergonomic **fixed bottom bar** within thumb reach; multi-column grids convert into **horizontal touch-swipe carousels with right-edge card peek** (`clamp` padding and scroll-snap).
3. **Typography as Structure**: Strong scale contrast between 51px bold grotesk headings (`letter-spacing: -0.5px`) and 12px monospace technical telemetry (`letter-spacing: 1.44px`).

---

## 2. Page Structure & Section Order

### On.com E-Commerce Structure vs. ÖzÜ Running Club Translation

| Section # | On.com E-Commerce Pattern | ÖzÜ Running Club Translation | Purpose & UX Intent |
| :--- | :--- | :--- | :--- |
| **01** | **Hero Section (Full Bleed)**<br>Seasonal hero video/photo, H1 text bottom-left, pill CTAs ("Shop men's", "Shop women's"). | **Hero: "Run With The Pack" / ÖzÜ Running Club**<br>Cinematic Istanbul/campus running background, live next-run ticker badge, H1 club statement, double CTAs: `[Join Next Run]` + `[Explore Club]`. | Immediate emotional hook; conveys motion, community, and immediate invitation to run. |
| **02** | **Category Columns (3-Col Grid)**<br>Portrait 3:4 cards: "Shoes", "Apparel", "Accessories" with bottom-left overlay titles. | **Pace Groups / Running Streams (3-Col Grid)**<br>3:4 portrait cards: `Campus Loops (6:00-6:30)`, `Tempo & Intervals (5:00-5:30)`, `Long Run Crew (4:30-5:00)`. Swipeable on mobile. | Eliminates beginner intimidation; shows clear entry points for any fitness level. |
| **03** | **Interactive Focus List (Split Pane)**<br>Left: Vertical list of running disciplines. Hovering swaps the right-side media card dynamically. | **Disciplines & Training Hub (Interactive Split)**<br>Left: List of club sessions (`Couch to 5K`, `Track Intervals`, `Belgrad Forest Trails`, `Istanbul Marathon Prep`). Right: Dynamic route & telemetry card. | Editorial storytelling, deep engagement, highlights technical discipline. |
| **04** | **Product Swiper Carousel**<br>Horizontal carousel with scrollbar progress line & arrow buttons. | **Upcoming Runs & Events Carousel**<br>Horizontal cards for this week's runs with Date, Distance, Elevation, Meeting point, and 1-click RSVP. | The core utility of the club: finding and joining the next training session. |
| **05** | **Editorial Story / Athlete Spotlight**<br>Large split block with narrative typography and runner profile. | **Club Culture / Runner Stories ("Voices of ÖzÜ")**<br>Story of a student who started at 0 km and ran their first half-marathon; quote block and Strava telemetry. | Authentic social proof and inspiration for university students. |
| **06** | **Product Grid ("New Arrivals")**<br>4-column responsive grid with clean neutral cards. | **Recent Runs Recap & Photo Grid**<br>High-res photo gallery with runner attendance numbers, pace recaps, and Instagram/Strava links. | Validates active community life; shows real faces and energy. |
| **07** | **Partner & Community Ecosystem**<br>Brand story, sustainability & technology. | **Partners & Sponsors (Runaway Zone, etc.)**<br>Clean partner showcase: Runaway Zone gear partner, campus sports directorate, member discounts. | Transparency, professional credibility, student perks. |
| **08** | **Membership / Newsletter Capture**<br>Clean input field with pill submit button. | **"Join the Club" Official Registration CTA**<br>Multi-step membership enrollment card + links to WhatsApp/Strava community. | Primary membership conversion funnel. |
| **09** | **Technical Global Footer**<br>Dark Gray (`#151522`) 12-column grid with structured links, social icons, and copyright. | **ÖzÜ Running Club Global Footer**<br>Editorial dark footer with Özyeğin University sports links, emergency contacts, schedule, and social links. | Accessible directory, legal notices, social channels. |

---

## 3. Navigation & Header Behavior

### Desktop Navigation (`>= 1024px`)
- **Position**: Sticky top header, height `4.5rem` (72px), backdrop blur or subtle transition from transparent to solid white/dark depending on scroll depth.
- **Left**: Club Emblem / Monogram.
- **Center**: Primary navigation links: `Runs & Events`, `Pace Groups`, `About`, `Recaps`, `Partners`.
- **Right**: Secondary utilities: Search, Strava Club link, and a prominent pill button `Join Club`.

### Mobile Navigation (`< 1024px`)
- **Top Header**: Minimalistic logo mark fixed top-left (`padding: 1.25rem 1rem`).
- **Ergonomic Bottom Bar**: Fixed bottom bar (`height: 3.75rem`, 60px) elevated with subtle border and frosted surface (`z-index: 50`). Contains:
  1. Quick Search / Filter
  2. Next Run Shortcut
  3. Strava / Social Hub
  4. Fullscreen Menu Trigger (`☰` / `✕`)
- **Mobile Menu Drawer**: Fullscreen slide-over with oversized 28px typography, secondary club links, and direct contact buttons.

---

## 4. Grid, Spacing & Alignment Systems

From inspecting both the live site and CSS tokens:
- **Fluid Side Margins**:
  - Mobile: `clamp(1rem, 4.2667vw, 2rem)` (approx 16px to 32px).
  - Desktop: `max(2rem, 3.33vw)` (approx 48px to 64px on wide screens).
- **12-Column Editorial Grid**:
  - `grid-template-columns: repeat(12, 1fr)` with gap `clamp(1rem, 1.6667vw, 2rem)`.
  - Content containers span 10 columns centered (`grid-column: 2 / span 10`) or 8 columns (`grid-column: 3 / span 8`) for reading text.
  - Media cards span 4 columns (3 per row), 3 columns (4 per row), or 6 columns (2 per row).
- **Vertical Rhythm**:
  - Section gaps: `clamp(3rem, 2.27rem + 3.11vw, 6rem)` (48px to 96px).
  - Title bottom margin: `0.65em` to `1em`.

---

## 5. Typography Hierarchy & Tokens

Extracted from `reference/on/on.com-styles-2026-09-03 (1).css` and live computed styles:

```css
/* Headline Display */
--font-display: 51px, weight 700, line-height 1.11, letter-spacing: -0.515px
/* Sub-headlines */
--font-h2: 32px, weight 700, line-height 1.21, letter-spacing: -0.2px
--font-h3: 25px, weight 700, line-height 1.25
/* Body */
--font-body-large: 20px, weight 400, line-height 1.5
--font-body: 16px, weight 400, line-height 1.5, letter-spacing: 0.2px
--font-small: 14px, weight 400, line-height 1.35
/* Monospace Telemetry / Metadata */
--font-mono-meta: 12px, weight 500, line-height 1.5, letter-spacing: 1.44px (uppercase)
--font-micro-tag: 10px, weight 700, line-height 1.0, letter-spacing: 1.0px (uppercase)
```

**Adaptation for ÖzÜ Running Club**:
- Primary Sans: Modern open geometric grotesk (*Plus Jakarta Sans* / *Inter*).
- Display Heading: Dynamic sport-editorial typeface (*Syne* / *Cabinet Grotesk*).
- Technical Telemetry: Monospace (*Geist Mono* / *JetBrains Mono*) for pace (`05:15 /KM`), distance (`10.4 KM`), elevation (`+142 M`), and date/time stamps.

---

## 6. Color Palette & Tonal Contrast

| Color Name | Hex Token | Usage on On.com | ÖzÜ Running Club Adaptation |
| :--- | :--- | :--- | :--- |
| **White** | `#FFFFFF` | Core light surface | Primary page canvas & card backgrounds |
| **White Smoke** | `#F7F7F7` | Neutral section alternates, card backings | Neutral surface for run cards and metadata panels |
| **Charcoal Dark** | `#151522` | Dark theme footer, tech callouts | High-contrast dark sections, footer, and midnight run alerts |
| **Deep Campus Navy** | `#07152B` | — (ÖzÜ custom) | Heritage Özyeğin University identity token |
| **Kinetic Volt** | `#D4FF00` | Accent & alert tags | High-visibility athletic accent (active status, next run badge, CTAs) |
| **Muted Gray** | `#666666` | Secondary body, metadata | Pacer names, distance subtext, timestamps |
| **Gainsboro Border** | `#E5E5E5` | Hairline dividers, carousel tracks | Progress tracks, subtle card borders |

---

## 7. Interactive Components & Micro-Interactions

1. **Pill Buttons (`border-radius: 2.5rem` / `9999px`)**:
   - Height: `3rem` (48px) primary, `2.5rem` (40px) compact.
   - States: Solid Black (`#000` text `#FFF`) with hover `#333`, Outlined (`border: 1px solid #000`), and Ghost link with underline slide-in animation (`background-size: 100% 1px`).
2. **Horizontal Swiper Carousel**:
   - Fluid drag and momentum scrolling on touch devices.
   - Arrow controls disabled with `opacity: 0.35` at track boundaries.
   - Connected progress bar with linear indicator advancing proportionally to current slide index.
   - Cards maintain vertical aspect ratio (3:4 or 4:5) and reveal the trailing card by `20-30%` (peek effect) to indicate swipeability.
3. **Interactive Category / Discipline Switcher**:
   - Vertical typography list on the left with clean underline or dot indicators.
   - Hovering/clicking triggers an instantaneous or smooth fade transition of the right hero imagery and telemetry card without layout shift.
4. **Editorial Cards**:
   - Gradient overlay (`linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%)`) ensures text legibility over any photography.
   - Subtle scale transform (`scale(1.02)`) on card media on hover with smooth cubic bezier (`cubic-bezier(0.25, 1, 0.5, 1)`).

---

## 8. Mobile-First Transformation Blueprint

```
Desktop (1440px)                           Mobile (390px)
┌──────────────────────────────────────┐   ┌───────────────────────────┐
│ Logo      Links       CTA / Utils    │   │ Logo                      │
├──────────────────────────────────────┤   ├───────────────────────────┤
│                                      │   │                           │
│           HERO BANNER                │   │         HERO (100dvh)     │
│ [H1 + Subtitle]       [Media]        │   │ [H1 + Subtitle]           │
│ [CTAs]                               │   │ [Stacked CTAs]            │
├──────────────────────────────────────┤   ├───────────────────────────┤
│ [Card 1]   [Card 2]   [Card 3]       │   │ [Card 1] ──► [Card 2 (peek)│
│ (3-column static grid)               │   │ (Horizontal touch swipe)  │
├──────────────────────────────────────┤   ├───────────────────────────┤
│ [Interactive List]  [Dynamic Card]   │   │ [Tabs]                    │
│ (Side-by-side split)                 │   │ [Active Card + Stats]     │
├──────────────────────────────────────┤   ├───────────────────────────┤
│ 12-Column Footer                     │   │ Stacked Accordion Footer  │
└──────────────────────────────────────┘   ├───────────────────────────┤
                                           │ [ 🔍 ] [ 🏃 ] [ 👥 ] [ ☰ ]│
                                           │ (Fixed Bottom Bar)        │
                                           └───────────────────────────┘
```

This audit will serve as the architectural foundation for `docs/design-system.md` and `docs/implementation-plan.md`.
