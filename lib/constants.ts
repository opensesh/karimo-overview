// KARIMO ASCII art (from README)
export const KARIMO_ASCII_ART = [
  "██╗  ██╗   █████╗   ██████╗   ██╗  ███╗   ███╗   ██████╗",
  "██║ ██╔╝  ██╔══██╗  ██╔══██╗  ██║  ████╗ ████║  ██╔═══██╗",
  "█████╔╝   ███████║  ██████╔╝  ██║  ██╔████╔██║  ██║   ██║",
  "██╔═██╗   ██╔══██║  ██╔══██╗  ██║  ██║╚██╔╝██║  ██║   ██║",
  "██║  ██╗  ██║  ██║  ██║  ██║  ██║  ██║ ╚═╝ ██║  ╚██████╔╝",
  "╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝  ╚═╝     ╚═╝   ╚═════╝",
] as const;

// Brand color tokens
export const colors = {
  black: "#000000",
  charcoal: "#191919",
  vanilla: "#FFFAEE",
  aperol: "#FE5102",
  black80: "#383838",
  black70: "#4A4A4A",
  black60: "#595959",
  black50: "#787878",
  black30: "#C7C7C7",
  black10: "#F0F0F0",
} as const;

// Animation timing
export const timing = {
  fast: 150,
  normal: 300,
  slow: 500,
  stagger: 100,
} as const;

// Stats data for hero
export const stats = [
  { value: "22", label: "Agents" },
  { value: "11", label: "Commands" },
  { value: "3", label: "Loops" },
  { value: "18", label: "Templates" },
] as const;

