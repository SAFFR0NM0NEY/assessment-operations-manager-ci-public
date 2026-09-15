# Services Boundary

Feature pages and components must not directly scatter future Supabase queries or other integration calls.

Future feature services or repositories should own data-access decisions for their feature area. Those services may call configured integration clients from `src/lib/` when backend work begins, and UI code should consume the feature-level service or query hook instead of reaching directly into the database client.

This folder intentionally contains no fake API calls, mock student data, campus data, result data, or pretend database functions.
