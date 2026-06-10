---
description: "Frontend conventions for the GridWatch dashboard"
applyTo: "public/**"
---

# Frontend Instructions

Follow these rules when creating or modifying any code under `public/`.

## Stack constraints

* Vanilla HTML, CSS, and JavaScript only — no frameworks, no build tools, no npm packages.
* All API calls go through the `api` helper object in `app.js` (`api.get`, `api.post`). Add `api.patch`/`api.delete` there if needed rather than calling `fetch` inline.

## Security

* Always escape user- or API-supplied values with `escapeHtml()` before inserting into `innerHTML`.
* Never use `eval`, inline event handler attributes, or `document.write`.

## Styling

* Use the CSS custom properties defined in `:root` in `styles.css` (`--color-accent`, `--color-danger`, etc.) — do not hardcode hex colors in new rules.
* Status and severity values render as `.badge badge-<value>` pills; add a matching badge class when introducing a new status.
* Keep the dark operations-center aesthetic: panels use `--color-panel` backgrounds with `--color-border` borders and `--radius` corners.

## UX conventions

* Tables for tabular data, stat cards for headline numbers.
* Show `—` (em dash) for null timestamps and `Unassigned` for missing crews.
* Format numbers with `toLocaleString()` and timestamps with `toLocaleString()` on a `Date`.