// Process steps data
export const processSteps = [
  {
    id: "configure",
    number: "00",
    title: "Configure",
    command: "/karimo:configure",
    description: "Auto-detect project settings and create .karimo/config.yaml — the single source of truth for all KARIMO operations.",
    details: [
      "Detects runtime, framework, and package manager",
      "Sets build, test, lint, and typecheck commands",
      "Configures file boundaries and review provider",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:configure --auto" },
      { type: "output" as const, text: "→ Detected: Next.js 16, React 19, TypeScript" },
      { type: "output" as const, text: "→ Build: npm run build  Test: npm run test" },
      { type: "output" as const, text: "→ Review provider: Greptile (threshold: 5)" },
      { type: "output" as const, text: "→ Config saved to .karimo/config.yaml" },
    ],
  },
  {
    id: "research",
    number: "01",
    title: "Research",
    command: "/karimo:research",
    description: "Scan your codebase and the web for patterns, conventions, and context before planning.",
    details: [
      "Scans project structure and existing patterns",
      "Performs web research for best practices",
      "Generates research/findings.md for the PRD interview",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:research" },
      { type: "output" as const, text: "→ Scanning 847 files across 12 directories..." },
      { type: "output" as const, text: "→ Internal: patterns, conventions, schema" },
      { type: "output" as const, text: "→ External: API docs, compliance standards" },
      { type: "output" as const, text: "→ Findings saved to research/findings.md" },
    ],
  },
  {
    id: "plan",
    number: "02",
    title: "Plan",
    command: "/karimo:plan",
    description: "A 5-round PRD interview that produces a structured plan with tasks, waves, and dependencies. Rounds are template-driven — edit the interview skill to reshape the process.",
    details: [
      "5-round interview: research, vision, scope, tasks, review",
      "Automatic task breakdown with wave ordering",
      "Reviewer validates PRD before approval",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:plan --prd auth-system" },
      { type: "output" as const, text: "→ Loading research context..." },
      { type: "output" as const, text: "→ Round 1/5: Vision — what and why" },
      { type: "output" as const, text: "→ Round 2/5: Scope — setting boundaries" },
      { type: "output" as const, text: "→ Round 3/5: Tasks — breaking down work" },
      { type: "output" as const, text: "→ Round 4/5: Review — validating the plan" },
      { type: "output" as const, text: "→ PRD generated: 12 tasks across 4 waves" },
      { type: "output" as const, text: "→ Saved to .karimo/prds/001_auth-system/" },
    ],
  },
  {
    id: "run",
    number: "03",
    title: "Run",
    command: "/karimo:run",
    description: "Generates task briefs, validates them, then configures execution — including gate placement for PRDs with 15+ tasks. Gates are checkpoints between waves for human review.",
    details: [
      "Auto-places gates between waves based on PRD size and complexity",
      "Generates detailed briefs with auto-review for gaps and conflicts",
      "Dispatches via worktree, wave, or feature integration cadence",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:run --prd auth-system" },
      { type: "output" as const, text: "→ Policy: worktree cadence, conditional gates" },
      { type: "output" as const, text: "→ Phase 1: Generating 12 task briefs..." },
      { type: "output" as const, text: "→ Phase 2: Auto-reviewing briefs (0 critical)" },
      { type: "output" as const, text: "→ PM Agent spawned. Wave 1: 3 parallel worktrees" },
      { type: "output" as const, text: "→ task-1a: PR #12 created → feature/auth-system" },
    ],
  },
  {
    id: "review",
    number: "04",
    title: "Review",
    command: "Claude + User",
    description: "Claude auto-reviews every task brief before execution, flagging critical risks, warnings, and observations. You can also manually review and adjust the recommendations before any code is written.",
    details: [
      "Claude challenges task order, dependencies, and scope",
      "Produces recommendations.md: Critical, Warning, Observation",
      "You review findings and approve, apply fixes, or loop back",
    ],
    terminalLines: [
      { type: "command" as const, text: "→ Brief-Reviewer analyzing 12 briefs..." },
      { type: "output" as const, text: "→ 0 Critical  2 Warnings  4 Observations" },
      { type: "output" as const, text: "→ Warning: task-2b may conflict with task-2a" },
      { type: "output" as const, text: "→ Recommendations saved to recommendations.md" },
      { type: "output" as const, text: "? Approve / Apply fixes / Modify / Cancel" },
    ],
  },
  {
    id: "orchestrate",
    number: "05",
    title: "Orchestrate",
    command: "PM Agent",
    description: "The PM agent sequences waves and pauses at gates for human review. Gates are checkpoints placed between waves — review findings, provide feedback, then resume execution.",
    details: [
      "Gates pause execution for human-in-the-loop review",
      "Propagates findings.md between waves for task-to-task coordination",
      "Resume with --resume after reviewing each gate checkpoint",
    ],
    terminalLines: [
      { type: "command" as const, text: "→ PM Agent coordinating execution..." },
      { type: "output" as const, text: "→ Wave 1: 3 tasks dispatched in parallel" },
      { type: "output" as const, text: "→ Wave 1: 3/3 passed. Gate: auto-passed ✓" },
      { type: "output" as const, text: "→ Wave 2: 4 tasks dispatched in parallel" },
      { type: "output" as const, text: "→ All 4 waves complete. Ready for merge." },
    ],
  },
  {
    id: "worktrees",
    number: "06",
    title: "Worktrees",
    command: "Isolation",
    description: "Each task runs in its own git worktree, all merging to one isolated feature branch. Work happens in parallel or dependent and merges to the feature branch before PR to main.",
    details: [
      "Each task gets worktree/{prd-slug}-{task-id}",
      "Tasks in the same wave execute in parallel",
      "PRs merge to feature/{prd-slug}, not main",
    ],
    terminalLines: [
      { type: "command" as const, text: "→ Creating worktrees for wave 1..." },
      { type: "output" as const, text: "→ worktree/auth-task-001 → Auth types" },
      { type: "output" as const, text: "→ worktree/auth-task-002 → User model" },
      { type: "output" as const, text: "→ worktree/auth-task-003 → DB migrations" },
      { type: "output" as const, text: "→ 3 agents implementing in parallel..." },
    ],
  },
  {
    id: "greptile-review",
    number: "07",
    title: "Code Review",
    command: "Auto/Manual",
    description: "Review cadence is fully configurable — trigger on PR, wave completion, or PRD merge. Providers include Greptile, Claude, or manual review with auto-remediation loops.",
    details: [
      "Review triggers: per-PR, per-wave, or per-PRD",
      "Provider options: Greptile, Claude, or manual",
      "Auto-remediation with Sonnet → Opus escalation",
    ],
    terminalLines: [
      { type: "command" as const, text: "→ Greptile reviewing PR #12..." },
      { type: "output" as const, text: "→ PR #12: Score 9/10 — passed ✓" },
      { type: "output" as const, text: "→ PR #13: Score 6/10 — remediating..." },
      { type: "output" as const, text: "→ PR #13: Sonnet fix applied, re-reviewing..." },
      { type: "output" as const, text: "→ PR #13: Score 8/10 — passed ✓" },
    ],
  },
  {
    id: "merge",
    number: "08",
    title: "Merge",
    command: "/karimo:merge",
    description: "Validate the feature branch, run your full test suite, and create a single consolidated PR to main with links to every task PR and a complete audit trail.",
    details: [
      "Runs build, typecheck, lint, and tests",
      "Creates consolidated PR with audit trail",
      "Cleans up all worktrees and task branches",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:merge --prd auth-system" },
      { type: "output" as const, text: "→ Validation: build ✓ typecheck ✓ lint ✓ tests ✓" },
      { type: "output" as const, text: "→ 12 tasks merged to feature/auth-system" },
      { type: "output" as const, text: "→ Consolidated diff: 47 files, +2,841 −189" },
      { type: "output" as const, text: "→ PR #24 created → main" },
    ],
  },
] as const;

