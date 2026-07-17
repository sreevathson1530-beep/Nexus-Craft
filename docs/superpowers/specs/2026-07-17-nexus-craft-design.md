# NEXUS CRAFT — Single-Page Website Design Spec

Date: 2026-07-17

## Purpose

A single-page marketing site for NEXUS CRAFT, a one-person website
development studio, selling a flat-price (₹5,999) bundle of seven
services. Goal: convert visitors into a phone call. Deploy-ready for
Vercel as a static site — no framework, no build step.

## Brand

- Name: NEXUS CRAFT — tagline "Connect · Create · Elevate"
- Logo: interlocking gold "N" + silver "C" monogram inside a thin
  circular ring, above the wordmark. Served from `/assets/logo.png`.
  File will be provided by the user and dropped into `assets/`; the
  `<img>` markup is wired to that path from the start (no placeholder
  SVG needed).
- Palette (CSS custom properties):
  - `--bg: #0a0a0a` (near-black, slight navy undertone)
  - `--gold: #c9a24d`, `--gold-hi: #e8c170`
  - `--silver: #b8b8b8`, `--silver-hi: #e4e4e4`
  - `--text: #e9e4d6` (warm off-white)
- Type (Google Fonts):
  - Display/serif/wordmark/italic emphasis: **Playfair Display**
  - Body/geometric sans: **Inter**
  - Eyebrows, price, phone number: **JetBrains Mono**, with
    `font-variant-numeric: tabular-nums`
- Background texture: faint CSS grid-line background image, one soft
  radial-gradient glow anchored to a top corner, low opacity.

## File Structure

```
nexus-craft/
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── logo.png          (provided by user)
├── vercel.json            (static caching headers, no build config needed)
└── README.md
```

## Content & Sections

All copy is fully specified by the user; this section records
structure/behavior only, not restating full copy (see original
request for verbatim text).

1. **Hero** — eyebrow, two-line headline (one word in italic serif),
   subhead, hero footer row (phone CTA left, price + "ALL SERVICES ·
   ONE FLAT PRICE" right). Canvas line-field animation behind/around
   the text (see Motion section).
2. **Services — "THE FULL TOOLKIT"** — eyebrow, heading, subhead, a
   responsive grid of 7 cards (BUILD, CONVERT, REFRESH, PROTECT,
   RANK, CONNECT, RESCUE), each with action-word label, service name,
   one-line description. Ends with a "SEE THE NUMBER →" anchor link
   scrolling to `#pricing`.
3. **Pricing — "THE OFFER"** (`id="pricing"`) — bordered panel,
   eyebrow, giant gold price, subline, body copy, a checklist row of
   the seven services with ✓ icons.
4. **Process** — 3-column "STEP 01/02/03" grid: CALL, CRAFT, LAUNCH.
5. **Closing CTA** — large statement line (italic on one word), huge
   centered clickable phone number underlined in gold, sub-line.
6. **Footer** — studio name (left) / "CRAFTED BY SREEVATHSON" (right),
   plus a small icon row: email (`mailto:`), phone (`tel:`),
   Instagram link.

## Hero Line-Field Animation (script.js)

- Single `<canvas>` positioned behind hero content, resized on load
  and on window resize using `devicePixelRatio` for crisp lines.
- 10–14 fixed anchor points distributed around the viewport edges
  (sides + corners).
- A focal point `{x, y}` lerps toward the live cursor position each
  animation frame at `factor ≈ 0.05`. When the cursor is idle (no
  `mousemove` for a short timeout), the target instead drifts slowly
  along a smooth idle path (e.g. Lissajous-style) so the field stays
  alive without user input.
- Each anchor draws a thin gold line to the focal point; opacity
  scales with proximity/length so the effect stays subtle, not neon.
- 3–4 additional faint fixed "horizon" lines get a slight parallax
  offset driven by the focal point's position (not the raw cursor),
  for a subtle depth layer.
- Entire loop runs on `requestAnimationFrame`; canvas redraw only, no
  DOM layout touched — keeps it off the main-thread layout/paint
  bottleneck.
- `prefers-reduced-motion: reduce` → skip the rAF loop entirely and
  render a single static frame (anchors connected to viewport center,
  no drift, no cursor tracking).

## Scroll Reveals

A single shared `IntersectionObserver` toggles a `.reveal` class on
section-level containers, animating `opacity` + `transform:
translateY(...)` only (GPU-friendly, no layout thrash). Under
`prefers-reduced-motion: reduce`, the class is applied immediately
with no transition (content just appears).

## Responsive Behavior

Mobile-first CSS with breakpoints at roughly 640px / 960px / 1280px:

- Services grid: CSS grid with `auto-fit`/`minmax`, reflows
  1 → 2 → 3 columns.
- Process section: 3-column grid, stacks to 1 column under ~760px.
- Pricing checklist row: wraps freely on narrow viewports.
- Hero headline/type scale uses `clamp()` for fluid sizing.

## Accessibility

- Semantic landmarks: `header`, `main`, `section`s, `footer`.
- Visible focus states styled in gold on all interactive elements.
- `tel:`/`mailto:`/Instagram links are native anchors, not JS-driven.
- `alt` text on the logo image.
- Text contrast checked against `--bg`: off-white body text passes
  WCAG AA; gold/silver reserved for accents and large display text.
- Reduced-motion respected in both the hero canvas and scroll reveals
  (see above).

## Deployment

- Git repository initialized locally at `C:\Users\sreev\nexus-craft`.
- `vercel.json` included with minimal static-asset caching config;
  no build step required since this is plain HTML/CSS/JS.
- User will push to GitHub and import into Vercel (or request a
  direct `vercel deploy` once the build is complete).

## Out of Scope

- No CMS, no backend, no forms/analytics beyond what's described.
- No additional animation beyond the one hero line-field moment and
  the section scroll-reveals (per the user's explicit motion rules —
  no scattered effects elsewhere).
- Logo file itself is not generated; only the markup/asset path is
  prepared for it.
