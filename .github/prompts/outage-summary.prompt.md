---
description: "Generates an operations shift-handover summary from current outage data"
agent: agent
argument-hint: "[audience={ops|executive}]"
---

# Outage Summary

Produce a shift-handover outage summary for the GridWatch operations team.

## Inputs

* ${input:audience:ops}: (Optional, defaults to ops) `ops` for a technical handover, `executive` for a non-technical leadership briefing.

## Requirements

1. Start the GridWatch server if it is not already running, then fetch current outages from `http://localhost:3000/api/outages` (or read `server/data/seed.js` if the server cannot be started).
2. Summarize in this order: active outages by severity, total customers affected, oldest unrestored outage, unassigned outages needing a crew.
3. For `ops` audience: include outage IDs, feeder IDs, causes, and crew assignments.
4. For `executive` audience: no IDs or jargon; focus on customer impact, restoration progress, and any reputational risk.
5. Keep the summary under 250 words and present it directly in chat as markdown with headings and bullet points.