// Adoption phases data
export const adoptionPhases = [
  {
    phase: 1,
    title: "Kickoff Feature",
    description:
      "Set up your environment so AI can quickly work as a cheat sheet. Run your first research — 8 documents generated for internal and external resources. Then kick off an interview to create a PRD that gets decomposed into tasks.",
    features: [
      "Auto-detect project config",
      "Internal + external research",
      "8 generated documents",
      "PRD interview → task decomposition",
    ],
    objective: "Feel the difference between prompting and orchestrating",
  },
  {
    phase: 2,
    title: "Choose Review Path",
    description:
      "Two review gates protect quality. Brief review catches gaps and errors before code is written — loop the model or inject feedback manually. PR review lets you choose manual, Greptile, or Claude before merge.",
    features: [
      "Brief review gate (critical/warning)",
      "Feedback injection + model loop",
      "Manual / Greptile / Claude PR review",
      "Automated revision loops",
    ],
    objective: "Find your boundaries with your codebase",
  },
  {
    phase: 3,
    title: "Monitor and Merge",
    description:
      "Full visibility into past and present tasks. Track task rate, model selection, and review feedback from a single dashboard. When everything looks good, merge with a consolidated PR to main.",
    features: [
      "Task history + task rate",
      "Loop model selection",
      "KARIMO feedback dashboard",
      "Consolidated merge to main",
    ],
    objective: "Understand the past and present of all features",
  },
] as const;

// Pipeline animation timing (ms) ~6.8s total
// Each loop runs for 1.4s = 2 full stroke-pulse cycles at 0.7s each
export const pipelineTimeline = {
  configure: 100, research: 350, plan: 550, loop1In: 750, loop1End: 2150,
  tasks: 2300, autoReview: 2550, loop2In: 2750, loop2End: 4150,
  orchestrate: 4300, inspect: 4550, merge: 4750, loop3In: 4950, loop3End: 6350,
  done: 6600,
} as const;

