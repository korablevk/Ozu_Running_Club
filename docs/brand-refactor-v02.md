# Brand Refactor v0.2: ÖzÜ Running Club Visual Identity Specification

**Status**: Planning & Audit Phase  
**Branch**: `refactor/club-brand-v02`  
**Target Reference**: Official Club Emblem (`logo.jpeg` & `logo2.jpeg`)  
**Scope**: Non-destructive visual refactor — zero changes to data, routes, information architecture, dependencies, or backend.

---

## 1. Executive Summary & Context

The initial v0.1 website was engineered with a structure inspired by high-performance commercial athletic brands (specifically On.com). While the UX structure, grid systems, interactive components, and responsive behaviors perform cleanly, the visual palette relies heavily on **Kinetic Volt / Neon Lime (`#D4FF00`)** and **Generic Electric Blue (`#0B5ED7`)** set against deep black and stark white.

This visual styling resembles a commercial sneaker retail brand or an electric fitness app rather than the authentic collegiate athletics identity of **ÖzÜ Running Club** at Özyeğin University.

The official club emblem (`logo.jpeg`) establishes a sophisticated, energetic palette:
- **Navy to Burgundy/Crimson dynamic transition**
- **White continuous-line running shoe contour**
- **Strong, bold collegiate athletic typography**

This refactor (v0.2) replaces the commercial Volt/Neon accents with the authentic **Club Navy / Plum / Burgundy / Crimson** identity system, giving the club an unmistakable visual signature while preserving all demo content, events, statistics, routes, and interactions.

---

## 2. Established Brand Palette (v0.2)

Derived directly from the official club emblem (`logo.jpeg`):

| Token Name | Hex Code | RGB | Role / Usage |
|---|---|---|---|
| **Club Navy** | `#263260` | `rgb(38, 50, 96)` | Primary dark anchor, header backgrounds, dark cards, deep accents |
| **Club Plum** | `#56244F` | `rgb(86, 36, 79)` | Mid-tone bridge, subtle hover states, tertiary accents |
| **Club Burgundy** | `#871537` | `rgb(135, 21, 55)` | Rich athletic accent, badge backgrounds, telemetry highlights |
| **Club Crimson** | `#B50E2C` | `rgb(181, 14, 44)` | Primary active accent, key CTAs, live pulse indicators, hover borders |
| **Off White** | `#F7F7F5` | `rgb(247, 247, 245)` | Main canvas page background, subtle section alternating bands |
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | Card surfaces, container surfaces, high-contrast text |
| **Ink** | `#111318` | `rgb(17, 19, 24)` | Primary typography, deep footer base, high-contrast borders |

### Brand Signature Gradient
```css
linear-gradient(115deg, #263260 0%, #56244F 48%, #B50E2C 100%)
```

> **Crucial Rule**: The signature gradient must be used **sparingly** (e.g. signature hero badges, key CTA borders, active navigation accents, subtle edge tints). It must **NEVER** become the default background of full pages or wide sections.

---

## 3. Current Visual Problems Identified in Baseline Audit

Based on browser testing of `https://ozu-running-club.vercel.app/` on Desktop (1440px) and Mobile (390px):

1. **Overuse of High-Frequency Neon Volt (`#D4FF00`)**:
   - Used across 80+ locations: hero CTAs, card badges, telemetry numbers, live pulsing dots, mobile bottom bar "Join" button, and hover states.
   - Creates a Nike/Volt aesthetic that has no connection to Özyeğin University or the club logo.
2. **Generic Bootstrap/SaaS Blue (`#0B5ED7` / `#1A73E8`)**:
   - Used in telemetry text ("1,240+ finishers", "35 MIN", pace numbers), focus rings, and icons (`Sparkles`, `MapPin`, `Users`).
   - Clashes with both the deep collegiate navy (`#263260`) and crimson tones of the logo.
3. **Black & Neon Contrast Disconnect**:
   - Deep pitch-black (`#000000`) paired with piercing `#D4FF00` gives an aggressive techno/industrial feel, rather than a community-driven, warm, and inviting student runner atmosphere.
4. **Text-Only Header Monogram**:
   - Desktop and mobile headers display plain text `"ÖZÜ RC"` with the "RC" in neon volt, completely omitting the distinctive ribbon-shoe mark and burgundy gradient of the club emblem.
5. **Cold Backdrop Tints & Glows**:
   - `JoinCtaBanner.tsx` and `PartnersSection.tsx` utilize `bg-volt/10` blurred circular glows that dilute the brand focus.

---

## 4. Components & Files Affected

