# Security Specification for Advocate Sikandar Khan Legal Platform

## Data Invariants
1. `cases`: Public read allowed for active cases if needed, but administrative write (create, update, delete) requires authentication or valid admin session.
2. `news`: Public read allowed so all visitors can see court news and cause list updates. Writes restricted to authenticated users / admins.
3. `consultations`: Anyone can submit a consultation request (create). Reads/updates are restricted to administrative access.
4. `clients`, `payments`, `auditLogs`: Read and write restricted to administrative access.

## The Dirty Dozen Security Test Payloads
1. Unauthenticated case deletion attack.
2. Unauthenticated news item modification / defacement.
3. Malicious consultation payload with oversized text (> 50KB).
4. Unauthenticated audit log wiping / deletion.
5. Injection of non-string invalid types into case numbers.
6. Spoofed client profile creation with missing required fields.
7. Unauthenticated fee payment record modification.
8. Malicious injection of arbitrary document IDs with path traversal characters.
9. Attempting to override audit log timestamps with past/fake dates.
10. Attempting shadow fields on news updates.
11. Query scraping on private client profiles without authentication.
12. Attempting unauthorized write to system audit logs.

All operations violating these invariants return PERMISSION_DENIED.
