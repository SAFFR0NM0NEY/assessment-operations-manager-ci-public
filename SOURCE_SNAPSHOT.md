# Source Snapshot

Private source SHA: baa8dde271d1d62f28b51572374b783020615f8b

Export type: sanitized CI-only working-tree snapshot.

Export contents are limited to the renderer source, public assets, npm package metadata, TypeScript/Vite/ESLint/Prettier configuration, GitHub Actions workflows, and CI metadata required for public CI validation.

Excluded from this public snapshot:

- private Git history
- legacy project documentation
- legacy database migrations and scripts
- local environment files
- generated build output
- dependency folders
- private workbook files
- secrets or credentials

CI_EXPORT_MANIFEST.tsv excludes CI_EXPORT_MANIFEST.tsv and CI_EXPORT_MANIFEST_SHA256.txt to avoid recursive self-hashing.
