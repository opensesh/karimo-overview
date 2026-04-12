# KARIMO Accuracy Audit

Comparison of the overview site's content against the real KARIMO system (`github.com/opensesh/KARIMO`).  
Generated: 2026-04-10

---

## Critical Discrepancies

### 1. PRD Interview Rounds: 4 vs 5

**Site says:** "A 4-round PRD interview" / "4-round interview: scope, requirements, dependencies, retro"  
**Reality:** The real KARIMO has a **5-round** interview:

1. Research — Load research context
2. Vision — What are we building and why?
3. Scope — Where are the boundaries?
4. Tasks — Break down into executable units
5. Review — Validate and generate dependency graph

**Files affected:**
- `lib/constants.ts:86` — processSteps plan description
- `lib/constants.ts:88` — details bullet
- `lib/constants.ts:287` — Loop 1 explanation paragraph

Even within the project's own `.claude/commands/karimo/plan.md`, line 203 says "5 rounds" and line 397 says "4 rounds" — the command file contradicts itself. The research command (`.claude/commands/karimo/research.md:484`) correctly says 5.

---

### 2. Compressed Architecture Layers Are Wrong

This is the biggest accuracy problem on the site. The overview conflates **workflow artifacts** with the actual **context compression layers**.

**Site says (ContextSection.tsx):**
| Layer | Name | Tokens | Content |
|-------|------|--------|---------|
| L0 | Agent Overview | ~500 | Agent types, commands, workflow shape |
| L1 | PRD & Execution Plan | ~2k | Task graph, wave ordering, branch strategy |
| L2 | Task Briefs | ~5k | Scope, constraints, target agent |

**Reality (OpenViking-inspired progressive disclosure):**
| Layer | Name | Tokens | Content |
|-------|------|--------|---------|
| L0 | Abstracts | ~100 | One-line summaries to verify specific items exist |
| L1 | Overviews | ~2K | Category digests — `agents.overview.md`, `commands.overview.md`, `skills.overview.md` |
| L2 | Full Definitions | Variable | Complete agent/command/skill files, loaded only when executing |

**What's wrong:**
- L0 on the site shows a `@CLAUDE.md` digest with agent counts, file paths, and workflow summary. That's closer to the real L1 (overview layer), not L0.
- L1 on the site shows `execution_plan.yaml` — that's a **workflow artifact**, not a context compression layer. The real L1 is about Claude configuration overviews.
- L2 on the site shows a task brief — again a workflow artifact, not a context layer. The real L2 is about loading full agent/command/skill definitions on demand.
- The real system's layers are about **how Claude loads its own configuration progressively** (abstracts → overviews → full definitions). The site's layers describe **what data flows through the pipeline** (config → execution plan → task briefs). These are fundamentally different concepts.

**The terminal previews compound the problem:**
- L0 preview (`@CLAUDE.md`) says "agents: 12 specialized" — but the hero stats say 22 agents
- L0 preview shows `.claude/commands/` and `.claude/skills/` paths — but the real system uses `.claude/plugins/karimo/` with `agents/`, `commands/`, and `skills/` subdirectories (plugin architecture v8.0+)

---

### 3. "PRs target main directly" in Adoption Phase 1

**Site says (`lib/constants.ts:229`):** Phase 1 feature list includes "PRs target main directly"  
**Reality:** KARIMO uses a **two-tier merge** strategy:
- Tier 1: Task PRs → feature branch (automated after review)
- Tier 2: Feature branch → main (human gate via `/karimo:merge`)

This is correctly described elsewhere on the site (Loop 3 worktrees step says "PRs merge to feature/{prd-slug}, not main") — so the site contradicts itself.

---

### 4. Agent Count Inconsistency

**Hero stats:** 22 Agents  
**L0 terminal preview:** "agents: 12 specialized (PM, reviewer, ...)"  
**Real system:** 18 core agents (with some having Sonnet/Opus variants making ~22 total)

The "12" in the L0 preview is outdated and doesn't match either the hero stat or reality.

---

## Moderate Discrepancies

### 5. Directory Structure: Old vs Plugin Architecture