// Unified pipeline phases — maps loops → commands, I/O, terminal preview
export const pipelinePhases = [
  {
    id: "loop1",
    label: "Foundation",
    sublabel: "Human-Led",
    steps: ["RESEARCH", "PLAN"],
    loopCount: 2,
    stepTimes: [pipelineTimeline.research, pipelineTimeline.plan],
    loopStart: pipelineTimeline.loop1In,
    loopEnd: pipelineTimeline.loop1End,
    commands: [processSteps[0], processSteps[1], processSteps[2]],
    inputOutput: {
      input: "Your codebase + your answers to the PRD interview",
      output: "Approved PRD with task breakdown, wave plan, and dependencies",
    },
    explanation: {
      title: "Human-Led",
      description: "You drive this loop. KARIMO auto-detects your project config, scans your codebase for patterns, then interviews you across 5 rounds to produce a structured PRD. You decide when the plan is ready to execute.",
      bullets: [
        "Configure detects your stack and sets up .karimo/config.yaml",
        "Research scans code + web for patterns and best practices",
        "Plan interviews you and generates PRD with tasks and waves",
      ],
    },
  },
  {
    id: "loop2",
    label: "Decomposition",
    sublabel: "Claude-Led",
    steps: ["TASKS", "REVIEW"],
    loopCount: 2,
    stepTimes: [pipelineTimeline.tasks, pipelineTimeline.autoReview],
    loopStart: pipelineTimeline.loop2In,
    loopEnd: pipelineTimeline.loop2End,
    commands: [processSteps[3], processSteps[4]],
    inputOutput: {
      input: "Approved PRD with tasks.yaml and execution_plan.yaml",
      output: "Validated task briefs ready for execution",
    },
    explanation: {
      title: "Claude-Led",
      description: "Claude generates detailed task briefs from your PRD, then a brief-reviewer agent challenges them for risks and conflicts. You see a recommendations report with critical issues, warnings, and observations — and decide whether to approve, fix, or loop back before any code is written.",
      bullets: [],
    },
  },
  {
    id: "loop3",
    label: "Orchestration",
    sublabel: "Auto or Manual",
    steps: ["ORCHESTRATE", "INSPECT"],
    loopCount: 2,
    stepTimes: [pipelineTimeline.orchestrate, pipelineTimeline.inspect],
    loopStart: pipelineTimeline.loop3In,
    loopEnd: pipelineTimeline.loop3End,
    commands: [processSteps[5], processSteps[6], processSteps[7], processSteps[8]],
    inputOutput: {
      input: "Validated briefs + execution_plan.yaml + gate config",
      output: "Single consolidated PR to main with gate outcomes tracked",
    },
    explanation: {
      title: "Auto or Manual",
      description: "The PM agent dispatches tasks using your configured integration cadence (worktree, wave, or feature). Gates between waves enforce quality — pause for human review, auto-pass when tests are green, or skip entirely. Once all gates pass, /karimo:merge validates integration.",
      bullets: [],
    },
  },
] as const;

// Wave animation data (legacy, kept for backward compat)
export const waveData = [
  {
    wave: 1,
    tasks: [
      { id: "task-1a", name: "Setup auth types", status: "complete" },
      { id: "task-1b", name: "Create user model", status: "complete" },
    ],
  },
  {
    wave: 2,
    tasks: [
      { id: "task-2a", name: "Implement login", status: "complete" },
      { id: "task-2b", name: "Add session middleware", status: "complete" },
    ],
  },
  {
    wave: 3,
    tasks: [
      { id: "task-3a", name: "Build login UI", status: "active" },
      { id: "task-3b", name: "Add auth tests", status: "pending" },
    ],
  },
] as const;

// Orchestration phase types
export type PhaseId = "planning" | "execution" | "review";

export interface OrchestrationPhase {
  id: PhaseId;
  label: string;
  shortLabel: string;
}

export interface ResearchItem {
  label: string;
}

export interface TaskBrief {
  id: string;
  name: string;
  wave: number;
}

