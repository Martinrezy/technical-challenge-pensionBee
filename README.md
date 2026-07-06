# Acme Co. Static Content CMS

A full-stack JavaScript MVP that serves marketing pages from Markdown files in a `content` folder. Each folder maps to a URL path and is rendered with `template.html` plus a React-powered site header.

**Live deployment:** [https://acme-cms.onrender.com](https://acme-cms.onrender.com)

## Overview

Acme Co.'s marketing team can add new pages by creating folders under `content/` with an `index.md` file. No application code changes are required.

| URL | Content file |
| --- | --- |
| `/about-page` | `content/about-page/index.md` |
| `/blog/june/company-update` | `content/blog/june/company-update/index.md` |

The server:

1. Resolves the request path to `content/<path>/index.md`
2. Converts Markdown to HTML
3. Injects the result into `template.html` at the `{{content}}` placeholder
4. Renders a React navigation bar (SSR + client hydration)

## Tech stack

- **Backend:** Node.js, Express
- **Frontend:** React (Vite build), server-side rendering for navigation
- **Markdown:** `marked`
- **Tests:** Vitest, Supertest

## Getting started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
npm run build
```

### Run locally

```bash
npm start
```

Open [http://localhost:3000/about-page](http://localhost:3000/about-page).

### Development

Rebuilds the React bundle on change and restarts the server:

```bash
npm run dev
```

### Tests

```bash
npm test
```

Tests use temporary fixture folders so they do not depend on the sample content in `content/`.

## Adding new pages

1. Create a folder under `content/`, e.g. `content/pricing/`
2. Add `index.md` with your Markdown content
3. Visit `/pricing` — the page and navigation update automatically

Example:

```markdown
# Pricing

Our widgets start at £9.99.
```

Nested paths work the same way: `content/docs/api/index.md` is served at `/docs/api`.

## Project structure

```
content/              # Markdown pages (managed by marketing)
template.html         # HTML shell with {{content}} placeholder
src/
  server/
    app.js            # Express app factory (used by tests)
    content.js        # Path resolution and content discovery
    index.js          # Server entry point
  shared/
    SiteNav.js        # React navigation (SSR + client hydration)
  client/
    main.jsx          # Client hydration entry
    styles.css        # Page styling
tests/
  app.test.js         # HTTP integration tests
render.yaml           # Render.com deployment config
```

## Deployment

This repo includes a [Render](https://render.com) blueprint (`render.yaml`):

1. Push the repository to GitHub
2. Create a new **Blueprint** on Render and connect the repo
3. Render runs `npm install && npm run build` then `npm start`

Set `PORT` automatically via Render; the server reads `process.env.PORT`.

## Iterating from here

Possible next steps for a production CMS:

- **Authoring UI** — web form or headless CMS integration for non-technical editors
- **Preview mode** — draft content before publish
- **Caching** — in-memory or CDN cache for rendered pages
- **SEO** — meta descriptions from front matter in Markdown
- **Asset pipeline** — images and downloads alongside Markdown
- **CI** — GitHub Actions running `npm test` on every pull request
- **Watch mode** — file watcher to hot-reload when `content/` changes

## Challenge requirements

- [x] URLs match `content/` folder paths
- [x] Pages built from `template.html` + `index.md`
- [x] `{{content}}` placeholder replaced per page
- [x] New folders work without code changes
- [x] React on the front-end
- [x] Test: valid URL returns 200
- [x] Test: valid URL body contains rendered Markdown HTML
- [x] Test: unknown URL returns 404
- [x] Tests independent of sample content
- [x] Styled pages
- [x] Cloud deployment configuration
- [x] Documentation
