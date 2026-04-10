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
    description: "A 4-round PRD interview that produces a structured plan with tasks, waves, and dependencies.",
    details: [
      "4-round interview: scope, requirements, dependencies, retro",
      "Automatic task breakdown with wave ordering",
      "Reviewer validates PRD before approval",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:plan --prd auth-system" },
      { type: "output" as const, text: "→ Loading research context..." },
      { type: "output" as const, text: "→ Round 1: Framing scope and success criteria" },
      { type: "output" as const, text: "→ Round 2: Breaking into prioritized requirements" },
      { type: "output" as const, text: "→ PRD generated: 12 tasks across 4 waves" },
      { type: "output" as const, text: "→ Saved to .karimo/prds/001_auth-system/" },
    ],
  },
  {
    id: "run",
    number: "03",
    title: "Run",
    command: "/karimo:run",
    description: "Generate task briefs, validate them, then execute with agents in parallel worktrees.",
    details: [
      "Generates detailed briefs from PRD per task",
      "Auto-reviews briefs for gaps and conflicts",
      "PM agent orchestrates wave-based execution",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:run --prd auth-system" },
      { type: "output" as const, text: "→ Phase 1: Generating 12 task briefs..." },
      { type: "output" as const, text: "→ Phase 2: Auto-reviewing briefs (0 critical)" },
      { type: "output" as const, text: "→ Phase 4: Creating feature/auth-system branch" },
      { type: "output" as const, text: "→ PM Agent spawned. Wave 1: 3 parallel worktrees" },
      { type: "output" as const, text: "→ task-1a: PR #12 created → feature/auth-system" },
    ],
  },
  {
    id: "review",
    number: "04",
    title: "Auto-Review",
    command: "Greptile / Claude",
    description: "Every task PR gets reviewed automatically with revision loops and model escalation.",
    details: [
      "Greptile or Claude reviews every task PR",
      "Up to 3 revision attempts per task",
      "Sonnet → Opus escalation on review failure",
    ],
    terminalLines: [
      { type: "command" as const, text: "→ Greptile reviewing PR #12..." },
      { type: "output" as const, text: "→ PR #12: Review passed ✓ (score: 9/10)" },
      { type: "output" as const, text: "→ PR #13: Revision 1 triggered (score: 6/10)" },
      { type: "output" as const, text: "→ PR #13: Sonnet attempting fix..." },
      { type: "output" as const, text: "→ PR #13: Revision 2 passed ✓ (score: 8/10)" },
    ],
  },
  {
    id: "orchestrate",
    number: "05",
    title: "Orchestrate",
    command: "PM Agent",
    description: "The PM agent sequences waves, propagates findings between tasks, and handles failures.",
    details: [
      "Wave completion detection and sequencing",
      "Cross-task finding propagation via findings.md",
      "Crash recovery from git state",
    ],
    terminalLines: [
      { type: "command" as const, text: "→ PM Agent coordinating execution..." },
      { type: "output" as const, text: "→ Wave 1: 3/3 tasks passed review" },
      { type: "output" as const, text: "→ Propagating findings to wave 2 agents..." },
      { type: "output" as const, text: "→ Wave 2: 4 worktrees spawned in parallel" },
      { type: "output" as const, text: "→ All 4 waves complete. Ready for merge." },
    ],
  },
  {
    id: "merge",
    number: "06",
    title: "Merge",
    command: "/karimo:merge",
    description: "Validate integration, run the full test suite, and create a consolidated PR to main.",
    details: [
      "Runs build, typecheck, lint, and tests",
      "Creates consolidated PR with audit trail",
      "Optional auto-merge and worktree cleanup",
    ],
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:merge --prd auth-system" },
      { type: "output" as const, text: "→ Running validation: build ✓ typecheck ✓ lint ✓" },
      { type: "output" as const, text: "→ 12 tasks merged to feature/auth-system" },
      { type: "output" as const, text: "→ Consolidated diff: 47 files, +2,841 −189" },
      { type: "output" as const, text: "→ PR #24 created → main (ready for approval)" },
      { type: "output" as const, text: "→ Cleaning up 12 worktrees and task branches..." },
    ],
  },
] as const;

