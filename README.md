---
title: GridWatch
description: Two-tier utility operations demo app for showcasing GitHub Copilot instruction files, prompt files, and skills
---

# GridWatch — GitHub Copilot Demo for Harris Utilities

GridWatch is a small two-tier outage and meter operations app built to demonstrate GitHub Copilot customization features (instruction files, prompt files, and skills) in a utility-industry context.

> See [DEMO.md](DEMO.md) for the full run instructions and step-by-step demo script with timings.

## Architecture

| Tier | Tech | Location |
|------|------|----------|
| Frontend | Vanilla HTML/CSS/JS dashboard | `public/` |
| Backend | Express REST API, in-memory data | `server/` |

## Run it

```powershell
npm install
npm start        # http://localhost:3000
npm test         # node:test API tests
```

## Copilot customization built in

### Instruction files (always-on context)

| File | What it demonstrates |
|------|----------------------|
| `.github/copilot-instructions.md` | Repo-wide context: architecture rules, response envelope, ID prefixes, utility-domain glossary |
| `.github/instructions/backend-api.instructions.md` | Scoped to `server/**` — route structure, validation, and testing conventions |
| `.github/instructions/frontend.instructions.md` | Scoped to `public/**` — no-framework rule, XSS escaping, CSS custom properties |

### Prompt files (slash commands in chat)

| Prompt | Try it |
|--------|--------|
| `/new-endpoint` | `/new-endpoint resource=crews` — scaffolds seed data, route, mount, and tests |
| `/outage-summary` | `/outage-summary audience=executive` — generates a shift-handover briefing from live outage data |
| `/write-tests` | Open a route file, then `/write-tests` — generates node:test coverage |

### Skills (on-demand domain knowledge)

| Skill | What it demonstrates |
|-------|----------------------|
| `.github/skills/tariff-billing/SKILL.md` | Tariff tables, bill calculation steps, and edge cases Copilot pulls in when asked about billing |
| `.github/skills/outage-reliability/SKILL.md` | Severity classification rules and SAIDI/SAIFI/CAIDI formulas |

## Suggested demo flow

1. **Instruction files**: Ask Copilot "add a DELETE endpoint for outages" — note it follows the error envelope, validation style, and ID conventions without being told.
2. **Scoped instructions**: Ask for a new dashboard panel — note it uses `escapeHtml`, CSS variables, and the badge pattern from the frontend instructions.
3. **Skills (the showstopper)**: The bill endpoint in `server/routes/customers.js` returns `501 NOT_IMPLEMENTED`. Ask Copilot: *"Implement the bill endpoint"* — it discovers the tariff-billing skill, applies the rate tables, tiered energy charges, demand charges, and tax rules, and handles every documented edge case.
4. **Prompt files**: Run `/new-endpoint resource=crews` to scaffold a complete new resource, or `/outage-summary audience=executive` to show non-code value for operations staff.
5. **Verify**: `npm test` after each generation to show Copilot produced working, tested code.

## Domain notes

Seed data models a small distribution utility: 8 customers across 4 feeders (`FDR-01` to `FDR-12`), AMI/AMR meters with billing multipliers, monthly kWh and demand readings, and a live outage board.
