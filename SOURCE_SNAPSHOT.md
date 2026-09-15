# Source Snapshot

Private source SHA: 7e70a5c7786c8697ce6a244538578f7218115f88

Export type: sanitized CI-only working-tree snapshot.

Export contents are limited to the renderer source, Electron shell files, public assets, npm package metadata, TypeScript/Vite/ESLint/Prettier configuration, noninteractive desktop checks, GitHub Actions workflows, and CI metadata required for public CI validation.

Excluded from this public snapshot:

- private Git history
- legacy project documentation
- legacy database migrations and scripts
- local environment files
- generated build output
- dependency folders
- private workbook files
- secrets or credentials

`CI_EXPORT_MANIFEST.tsv` excludes `CI_EXPORT_MANIFEST.tsv` and `CI_EXPORT_MANIFEST_SHA256.txt` to avoid recursive self-hashing.
