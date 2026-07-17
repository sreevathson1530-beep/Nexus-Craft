# NEXUS CRAFT v2 "Golden Thread" Implementation Plan

> **For agentic workers:** Executed inline by the session author (superpowers:executing-plans style) — the author holds full design context, so steps specify exact deliverables/values rather than duplicated verbatim code. Spec: `docs/superpowers/specs/2026-07-17-nexus-craft-v2-legendary-design.md` (authoritative for every value cited here).

**Goal:** Rebuild the NEXUS CRAFT one-pager as the "Golden Thread" cinematic experience on the vanilla + vendored Motion/Lenis stack.

**Architecture:** `index.html` + `styles.css` rewritten; `script.js` deleted, replaced by `js/app.js`, `js/hero.js`, `js/scenes.js` (classic deferred IIFEs) + `js/vendor/{motion,lenis}.min.js`.

**Tech Stack:** HTML5, CSS3, vanilla JS, Motion v12 UMD (`window.Motion`), Lenis v1 (`globalThis.Lenis`).

## Global Constraints

- All copy, contacts, palette, type roles verbatim from v1 spec; visible copy changes forbidden (sr-only headings and semantic promotions allowed per v2 spec).
- Zero build step; only the two vendored libs; static Vercel deploy.
- `prefers-reduced-motion: reduce` → full matrix in v2 spec (content parity, no animation).
- 60fps: transform/opacity/clip-path only; passive listeners; canvas pauses off-screen; DPR ≤ 2.
- v1 recoverable at tag `v1-classic`.

---

### Task 1: Foundations
- [x] Tag `v1-classic`; vendor `motion.min.js` + `lenis.min.js` into `js/vendor/` (done pre-plan)
- [ ] Commit vendor files + spec + this plan
- [ ] Update `vercel.json` cache rule to cover `js/(.*)` alongside `assets/(.*)`

### Task 2: index.html rewrite
- [ ] Full new document: fonts link (+ Inter 900, Playfair 700 italic), SVG data-URI favicon, grain/grid/glow layers, preloader markup, custom-cursor mount, header (logo img with onerror-hide + wordmark)
- [ ] Scenes: hero (canvas, masked headline lines with `Googled` em + ellipse SVG, offset second line, footer bar, scroll indicator), marquee band, services editorial index (7 rows, verbatim copy, `data-cursor` hooks), pricing pinned stage (odometer digit strips markup, `<h2>` eyebrow, checklist), process timeline (SVG path + 3 nodes, sr-only h2), gold CTA (sr-only h2, per-char phone spans), footer (v1 content + ghost wordmark)
- [ ] Scripts: three deferred classic tags (vendor motion, vendor lenis, app, hero, scenes); delete `script.js`
- [ ] Commit

### Task 3: styles.css rewrite — system + chrome
- [ ] Tokens (v1 palette + glow/wash derivatives), reset, base type, selection, scrollbar, focus (+ ink variant on gold), grain/grid/glow layers, sr-only utility
- [ ] Preloader, custom cursor, header, magnetic-target base styles
- [ ] Commit (site may look unstyled mid-rewrite; Tasks 3–4 land together if needed)

### Task 4: styles.css rewrite — scenes + responsive
- [ ] Hero (type scale, masks, ellipse, footer bar, indicator), marquee (outline type, loop track), services index rows (+ hover wash/fill/arrow), pricing stage (sticky container, odometer strips, bloom, chips, drawn border), process (path, nodes, steps), CTA (gold wipe layer, colossal phone, underline terminus), footer (+ ghost wordmark)
- [ ] Breakpoints ~640/960/1280; reduced-motion CSS (final states, no transitions); print-safe none required
- [ ] Commit

### Task 5: js/app.js — boot, preloader, lenis, cursor, marquee, reveals
- [ ] Feature gates: `reduceMotion`, `finePointer`, `Motion`/`Lenis` presence guards
- [ ] Preloader sequence (sessionStorage skip, scroll lock, ring draw + counter + curtain, DOM removal)
- [ ] Lenis init (desktop fine-pointer, anchors via `scrollTo`), velocity feed
- [ ] Custom cursor (dot/ring springs, `data-cursor` labels, blend mode)
- [ ] Marquee loop with velocity/direction coupling
- [ ] Generic `inView` reveal system (`[data-reveal]`, masks, hairline draws, staggers)
- [ ] Commit

### Task 6: js/hero.js — constellation v2 + intro + parallax
- [ ] Spring-integrated focal point (k≈90, d≈18), node web with interconnect threshold, pulse dots, idle Lissajous, DPR ≤ 2, rAF pause off-screen, resize rebuild, reduced-motion static frame
- [ ] Intro choreography post-curtain: masked line springs, ellipse draw around "Googled", footer/indicator entrance
- [ ] Scroll-linked hero parallax/fade layers; magnetic phone
- [ ] Commit

### Task 7: js/scenes.js — services, odometer, thread, CTA, footer
- [ ] Services rows: reveal staggers, hover wash/fill (CSS-driven where possible), magnetic "SEE THE NUMBER"
- [ ] Odometer: digit strip springs (k≈80, d≈16, 80ms stagger, once), bloom/ring, chip cascade, panel border draw; pin progress dimming via `scroll()`
- [ ] Process thread: scroll-linked path draw + node ignition + step reveals
- [ ] CTA: gold wipe (scroll-linked clip-path), underline draw terminus, digit hover wave, ink focus context class
- [ ] Footer reveals + icon springs
- [ ] Commit

### Task 8: Integration QA + docs
- [ ] Console-clean load; reduced-motion pass; 375/768/1024/1440 layout pass; anchor/tel/mailto audit; Lighthouse-style sanity (no layout thrash patterns)
- [ ] README refresh (structure, vendor note, deploy unchanged); final commit
- [ ] Browser screenshot verification via Chrome tools if the extension connects; otherwise user eyeballs localhost:5500