// Adoption phases data
export const adoptionPhases = [
  {
    phase: 1,
    title: "Execute PRD",
    description:
      "Kick off your first PRD — pick something just a little too big for plan mode. KARIMO interviews you, breaks the work into tasks, and runs an agent team across isolated worktrees. You watch PRs land while you do other things.",
    features: [
      "PRD interviews with AI",
      "Agent team execution",
      "Wave-based parallel work",
      "PRs target main directly",
    ],
    objective: "Feel the difference between prompting and orchestrating",
  },
  {
    phase: 2,
    title: "Automate Review",
    description:
      "Turn on quality gates. Every PR gets reviewed by Greptile or Claude before it merges — with automated revision loops that fix findings without you lifting a finger. When Sonnet can't resolve it, Opus steps in.",
    features: [
      "Greptile or Claude code review",
      "Automated revision loops",
      "Model escalation (Sonnet → Opus)",
      "Hard gate after 3 failures",
    ],
    objective: "Ship with confidence you didn't have to earn manually",
  },
  {
    phase: 3,
    title: "Monitor",
    description:
      "Full visibility into what KARIMO is doing and has done. A real-time dashboard, PR-based status tracking, GitHub labels for every state transition, and execution metrics you can actually use to improve your workflow.",
    features: [
      "/karimo:dashboard command",
      "PR-based status tracking",
      "GitHub labels for state",
      "Execution metrics",
    ],
    objective: "Know exactly where every task stands without checking",
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
    label: "Loop 1",
    sublabel: "Human-Led",
    steps: ["CONFIGURE", "RESEARCH", "PLAN"],
    stepTimes: [pipelineTimeline.configure, pipelineTimeline.research, pipelineTimeline.plan],
    loopStart: pipelineTimeline.loop1In,
    loopEnd: pipelineTimeline.loop1End,
    commands: [processSteps[0], processSteps[1], processSteps[2]],
    inputOutput: {
      input: "Your codebase + your answers to the PRD interview",
      output: "Approved PRD with task breakdown, wave plan, and dependencies",
    },
    explanation: {
      title: "Human-Led",
      description: "You drive this loop. KARIMO auto-detects your project config, scans your codebase for patterns, then interviews you across 4 rounds to produce a structured PRD. You decide when the plan is ready to execute.",
      bullets: [
        "Configure detects your stack and sets up .karimo/config.yaml",
        "Research scans code + web for patterns and best practices",
        "Plan interviews you and generates PRD with tasks and waves",
      ],
    },
  },
  {
    id: "loop2",
    label: "Loop 2",
    sublabel: "Claude-Led",
    steps: ["TASKS", "REVIEW"],
    stepTimes: [pipelineTimeline.tasks, pipelineTimeline.autoReview],
    loopStart: pipelineTimeline.loop2In,
    loopEnd: pipelineTimeline.loop2End,
    commands: [processSteps[3], processSteps[4]],
    inputOutput: {
      input: "Approved PRD with tasks.yaml and execution_plan.yaml",
      output: "Feature branch with all task PRs merged and reviewed",
    },
    explanation: {
      title: "Claude-Led",
      description: "Claude agents take over. The PM agent generates briefs, auto-reviews them, then orchestrates execution across parallel worktrees. Every task PR gets reviewed by Greptile or Claude with automatic revision loops and model escalation.",
      bullets: [
        "Briefs generated and auto-reviewed before execution",
        "Each task runs in an isolated worktree with its own PR",
        "Sonnet → Opus escalation after failed review attempts",
      ],
    },
  },
  {
    id: "loop3",
    label: "Loop 3",
    sublabel: "Auto or Manual",
    steps: ["ORCHESTRATE", "INSPECT", "MERGE"],
    stepTimes: [pipelineTimeline.orchestrate, pipelineTimeline.inspect, pipelineTimeline.merge],
    loopStart: pipelineTimeline.loop3In,
    loopEnd: pipelineTimeline.loop3End,
    commands: [processSteps[5], processSteps[6]],
    inputOutput: {
      input: "Executed feature branch with all task PRs merged",
      output: "Single consolidated PR to main with full audit trail",
    },
    explanation: {
      title: "Auto or Manual",
      description: "The PM agent sequences waves and propagates findings between them. Once all tasks pass, the merge command validates integration, runs your full test suite, and creates a single consolidated PR to main for your final approval.",
      bullets: [
        "PM agent coordinates waves and propagates cross-task findings",
        "Validation suite runs build, typecheck, lint, and tests",
        "Consolidated PR includes links to every task PR",
      ],
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
      description: "You are the architect. Research discovers external dependencies, standards, and internal patterns. A structured interview captures your requirements into a PRD. Task briefs and a dependency graph are generated automatically.",
      howItWorks: [
        "Research scans external deps, API docs, standards + internal patterns, components, conventions",
        "Structured PRD interview captures requirements (~10 min via /karimo:plan)",
        "Task briefs generated from research + PRD artifacts",
        "Dependency graph maps execution order into parallelizable waves",
      ],
    },
    execution: {
      title: "Execution Phase",
      description: "Tasks execute in parallel waves using git worktree isolation. Each task runs in its own worktree with model routing — Sonnet for simple tasks, Opus for complex. Built-in safeguards prevent stuck loops and wrong-branch commits.",
      howItWorks: [
        "Waves execute in parallel using native git worktree isolation",
        "Model routing: Sonnet for simple tasks, Opus for complex — auto-escalation on failure",
        "4-layer branch assertion validates state before and after each operation",
        "Loop detection via semantic fingerprinting catches stuck tasks",
      ],
    },
    review: {
      title: "Review & Merge Phase",
      description: "Each PR is automatically reviewed via Greptile or Claude Code Review. Simple findings are auto-fixed by Sonnet; complex ones escalate to Opus. After passing review, the feature branch merges to main with clean atomic history.",
      howItWorks: [
        "Automated code review via Greptile or Claude Code Review",
        "Sonnet auto-fixes simple findings, escalates to Opus for complex issues",
        "Up to 3 review loops before requiring human intervention",
        "Final merge to main with clean, atomic commit history",
      ],
    },
  },
};