export interface WaveMapping {
  wave: number;
  color: string;
  taskIds: string[];
}

export interface WorktreeTask {
  id: string;
  name: string;
  status: "complete" | "active" | "pending";
  worktreeBranch: string;
  mergeTarget: string;
  wave: number;
}

export interface WaveNode {
  wave: number;
  color: string;
  tasks: WorktreeTask[];
}

export interface PhaseDescription {
  title: string;
  description: string;
  howItWorks: string[];
}

export interface OrchestrationData {
  phases: OrchestrationPhase[];
  featureBranch: string;
  prdName: string;
  research: { external: ResearchItem[]; internal: ResearchItem[] };
  taskBriefs: TaskBrief[];
  waveMappings: WaveMapping[];
  execution: { waves: WaveNode[] };
  reviewSteps: { id: string; label: string; sublabel: string }[];
  phaseDescriptions: Record<PhaseId, PhaseDescription>;
}

// Agent role types for timeline visualization
export type AgentRole = "coordinator" | "sub-agent" | "team";

export interface AgentDefinition {
  name: string;
  role: AgentRole;
}

export const agentAssignments: Record<string, AgentDefinition[]> = {
  "planning:research":    [{ name: "Investigator", role: "sub-agent" }],
  "planning:create-prd":  [{ name: "Interviewer", role: "sub-agent" }],
  "planning:task-briefs": [{ name: "Brief Writer", role: "sub-agent" }, { name: "PM", role: "coordinator" }],
  "planning:dependency":  [{ name: "PM", role: "coordinator" }, { name: "Reviewer", role: "sub-agent" }],
  "execution:execute":    [{ name: "PM", role: "coordinator" }, { name: "Implementer", role: "sub-agent" }, { name: "Tester", role: "sub-agent" }],
  "execution:inspect":    [{ name: "PM Reviewer", role: "team" }],
  "review:inspect":       [{ name: "Review Architect", role: "team" }],
  "review:fix-errors":    [{ name: "Greptile Remediator", role: "sub-agent" }, { name: "Implementer", role: "sub-agent" }],
  "review:merge":         [{ name: "PM", role: "coordinator" }],
};

// Wave colors for visual coding
const WAVE_COLORS = {
  1: "#22c55e",  // green
  2: "#f59e0b",  // amber
  3: "#3b82f6",  // blue
  4: "#a855f7",  // purple
} as const;

