# Brand Refactor v0.2: ÖzÜ Running Club Visual Identity Specification

**Document Role:** Visual Identity Specification  
**Status:** Implemented & Merged into `main` (`df64b95`)  
**Current Project State:** [PROJECT_STATUS.md](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/docs/PROJECT_STATUS.md)  
**Target Reference:** Official Club Emblem (`logo.jpeg` & `logo2.jpeg`)  
**Scope:** Non-destructive visual refactor — zero changes to data, routes, information architecture, dependencies, or backend.

---

## 1. Executive Summary & Context

The initial v0.1 website was engineered with a structure inspired by high-performance commercial athletic brands (specifically On.com). While the UX structure, grid systems, interactive components, and responsive behaviors perform cleanly, the visual palette relied heavily on **Kinetic Volt / Neon Lime (`#D4FF00`)** and **Generic Electric Blue (`#0B5ED7`)** set against deep black and stark white.

In an early refactor pass, simply replacing Volt with Crimson resulted in an over-aggressive, red-dominant sports aesthetic.

The official club emblem (`logo.jpeg`) establishes a sophisticated, collegiate multi-hue spectrum:
- **Navy to Burgundy/Crimson dynamic transition** (`#1E294C` → `#263260` → `#56244F` → `#871537` → `#B50E2C`)
- **White continuous-line running shoe contour**
- **Strong, bold collegiate athletic typography**

This refactor (v0.2) establishes a balanced, semantic brand system based on the complete logo palette, giving the club an unmistakable visual signature while preserving all demo content, events, statistics, routes, and interactions.

---

## 2. Established Brand Palette (v0.2)

Derived directly from the official club emblem (`logo.jpeg`):

| Token Name | Hex Code | RGB | Role / Usage |
|---|---|---|---|
| **Deep Navy** | `#1E294C` | `rgb(30, 41, 76)` | Dark branded surfaces, cards, footer, mobile drawer base |
| **Club Navy** | `#263260` | `rgb(38, 50, 96)` | Structural foundation, secondary actions, selected states, navigation |
| **Club Plum** | `#56244F` | `rgb(86, 36, 79)` | Supporting brand accent, subtle hover states, tertiary accents |
| **Club Burgundy** | `#871537` | `rgb(135, 21, 55)` | Badges, highlighted metadata, intermediate active states, focus ring |
| **Club Crimson** | `#B50E2C` | `rgb(181, 14, 44)` | **PRIMARY ACTIONS ONLY**: `Join`, `RSVP`, `Next Run`, live indicators, key CTA |
| **Off White** | `#F7F7F5` | `rgb(247, 247, 245)` | Main canvas page background, subtle section alternating bands |
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | Card surfaces, container surfaces, high-contrast text |
| **Ink** | `#111318` | `rgb(17, 19, 24)` | Primary typography, deep footer base, high-contrast borders |

### Brand Signature Gradient
```css
linear-gradient(115deg, #263260 0%, #56244F 48%, #B50E2C 100%)
```

> **Strict Semantic Constraint**: The signature gradient is strictly permitted in only 3 specific contexts:
> 1. Subtle Hero image tint / atmospheric overlay
> 2. Active nav or identity line
> 3. Exactly ONE major full-width brand moment: final `JoinCtaBanner`

---

## 3. Core Identity Pillars

1. **Semantic Color Hierarchy**:
   - **Crimson is NOT the default color**. It is strictly reserved for primary actions (Join, RSVP, Next Run pulse, key submit triggers).
   - **Deep Navy & Club Navy** provide the structural, athletic, collegiate foundation.
   - **Burgundy** is the athletic badge and telemetry accent.
   - **Plum** provides editorial depth and subtle hover transitions.
