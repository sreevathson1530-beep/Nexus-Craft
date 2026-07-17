# NEXUS CRAFT Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the NEXUS CRAFT single-page marketing site (vanilla HTML/CSS/JS) exactly as specified in `docs/superpowers/specs/2026-07-17-nexus-craft-design.md`, deploy-ready for Vercel.

**Architecture:** Three files — `index.html` (all markup, sections wired with placeholder comments filled in incrementally), `styles.css` (custom-property design tokens + one rule block per section, appended incrementally), `script.js` (two self-contained IIFEs: hero canvas line-field animation, and scroll-reveal IntersectionObserver). No build step, no dependencies, no framework.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, grid, clamp), vanilla JS (Canvas 2D API, IntersectionObserver), Google Fonts (Playfair Display, Inter, JetBrains Mono).

## Global Constraints

- Static site only: vanilla HTML/CSS/JS, no build step, no npm dependencies, no framework.
- Fully responsive; deploy-ready for Vercel as a static site.
- Copy, palette, and typography must match the spec exactly — do not reword or restyle beyond what's documented.
- Motion is limited to two things: the hero canvas line-field, and section-level scroll reveals. Nothing else animates. `prefers-reduced-motion: reduce` must be respected by both.
- No automated test framework is introduced (YAGNI, per project instructions) — verification is manual, browser-based, described concretely in each task.
- Phone number everywhere: `+91 63698 85901` → `tel:+916369885901`. Email: `nexuscraftstudio.co@gmail.com` → `mailto:`. Instagram: `@nexuscraft_websitescreation` → `https://instagram.com/nexuscraft_websitescreation`.
- Logo file `assets/logo.png` is provided by the user later; markup is wired to that path with alt text from the start — do not generate a placeholder graphic.
- Working directory: `C:\Users\sreev\nexus-craft` (git repo already initialized, local identity set).

---

### Task 1: Project scaffold — HTML skeleton, base CSS, header

**Files:**
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Produces: page skeleton with section ids `#hero`, `#services`, `#pricing`, `#process`, `#cta`, each containing an HTML comment placeholder (`<!-- HERO_CONTENT -->`, `<!-- SERVICES_CONTENT -->`, `<!-- PRICING_CONTENT -->`, `<!-- PROCESS_CONTENT -->`, `<!-- CTA_CONTENT -->`) that later tasks replace with real markup. Services/pricing/process/cta sections carry class `reveal` from the start.
- Produces: `styles.css` design tokens (`--bg`, `--gold`, `--gold-hi`, `--silver`, `--silver-hi`, `--text`, `--text-dim`, `--font-serif`, `--font-sans`, `--font-mono`, `--container`), utility class `.container`, base reset, `.eyebrow`, `.reveal`/`.reveal.is-visible`, header/brand styles, and empty section anchor comments (`/* == HERO == */`, `/* == SERVICES == */`, `/* == PRICING == */`, `/* == PROCESS == */`, `/* == CTA == */`, `/* == FOOTER == */`) that later tasks replace with real rules.
- Consumes: nothing (first task).

- [ ] **Step 1: Create `index.html`**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NEXUS CRAFT — Website Development Studio</title>
<meta name="description" content="NEXUS CRAFT builds fast, beautiful, conversion-ready websites for businesses that mean business. Every service, one flat price: ₹5,999.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="bg-grid" aria-hidden="true"></div>
<div class="bg-glow" aria-hidden="true"></div>

<header class="site-header">
  <div class="header-inner">
    <a href="#top" class="brand">
      <img src="assets/logo.png" alt="NEXUS CRAFT logo" class="brand-logo" width="40" height="40">
      <span class="brand-word">NEXUS CRAFT</span>
    </a>
  </div>
</header>

