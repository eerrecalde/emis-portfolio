# Curated project ingestion format

P2-01 freezes the repository-derived input to the smallest useful build-time
contract. The extractor requests only each repository's curated README and
writes `data/curated-projects.json`.

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