export const orchestrationData: OrchestrationData = {
  phases: [
    { id: "planning", label: "Planning", shortLabel: "Plan" },
    { id: "execution", label: "Execution", shortLabel: "Exec" },
    { id: "review", label: "Review & Merge", shortLabel: "Review" },
  ],
  featureBranch: "feature/auth-system",
  prdName: "PRD-Feature-001",
  research: {
    external: [
      { label: "Dependencies" },
      { label: "API Docs" },
      { label: "Standards" },
      { label: "Compliance" },
    ],
    internal: [
      { label: "Patterns" },
      { label: "Components" },
      { label: "Conventions" },
      { label: "Schema" },
    ],
  },
  taskBriefs: [
    { id: "PRD-Task-001", name: "Auth types", wave: 1 },
    { id: "PRD-Task-002", name: "User model", wave: 1 },
    { id: "PRD-Task-003", name: "DB migrations", wave: 1 },
    { id: "PRD-Task-004", name: "Login API", wave: 2 },
    { id: "PRD-Task-005", name: "Session mgmt", wave: 2 },
    { id: "PRD-Task-006", name: "Token refresh", wave: 2 },
    { id: "PRD-Task-007", name: "Auth middleware", wave: 2 },
    { id: "PRD-Task-008", name: "Login UI", wave: 3 },
    { id: "PRD-Task-009", name: "Signup flow", wave: 3 },
    { id: "PRD-Task-010", name: "Password reset", wave: 3 },
    { id: "PRD-Task-011", name: "E2E auth tests", wave: 4 },
    { id: "PRD-Task-012", name: "Docs update", wave: 4 },
  ],
  waveMappings: [
    { wave: 1, color: WAVE_COLORS[1], taskIds: ["PRD-Task-001", "PRD-Task-002", "PRD-Task-003"] },
    { wave: 2, color: WAVE_COLORS[2], taskIds: ["PRD-Task-004", "PRD-Task-005", "PRD-Task-006", "PRD-Task-007"] },
    { wave: 3, color: WAVE_COLORS[3], taskIds: ["PRD-Task-008", "PRD-Task-009", "PRD-Task-010"] },
    { wave: 4, color: WAVE_COLORS[4], taskIds: ["PRD-Task-011", "PRD-Task-012"] },
  ],
  execution: {
    waves: [
      {
        wave: 1,
        color: WAVE_COLORS[1],
        tasks: [
          { id: "PRD-Task-001", name: "Auth types", status: "complete", worktreeBranch: "worktree/prd-1-task-001", mergeTarget: "feature/auth-system", wave: 1 },
          { id: "PRD-Task-002", name: "User model", status: "complete", worktreeBranch: "worktree/prd-1-task-002", mergeTarget: "feature/auth-system", wave: 1 },
          { id: "PRD-Task-003", name: "DB migrations", status: "complete", worktreeBranch: "worktree/prd-1-task-003", mergeTarget: "feature/auth-system", wave: 1 },
        ],
      },
      {
        wave: 2,
        color: WAVE_COLORS[2],
        tasks: [
          { id: "PRD-Task-004", name: "Login API", status: "complete", worktreeBranch: "worktree/prd-1-task-004", mergeTarget: "feature/auth-system", wave: 2 },
          { id: "PRD-Task-005", name: "Session mgmt", status: "complete", worktreeBranch: "worktree/prd-1-task-005", mergeTarget: "feature/auth-system", wave: 2 },
          { id: "PRD-Task-006", name: "Token refresh", status: "complete", worktreeBranch: "worktree/prd-1-task-006", mergeTarget: "feature/auth-system", wave: 2 },
          { id: "PRD-Task-007", name: "Auth middleware", status: "complete", worktreeBranch: "worktree/prd-1-task-007", mergeTarget: "feature/auth-system", wave: 2 },
        ],
      },
      {
        wave: 3,
        color: WAVE_COLORS[3],
        tasks: [
          { id: "PRD-Task-008", name: "Login UI", status: "active", worktreeBranch: "worktree/prd-1-task-008", mergeTarget: "feature/auth-system", wave: 3 },
          { id: "PRD-Task-009", name: "Signup flow", status: "active", worktreeBranch: "worktree/prd-1-task-009", mergeTarget: "feature/auth-system", wave: 3 },
          { id: "PRD-Task-010", name: "Password reset", status: "pending", worktreeBranch: "worktree/prd-1-task-010", mergeTarget: "feature/auth-system", wave: 3 },
        ],
      },
      {
        wave: 4,
        color: WAVE_COLORS[4],
        tasks: [
          { id: "PRD-Task-011", name: "E2E auth tests", status: "pending", worktreeBranch: "worktree/prd-1-task-011", mergeTarget: "feature/auth-system", wave: 4 },
          { id: "PRD-Task-012", name: "Docs update", status: "pending", worktreeBranch: "worktree/prd-1-task-012", mergeTarget: "feature/auth-system", wave: 4 },
        ],
      },
    ],
  },
  reviewSteps: [
    { id: "inspect", label: "Inspect", sublabel: "Code Review" },
    { id: "clean", label: "Fix Errors", sublabel: "Auto or Manual" },
    { id: "merge", label: "Merge", sublabel: "Pass tests to main" },
  ],
  phaseDescriptions: {
    planning: {
      title: "Planning Phase",
      description: "You are the architect. Research discovers external dependencies, standards, and internal patterns. You can layer in your own research, upload screenshots, and collect assets in a PRD folder. A structured interview captures your requirements into a PRD. Task briefs and a dependency graph are generated automatically.",
      howItWorks: [
        "Research scans external deps, API docs, standards + internal patterns, components, conventions — layer in your own research and assets",
        "Structured PRD interview captures requirements (~10 min via /karimo:plan)",
        "Task briefs generated from research + PRD artifacts",
        "Dependency graph maps execution order into parallelizable waves",
      ],
    },
    execution: {
      title: "Execution Phase",
      description: "Tasks execute in dependency-ordered waves using your configured integration cadence. Gates between waves enforce quality checkpoints. Model routing assigns Sonnet or Opus based on complexity, with live worktree state tracking.",
      howItWorks: [
        "Integration cadence: worktree (parallel), wave (sequential), or feature (single branch)",
        "Gate modes: pause (human), conditional (auto if green), skip-on-pass",
        "Model routing based on complexity — Sonnet for simple, Opus for complex, with auto-escalation",
        "Live worktree tracking with auto-cleanup after merge",
      ],
    },
    review: {
      title: "Review & Merge Phase",
      description: "Review cadence is fully configurable — trigger on PR, wave, or PRD completion. Gate outcomes are tracked for visibility. After all gates pass, the feature branch merges to main with a complete audit trail.",
      howItWorks: [
        "Review triggers: per-PR, per-wave, or per-PRD (configurable)",
        "Providers: Greptile, Claude, or manual review",
        "Gate outcomes tracked: auto-passed, human-approved, or waiting",
        "Final merge to main with clean, atomic commit history",
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// FAQ items (from KARIMO README)
// ---------------------------------------------------------------------------

export const faqItems = [
  {
    question: "Can I run without automated review?",
    answer:
      "Yes. Review is optional (Phase 2). PRD interviews, execution, and PRs all work out of the box.",
  },
  {
    question: "Do I need to use a feature branch?",
    answer:
      "No. KARIMO supports two modes configured via /karimo:configure: feature branch mode (tasks branch from a feature branch) or main mode (tasks branch directly from main). Choose what fits your workflow.",
  },
  {
    question: "Can I run multiple sessions at once?",
    answer:
      "Yes, but be careful when running multiple feature branches with worktrees simultaneously. Typically when a feature branch and work trees are kicked off for a PRD, you only want to be doing research and planning on main. For best results, let one orchestration complete before starting another.",
  },
  {
    question: "Do I need to use Greptile?",
    answer:
      "No. You can use manual review, Claude Code Review, or any other review mechanism. Greptile is one option for automated review in Phase 2, but it's entirely optional.",
  },
  {
    question: "Can I use other tools for research?",
    answer:
      "Yes. We use Firecrawl MCP for deeper web research capability. You can integrate any MCP servers or tools that fit your workflow.",
  },
  {
    question: "Can I customize for my use case?",
    answer:
      "Yes. You can modify your local installation directly or fork the repository for more extensive customization. Agent definitions, templates, and skills are all editable.",
  },
  {
    question: "What are gates and when do I need them?",
    answer:
      "Gates are checkpoints placed between waves for human review. PRDs with 15+ tasks require at least one gate — they're auto-suggested during /karimo:run or you can customize placement. At each gate, execution pauses so you can review findings, provide feedback, then resume with --resume.",
  },
  {
    question: "How does compound learning work?",
    answer:
      "KARIMO has a two-tier knowledge system. Findings are per-PRD and automatic — they coordinate task-to-task within a single PRD. Learnings are project-wide and user-triggered via /karimo:feedback — patterns that work, anti-patterns to avoid, captured and applied to all future PRDs.",
  },
  {
    question: "Having issues?",
    answer:
      "Run /karimo:doctor to diagnose. Still stuck? Contact hello@opensession.co",
  },
];