<main id="top">
  <section id="hero" class="hero">
    <canvas id="hero-canvas" class="hero-canvas" aria-hidden="true"></canvas>
    <!-- HERO_CONTENT -->
  </section>

  <section id="services" class="reveal">
    <!-- SERVICES_CONTENT -->
  </section>

  <section id="pricing" class="reveal">
    <!-- PRICING_CONTENT -->
  </section>

  <section id="process" class="reveal">
    <!-- PROCESS_CONTENT -->
  </section>

  <section id="cta" class="reveal">
    <!-- CTA_CONTENT -->
  </section>
</main>

<footer class="site-footer">
  <!-- FOOTER_CONTENT -->
</footer>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `styles.css`**

```css
:root {
  --bg: #0a0a0a;
  --gold: #c9a24d;
  --gold-hi: #e8c170;
  --silver: #b8b8b8;
  --silver-hi: #e4e4e4;
  --text: #e9e4d6;
  --text-dim: rgba(233, 228, 214, 0.65);
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --container: 1180px;
}

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img { max-width: 100%; display: block; }

a { color: inherit; text-decoration: none; }

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--gold-hi);
  outline-offset: 3px;
}

.container {
  width: min(92%, var(--container));
  margin-inline: auto;
}

.bg-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(184, 184, 184, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184, 184, 184, 0.05) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse at top, black, transparent 75%);
  mask-image: radial-gradient(ellipse at top, black, transparent 75%);
}

.bg-glow {
  position: fixed;
  top: -10%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  max-width: 900px;
  max-height: 900px;
  background: radial-gradient(circle, rgba(201, 162, 77, 0.1), transparent 60%);
  z-index: 0;
  pointer-events: none;
}

.site-header {
  position: relative;
  z-index: 2;
  padding: 1.5rem 0 0;
}

.header-inner {
  width: min(92%, var(--container));
  margin-inline: auto;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.brand-word {
  font-family: var(--font-serif);
  letter-spacing: 0.04em;
  font-size: 1.05rem;
  color: var(--text);
}

.eyebrow {
  font-family: var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
  margin: 0;
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

/* == HERO == */

/* == SERVICES == */

/* == PRICING == */

/* == PROCESS == */

/* == CTA == */

/* == FOOTER == */
```

- [ ] **Step 3: Verify in browser**

Open `index.html` directly in a browser (double-click, or File → Open).
Expected: near-black page, faint grid texture with a soft gold glow in the top-right corner, "NEXUS CRAFT" wordmark top-left in serif type (logo image will 404 silently since `assets/logo.png` doesn't exist yet — that's expected until the user adds it), no visible content below the header yet (sections are empty), no console errors other than the expected 404 for the logo image.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Scaffold NEXUS CRAFT page skeleton, design tokens, and header"
```

---

### Task 2: Hero section

**Files:**
- Modify: `index.html` (replace `<!-- HERO_CONTENT -->`)
- Modify: `styles.css` (replace `/* == HERO == */`)

**Interfaces:**
- Consumes: `.eyebrow`, `.container` sizing pattern, design tokens from Task 1.
- Produces: `.hero-inner`, `.hero-headline`, `.hero-subhead`, `.hero-footer`, `.hero-call`, `.call-label`, `.hero-phone`, `.hero-price-block`, `.hero-price`, `.hero-price-label` classes. `#hero-canvas` element remains empty (no drawing) until Task 3.

- [ ] **Step 1: Replace `<!-- HERO_CONTENT -->` in `index.html`**

```html
    <div class="hero-inner">
      <p class="eyebrow">NEXUS CRAFT · WEBSITE DEVELOPMENT STUDIO</p>
      <h1 class="hero-headline">Your next customer just <em>Googled</em> you. What did they find?</h1>
      <p class="hero-subhead">A great business with a weak website is a secret — and secrets don't sell. NEXUS CRAFT builds fast, beautiful, conversion-ready websites for businesses that mean business. Every service we offer, bundled at one flat, honest price.</p>
      <div class="hero-footer">
        <div class="hero-call">
          <p class="call-label">CALL US — 10 MINUTES IS ENOUGH</p>
          <a href="tel:+916369885901" class="hero-phone">+91 63698 85901</a>
        </div>
        <div class="hero-price-block">
          <p class="hero-price">₹5,999</p>
          <p class="hero-price-label">ALL SERVICES · ONE FLAT PRICE</p>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Replace `/* == HERO == */` in `styles.css`**

```css
/* == HERO == */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 6rem 0 2.5rem;
}

