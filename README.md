# Portfolio project curation

This repository contains a senior React engineer portfolio and the build-time
source list for its curated project content.

## Project list

Edit [projects.config.json](./projects.config.json) to add or update a project. The file is plain JSON, so a future build tool, script, or application can consume it without being tied to a specific frontend framework.

Each entry needs:

- `slug` — a stable, lowercase, URL-friendly identifier
- `repositoryUrl` — the repository's canonical GitHub URL
- `featured` — set to `true` when the project should appear in a future featured-projects area

The optional `curation` field records Phase 1 progress without tying the project list to a frontend. New entries can omit it until curation begins.

`projects.config.schema.json` documents and validates that structure in editors that support JSON Schema.

## Curated content ingestion

When a curated repository is added to `projects.config.json`, run
`npm run extract:projects` once and commit the updated
`data/curated-projects.json`. The command is deliberately separate from
`npm run build`: ordinary builds use the last committed extraction and never
fetch GitHub. The output has the source Markdown and selected screenshot URLs,
ready for a later domain-content step; it does not expose a runtime GitHub
integration. See
[the ingestion contract](./docs/INGESTION_FORMAT.md) for the exact format and
the fields intentionally excluded.
