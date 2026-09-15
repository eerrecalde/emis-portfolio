# Project breakdown

This is the execution source of truth. Follow the order below: Phase 2 UI work
does not begin until every Phase 1 curation task is done. See
[MAIN_PLAN.md](./MAIN_PLAN.md) for the product and engineering direction.

## Current next task

**P3-04 — Complete learning-timeline verification and content polish.**

## Completed groundwork

| ID   | Task                                    | Status |
| ---- | --------------------------------------- | ------ |
| G-01 | Foundation and repository-data pipeline | Done   |
| G-02 | Extend extraction with project images   | Done   |

## Maintenance

| ID   | Task                                                                                 | Status |
| ---- | ------------------------------------------------------------------------------------ | ------ |
| M-01 | Organise route-specific UI in `src/pages` and split reusable JSX components by file. | Done   |
| M-02 | Align the project-detail title treatment with the experience and skills pages.       | Done   |
| M-03 | Defer non-home route code and content, then warm it after the home page is visible.  | Done   |
| M-04 | Reset the scroll position when visitors navigate between portfolio routes.           | Done   |
| M-05 | Add a Surge SPA fallback so direct portfolio routes load after static deployment.    | Done   |
| M-06 | Add React and Angular technology-area skill filters and update the skill catalogue.  | Done   |
| M-07 | Merge manually authored projects with repository-derived portfolio content.          | Done   |
| M-08 | Add public-safe Luno case studies for transaction and regulatory flows.              | Done   |
| M-09 | Add public-safe TechSoup case studies for modernisation and endpoint tooling.        | Done   |
| M-10 | Add the public-safe Ver Análisis proof-of-concept case study.                        | Done   |
| M-11 | Add the text-only CitizenShareholders headless WordPress case study.                 | Done   |

## Phase 1 — repository curation

| ID    | Task                                                                                                            | Status | Depends on  |
| ----- | --------------------------------------------------------------------------------------------------------------- | ------ | ----------- |
| P1-01 | Curate `pill-reminder`; reviewed documentation and screenshot set are merged into `main`.                       | Done   | —           |
| P1-02 | Curate `assets-watcher`; reviewed documentation and screenshot set are merged into `main`.                      | Done   | P1-01       |
| P1-03 | Verify `pet-seen` against the Phase 1 definition of done; documentation and screenshots are merged into `main`. | Done   | P1-02       |
| P1-04 | Confirm all three repositories meet the Phase 1 definition of done.                                             | Done   | P1-01–P1-03 |

## Phase 2 — portfolio application

| ID    | Task                                                                                                                                            | Status | Depends on          |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------- |
| P2-01 | Reassess curated repository output and finalize the smallest ingestion format.                                                                  | Done   | P1-04               |
| P2-02 | Update the frontend foundation to the latest stable React with React Compiler; add React Router and ESLint.                                     | Done   | P2-01               |
| P2-03 | Define project and professional-experience domain content; test ingestion with fixtures.                                                        | Done   | P2-01               |
| P2-04 | Build accessible shared layout, routing, project listing, and detail-page composition.                                                          | Done   | P2-02, P2-03        |
| P2-05 | Build the project-portfolio homepage and a dedicated professional-experience page.                                                              | Done   | P2-04               |
| P2-06 | Apply the approved visual direction, responsive behaviour, and image performance treatment.                                                     | Done   | P2-04, mood board   |
| P2-07 | Define the skill list and years of experience; use that shared data to replace the current combined skill pills wherever skills appear.         | Done   | P2-05, P2-06        |
| P2-08 | Build an accessible `/skills` page that visualises the individual skills by years of experience using D3 or a similarly suitable chart library. | Done   | P2-07               |
| P2-09 | Complete component/page tests, a small E2E suite if warranted, accessibility and performance review, and static deployment.                     | Done   | P2-05, P2-06, P2-08 |

## Phase 3 — learning timeline

| ID    | Task                                                                                                                                                                                                                                                                                          | Status  | Depends on   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------ |
| P3-01 | Define extendable learning-course content, including status, dates, deterministic same-month sequencing, platform, optional university, source link, and optional diploma. Add the `/learning` route and navigation entry. Follow the [learning timeline plan](./plans/learning-timeline.md). | Done    | —            |
| P3-02 | Build the responsive learning timeline: an inverted-S desktop path with ordered course nodes and a readable chronological mobile layout.                                                                                                                                                      | Done    | P3-01        |
| P3-03 | Add an accessible animated course-details popover: hover preview and delayed pointer-leave dismissal on desktop, persistent click/keyboard interaction, and a 90%-viewport mobile modal.                                                                                                      | Done    | P3-02        |
| P3-04 | Complete learning-timeline tests, keyboard and reduced-motion checks, desktop/mobile visual verification, and content polish.                                                                                                                                                                 | Planned | P3-01–P3-03  |
| P3-05 | Surface the short names of current courses in the shared header as a restrained cyan “Currently learning” display, responsive to available space and derived from the learning content.                                                                                                       | Planned | P3-01, P3-04 |