.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: min(92%, var(--container));
  margin-inline: auto;
}

.hero-headline {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw + 1rem, 4.2rem);
  line-height: 1.08;
  margin: 1.25rem 0 1.5rem;
  max-width: 16ch;
}

.hero-headline em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 500;
  color: var(--gold-hi);
}

.hero-subhead {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-dim);
  max-width: 52ch;
  margin-bottom: 3rem;
}

.hero-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  border-top: 1px solid rgba(184, 184, 184, 0.15);
  padding-top: 1.75rem;
}

.call-label {
  font-family: var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.7rem;
  color: var(--silver);
  margin: 0;
}

.hero-phone {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: var(--text);
  display: inline-block;
  margin-top: 0.4rem;
  border-bottom: 1px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.hero-phone:hover,
.hero-phone:focus-visible {
  color: var(--gold-hi);
  border-color: var(--gold-hi);
}

.hero-price-block {
  text-align: right;
}

.hero-price {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  color: var(--gold);
  margin: 0;
}

.hero-price-label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--silver);
  margin-top: 0.35rem;
}

@media (max-width: 640px) {
  .hero-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-price-block {
    text-align: left;
  }
}
```

- [ ] **Step 3: Verify in browser**

Reload `index.html`. Expected: full-height hero with eyebrow, large headline with "Googled" in italic gold serif, subhead paragraph, and a bottom row with the clickable phone number on the left and "₹5,999 / ALL SERVICES · ONE FLAT PRICE" right-aligned on desktop widths. Resize the window down to ~375px wide (or use DevTools device toolbar) — the price block should drop to left-aligned and stack under the phone row instead of overlapping.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add hero section markup and styles"
```

---

### Task 3: Hero canvas line-field animation

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `#hero-canvas` (canvas element), `#hero` (its positioning container) from Task 1/2.
- Produces: a self-running IIFE that draws the animation; no exported functions (later tasks append a second, independent IIFE to the same file for scroll reveals — see Task 8).

- [ ] **Step 1: Create `script.js` with the hero animation**

