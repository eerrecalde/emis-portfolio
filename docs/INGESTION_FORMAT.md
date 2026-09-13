# Curated project ingestion format

P2-01 freezes the repository-derived input to the smallest useful static
contract. When a repository is added to `projects.config.json`, run the
extractor once to request its curated README and write
`data/curated-projects.json`. Commit the generated file with that project-list
change so the latest extraction is preserved in the repository.

Extraction is intentionally not part of `npm run build`. Normal builds use the
last committed generated file and never contact GitHub; this keeps builds
repeatable and avoids losing the last known curated output if GitHub is
unavailable.

```json
{
  "projects": [
    {
      "slug": "pet-seen",
      "featured": false,
      "repositoryUrl": "https://github.com/eerrecalde/pet-seen",
      "readme": "# Pet Seen ...",
      "screenshots": [
        {
          "alt": "Missing-pet case flow",
          "url": "https://raw.githubusercontent.com/.../01-missing-case.png"
        }
      ]
    }
  ]
}
```

`slug` and `featured` come from `projects.config.json`. `repositoryUrl` stays
as the canonical outbound link. `readme` preserves the curated project story
as the repository source of truth. `screenshots` are the de-duplicated HTTPS
Markdown images resolved relative to the fetched README, including their alt
text.

The format deliberately excludes GitHub descriptions, stars, forks, issues,
language byte counts, timestamps, homepages, and releases. Those fields are
either volatile, duplicate the curated documentation, or have no approved
portfolio use. The browser consumes a later normalized domain model and never
calls GitHub; P2-03 will transform this input alongside hand-authored
professional-experience content.

## Normalized portfolio content

P2-03 adds a second, local-only ingestion step. Run `npm run ingest:portfolio`
after changing either `data/curated-projects.json` or
`data/professional-experience.json`, then commit the resulting
`public/data/portfolio.json`.

The generated model retains the curated title, summary, rationale,
capabilities, technical highlights, decisions, stack, status, screenshots, and
canonical repository link for each project. It combines those records with
hand-authored professional experience: company, role, dates, location, and
outcome-focused highlights. This is the static, browser-safe contract for the
portfolio; it excludes CV contact details and never calls GitHub at runtime.
