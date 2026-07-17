# NEXUS CRAFT v2 — "The Golden Thread" Redesign Spec

Date: 2026-07-17. Supersedes the visual/experience layer of the v1 spec
(`2026-07-17-nexus-craft-design.md`). Brand, copy, contacts, palette and
type roles carry over verbatim from v1 — this spec changes the
*experience architecture* only. v1 is preserved at git tag `v1-classic`.

## Verdict driving the redesign

v1 was clean but conventional: predictable section stack, timid hero
effect, no choreography, polite typography. v2 must read "legendary" —
a site a client remembers and quotes. Authority for all creative calls
was delegated to the implementer by the user.

## Organizing concept — one golden thread

NEXUS = connection point. A single golden-line motif carries the whole
page: the preloader ring draws itself → the hero constellation connects
lines to the cursor → a hairline rail runs the services index → the
price panel border draws itself → the process timeline draws through
three igniting nodes → the thread ends as the drawn underline beneath
the phone number in the finale. Implemented as independent per-section
segments (robust across breakpoints) that read as one continuous motif.

## Stack decision

- Vanilla HTML/CSS/JS, zero build step, static Vercel deploy (unchanged).
- **Motion** (Framer Motion's official vanilla engine, motion.dev v12)
  vendored at `js/vendor/motion.min.js`, UMD global `window.Motion`.
  Used for: springs, `inView` reveals, `scroll()`-linked animation,
  `stagger`.
- **Lenis** (inertia smooth scroll) vendored at `js/vendor/lenis.min.js`,
  global `Lenis`. Desktop fine-pointer only; disabled for touch and
  reduced-motion. Anchor links routed through `lenis.scrollTo`.
- App code as three classic deferred scripts (IIFEs, no modules):
  `js/app.js` (boot, preloader, lenis, cursor, marquee, global reveals),
  `js/hero.js` (constellation canvas v2 + hero intro + parallax),
  `js/scenes.js` (services, price odometer, process thread, CTA, footer).
  v1 `script.js` is deleted.

## Scene specifications

### 0. Preloader (first visit per session only; sessionStorage `nc_intro=1`)
Ink screen. SVG ring (the logo circle) draws stroke 0→100% in ~0.9s
ease-out while a mono tabular counter ticks 000→100 bottom-right and
"NEXUS CRAFT" fades in under the ring. At ~0.95s the overlay splits as
two vertical curtain panels (translateY, cubic-bezier(0.76,0,0.24,1),
0.6s) revealing the hero. Total ≤1.6s. Skipped entirely (removed from
DOM) on revisit or reduced-motion. Page is scroll-locked during it.

### 1. Hero — "Connect"
- Constellation canvas v2: ~26 nodes desktop / ~14 mobile placed around
  edges + midfield; thin gold lines from nodes to a focal point driven
  by a **spring integrator** (stiffness ≈ 90, damping ≈ 18 — visible
  life/overshoot, unlike v1's flat lerp); nodes near the focal point
  also interconnect (threshold ≈ 160px) for a triangulated web; gold
  dot nodes pulse subtly. Idle: focal point drifts on a slow Lissajous
  path. Canvas pauses (`cancelAnimationFrame`) when hero exits viewport.
  DPR capped at 2.
- Headline at clamp(2.6rem, 8.5vw, 7.5rem), weight 800; each line
  wrapped in an overflow mask and springs up (y 110%→0, 0.9s,
  ease [0.22,1,0.36,1], stagger 0.09s) after the curtain. "Googled" in
  Playfair italic gold; an SVG hand-drawn ellipse draws itself around
  the word (~0.7s) once its line lands. "What did they find?" is a
  second, offset line in silver at a smaller scale for asymmetry.
- Hero footer (phone + price) unchanged copy; phone link is magnetic
  (translate toward cursor within ~120px radius, spring return).
- Scroll indicator: 1px gold line bottom-center, stretching/pulsing.
- Leaving the hero: content layers parallax up at different rates with
  slight scale/fade (scroll-linked) — a camera move, not a scroll.

### 2. Marquee — tagline band
"CONNECT · CREATE · ELEVATE · NEXUS CRAFT · " repeated; hollow outline
type (1px gold `-webkit-text-stroke`, transparent fill) at
clamp(4rem, 7vw, 7rem), one word per cycle solid gold. Infinite loop
(x translate, duplicated content); base speed ~60px/s; scroll velocity
(from Lenis) adds speed and flips direction with scroll direction.
Static (no loop) under reduced-motion.

### 3. Services — "THE FULL TOOLKIT" as editorial index
Card grid is replaced by seven full-width numbered ledger rows:
mono number (01–07) — action word (BUILD…) huge
(clamp(2.2rem, 5.5vw, 4.5rem), weight 800, uppercase) — service name
(serif) + one-line description right column. Hairline separators draw
in (scaleX 0→1) on reveal; rows stagger up on `inView`. Hover: a gold
wash (≈8% opacity) sweeps across (scaleX, origin left), the action word
fills from outline to solid gold, row content nudges right, an →
appears. All copy verbatim from v1. Footer line + "SEE THE NUMBER →"
(magnetic; routed through Lenis to `#pricing`).

### 4. Pricing — "THE OFFER" as pinned theater
Sticky stage inside a ~190vh container: as it pins, the backdrop
darkens/vignettes. "THE WHOLE STUDIO, ONE PRICE" (promoted to `<h2>` —
existing copy, better semantics), then **₹5,999 rolls in as a
slot-machine odometer** — each digit a vertical 0–9 strip translated
with a spring (stiffness ≈ 80, damping ≈ 16), staggered ~80ms
right-to-left, triggered once on `inView`; size up to ~18vw, gold,
tabular mono. A radial gold bloom + expanding 1px ring fire as it
lands. Then subline, body, and the 7 checklist chips cascade
(scale 0.85→1, spring, stagger 60ms). The panel border draws itself
(SVG rect stroke) as the closing touch. No pin on mobile/reduced-motion
— plain reveal, odometer still plays (instant under reduced-motion).

### 5. Process — the thread as timeline
The three steps sit along an SVG path (vertical on mobile, flowing on
desktop). Path draw is scroll-linked (`scroll()` + stroke-dashoffset,
offsets ≈ ['start 0.8','end 0.45']); as the thread reaches each node
the dot ignites (scale + ring pulse) and STEP copy reveals. Copy
verbatim. An sr-only `<h2>` ("Process") fixes the heading outline.

### 6. CTA — "Elevate," the inversion finale
The one inversion: a gold (#c9a24d) layer wipes up (scroll-linked
clip-path) until the section is gold with ink text — lights on.
Statement line huge serif with italic "deserves"; phone number colossal
(clamp ~ 3rem→8rem), ink, magnetic, its gold→ink underline **draws in**
as the thread's terminus; on hover digits do a quick stagger lift wave.
Sub-line mono. Focus outlines flip to ink here. Copy verbatim + sr-only
`<h2>`.

### 7. Footer
Back to ink over a hairline. Same content/links/SVG icons as v1, springy
icon hovers, plus a giant clipped "NEXUS CRAFT" ghost wordmark
(~15vw, outline at ~4% opacity, cropped by the bottom edge).

## Global craft systems

- **Custom cursor** (only `(pointer:fine)` and not reduced-motion):
  6px gold-hi dot (tight spring) + 34px 1px gold ring (lazier spring).
  Over `[data-cursor="call"]` grows and shows mono label "CALL"; over
  the Instagram link shows "OPEN". Native cursor hidden only while
  custom cursor is active; `mix-blend-mode: difference` keeps it
  visible over the gold CTA.
- **Film grain**: full-page SVG feTurbulence data-URI overlay,
  opacity ≈ 0.035, static, `pointer-events:none`, above sections below
  cursor/preloader.
- **Selection** gold on ink; **scrollbar** thin gold thumb on ink.
- **Favicon**: inline SVG data-URI — thin gold ring on ink (geometric,
  not a logo substitute).
- **Header logo img**: keeps `src="assets/logo.png"`; `onerror` hides
  the img (no broken glyph, no invented placeholder) until the real
  file is dropped in.
- **Fonts**: add Inter 900 and Playfair Display 700-italic to the
  existing Google Fonts request.

## Reduced-motion matrix (`prefers-reduced-motion: reduce`)

No preloader; Lenis off (native scroll); constellation renders one
static frame; all `inView`/scroll reveals apply final state instantly;
marquee static; no pin; odometer shows ₹5,999 immediately; thread fully
drawn; no cursor, no magnetic effects, no hover motion beyond color.
Full content parity.

## Performance budget

Vendored JS ≈ 155KB raw (~55KB gz) total; no other additions. All
animation transform/opacity/clip-path only; scroll listeners passive;
`will-change` only on actively animating layers; canvas rAF paused
off-screen; DPR ≤ 2; 60fps target on mid-range mobile.

## Accessibility

Semantics and landmarks preserved; heading outline repaired via
promoted/sr-only `<h2>`s (visible copy unchanged); all decorative
layers `aria-hidden`; focus-visible everywhere (ink variant on gold);
contrast: ink-on-gold ≈ 9:1 (AA/AAA large); content never gated behind
animation.

## Deploy

`vercel.json` cache rule extended to cover `js/` (immutable vendor
files). README updated for the new structure. Same zero-config static
deploy.

## Out of scope

No copy changes beyond semantics noted above; no CMS/forms/analytics;
no React/build step; logo file still user-supplied.
