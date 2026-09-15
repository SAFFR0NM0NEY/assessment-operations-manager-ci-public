# Assessment Operations Manager Public CI Mirror

This repository is disposable public CI infrastructure for Assessment Operations Manager.

It is used only for validation of sanitized snapshots. It is not the private source-of-truth repository, not a production repository, not a deployment repository, and not a normal history mirror.

Snapshots are sanitized locally before publication. `CI_SOURCE_SHA.txt` records the exact private source SHA used to create the snapshot. No private Git history is included here.

No credentials, private keys, service-role keys, database passwords, real student data, real staff or client data, private workbook data, local backups, or production deployment material belongs in this repository.

This repository cannot deploy, mutate production, access hosted Supabase, or update any private source repository. Development remains in the private source-of-truth repository.

`CI_EXPORT_MANIFEST.tsv` records the exported file paths, byte sizes, and SHA-256 checksums. The manifest and its checksum file are excluded from the manifest to avoid recursive self-hashing.
