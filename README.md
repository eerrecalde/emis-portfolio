# Portfolio project curation

This repository starts with the source list for a senior React engineer portfolio. It is intentionally framework-agnostic while the selected project repositories are curated.

## Project list

Edit [projects.config.json](./projects.config.json) to add or update a project. The file is plain JSON, so a future build tool, script, or application can consume it without being tied to a specific frontend framework.

Each entry needs:

- `slug` — a stable, lowercase, URL-friendly identifier
- `repositoryUrl` — the repository's canonical GitHub URL
- `featured` — set to `true` when the project should appear in a future featured-projects area

The optional `curation` field records Phase 1 progress without tying the project list to a frontend. New entries can omit it until curation begins.

`projects.config.schema.json` documents and validates that structure in editors that support JSON Schema.

## Current phase

The next work is to curate each listed repository: verify its story and technical claims, improve its README, separate setup instructions into `HOW_TO_USE.md`, and add a focused screenshot set under `docs/screenshots/`. Only then should this repository gain a portfolio frontend and build-time content ingestion.