```js
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildAnchors() {
    const edge = 24;
    return [
      { x: edge, y: edge },
      { x: width / 2, y: edge },
      { x: width - edge, y: edge },
      { x: edge, y: height / 2 },
      { x: width - edge, y: height / 2 },
      { x: edge, y: height - edge },
      { x: width / 2, y: height - edge },
      { x: width - edge, y: height - edge },
      { x: width * 0.25, y: edge },
      { x: width * 0.75, y: edge },
      { x: width * 0.25, y: height - edge },
      { x: width * 0.75, y: height - edge }
    ];
  }

  let anchors = [];
  const focal = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let idleAngle = 0;
  let lastMoveTime = 0;
  const IDLE_DELAY = 2200;
  const LERP = 0.05;

  function onPointerMove(e) {
    const rect = hero.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    lastMoveTime = performance.now();
  }

  function updateIdleTarget() {
    idleAngle += 0.004;
    target.x = width / 2 + Math.cos(idleAngle) * width * 0.18;
    target.y = height / 2 + Math.sin(idleAngle * 1.3) * height * 0.14;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    const parallaxX = (focal.x / width - 0.5) * 16;
    ctx.strokeStyle = 'rgba(184,184,184,0.06)';
    ctx.lineWidth = 1;
    const horizonYs = [0.28, 0.42, 0.58, 0.72];
    horizonYs.forEach((fy, i) => {
      const y = height * fy;
      ctx.beginPath();
      ctx.moveTo(-20 + parallaxX * (i + 1) * 0.4, y);
      ctx.lineTo(width + 20 + parallaxX * (i + 1) * 0.4, y);
      ctx.stroke();
    });

    const maxDist = Math.sqrt(width * width + height * height);
    anchors.forEach((a) => {
      const dx = focal.x - a.x;
      const dy = focal.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const opacity = Math.max(0.04, 0.22 * (1 - dist / maxDist));
      ctx.strokeStyle = `rgba(201,162,77,${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(focal.x, focal.y);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.fillStyle = 'rgba(232,193,112,0.5)';
    ctx.arc(focal.x, focal.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    const now = performance.now();
    if (now - lastMoveTime > IDLE_DELAY) {
      updateIdleTarget();
    }
    focal.x += (target.x - focal.x) * LERP;
    focal.y += (target.y - focal.y) * LERP;
    drawFrame();
    requestAnimationFrame(tick);
  }

  function drawStaticFrame() {
    focal.x = width / 2;
    focal.y = height / 2;
    drawFrame();
  }

  function init() {
    resize();
    anchors = buildAnchors();
    focal.x = target.x = width / 2;
    focal.y = target.y = height / 2;

    if (reduceMotion) {
      drawStaticFrame();
      return;
    }

    hero.addEventListener('mousemove', onPointerMove);
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resize();
    anchors = buildAnchors();
    if (reduceMotion) drawStaticFrame();
  });

  init();
})();
```

- [ ] **Step 2: Verify mouse tracking and idle drift**

Reload `index.html` in a browser with normal motion settings. Move the mouse around the hero area: thin gold lines from the anchor points around the edges should converge smoothly (not instantly) toward the cursor. Stop moving the mouse for ~3 seconds: the convergence point should start drifting slowly on its own instead of freezing. Open DevTools console: expect zero errors.

- [ ] **Step 3: Verify reduced-motion behavior**

In Chrome DevTools, open the Rendering tab (⋮ menu → More tools → Rendering) and set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Reload the page. Expected: a single static frame of lines converging on the center of the hero — no animation, no response to mouse movement, no console errors.

- [ ] **Step 4: Verify resize handling**

With normal motion settings, resize the browser window (or toggle DevTools device toolbar between a few widths). Expected: the canvas and its line field rescale to fill the hero without stretching, clipping, or leaving stale lines from the previous size.

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "Add hero canvas line-field animation"
```

---

### Task 4: Services section

**Files:**
- Modify: `index.html` (replace `<!-- SERVICES_CONTENT -->`)
- Modify: `styles.css` (replace `/* == SERVICES == */`)

**Interfaces:**
- Consumes: `.eyebrow`, `.container`, `.reveal` (already on `#services`) from Task 1.
- Produces: `.section-heading`, `.section-subhead` (reused by Task 6), `.services-grid`, `.service-card`, `.service-label`, `.service-name`, `.service-desc`, `.services-footer`, `.see-price-link`. Anchor link `href="#pricing"` targets the `#pricing` section id from Task 1.

- [ ] **Step 1: Replace `<!-- SERVICES_CONTENT -->` in `index.html`**

```html
    <div class="container">
      <p class="eyebrow">WHAT'S INCLUDED</p>
      <h2 class="section-heading">Everything your website needs. Nothing you don't.</h2>
      <p class="section-subhead">Seven services. One studio. One person who picks up the phone — no agencies, no middlemen, no "let me check with the team."</p>

      <div class="services-grid">
        <article class="service-card">
          <p class="service-label">BUILD</p>
          <h3 class="service-name">Custom Website Development</h3>
          <p class="service-desc">Designed from a blank canvas around your business, no templates, no lookalikes.</p>
        </article>
        <article class="service-card">
          <p class="service-label">CONVERT</p>
          <h3 class="service-name">Landing Pages</h3>
          <p class="service-desc">One page, one goal: turn clicks into calls, sign-ups, and sales.</p>
        </article>
        <article class="service-card">
          <p class="service-label">REFRESH</p>
          <h3 class="service-name">Website Redesign</h3>
          <p class="service-desc">Your business grew. Your website didn't. Let's fix that.</p>
        </article>
        <article class="service-card">
          <p class="service-label">PROTECT</p>
          <h3 class="service-name">Website Maintenance</h3>
          <p class="service-desc">Updates, backups, uptime, handled, while you run the business.</p>
        </article>
        <article class="service-card">
          <p class="service-label">RANK</p>
          <h3 class="service-name">Speed &amp; SEO Optimization</h3>
          <p class="service-desc">Loads in a blink. Ranks where your customers actually look.</p>
        </article>
        <article class="service-card">
          <p class="service-label">CONNECT</p>
          <h3 class="service-name">API &amp; Third-Party Integrations</h3>
          <p class="service-desc">Payments, WhatsApp, maps, bookings, everything wired to work together.</p>
        </article>
        <article class="service-card">
          <p class="service-label">RESCUE</p>
          <h3 class="service-name">Bug Fixes &amp; Support</h3>
          <p class="service-desc">Something broke at 9 PM? You have our number. Consider it handled.</p>
        </article>
      </div>

      <div class="services-footer">
        <p>All seven services. One flat price.</p>
        <a href="#pricing" class="see-price-link">SEE THE NUMBER →</a>
      </div>
    </div>
```

