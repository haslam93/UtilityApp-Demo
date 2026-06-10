---
title: GridWatch Demo Guide
description: Step-by-step run instructions and demo script for showcasing GitHub Copilot instruction files, prompt files, and skills with GridWatch
---

## Prerequisites

* Node.js 20+ (uses the built-in `node:test` runner and global `fetch`)
* VS Code with the GitHub Copilot extension signed in
* No other process on port 3000

## Running the app

```powershell
npm install      # one-time, installs Express
npm start        # serves frontend + API at http://localhost:3000
npm run dev      # same, but auto-restarts on file changes (use during the demo)
npm test         # runs the API test suite
```

Open <http://localhost:3000> — you should see the dark GridWatch dashboard with 4 stat cards, an outage board, a report form, and a meter table. The "API: online" pill in the header confirms both tiers are talking.

### Resetting between demos

Data is in-memory, so a restart (`Ctrl+C`, `npm start`) resets everything back to seed state. Revert any code Copilot generated with `git checkout .` if the repo is under git, or keep a clean copy of the folder.

## What to showcase, in order

The flow builds from "Copilot knows my repo" to "Copilot knows my business domain". Each act stands alone, so you can cut from the end if short on time.

### Act 1 — Repository instructions (5 min)

Goal: show that Copilot follows team conventions without being told in the prompt.

1. Open [.github/copilot-instructions.md](.github/copilot-instructions.md) and walk through it: architecture rules, the `{ data, count }` / `{ error: { code, message } }` envelope, ID prefixes, and the utility glossary (feeders, AMI/AMR, SAIDI/SAIFI).
2. In Copilot Chat, ask: **"Add a DELETE endpoint for outages"**.
3. Point out what Copilot did *unprompted*: 404 with `NOT_FOUND` envelope, handler placed after PATCH, route comment style, `OUT-` IDs in any examples.
4. Talking point: this file ships with the repo, so every developer (and every Copilot session) inherits the same conventions on day one.

### Act 2 — Scoped instruction files (5 min)

Goal: show path-scoped rules via `applyTo` patterns.

1. Show [.github/instructions/backend-api.instructions.md](.github/instructions/backend-api.instructions.md) (`applyTo: server/**/*.js`) and [.github/instructions/frontend.instructions.md](.github/instructions/frontend.instructions.md) (`applyTo: public/**`).
2. Ask: **"Add a panel to the dashboard that lists customers with their feeder and rate class"**.
3. Point out: Copilot used the `api` helper instead of inline `fetch`, escaped values with `escapeHtml()`, used CSS custom properties rather than hardcoded hex colors, and matched the panel/table aesthetic.
4. Talking point: frontend rules never pollute backend suggestions and vice versa — the right rules load for the right files.

### Act 3 — Skills, the showstopper (10 min)

Goal: show Copilot pulling in deep utility-domain knowledge on demand.

1. Open [server/routes/customers.js](server/routes/customers.js) — the bill endpoint deliberately returns `501 NOT_IMPLEMENTED`.
2. Open [.github/skills/tariff-billing/SKILL.md](.github/skills/tariff-billing/SKILL.md) and skim the tariff table: tiered residential energy charges, demand charges, the 6% utility tax, and the edge cases.
3. Ask: **"Implement the bill endpoint"** — nothing more. Copilot discovers the skill from the request, applies the rate tables, tiered/demand logic, and edge cases.
4. Verify live: `npm test`, then in the running app try
   `http://localhost:3000/api/customers/CUST-1001/bill?period=2026-05` (GS-1 flat rate) and
   `http://localhost:3000/api/customers/CUST-1007/bill?period=2026-05` (IND-1 with demand charge).
5. Bonus: ask **"What's our month-to-date SAIDI and SAIFI?"** — Copilot picks up the [outage-reliability skill](.github/skills/outage-reliability/SKILL.md), reads the outage data, and applies the IEEE index formulas with benchmark context.
6. Talking point: skills are how you encode tribal knowledge — tariff books, engineering standards, regulatory rules — so Copilot answers like a 20-year veteran, not a generic model.

### Act 4 — Prompt files (5 min)

Goal: show reusable one-command workflows for the whole team.

1. Show the files in `.github/prompts/`, then in chat type `/` to reveal them as slash commands.
2. Run **`/new-endpoint resource=crews`** — Copilot scaffolds seed data with a `CRW-` prefix, a full route file, the server mount, and tests, then runs them.
3. Run **`/outage-summary audience=executive`** — a non-code payoff: a leadership-ready outage briefing generated from live API data. Run it again with `audience=ops` to show the same prompt, different output contract.
4. Optional: open a route file and run **`/write-tests`**.
5. Talking point: prompt files turn a senior engineer's best prompt into a button anyone on the team can press.

### Act 5 — Wrap-up (2 min)

* Run `npm test` one last time: everything Copilot generated during the demo is tested and passing.
* Refresh the dashboard to show new resources/data live.
* Recap the layering: repo instructions (always on) → scoped instructions (per path) → skills (on-demand domain depth) → prompts (reusable workflows).

## Suggested timings

| Act | Feature | Time |
|-----|---------|------|
| 1 | Repository instructions | 5 min |
| 2 | Scoped instruction files | 5 min |
| 3 | Skills (billing + reliability) | 10 min |
| 4 | Prompt files | 5 min |
| 5 | Wrap-up | 2 min |

## Troubleshooting

* **Port 3000 busy**: set `$env:PORT=3100; npm start` and adjust URLs.
* **Slash commands not appearing**: make sure the workspace folder open in VS Code is the repo root (prompts are discovered from `.github/prompts/`).
* **Skill not picked up**: mention the domain in the ask ("bill", "tariff", "SAIDI") — skill discovery is driven by the request matching the skill description.
* **Stale demo state**: restart the server; in-memory data resets to seed.