### A. Core Token & Configuration Files
- **[`src/app/globals.css`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/globals.css)**:
  - Replace `--color-kinetic-volt`, `--color-ozu-navy`, `--color-ozu-blue` with `--color-club-navy`, `--color-club-plum`, `--color-club-burgundy`, `--color-club-crimson`, `--color-off-white`, `--color-ink`.
  - Add `--brand-gradient: linear-gradient(115deg, #263260 0%, #56244F 48%, #B50E2C 100%)`.
  - Update focus-visible outline color from `#0b5ed7` to `#B50E2C` (Crimson).
- **[`tailwind.config.ts`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/tailwind.config.ts)**:
  - Extend theme with `club: { navy: '#263260', plum: '#56244F', burgundy: '#871537', crimson: '#B50E2C' }`.
  - Map `canvas: { light: '#FFFFFF', subtle: '#F7F7F5', dark: '#111318' }`.
  - Define `backgroundImage: { 'club-gradient': 'linear-gradient(115deg, #263260 0%, #56244F 48%, #B50E2C 100%)' }`.

### B. UI Atoms
- **[`src/components/ui/Button.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/Button.tsx)**:
  - Replace `variant="volt"` with `variant="crimson"` (`bg-club-crimson text-white hover:bg-club-burgundy active:scale-[0.98] shadow-sm`).
  - Add `variant="gradient"` (`bg-club-gradient text-white shadow-sm hover:opacity-95`).
- **[`src/components/ui/Badge.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/Badge.tsx)**:
  - Replace `variant="volt"` with `variant="crimson"` (`bg-club-crimson text-white`) and `variant="burgundy"` (`bg-club-burgundy text-white`).
  - Pulse ring animation updated to crimson/burgundy tones.
- **[`src/components/ui/Ticker.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/ui/Ticker.tsx)**:
  - Update separator dots and highlighted text accents to Club Crimson/Burgundy.

### C. Layout & Navigation
- **[`src/components/layout/DesktopHeader.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/DesktopHeader.tsx)**:
  - Update "RC" monogram accent to Club Crimson.
  - Active nav link underline: change from volt to `bg-club-crimson`.
  - Primary button: update to Club Crimson / Gradient.
- **[`src/components/layout/MobileTopBar.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/MobileTopBar.tsx)**:
  - Brand mark text accent update.
  - "Join Club" pill CTA: update from volt to Club Crimson.
- **[`src/components/layout/MobileBottomBar.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/MobileBottomBar.tsx)**:
  - "Join" pill button: update from `bg-volt text-asphalt-black` to `bg-club-crimson text-white`.
  - Active tab indicators and sparkle icon updated from generic blue to Club Crimson/Burgundy.
- **[`src/components/layout/MobileMenuDrawer.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/MobileMenuDrawer.tsx)**:
  - Active link highlight and bullet dot updated from volt/blue to Club Crimson.
- **[`src/components/layout/Footer.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/layout/Footer.tsx)**:
  - Replace volt text accents with Club Crimson.
  - Update heart icon fill to Club Crimson.

### D. Homepage Sections
- **[`src/components/home/HeroSection.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/HeroSection.tsx)**:
  - "Next Run" live pill badge: pulse dot and text changed from volt to Club Crimson / Off-White.
  - Main CTA button: updated to `variant="crimson"`.
  - Weekly sessions telemetry highlight updated from volt to Club Crimson.
- **[`src/components/home/PaceStreamsGrid.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/PaceStreamsGrid.tsx)**:
  - Telemetry tags and hover arrow transitions updated from volt to Club Crimson.
- **[`src/components/home/DisciplineSplit.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/DisciplineSplit.tsx)**:
  - Active indicator dot and button updated from volt/blue to Club Crimson / Club Navy.
- **[`src/components/home/UpcomingRunsCarousel.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/UpcomingRunsCarousel.tsx)**:
  - Scroll progress bar and carousel controls updated to Club Crimson/Navy.
- **[`src/components/home/RunnerStories.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/RunnerStories.tsx)**:
  - Accent text and PR stats updated from volt/blue to Club Crimson / Club Navy.
- **[`src/components/home/RecapsGrid.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/RecapsGrid.tsx)**:
  - Badge and pace stats updated from volt to Club Crimson.
- **[`src/components/home/PartnersSection.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/PartnersSection.tsx)**:
  - Partner code badge and decorative glow updated to Club Burgundy / Crimson.
- **[`src/components/home/JoinCtaBanner.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/home/JoinCtaBanner.tsx)**:
  - Background glow updated from volt to Club Plum/Burgundy glow.
  - Check icons and primary button updated to Club Crimson.

### E. Events, Event Details, Join, About, Partners Pages
- **[`src/components/events/EventCard.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/events/EventCard.tsx)**:
  - Featured badge, pace tag, and RSVP trigger updated to Club Crimson.
- **[`src/components/events/RSVPModal.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/components/events/RSVPModal.tsx)**:
  - Step indicators, primary submit button, and calendar tags updated to Club Crimson/Navy.