2. **Authentic Official Emblem Integration**:
   - Reusable [`ClubLogo.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/ClubLogo.tsx) component displaying `logo.jpeg` with circular CSS crop/masking (scale 1.04 to eliminate white outer border artifacts without mutating the source asset).
   - Paired with collegiate typography across Desktop Header, Mobile Top Bar, Mobile Drawer, and Footer.
3. **Hero Statement**:
   - Slogan updated to **`WE MOVE TOGETHER.`** — capturing the inclusive collegiate spirit ("Open to all paces. No runner left behind.").

---

## 4. Components & Files Affected

### A. Core Token & Configuration Files
- **[`src/app/globals.css`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/globals.css)**:
  - Added `--color-club-deep-navy`, `--color-club-navy`, `--color-club-plum`, `--color-club-burgundy`, `--color-club-crimson`, `--color-off-white`, `--color-ink`.
  - Added `--brand-gradient: linear-gradient(115deg, #263260 0%, #56244F 48%, #B50E2C 100%)`.
  - Updated focus-visible outline color to `#871537` (Burgundy).
- **[`tailwind.config.ts`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/tailwind.config.ts)**:
  - Extended theme with `club: { deepNavy: '#1E294C', navy: '#263260', plum: '#56244F', burgundy: '#871537', crimson: '#B50E2C' }`.
  - Defined `offWhite: '#F7F7F5'`, `ink: '#111318'`, and `'club-gradient'`.

### B. UI Atoms
- **[`src/components/ui/ClubLogo.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/ClubLogo.tsx)**:
  - Reusable circular-masked logo with size presets (`sm`, `default`, `lg`), light/dark modes, and collegiate wordmark.
- **[`src/components/ui/Button.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/Button.tsx)**:
  - Added `crimson`, `navy`, `white`, `outline-crimson`, `outline-navy`, and fallback alias.
- **[`src/components/ui/Badge.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/Badge.tsx)**:
  - Added `burgundy` (default athletic badge), `navy`, `deepNavy`, `plum`, `crimson`, and `subtle`.
- **[`src/components/ui/Ticker.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/Ticker.tsx)**:
  - Deep Navy base, burgundy separator dots, crimson hover accent.

### C. Layout & Navigation
- **[`src/components/layout/DesktopHeader.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/DesktopHeader.tsx)**:
  - Official `<ClubLogo />`, burgundy active indicator line, crimson "Join the Club" primary CTA.
- **[`src/components/layout/MobileTopBar.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/MobileTopBar.tsx)**:
  - Official `<ClubLogo size="sm" />`, crimson "Join Club" pill.
- **[`src/components/layout/MobileBottomBar.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/MobileBottomBar.tsx)**:
  - Navy navigation icons, live crimson dot on events, crimson "Join" pill button.
- **[`src/components/layout/MobileMenuDrawer.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/MobileMenuDrawer.tsx)**:
  - Official `<ClubLogo />`, Deep Navy surfaces, crimson Join bullet.
- **[`src/components/layout/Footer.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/Footer.tsx)**:
  - Official `<ClubLogo variant="light" />`, Deep Navy base, burgundy campus badge, crimson heart.

### D. Homepage Sections
- **[`src/components/home/HeroSection.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/HeroSection.tsx)**:
  - H1: **`WE MOVE TOGETHER.`**
  - Subtle Deep Navy → Plum → Crimson overlay.
  - Live Crimson Next Run indicator.
  - Crimson "Join Next Run" primary action.
- **[`src/components/home/PaceStreamsGrid.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/PaceStreamsGrid.tsx)**:
  - Deep Navy cards, burgundy/navy badges, crimson hover arrow.
- **[`src/components/home/DisciplineSplit.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/DisciplineSplit.tsx)**:
  - Navy/plum active states, burgundy badge, crimson CTA.
- **[`src/components/home/UpcomingRunsCarousel.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/UpcomingRunsCarousel.tsx)**:
  - Deep Navy / Club Navy controls and progress bar.
- **[`src/components/events/EventCard.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/events/EventCard.tsx)**:
  - Deep Navy card, burgundy badge, crimson date indicator, crimson RSVP button.
- **[`src/components/home/RunnerStories.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/RunnerStories.tsx)**:
  - Restrained editorial navy/plum accents with Ink typography.
- **[`src/components/home/JoinCtaBanner.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/JoinCtaBanner.tsx)**:
  - Signature full-width brand moment: `bg-club-gradient`, white typography, white primary CTA button.
- **[`src/components/home/RecapsGrid.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/RecapsGrid.tsx)**:
  - Deep Navy base, burgundy tags, white pace numbers.
- **[`src/components/home/PartnersSection.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/PartnersSection.tsx)**:
  - Deep Navy title sponsor card, burgundy partner badge, crimson action button.

### E. Modals & Inner Pages
- **[`RSVPModal.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/events/RSVPModal.tsx)**: Crimson submit button, navy pace selector.
- **[`events/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/events/page.tsx)**: Burgundy badge, Deep Navy filter buttons.
- **[`events/[slug]/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/events/[slug]/page.tsx)**: Burgundy badge, Club Navy metadata, Deep Navy partner perk box.
- **[`events/[slug]/EventDetailsRSVP.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/events/[slug]/EventDetailsRSVP.tsx)**: Crimson RSVP button.
- **[`join/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/join/page.tsx)**: Burgundy badges, Deep Navy steps and options, Crimson submit button.
- **[`about/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/about/page.tsx)**: Burgundy badge, 3 pillars mapped to Deep Navy, Plum, Burgundy, Crimson CTA.
- **[`partners/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/partners/page.tsx)**: Burgundy badge, Deep Navy sponsor box, Crimson action button.
- **[`recaps/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/recaps/page.tsx)**: Burgundy badges, Club Navy telemetry counters.

---

## 5. Verification Checklist

- [x] All legacy occurrences of `bg-volt`, `text-volt`, `border-volt` removed across all pages.
- [x] All occurrences of generic blue (`#0B5ED7`, `text-ozu-blue`) replaced with cohesive club tones.
- [x] Crimson is reserved exclusively for primary actions and live indicators.
- [x] Deep Navy and Club Navy provide the structural darks and foundations.
- [x] Official club logo cleanly masked and integrated without mutating source asset.
- [x] Hero headline updated to **`WE MOVE TOGETHER.`**
- [x] Zero changes made to demo events, mileage, pacers, routes, or copy.
- [x] No new npm dependencies installed.
- [x] `npx tsc --noEmit` exits with 0 errors.
- [x] `npm run build` generates all static routes successfully.
- [x] Desktop & Mobile responsive viewports audited and verified.
