# GridWatch — Copilot Repository Instructions

GridWatch is a two-tier demo application for a utility company:

* **Tier 1 (frontend)**: static dashboard in `public/` — vanilla HTML/CSS/JS, no frameworks, no build step.
* **Tier 2 (backend)**: Express REST API in `server/` — ES modules, in-memory data store in `server/data/seed.js`.

## Architecture rules

* Keep the two-tier separation: the frontend talks to the backend only through `/api/*` endpoints.
* Data is in-memory by design (demo app). Do not add a database unless explicitly asked.
* Routes live in `server/routes/`, one file per resource, mounted in `server/server.js`.

## Conventions

* All API responses use the envelope `{ data, count? }` for success and `{ error: { code, message } }` for failures.
* Error codes are SCREAMING_SNAKE_CASE: `NOT_FOUND`, `VALIDATION_ERROR`, `NOT_IMPLEMENTED`, `INTERNAL_ERROR`.
* IDs follow utility-domain prefixes: `OUT-` (outages), `MTR-` (meters), `CUST-` (customers), `FDR-` (feeders).
* Use modern JavaScript: ES modules, `const`/`let`, optional chaining, arrow functions for callbacks.
* Tests use the built-in `node:test` runner and live in `server/tests/`. Run with `npm test`.

## Utility domain terminology

* **Feeder**: a distribution circuit serving a group of customers (e.g. `FDR-07`).
* **AMI / AMR**: advanced metering infrastructure (remote read) vs. automated meter reading (drive-by).
* **Meter multiplier**: register reads are multiplied by this value to get billed kWh.
* **SAIDI / SAIFI**: industry reliability indices (duration / frequency of interruptions per customer).

When generating code, prefer realistic utility-industry naming and sample data over generic placeholders.
