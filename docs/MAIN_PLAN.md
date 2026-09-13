# Senior React Engineer Portfolio — main plan

## Goal

Build a polished, frontend-only portfolio that presents professional experience
and selected projects with accurate technical depth. The project repositories
remain the source of truth; the portfolio presents their curated content.

## Delivery order

### Phase 1 — curate every project repository

Each selected repository must be independently portfolio-ready before the
portfolio UI begins. For every project:

1. Inspect the application, source code, documentation, configuration, and
   tests.
2. Verify its story, technical highlights, decisions, and trade-offs against
   the codebase.
3. Keep the project story in `README.md`; put operational setup in
   `HOW_TO_USE.md`.
4. Capture a small, useful screenshot set in `docs/screenshots/` and reference
   the strongest images from the README.
5. Check the documentation, screenshots, setup instructions, and relevant
   tests before marking the project complete.

Phase 1 is complete only when every selected repository has an accurate,
self-contained README, usable setup documentation, curated public-safe
screenshots, and passing relevant tests.

### Phase 2 — build the portfolio

After Phase 1, use a small build-time ingestion layer to turn curated repository
content into normalized static project data. Keep ingestion separate from
presentation; the browser must not call GitHub directly.

Version 1 includes a homepage, professional experience, project listing,
project detail pages, repository-derived content and screenshots, responsive
layout, accessibility basics, automated tests, and static deployment.

Use Vite, the latest stable React with React Compiler, TypeScript, Tailwind CSS,
React Router, Vitest, React Testing Library, ESLint, and Prettier. Add Markdown
or E2E tooling only when the final curated content needs it. Do not add a
backend, database, CMS, runtime GitHub integration, global state library,
search, blog, theme switcher, or animation framework in version 1.

## Engineering rules

- Keep project ingestion, domain content, page composition, and presentational
  components separate.
- Prefer focused components and simple, strongly typed code.
- Use semantic HTML, visible focus states, descriptive links and image alt
  text, and responsive images by default.
- Keep the site static, accessible, lightweight, and tested in proportion to
  its behaviour.
- Test ingestion with fixtures and cover important component and page behaviour.
  Add only a small desktop-and-mobile end-to-end suite if it provides value.

## Visual direction

Use [the portfolio mood board](./design/emis-portfolio-moodboard.png) as the
reference for Phase 2 interface work: a near-black and slate foundation,
restrained violet-to-cyan accents, confident typography, generous whitespace,
and subtle purposeful interaction. Keep the result calm, accessible, and
focused on real project work rather than decorative effects.

## Source and tracking

This is the repository copy of the approved main plan. The ordered implementation
status and the next task live in [PROJECT_BREAKDOWN.md](./PROJECT_BREAKDOWN.md).
