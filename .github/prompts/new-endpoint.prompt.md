---
description: "Scaffolds a new GridWatch REST resource: route file, server mount, and tests"
agent: agent
argument-hint: "resource=... [fields=...]"
---

# New Endpoint

Create a complete new REST resource for the GridWatch API.

## Inputs

* ${input:resource}: (Required) Resource name in plural lowercase (e.g. `crews`, `feeders`, `work-orders`).
* ${input:fields}: (Optional) Comma-separated list of fields for the resource. If omitted, propose realistic utility-domain fields and confirm before generating.

## Requirements

1. Add seed data for the resource to `server/data/seed.js` with at least 5 realistic utility-industry records and an ID prefix that fits the domain (e.g. `CRW-` for crews).
2. Create `server/routes/<resource>.js` following the conventions in `.github/instructions/backend-api.instructions.md` with collection GET, item GET, POST (with validation), and PATCH handlers.
3. Mount the router in `server/server.js` under `/api/<resource>`.
4. Create `server/tests/<resource>.test.js` covering happy path, validation failure, and 404 lookup.
5. Run `npm test` and fix any failures.