- [ ] **Step 2: Replace `/* == SERVICES == */` in `styles.css`**

```css
/* == SERVICES == */
#services {
  padding: 7rem 0;
  position: relative;
  z-index: 1;
}

.section-heading {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(1.8rem, 3.2vw, 2.75rem);
  margin: 1rem 0 1rem;
  max-width: 20ch;
}

.section-subhead {
  color: var(--text-dim);
  max-width: 58ch;
  line-height: 1.7;
  margin-bottom: 3rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.service-card {
  border: 1px solid rgba(184, 184, 184, 0.14);
  border-radius: 2px;
  padding: 1.75rem 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.015), transparent);
  transition: border-color 0.25s, transform 0.25s;
}

.service-card:hover {
  border-color: rgba(201, 162, 77, 0.45);
  transform: translateY(-2px);
}

.service-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: var(--gold);
  text-transform: uppercase;
  margin: 0;
}

.service-name {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  margin: 0.65rem 0 0.6rem;
  color: var(--text);
}

.service-desc {
  font-size: 0.92rem;
  color: var(--text-dim);
  line-height: 1.6;
  margin: 0;
}

.services-footer {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgba(184, 184, 184, 0.15);
  padding-top: 1.75rem;
}

.services-footer p {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  margin: 0;
}

.see-price-link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  border-bottom: 1px solid var(--gold);
  padding-bottom: 2px;
  transition: color 0.2s, border-color 0.2s;
}

.see-price-link:hover,
.see-price-link:focus-visible {
  color: var(--gold-hi);
  border-color: var(--gold-hi);
}
```

- [ ] **Step 3: Verify in browser**