**Site's L0 preview shows:**
```
.claude/commands/    → slash commands
.claude/skills/      → auto-activate skills
```

**Real system (v8.0+ plugin migration):**
```
.claude/plugins/karimo/
├── agents/          → 22 agent definitions
├── commands/        → 11 slash commands
└── skills/          → 7 reusable skills
```

Plus overview files at `.claude/` root:
- `agents.overview.md`
- `commands.overview.md`
- `skills.overview.md`
- `KARIMO_RULES.md`

---

### 6. Skills Count Mismatch

**Hero stats:** "18 Templates"  
**Real system:** 9 skills (7 in plugins/karimo/skills/ + 2 additional). It's unclear what "18 templates" refers to — possibly including brief templates, PRD templates, etc., but this isn't self-evident.

---

### 7. Token Comparison Numbers May Be Misleading

**Site claims:**
- Typical Plan Mode: 55k tokens (27.5% of 200k window)
- KARIMO: 7.5k tokens (3.75% of 200k window)
- Result: ~7x less

The "Typical Plan Mode" breakdown of "MCP servers ~25k, System prompt ~8k, Plan mode overhead ~22k" assumes a heavily loaded setup. This may be accurate for a real project with many MCP servers, but could seem inflated without that context. The "7x" claim depends on this specific comparison point.

---

### 8. Encoding Section Phase Descriptions Are Slightly Off

**Phase 1 (Planning) says:** "Research discovers external dependencies, standards, and internal patterns."  
**More accurate:** Research has two distinct phases — internal scan (patterns, components, conventions, schema) AND external scan (API docs, compliance standards, best practices). The site's description is vague about this two-phase nature.

**Phase 2 (Execution) says:** "4-layer branch assertion validates state before and after each operation"  
This is mentioned as a feature but never explained anywhere else on the site. Readers may not understand what the 4 layers are.

---

## Minor Discrepancies / Improvements

### 9. "Three-Phased Approach" Naming Confusion

The site has TWO different "three-phase" concepts:
- **Encoding Section:** "Git Timeline" — Planning, Execution, Review & Merge (the actual pipeline phases)
- **Option Section:** "Three-Phased Approach" — Execute PRD, Automate Review, Monitor & Merge (the adoption roadmap)

These are conceptually different (pipeline phases vs adoption phases) but use nearly identical terminology, which could confuse readers.

---

### 10. Installation Path

**Site CTA says:**
```
$ bash KARIMO/.karimo/install.sh ./my-project
```

This should be verified against the actual install script location in the repo. The MANIFEST.json-based installation system may use a different invocation.

---

### 11. Claude Features Timeline Dates

The feature dates (e.g., "Worktree Isolation - Mar 2026", "Sub-Agents - Jul 2025") should be verified. Some may be aspirational or based on Claude Code's roadmap rather than actual release dates.

---

### 12. Loop Terminology Inconsistency

The Overview section calls them "Loops" (Loop 1: Foundation, Loop 2: Decomposition, Loop 3: Orchestration), but the Encoding section calls them "Phases" (Phase 1: Planning, Phase 2: Execution, Phase 3: Review). These describe roughly the same pipeline but use different names and groupings.

---

## Priority Fix Order

| Priority | Issue | Impact |
|----------|-------|--------|
| P0 | Compressed Architecture layers wrong (#2) | Fundamentally misrepresents the core innovation |
| P0 | PRD interview 4 vs 5 rounds (#1) | Basic factual error, appears 3 times |
| P1 | "PRs target main directly" (#3) | Contradicts the site's own content elsewhere |
| P1 | Agent count inconsistency (#4) | 12 vs 22 in the same page |
| P1 | Directory structure outdated (#5) | Shows pre-plugin paths |
| P2 | Skills/templates count (#6) | "18 Templates" is unexplained |
| P2 | Token comparison context (#7) | Could seem inflated |
| P2 | Phase naming confusion (#9, #12) | UX/clarity issue |
| P3 | Encoding phase details (#8) | Minor copy improvements |
| P3 | Install path verification (#10) | Needs verification |
| P3 | Feature dates (#11) | Needs verification |
