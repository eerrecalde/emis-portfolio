# Project breakdown

This is the execution source of truth. Follow the order below: Phase 2 UI work
does not begin until every Phase 1 curation task is done. See
[MAIN_PLAN.md](./MAIN_PLAN.md) for the product and engineering direction.

## Current next task

**P1-01 — Curate `pill-reminder`.** Capture its curated screenshots, verify the
README and setup documentation against the codebase, run relevant tests, and
commit the completed curation pass in its source repository.

## Completed groundwork

| ID   | Task                                    | Status |
| ---- | --------------------------------------- | ------ |
| G-01 | Foundation and repository-data pipeline | Done   |
| G-02 | Extend extraction with project images   | Done   |

## Phase 1 — repository curation

| ID    | Task                                                                                                                | Status      | Depends on  |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ----------- | ----------- |
| P1-01 | Curate `pill-reminder`; screenshots are pending.                                                                    | Next        | —           |
| P1-02 | Curate `assets-watcher`; screenshots are pending.                                                                   | Not started | P1-01       |
| P1-03 | Verify `pet-seen` against the Phase 1 definition of done; documentation and screenshots are currently marked ready. | Not started | P1-02       |
| P1-04 | Confirm all three repositories meet the Phase 1 definition of done.                                                 | Not started | P1-01–P1-03 |

## Phase 2 — portfolio application

| ID    | Task                                                                                                                        | Status      | Depends on        |
| ----- | --------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------- |
| P2-01 | Reassess curated repository output and finalize the smallest ingestion format.                                              | Not started | P1-04             |
| P2-02 | Update the frontend foundation to the latest stable React with React Compiler; add React Router and ESLint.                 | Not started | P2-01             |
| P2-03 | Define project and professional-experience domain content; test ingestion with fixtures.                                    | Not started | P2-01             |
| P2-04 | Build accessible shared layout, routing, project listing, and detail-page composition.                                      | Not started | P2-02, P2-03      |
| P2-05 | Build the homepage with professional experience and featured projects.                                                      | Not started | P2-04             |
| P2-06 | Apply the approved visual direction, responsive behaviour, and image performance treatment.                                 | Not started | P2-04, mood board |
| P2-07 | Complete component/page tests, a small E2E suite if warranted, accessibility and performance review, and static deployment. | Not started | P2-05, P2-06      |
