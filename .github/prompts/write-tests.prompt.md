---
description: "Writes node:test API tests for a GridWatch route file"
agent: agent
argument-hint: "[routeFile=...]"
---

# Write Tests

Generate API tests for a GridWatch route.

## Inputs

* ${input:routeFile}: (Optional) Path to the route file to test. Defaults to the currently open file.

## Requirements

1. Read the target route file and `server/tests/outages.test.js` as the reference pattern (ephemeral server via `app.listen(0)`, global `fetch`, `node:assert/strict`).
2. Create or extend `server/tests/<resource>.test.js` covering every handler in the route: happy path, query-parameter filters, validation failures (assert `error.code`), and 404 lookups.
3. Use realistic utility-domain test data (feeder IDs like `FDR-99`, causes like `storm` or `equipment failure`).
4. Run `npm test` and iterate until all tests pass.
