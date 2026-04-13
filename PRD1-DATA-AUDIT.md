# PRD-1 Framer Live Example — Data Audit Report

**Date:** 2026-04-13
**Scope:** All data rendered in the VS Code live example (LiveExampleSection)
**Data source:** `lib/vscode-data.ts` (~347 KB)

---

## Summary

The live example displays real data from the Open Session Framer-to-Next.js migration. The data contains **personal names, client information, and business details** that are rendered in the browser for any visitor to see. Most of this is already semi-public (published on opensession.co), but it's worth reviewing what's exposed.

---

## Findings

### HIGH — Personal Names & Roles

| Data | Location (vscode-data.ts) |
|------|--------------------------|
| `Karim Bouhdary \| Head of Design` | ~line 2253, 5439, 6093, 6142, 6194, 6249 |
| `Morgan MacKean \| Chief Creative Officer` | ~line 2254, 7531, 7586 |
| Professional bios describing career history | ~lines 5777, 5858, 5865 |
| Blog post author attributions (`Author: Karim Bouhdary`) | ~lines 6093–6249 |

**Why it matters:** Full names + titles + career details are displayed in the rendered example. These are identifiable individuals.

---

### MEDIUM-HIGH — Client & Project Names

| Data | Location |
|------|----------|
| Iterra — Brand Identity & Guidelines (2025) | ~line 2226 |
| BILTFOUR — Brand Identity, E-commerce (2024–2025) | ~line 2227 |
| NEXT \| Google Cloud — Demo Design System (2023–2024) | ~line 2228 |
| Infinite Nature \| Google Cloud — UX/UI (2023–2024) | ~line 2229 |
| Universal Audio — Visual Design (2022–present) | ~line 2230 |

**Why it matters:** Reveals client relationships and engagement timelines. These are business relationships that may or may not be intended to be public in this context.

---

### MEDIUM — Company Domain & Migration Strategy

| Data | Location |
|------|----------|
| `https://opensession.co/` (multiple references) | ~lines 268, 7238, 7244, 7250, 7266 |
| "Migrate all content from opensession.co (hosted on Framer)" | ~line 294 |
| "An entire Framer website migrated into a custom Next.js codebase" | ~line 510 |

**Why it matters:** Explicitly states the company's tech stack and migration strategy. Low risk if the company is comfortable with this being public.

---

### MEDIUM — Image File Paths Tied to Individuals

| Data | Location |
|------|----------|
| `public/images/team/karim.webp` | ~lines 4801–4802 |
| `public/images/team/morgan.webp` | ~lines 4879–4880 |
| Framer CDN hashes (`HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg`, etc.) tied to named individuals | ~lines 2646, 2650 |

**Why it matters:** File names directly associate images with named individuals. The Framer CDN hashes create a permanent link between file IDs and people.

---

### LOW — Commit Attribution Metadata

| Data | Location |
|------|----------|
| `Co-Authored-By: Claude <noreply@anthropic.com>` (scattered throughout) | ~lines 5083, 6008, 6513, 7466–7472 |

**Why it matters:** Minimal risk. Reveals that Claude was used in the workflow, which is the point of the demo.

---

## What's NOT a Risk

- **No API keys, tokens, or secrets** found in the data
- **No email addresses** (other than the generic `noreply@anthropic.com`)
- **No phone numbers, addresses, or financial data**
- **No database credentials or environment variables**
- **No internal URLs** (no staging servers, admin panels, etc.)

---

## Recommendations

### If you want to keep real data (current approach)
- Confirm Karim and Morgan consent to their names, roles, and bios being displayed
- Confirm clients (especially Google Cloud, Universal Audio) are OK being named
- Consider whether Framer CDN hash URLs should be replaced with local paths

### If you want to sanitize
| Replace | With |
|---------|------|
| `Karim Bouhdary` | `Alex Chen` or `Founder A` |
| `Morgan MacKean` | `Jordan Park` or `Founder B` |
| Client names (Iterra, BILTFOUR, etc.) | `Client Alpha`, `Client Beta`, etc. |
| `opensession.co` | `example-studio.co` |
| Team photo paths | Generic placeholder paths |

### Either way
- Add `<meta name="robots" content="noindex">` to the page if this section shouldn't be indexed by search engines
- Review git history — earlier commits may contain data that was later removed

---

## Files Audited

| File | Role |
|------|------|
| `components/LiveExampleSection.tsx` | Consumer component (renders the VS Code emulator) |
| `lib/vscode-data.ts` | **Primary data source** — all content, file trees, chat scripts, timelines |
| All VSCodeEmulator subcomponents | Render the data from vscode-data.ts |
