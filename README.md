# NEXUS CRAFT

Single-page marketing site for NEXUS CRAFT — Website Development Studio.
v2 "Golden Thread" cinematic experience: preloader brand moment,
spring-physics hero constellation, velocity-reactive marquee, editorial
services index, odometer price reveal, scroll-drawn process thread, and
a gold-inverted finale.

## Stack

Vanilla HTML/CSS/JS with two vendored libraries — no build step, no
node_modules, no framework:

- `js/vendor/motion.min.js` — Motion v12, Framer Motion's official
  vanilla engine (springs, inView, scroll-linked animation, stagger)
- `js/vendor/lenis.min.js` — Lenis inertia smooth scrolling
  (desktop fine-pointer only)

## Structure

```
index.html      all markup (scenes carry data-* animation hooks)
styles.css      design tokens + every scene's styles + reduced-motion matrix
js/app.js       boot, preloader, Lenis, custom cursor, marquee, generic reveals
js/hero.js      hero constellation canvas, intro choreography, exit parallax
js/scenes.js    services index, price odometer theater, process thread, CTA finale
```

All motion respects `prefers-reduced-motion: reduce` (full content
parity, zero animation). The intro preloader plays once per browser
session (`sessionStorage` key `nc_intro`).

## Local development

Serve the folder with any static server (needed for correct font/asset
loading; opening `index.html` directly also works in a pinch):

```
npx serve .
```

## Before deploying

Drop the studio logo at `assets/logo.png` — the header hides the image
slot until the file exists, so nothing looks broken without it.

## Deploy to Vercel

```
npm i -g vercel   # if not already installed
vercel             # preview deploy
vercel --prod      # production deploy
```

No build command or output directory configuration is needed — this is
a static site. `vercel.json` adds immutable caching for `assets/` and
`js/`.

The pre-redesign version is preserved at git tag `v1-classic`.
