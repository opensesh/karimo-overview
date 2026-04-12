# KARIMO Claude Code Feature Audit

**Date:** 2026-04-12
**Auditor:** Claude Opus 4.6
**Source of Claim:** `components/orchestration/ClaudeFeatures.tsx` (lines 21-102)
**Verified Against:** KARIMO v8.0.0 at `/KARIMO/`

---

## Verdict: 10/10 Confirmed

All 10 claimed Claude Code features are genuinely implemented in the KARIMO codebase. Five use native Claude Code APIs directly; five are custom orchestration logic built on top of git, bash, and GitHub CLI.

---

## Feature-by-Feature Audit

### 1. Worktree Isolation -- CONFIRMED (Native)

**Claim:** "Each task executes in its own git worktree. No conflicts, no race conditions."

**Evidence:** 6 worker agents declare `isolation: worktree` in their YAML frontmatter:
- `.claude/plugins/karimo/agents/implementer.md` (line 6)
- `.claude/plugins/karimo/agents/implementer-opus.md` (line 6)
- `.claude/plugins/karimo/agents/tester.md` (line 6)
- `.claude/plugins/karimo/agents/tester-opus.md` (line 6)
- `.claude/plugins/karimo/agents/documenter.md` (line 6)
- `.claude/plugins/karimo/agents/documenter-opus.md` (line 6)

Each task gets its own worktree branch (`worktree/{prd-slug}-{task-id}`), enabling true parallel execution without merge conflicts.

---

### 2. Sub-Agents -- CONFIRMED (Native)

**Claim:** "Spawn focused child agents for parallel task execution across your codebase."

**Evidence:** PM Agent (`agents/pm.md`) is an explicit orchestrator that never writes code itself. It spawns:
- `karimo-implementer` / `karimo-implementer-opus` for coding tasks
- `karimo-tester` / `karimo-tester-opus` for test writing
- `karimo-documenter` / `karimo-documenter-opus` for documentation
- `karimo-pm-reviewer` per task PR for review
- `karimo-pm-finalizer` after all waves complete

PM Agent line 14: "you NEVER write code" -- all work delegated to sub-agents.

---

### 3. Agent Teams -- CONFIRMED (Custom)

**Claim:** "Coordinate multiple agents working on related tasks simultaneously."

**Evidence:** Wave-based parallel execution in `agents/pm.md` (lines 285-310):
- Tasks organized into dependency-based waves
- Within a wave, up to 3 tasks run in parallel
- Wave N+1 waits for all Wave N tasks to merge
- Execution plan generated from task dependency graph

This is custom coordination logic built on top of Claude Code's native sub-agent spawning.

---

### 4. Skills -- CONFIRMED (Native)

**Claim:** "Reusable capability modules that extend agent knowledge and behavior."

**Evidence:** 7 skill files in `.claude/plugins/karimo/skills/`:

| Skill File | Lines | Referenced By |
|------------|-------|---------------|
| `bash-utilities.md` | 730 | Multiple agents |
| `code-standards.md` | 269 | implementer, implementer-opus |
| `doc-standards.md` | 463 | documenter, documenter-opus |
| `testing-standards.md` | 438 | tester, tester-opus |
| `research-methods.md` | 300 | Research workflows |
| `external-research.md` | 420 | Research workflows |
| `firecrawl-web-tools.md` | 483 | Web research |

Worker agents reference skills via `skills:` in YAML frontmatter (e.g., `implementer.md` line 7: `skills: karimo-code-standards`).

---

### 5. Hooks -- CONFIRMED (Native + Custom)

**Claim:** "Lifecycle hooks for pre/post task automation and validation steps."

**Native Claude Code Hooks** (documented in `agents/pm.md` lines 96-108):
- `WorktreeRemove` -- fires before worktree removal, deletes branches
- `SubagentStop` -- fires after worker agent finishes
- `SessionEnd` -- fires when Claude Code session ends

**Custom KARIMO Hooks** (`.karimo/hooks/` directory, 6 hook types):
- `pre-wave`, `post-wave` -- before/after each execution wave
- `pre-task`, `post-task` -- before/after each task
- `on-failure` -- on task failure
- `on-merge` -- after PR merge

Custom hooks receive environment variables (TASK_ID, PRD_SLUG, COMPLEXITY, WAVE) and control flow via exit codes (0=continue, 1=soft fail, 2=hard fail). Example integrations include Slack notifications, Jira updates, and deployment triggers.

---

### 6. Model Routing -- CONFIRMED (Custom)

**Claim:** "Route tasks to optimal models based on complexity and cost constraints."

**Evidence:** Complexity-based routing in `agents/pm.md` (lines 312-317):

| Complexity | Model | Agent Variant |
|------------|-------|---------------|
| 1-2 | Sonnet | karimo-implementer, karimo-tester, karimo-documenter |
| 3-10 | Opus | karimo-implementer-opus, karimo-tester-opus, karimo-documenter-opus |

**Escalation logic** (`agents/pm.md` lines 563-567):
- Task stalling (loop_count >= 3) triggers Sonnet-to-Opus escalation
- If already Opus, marks `needs-human-review`
- Never exceeds 5 total loops

This is custom logic -- KARIMO selects agent variants (which have different `model:` frontmatter) based on task metadata.

---

### 7. Commands -- CONFIRMED (Native)

**Claim:** "Custom slash commands to streamline repetitive workflows and operations."

**Evidence:** 11 command files in `.claude/plugins/karimo/commands/`:

