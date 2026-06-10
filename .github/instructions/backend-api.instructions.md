---
description: "API conventions for the GridWatch Express backend"
applyTo: "server/**/*.js"
---

# Backend API Instructions

Follow these rules when creating or modifying any code under `server/`.

## Route structure

* One router file per resource in `server/routes/`, exported as `default` and mounted in `server/server.js` under `/api/<resource>`.
* Order handlers: collection GET, item GET, POST, PATCH, DELETE.
* Comment each handler with its method and path (e.g. `// GET /api/outages/:id`).

## Response envelope

* Success: `res.json({ data, count })` — include `count` only for collections.
* Error: `res.status(code).json({ error: { code: 'ERROR_CODE', message: '...' } })`.
* Use 400 for validation failures, 404 for missing resources, 201 for creations, 501 for unimplemented endpoints.

## Validation

* Validate request bodies at the top of the handler and return early on failure.
* Whitelist allowed values in module-level `VALID_*` constant arrays.
* Never trust client-supplied IDs or numbers — coerce with `Number()` and default safely.

## Data access

* Import seed collections from `server/data/seed.js`; mutate arrays in place (in-memory store).
* Generate new IDs with the helper functions in `seed.js` (e.g. `nextOutageId()`), never inline counters.

## Testing

* Every new endpoint needs tests in `server/tests/<resource>.test.js` using `node:test` and the global `fetch` against an ephemeral server (`app.listen(0)`).
* Cover at least: happy path, validation failure, and 404 lookup.