Reload `index.html`. Expected: because `.reveal` starts at `opacity: 0` and this section has no observer yet (added in Task 8), the services section will currently render invisible until you inspect it — that's expected at this stage. Temporarily remove the `reveal` class from `#services` in DevTools' Elements panel (client-side only, don't edit the file) to check the layout: a 7-card grid that reflows to 1 column under ~640px, 2 columns around tablet widths, and 3 columns at desktop widths. Click "SEE THE NUMBER →" and confirm the browser jumps toward the (still-empty) pricing section anchor.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add services section markup and styles"
```

---

### Task 5: Pricing section

**Files:**
- Modify: `index.html` (replace `<!-- PRICING_CONTENT -->`)
- Modify: `styles.css` (replace `/* == PRICING == */`)

**Interfaces:**
- Consumes: `.eyebrow`, `.container`, `.reveal` (already on `#pricing`) from Task 1.
- Produces: `.pricing-panel`, `.price-giant`, `.price-subline`, `.pricing-body`, `.pricing-checklist`.

- [ ] **Step 1: Replace `<!-- PRICING_CONTENT -->` in `index.html`**

```html
    <div class="container">
      <div class="pricing-panel">
        <p class="eyebrow">THE WHOLE STUDIO, ONE PRICE</p>
        <p class="price-giant">₹5,999</p>
        <p class="price-subline">Every service. Flat. Final.</p>
        <p class="pricing-body">No hourly billing. No hidden add-ons. No "that'll be extra." You know the number before we write a single line of code.</p>
        <ul class="pricing-checklist">
          <li>Custom build</li>
          <li>Landing pages</li>
          <li>Redesign</li>
          <li>Maintenance</li>
          <li>Speed &amp; SEO</li>
          <li>Integrations</li>
          <li>Fixes &amp; support</li>
        </ul>
      </div>
    </div>
```

- [ ] **Step 2: Replace `/* == PRICING == */` in `styles.css`**

```css
/* == PRICING == */
#pricing {
  padding: 7rem 0;
  position: relative;
  z-index: 1;
}

.pricing-panel {
  border: 1px solid rgba(201, 162, 77, 0.35);
  padding: clamp(2rem, 5vw, 4rem);
  text-align: center;
  max-width: 760px;
  margin-inline: auto;
  background: radial-gradient(ellipse at top, rgba(201, 162, 77, 0.05), transparent 60%);
}

.price-giant {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--gold);
  font-size: clamp(3rem, 9vw, 5.5rem);
  line-height: 1;
  margin: 1.25rem 0 0.5rem;
}

.price-subline {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--silver-hi);
  font-size: 1.15rem;
  margin: 0 0 1.75rem;
}

.pricing-body {
  color: var(--text-dim);
  line-height: 1.8;
  max-width: 48ch;
  margin: 0 auto 2.25rem;
}

.pricing-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.03em;
}

.pricing-checklist li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
}

.pricing-checklist li::before {
  content: "✓";
  color: var(--gold);
}
```

- [ ] **Step 3: Verify in browser**

Reload `index.html`. As in Task 4, temporarily strip the `reveal` class from `#pricing` in DevTools to inspect layout. Expected: a centered bordered panel with the giant gold "₹5,999" price using tabular (monospace, evenly-spaced) digits, the seven-item checklist wrapping onto multiple lines at narrow widths without overlapping text. Confirm `#pricing` is the actual scroll target by clicking the services section's "SEE THE NUMBER →" link again now that this section has content — the browser should land on this panel.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add pricing section markup and styles"
```

---

### Task 6: Process section

**Files:**
- Modify: `index.html` (replace `<!-- PROCESS_CONTENT -->`)
- Modify: `styles.css` (replace `/* == PROCESS == */`)

**Interfaces:**
- Consumes: `.container`, `.reveal` (already on `#process`) from Task 1.
- Produces: `.process-grid`, `.process-step`, `.step-tag`, `.step-title`, `.step-desc`.

- [ ] **Step 1: Replace `<!-- PROCESS_CONTENT -->` in `index.html`**

```html
    <div class="container">
      <div class="process-grid">
        <div class="process-step">
          <span class="step-tag">STEP 01</span>
          <h3 class="step-title">CALL — Tell us about your business</h3>
          <p class="step-desc">Ten minutes on the phone is enough. What you do, who you serve, what you want the website to achieve.</p>
        </div>
        <div class="process-step">
          <span class="step-tag">STEP 02</span>
          <h3 class="step-title">CRAFT — We design and build</h3>
          <p class="step-desc">You keep running the business. We craft a site that looks premium, loads fast, and speaks to your customers.</p>
        </div>
        <div class="process-step">
          <span class="step-tag">STEP 03</span>
          <h3 class="step-title">LAUNCH — Your site goes live</h3>
          <p class="step-desc">Polished, tested, and ready to sell, with us on call for fixes, updates, and whatever comes next.</p>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Replace `/* == PROCESS == */` in `styles.css`**

```css
/* == PROCESS == */
#process {
  padding: 7rem 0;
  position: relative;
  z-index: 1;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

.process-step {
  border-top: 1px solid rgba(184, 184, 184, 0.2);
  padding-top: 1.5rem;
}

.step-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  color: var(--gold);
  display: block;
  margin-bottom: 0.5rem;
}