- **[`src/app/events/[slug]/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/events/[slug]/page.tsx)** & **[`EventDetailsRSVP.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/events/[slug]/EventDetailsRSVP.tsx)**:
  - Pace numbers, map pin icons, and inline registration button updated to Club Crimson.
- **[`src/app/join/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/join/page.tsx)**:
  - Step counter, active radio chips, and final submission button updated to Club Crimson / Navy.
- **[`src/app/about/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/about/page.tsx)**:
  - Pillar icon containers and role tags updated from volt/blue to Club Burgundy/Navy/Crimson.
- **[`src/app/partners/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/partners/page.tsx)**:
  - Partner highlight badges and primary links updated from volt to Club Crimson.
- **[`src/app/recaps/page.tsx`](file:///Users/kirillkorablev/Desktop/Ozu_Running_club/Ozu_Running_wesite/src/app/recaps/page.tsx)**:
  - Lifetime stats counters updated from volt/blue to Club Crimson/Navy.

---

## 5. Implementation Sequence (For Execution Phase)

1. **Step 1: Token & Utility Foundation**
   - Update `src/app/globals.css` with CSS custom properties.
   - Update `tailwind.config.ts` with color keys and gradient utilities.
2. **Step 2: Core Atoms**
   - Update `Button.tsx` (replace `volt` variant with `crimson`, add `gradient`).
   - Update `Badge.tsx` (replace `volt` variant with `crimson` / `burgundy`).
   - Update `Ticker.tsx` accents.
3. **Step 3: Global Layout & Navigation**
   - Update `DesktopHeader.tsx`.
   - Update `MobileTopBar.tsx`, `MobileBottomBar.tsx`, `MobileMenuDrawer.tsx`.
   - Update `Footer.tsx`.
4. **Step 4: Homepage Sections**
   - Update `HeroSection.tsx`, `PaceStreamsGrid.tsx`, `DisciplineSplit.tsx`, `UpcomingRunsCarousel.tsx`, `RunnerStories.tsx`, `RecapsGrid.tsx`, `PartnersSection.tsx`, `JoinCtaBanner.tsx`.
5. **Step 5: Inner Pages & RSVP Flow**
   - Update `EventCard.tsx`, `RSVPModal.tsx`, `src/app/events/`, `src/app/events/[slug]`, `src/app/join/`, `src/app/about/`, `src/app/partners/`, `src/app/recaps/`.
6. **Step 6: Verification & QA**
   - Run `npx tsc --noEmit` to ensure zero type regressions.
   - Run `npm run build` to verify all 14 routes compile cleanly.
   - Test in Browser Agent (Desktop 1440px & Mobile 390px) to verify visual harmony and contrast compliance.

---

## 6. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| **Text Legibility on Dark Backgrounds** | Club Navy (`#263260`) or Crimson (`#B50E2C`) text on dark cards could fail WCAG AA contrast. | On dark containers (`#111318`), use White (`#FFFFFF`) or Off-White (`#F7F7F5`) for body text, reserving Crimson for buttons and badge backgrounds with white text. |
| **Overuse of the Gradient** | The signature gradient could look cluttered if applied indiscriminately. | Strict constraint: only use the gradient on key CTA buttons, hero live badges, or subtle border rings. Never use it as a full-page background. |
| **Accidental Content Regressions** | Rewriting strings or demo statistics during refactor. | Refactor will strictly modify CSS classes, color utility classes, and variant props; all text copies, demo dates, pacers, and routes remain unchanged. |
| **Mobile Bottom Bar Touch Target Contrast** | Mobile bottom bar button must stand out ergonomically without neon volt. | Use Club Crimson (`#B50E2C`) pill button with crisp white text and icon, maintaining immediate thumb discoverability. |

---

## 7. Verification Checklist

- [ ] All occurrences of `bg-volt`, `text-volt`, `border-volt` removed or replaced with `club-crimson`, `club-burgundy`, or `club-navy`.
- [ ] All occurrences of generic blue (`#0B5ED7`, `text-ozu-blue`) replaced with cohesive club tones.
- [ ] No changes made to demo events, mileage, pacers, routes, or copy.
- [ ] No new npm dependencies installed.
- [ ] `npx tsc --noEmit` exits with 0 errors.
- [ ] `npm run build` generates all static routes successfully.
- [ ] Desktop viewport (1440px) audited: cohesive collegiate athletic atmosphere.
- [ ] Mobile viewport (390px) audited: ergonomic bottom bar, drawer, and cards render crisply.
- [ ] Color contrast passes WCAG AA for all interactive text and badges.
