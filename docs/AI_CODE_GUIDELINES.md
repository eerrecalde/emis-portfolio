# AI code guidelines

- Prefer small, focused modules and snippets over monolithic code. Extract a
  unit only when it has a clear responsibility.
- Treat tests as part of development. Every first-party executable TypeScript
  or TSX application and extraction module must have a matching test created
  or updated in the same change. Type-only declarations are verified by the
  strict type check.
- Choose simple, explicit code over clever abstractions or speculative reuse.
- Use standard TypeScript and React patterns. Use a reducer when state has
  meaningful transitions; use a polymorphic component only when the same UI
  genuinely needs to render different semantic elements.