.step-title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  margin: 0.5rem 0 0.75rem;
}

.step-desc {
  color: var(--text-dim);
  line-height: 1.7;
  font-size: 0.95rem;
  margin: 0;
}

@media (max-width: 760px) {
  .process-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

- [ ] **Step 3: Verify in browser**

Reload `index.html`, strip `reveal` from `#process` in DevTools to inspect. Expected: three columns (STEP 01 CALL / STEP 02 CRAFT / STEP 03 LAUNCH) at desktop width. Narrow the viewport below ~760px: columns stack into a single vertical column in order.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Add process section markup and styles"
```

---

### Task 7: Closing CTA and footer

**Files:**
- Modify: `index.html` (replace `<!-- CTA_CONTENT -->` and `<!-- FOOTER_CONTENT -->`)
- Modify: `styles.css` (replace `/* == CTA == */` and `/* == FOOTER == */`)

**Interfaces:**
- Consumes: `.container`, `.reveal` (already on `#cta`) from Task 1.
- Produces: `.cta-line`, `.cta-phone`, `.cta-subline`, `.footer-inner`, `.footer-brand`, `.footer-credit`, `.footer-icons`.

- [ ] **Step 1: Replace `<!-- CTA_CONTENT -->` in `index.html`**

```html
    <div class="container">
      <p class="cta-line">Let's build the website your business <em>deserves</em>.</p>
      <a href="tel:+916369885901" class="cta-phone">+91 63698 85901</a>
      <p class="cta-subline">ONE CALL · ONE PRICE · ONE REMARKABLE WEBSITE</p>
    </div>
```

- [ ] **Step 2: Replace `<!-- FOOTER_CONTENT -->` in `index.html`**

```html
    <div class="container footer-inner">
      <p class="footer-brand">NEXUS CRAFT — WEBSITE DEVELOPMENT STUDIO</p>
      <div class="footer-icons">
        <a href="mailto:nexuscraftstudio.co@gmail.com" aria-label="Email NEXUS CRAFT">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
        </a>
        <a href="tel:+916369885901" aria-label="Call NEXUS CRAFT">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>
        <a href="https://instagram.com/nexuscraft_websitescreation" aria-label="NEXUS CRAFT on Instagram" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
        </a>
      </div>
      <p class="footer-credit">CRAFTED BY SREEVATHSON</p>
    </div>
```

- [ ] **Step 3: Replace `/* == CTA == */` and `/* == FOOTER == */` in `styles.css`**

```css
/* == CTA == */
#cta {
  padding: 8rem 0 6rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-line {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  max-width: 18ch;
  margin: 0 auto 2.5rem;
  line-height: 1.2;
}

.cta-line em {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--gold-hi);
  font-weight: 500;
}

.cta-phone {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: clamp(2.2rem, 7vw, 4rem);
  color: var(--gold);
  text-decoration: underline;
  text-decoration-color: var(--gold);
  text-underline-offset: 0.35em;
  display: inline-block;
  transition: color 0.2s;
}

.cta-phone:hover,
.cta-phone:focus-visible {
  color: var(--gold-hi);
}

.cta-subline {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--silver);
  margin-top: 1.75rem;
}

/* == FOOTER == */
.site-footer {
  border-top: 1px solid rgba(184, 184, 184, 0.15);
  padding: 2.5rem 0;
  position: relative;
  z-index: 1;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.footer-brand,
.footer-credit {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--silver);
  margin: 0;
}

.footer-icons {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.footer-icons a {
  color: var(--silver);
  transition: color 0.2s;
  display: inline-flex;
}

.footer-icons a:hover,
.footer-icons a:focus-visible {
  color: var(--gold-hi);
}

.footer-icons svg {
  width: 18px;
  height: 18px;
}
```

- [ ] **Step 4: Verify in browser**

Reload `index.html`, strip `reveal` from `#cta` in DevTools to inspect. Expected: centered closing statement with "deserves" in italic gold serif, a large gold phone number underlined below it, and the "ONE CALL · ONE PRICE · ONE REMARKABLE WEBSITE" subline. Below that, the footer shows the studio name on the left, three icon links (mail/phone/Instagram) in the middle, and "CRAFTED BY SREEVATHSON" on the right, wrapping to stacked rows on narrow viewports. Hover/focus each footer icon and confirm it turns gold. Inspect each link's `href` in DevTools to confirm `mailto:nexuscraftstudio.co@gmail.com`, `tel:+916369885901`, and `https://instagram.com/nexuscraft_websitescreation`.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "Add closing CTA and footer markup and styles"
```

---

### Task 8: Scroll-reveal animation

**Files:**
- Modify: `script.js` (append a second IIFE)

**Interfaces:**
- Consumes: `.reveal` / `.reveal.is-visible` CSS classes from Task 1, already present on `#services`, `#pricing`, `#process`, `#cta` from Task 1.
- Produces: nothing consumed by later tasks — this is the last behavioral piece.

- [ ] **Step 1: Append the reveal observer to `script.js`**

```js

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();
```

- [ ] **Step 2: Verify normal-motion behavior**

Reload `index.html` with default browser motion settings. All four lower sections (services, pricing, process, cta) should now be visible without needing DevTools tricks (each fades/slides up automatically once it scrolls into view). Scroll from top to bottom slowly: each section should fade+slide in once as it enters the viewport and stay visible afterward (no re-triggering when scrolling back up and down again). Check the console: zero errors.

- [ ] **Step 3: Verify reduced-motion behavior**

With DevTools "Emulate CSS media feature prefers-reduced-motion: reduce" still enabled (from Task 3), reload the page. Expected: every section is visible immediately on load with no fade/slide transition at all — content just appears in place.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Add scroll-reveal animation for section entries"
```

---

### Task 9: Final integration, responsive/accessibility QA, and deploy prep

**Files:**
- Create: `vercel.json`
- Create: `README.md`

**Interfaces:**
- Consumes: the complete site from Tasks 1–8.
- Produces: nothing further (final task).

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create `README.md`**

```markdown
# NEXUS CRAFT

Single-page marketing site for NEXUS CRAFT — Website Development Studio.

## Stack

Vanilla HTML/CSS/JS. No build step, no dependencies, no framework.

## Local development

Open `index.html` directly in a browser, or serve the folder with any static server:

```
npx serve .
```

## Before deploying

Drop the studio logo at `assets/logo.png` (referenced by the header brand markup and used as its `alt` text source).

## Deploy to Vercel

```
npm i -g vercel   # if not already installed
vercel             # preview deploy
vercel --prod      # production deploy
```

No build command or output directory configuration is needed — this is a static site.
```

- [ ] **Step 3: Full responsive QA pass**

Using DevTools device toolbar (or manual window resizing), check the full page top-to-bottom at four widths: 375px, 768px, 1024px, 1440px. At each width confirm: no horizontal scrollbar/overflow, no overlapping text, the services grid column count matches its breakpoint, the process grid is 3-column above 760px and 1-column below, the hero footer row stacks correctly under 640px, and the site footer wraps without clipping.

- [ ] **Step 4: Accessibility spot-check**

Tab through the page using only the keyboard from the top. Confirm every link (brand logo, "SEE THE NUMBER →", hero phone, CTA phone, footer icons) receives a visible gold focus outline in the order it appears on the page. Confirm the page has exactly one `<h1>` (the hero headline) and that `<h2>`/`<h3>` are used consistently for section/card headings (services heading is `<h2>`, card names and process step titles are `<h3>`).

- [ ] **Step 5: Console/perf sanity check**

With DevTools open, reload the page once and leave it idle for ~10 seconds with the hero visible. Confirm: zero console errors/warnings (the only acceptable one is the `assets/logo.png` 404 until the user supplies that file), and, using the Performance panel or just visual judgement, the hero line-field animation runs smoothly without visible stutter.

- [ ] **Step 6: Commit**

```bash
git add vercel.json README.md
git commit -m "Add Vercel config and README; complete NEXUS CRAFT site"
```
