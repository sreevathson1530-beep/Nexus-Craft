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
