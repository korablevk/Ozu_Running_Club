# Design System: ÖzÜ Running Club

> **Design Philosophy**: High-performance, editorial, authentic athletic community.  
> Inspired by the precision and minimalism of On.com, the raw energy of urban running crews, and the spirit of Özyeğin University.  
> **Anti-AI Manifesto**: Strict rejection of generic SaaS gradients, soft purple glassmorphism, floating meaningless 3D shapes, and rounded multi-shadow cards. Every element is grounded in athletic utility and typography.

---

## 1. Color Palette & Semantics

| Token Name | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-canvas-light` | `#FFFFFF` | Primary light page background |
| `--color-canvas-subtle` | `#F7F7F7` | Secondary neutral surface, event cards, telemetry panels |
| `--color-canvas-dark` | `#111620` | High-contrast dark sections, footer, night runs |
| `--color-ozu-navy` | `#081935` | Özyeğin University deep heritage navy |
| `--color-ozu-blue` | `#0B5ED7` | Primary university blue accent, active tab highlight |
| `--color-kinetic-volt` | `#D4FF00` | High-vis athletic lime: next run badge, live pulses, hero CTA |
| `--color-asphalt-black` | `#000000` | High-contrast text, primary buttons, borders |
| `--color-dim-gray` | `#666666` | Secondary metadata, pace sub-labels, pacer designations |
| `--color-divider` | `#E5E5E5` | Hairline grid borders, carousel tracks, form outlines |
| `--color-success` | `#10B981` | RSVP confirmed state |
| `--color-alert` | `#EF4444` | Session full / waitlist badge |

---

## 2. Typography Hierarchy & Tokens

The typography pairs an authoritative geometric grotesque for editorial storytelling with an ultra-clean monospace for running telemetry.

```css
:root {
  /* Font Families */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-display: 'Cabinet Grotesk', 'Syne', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

  /* Typography Scale */
  --text-hero: clamp(2.75rem, 2.2rem + 2.5vw, 4.5rem);       /* 44px - 72px, leading 1.05, tracking -0.03em */
  --text-h1: clamp(2.25rem, 1.9rem + 1.8vw, 3.5rem);         /* 36px - 56px, leading 1.10, tracking -0.025em */
  --text-h2: clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem);         /* 28px - 40px, leading 1.15, tracking -0.02em */
  --text-h3: clamp(1.25rem, 1.15rem + 0.5vw, 1.75rem);       /* 20px - 28px, leading 1.25, tracking -0.01em */
  --text-body-lg: 1.25rem;                                    /* 20px, leading 1.5 */
  --text-body: 1rem;                                          /* 16px, leading 1.5 */
  --text-small: 0.875rem;                                     /* 14px, leading 1.4 */
  --text-caption: 0.75rem;                                    /* 12px, leading 1.4 */

  /* Telemetry / Mono Metrics */
  --text-mono-label: 0.75rem;                                 /* 12px, tracking 0.12em, uppercase, weight 600 */
  --text-mono-stat: 1.125rem;                                 /* 18px, tracking -0.02em, weight 700 */
}
```

---

## 3. Layout Grid & Spacing Principles

### Fluid Padding & Margins
- **Mobile (`< 768px`)**: Container padding `clamp(1rem, 4.26vw, 1.5rem)` (16px to 24px).
- **Tablet (`768px - 1023px`)**: Container padding `2rem` (32px).
- **Desktop (`>= 1024px`)**: Container padding `max(2.5rem, 4vw)` (40px to 64px), max content width `1440px`.

### 12-Column Grid Setup
- Desktop layout employs a 12-column CSS Grid with gap `clamp(1rem, 1.67vw, 2rem)`.
- Cards:
  - 3-column layouts: `span 4`
  - 4-column layouts: `span 3`
  - Split editorial blocks: `span 6` + `span 6` or `span 5` + `span 7`
- Mobile: Multi-column grids smoothly collapse into horizontal peek carousels with CSS scroll snap.

---

## 4. UI Components Specification

### 4.1. Buttons
- **Shape**: Pure Pill (`border-radius: 9999px` / `2.5rem`).
- **Sizes**:
  - Regular: `height: 3rem` (48px), `padding: 0 1.75rem`, `font-size: 1rem`, `font-weight: 700`.
  - Compact: `height: 2.5rem` (40px), `padding: 0 1.25rem`, `font-size: 0.875rem`, `font-weight: 700`.
- **Variants**:
  - `ButtonPrimary`: Black `#000` background, White `#FFF` text. Hover: `#222`. Active: subtle `translateY(1px)`.
  - `ButtonVolt`: High-vis `#D4FF00` background, Black `#000` text. Used for primary hero CTA and "Next Run".
  - `ButtonOutline`: Transparent background, 1px solid `#000` (or `#FFF` on dark backgrounds).
  - `ButtonGhost`: Text-only with dynamic underline hover animation (`background-size: 100% 1px`).

### 4.2. Run / Event Card (The Utility Core)
- **Aspect Ratio**: 3:4 portrait or 4:5 on mobile carousels.
- **Header**: Type tag (`Social Run`, `Tempo Run`, `Track Session`, `Long Run`) + Date badge.
- **Center / Visual**: High-res route preview or community running photo with dark bottom gradient.
- **Telemetry Bar (Mono)**:
  - `DIST`: `8.5 KM`
  - `PACE`: `5'30" /KM`
  - `ELEV`: `+120 M`
- **Action**: Direct `RSVP` trigger with slot counter (`14 spots left`).

### 4.3. Interactive Category / Discipline Switcher
- **Left Side**: Vertical list of disciplines with active indicator dot and bold typography.
- **Right Side**: Dynamic media card showing the exact campus route, meeting point, and pacer leads for that discipline.

### 4.4. Carousel Mechanics
- **Touch-First**: Native momentum scrolling with CSS `scroll-snap-type: x mandatory` and `scroll-snap-align: start`.
- **Progress Line**: Fixed height 2px bar. Filled segment smoothly tracks current slide ratio (`width: calc((currentIndex + 1) / totalCount * 100%)`).
- **Desktop Navigation**: Discreet left/right round arrow buttons (`←` / `→`) with hover feedback.

### 4.5. Navigation System
- **Desktop Header**: Sticky top, `height: 4.5rem`, transparent over hero, blur white/dark on scroll. Direct access to `Runs`, `Disciplines`, `Recaps`, `About`, `Join Club`.
- **Mobile Ergonomic Architecture**:
  - Top: Minimal brand mark (`ÖzÜ RC`).
  - Fixed Bottom Bar (`height: 3.75rem`):
    - `[ 🔍 Search / Filter ]`
    - `[ 🏃 Next Run RSVP ]`
    - `[ 📸 Recaps / Strava ]`
    - `[ ☰ Menu Drawer ]`
  - Fullscreen Drawer: High-impact minimal overlay with oversized navigational links, social channels, and emergency campus contacts.

---

## 5. Motion & Kinetic Language

- **Spring-based Transitions**: No stiff linear transitions. Use spring physics (`damping: 24, stiffness: 220`).
- **Micro-Cadence**: Buttons and cards respond immediately to touch with subtle scale (`scale(0.98)` on tap).
- **Smooth Image Reveals**: Photos fade in with a crisp 0.4s ease-out curve upon loading, avoiding layout shifts.
- **Ticker / Live Marquee**: Steady, deliberate marquee ticker for next-run alert (e.g. `NEXT RUN: THURSDAY 18:30 — ÇEKMEKÖY CAMPUS LOOP — MEET AT ATHLETIC CENTER`).