| Command | File | Purpose |
|---------|------|---------|
| `/karimo:plan` | `plan.md` (26KB) | PRD interview and planning |
| `/karimo:run` | `run.md` (18KB) | Execute PRD tasks |
| `/karimo:merge` | `merge.md` (27KB) | Create final PR to main |
| `/karimo:dashboard` | `dashboard.md` | Monitor execution progress |
| `/karimo:research` | `research.md` | Research phase |
| `/karimo:feedback` | `feedback.md` | Feedback collection |
| `/karimo:configure` | `configure.md` (59KB) | Project configuration |
| `/karimo:doctor` | `doctor.md` (41KB) | Diagnostic checks |
| `/karimo:update` | `update.md` | Check for updates |
| `/karimo:help` | `help.md` | Documentation search |
| `/karimo:greptile-review` | `greptile-review.md` | Automated code review |

---

### 8. Branch Assertion -- CONFIRMED (Custom)

**Claim:** "PM Agent verifies branch state before and after each operation."

**Evidence:** 4-layer validation system documented in `agents/pm.md` (lines 201-233) and `.karimo/docs/SAFEGUARDS.md` (lines 249-290):

| Layer | What | Where |
|-------|------|-------|
| 1 | Task Brief Template | Visual execution context header + pre-commit validation script |
| 2 | KARIMO Rules | Section 2.1: mandatory branch verification, non-negotiable pre-commit check |
| 3 | PM Agent Spawn Wrapper | Identity enforcement + visual context header in spawn prompt |
| 4 | Task Agents | All 6 worker agents verify branch before every commit |

**Core function** (`agents/pm.md` lines 201-233): `ensure_branch()` runs at 5 points:
1. Before each wave starts
2. Before spawning each worker
3. Before committing wave state
4. Before running validation
5. Before finalization commit

**Pre-commit guard** (SAFEGUARDS.md lines 278-288):
```bash
CURRENT_BRANCH=$(git branch --show-current)
EXPECTED_BRANCH="worktree/{prd-slug}-{task-id}"
if [ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]; then
  echo "KARIMO BRANCH GUARD FAILURE"
  exit 1
fi
```

This is entirely custom logic -- not a native Claude Code feature, but a robust safety mechanism built on git commands.

---

### 9. Loop Detection -- CONFIRMED (Custom)

**Claim:** "Automatic detection of revision loops prevents infinite cycles."

**Evidence:** Semantic fingerprinting in `agents/pm-reviewer.md` (lines 357-412) and `.karimo/docs/SAFEGUARDS.md` (lines 291-322):

**Fingerprinting algorithm** (pm-reviewer.md lines 367-376):
```bash
fingerprint=$(cat <<EOF | sha256sum | cut -d' ' -f1
action: commit
files: $(git diff --name-only HEAD~1 HEAD | sort | tr '\n' ',')
branch: $(git rev-parse HEAD)
validation: $(git log -1 --format=%B | grep -oE 'ERROR:|FAILED:...')
EOF)
```

**Detection logic:**
- Stores fingerprints in `.fingerprints_{task_id}.txt`
- Compares current fingerprint against last 5 stored fingerprints
- Loop detected when same fingerprint appears twice
- Keeps rolling history of last 10 fingerprints

**Circuit breaker behavior:**

| Condition | Action |
|-----------|--------|
| Semantic loop + Sonnet | Escalate to Opus, reset loop count |
| Semantic loop + Opus | Return `escalate` verdict |
| 3 revision loops | Return `escalate` verdict (max_revisions) |
| 5 total loops | Hard limit, requires human review |

This is custom logic -- KARIMO built a fingerprint-based loop detector using sha256sum and git diff.

---

### 10. Crash Recovery -- CONFIRMED (Custom)

**Claim:** "Execution state reconstructed from git. Resume exactly where you left off."

**Evidence:** State reconciliation in `agents/pm.md` (lines 235-280) and `.karimo/docs/SAFEGUARDS.md` (lines 353-366):

**Reconciliation mechanism:**
- PM Agent reads git branch state (local + remote) to derive task status
- Branch detection via `git show-ref --verify` and `git ls-remote --heads`
- PR state retrieved via `gh pr list --head {branch}`
- Merge detection by parsing `mergedAt` timestamp from PR data

**Status inference rules:**
- Branch exists + no merged PR = task `crashed` (needs retry)
- Branch exists + merged PR = task `completed`
- No branch + no PR = task `not started`

**User invocation:** `/karimo:dashboard --reconcile` triggers full state reconstruction.

This is custom logic -- KARIMO uses git as its persistence layer, reconstructing execution state from branch and PR metadata rather than storing state in files.

---

## Classification Summary

| # | Feature | Native Claude Code | Custom KARIMO |
|---|---------|:-:|:-:|
| 1 | Worktree Isolation | X | |
| 2 | Sub-Agents | X | |
| 3 | Agent Teams | | X |
| 4 | Skills | X | |
| 5 | Hooks | X | X |
| 6 | Model Routing | | X |
| 7 | Commands | X | |
| 8 | Branch Assertion | | X |
| 9 | Loop Detection | | X |
| 10 | Crash Recovery | | X |

**5 Native** -- use Claude Code APIs directly (worktrees, sub-agents, skills, hooks, commands)
**5 Custom** -- built by KARIMO on top of git/bash/GitHub CLI (agent teams, model routing, branch assertion, loop detection, crash recovery)

---

## Notes

- Features 8-10 (Branch Assertion, Loop Detection, Crash Recovery) are the most novel -- they represent safety infrastructure that KARIMO built entirely from scratch using git as a state store. These are not features Claude Code provides out of the box.
- The distinction between "native" and "custom" doesn't diminish the claim. KARIMO uses Claude Code as the platform and extends it with custom orchestration. All 10 features are real, documented, and integrated into the execution pipeline.
- Hooks (feature 5) spans both categories: native Claude Code hooks handle infrastructure cleanup, while custom `.karimo/hooks/` scripts handle team integrations.
