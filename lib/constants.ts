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
    id: "research",
    number: "01",
    title: "Research",
    command: "/karimo:research",
    description: "Gather context about your codebase, dependencies, and existing patterns before planning.",
    details: [
      "Scans project structure and tech stack",
      "Identifies existing patterns and conventions",
      "Creates foundation for PRD interviews",
    ],
  },
  {
    id: "plan",
    number: "02",
    title: "Plan",
    command: "/karimo:plan",
    description: "Interactive PRD interviews with an AI interviewer that helps you define requirements.",
    details: [
      "Structured interview flow",
      "Automatic task breakdown",
      "Dependency detection between tasks",
    ],
  },
  {
    id: "run",
    number: "03",
    title: "Run",
    command: "/karimo:run",
    description: "Execute tasks with coordinated agents working in isolated worktrees.",
    details: [
      "Wave-based parallel execution",
      "Each task gets isolated worktree",
      "Automatic PR creation to main",
    ],
  },
  {
    id: "review",
    number: "04",
    title: "Auto-Review",
    command: "Greptile / Claude",
    description: "Automated code review with revision loops and model escalation.",
    details: [
      "Greptile or Claude Code Review",
      "Up to 3 revision attempts",
      "Sonnet → Opus escalation on failure",
    ],
  },
  {
    id: "orchestrate",
    number: "05",
    title: "Orchestrate",
    command: "PM Agent",
    description: "PM agent coordinates waves, handles failures, and manages the execution lifecycle.",
    details: [
      "Wave completion detection",
      "Finding propagation between waves",
      "Crash recovery from git state",
    ],
  },
  {
    id: "merge",
    number: "06",
    title: "Merge",
    command: "/karimo:merge",
    description: "Create final PR consolidating all changes with full audit trail.",
    details: [
      "Squash or merge strategy",
      "Complete change documentation",
      "Links to all task PRs",
    ],
  },
] as const;

// Adoption phases data
export const adoptionPhases = [
  {
    phase: 1,
    title: "Execute PRD",
    subtitle: "Start here",
    features: [
      "PRD interviews with AI",
      "Agent team execution",
      "Wave-based parallel work",
      "PRs target main directly",
    ],
    requirement: "Works out of the box",
  },
  {
    phase: 2,
    title: "Automate Review",
    subtitle: "Add quality gates",
    features: [
      "Greptile ($30/mo) or Claude Review",
      "Automated revision loops",
      "Model escalation (Sonnet → Opus)",
      "Hard gate after 3 failures",
    ],
    requirement: "Run /karimo:configure --review",
  },
  {
    phase: 3,
    title: "Monitor",
    subtitle: "Full visibility",
    features: [
      "/karimo:dashboard command",
      "PR-based status tracking",
      "GitHub labels for state",
      "Execution metrics",
    ],
    requirement: "GitHub MCP configured",
  },
] as const;

// Pipeline animation timing (ms) ~4.8s total
export const pipelineTimeline = {
  research: 100, plan: 350, loop1In: 550, loop1End: 1500,
  run: 1600, tasks: 1800, autoReview: 2000, loop2In: 2200, loop2End: 3150,
  orchestrate: 3250, inspect: 3450, loop3In: 3650, loop3End: 4600,
  done: 4800,
} as const;

// Unified pipeline phases — maps loops → commands, strategy, terminal preview
export const pipelinePhases = [
  {
    id: "loop1",
    label: "Loop 1",
    sublabel: "Human",
    steps: ["RESEARCH", "PLAN"],
    stepTimes: [pipelineTimeline.research, pipelineTimeline.plan],
    loopStart: pipelineTimeline.loop1In,
    loopEnd: pipelineTimeline.loop1End,
    commands: [processSteps[0], processSteps[1]],
    strategicLoop: {
      title: "Interview Refinement",
      description: "PRD interviews refine until requirements are clear. The interviewer loops back when answers are vague or contradictory, ensuring the PRD is agent-ready before execution begins.",
    },
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:research" },
      { type: "output" as const, text: "→ Scanning project structure..." },
      { type: "output" as const, text: "→ Analyzing 847 files across 12 directories" },
      { type: "output" as const, text: "→ Research complete. Ready for planning." },
      { type: "blank" as const, text: "" },
      { type: "command" as const, text: "claude /karimo:plan" },
      { type: "output" as const, text: "→ Starting PRD interview..." },
      { type: "output" as const, text: '? What feature are you building? › "Auth system"' },
      { type: "output" as const, text: "→ Generating PRD with 6 tasks across 3 waves" },
    ],
  },
  {
    id: "loop2",
    label: "Loop 2",
    sublabel: "Claude",
    steps: ["RUN", "TASKS", "AUTO-REVIEW"],
    stepTimes: [pipelineTimeline.run, pipelineTimeline.tasks, pipelineTimeline.autoReview],
    loopStart: pipelineTimeline.loop2In,
    loopEnd: pipelineTimeline.loop2End,
    commands: [processSteps[2], processSteps[3]],
    strategicLoop: {
      title: "Task Revision",
      description: "Failed tasks get revised with model escalation. Sonnet attempts first, and on failure the PM agent escalates to Opus for deeper reasoning — up to 3 revision attempts per task.",
    },
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:run" },
      { type: "output" as const, text: "→ Phase 1: Pre-execution validation..." },
      { type: "output" as const, text: "→ Spawning wave 1: task-1a, task-1b (parallel)" },
      { type: "output" as const, text: "→ task-1a: worktree created, implementing..." },
      { type: "output" as const, text: "→ task-1b: worktree created, implementing..." },
      { type: "output" as const, text: "→ task-1a: PR #12 created → Greptile reviewing..." },
      { type: "output" as const, text: "→ task-1a: Review passed ✓" },
      { type: "output" as const, text: "→ task-1b: Revision 1 triggered (score: 6/10)" },
    ],
  },
  {
    id: "loop3",
    label: "Loop 3",
    sublabel: "Configurable",
    steps: ["ORCHESTRATE", "INSPECT"],
    stepTimes: [pipelineTimeline.orchestrate, pipelineTimeline.inspect],
    loopStart: pipelineTimeline.loop3In,
    loopEnd: pipelineTimeline.loop3End,
    commands: [processSteps[4], processSteps[5]],
    strategicLoop: {
      title: "Review Revision",
      description: "The review-architect validates integration across task PRs, reconciles merge conflicts, and triggers revisions up to 3 times before hard-gating.",
    },
    terminalLines: [
      { type: "command" as const, text: "claude /karimo:merge" },
      { type: "output" as const, text: "→ Review-architect validating integration..." },
      { type: "output" as const, text: "→ Reconciling 4 task PRs into feature branch" },
      { type: "output" as const, text: "→ Conflict detected in src/auth/types.ts" },
      { type: "output" as const, text: "→ Auto-resolving with review-architect..." },
      { type: "output" as const, text: "→ All conflicts resolved ✓" },
      { type: "output" as const, text: "→ Feature PR #18 ready for your approval" },
    ],
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
  description: string;
}

export interface PlanningNode {
  id: string;
  label: string;
  sublabel: string;
  type: "prd" | "briefs" | "dependencies";
}

export interface WorktreeTask {
  id: string;
  name: string;
  status: "complete" | "active" | "pending";
  worktreeBranch: string;
  mergeTarget: string;
}

export interface WaveNode {
  wave: number;
  tasks: WorktreeTask[];
}

export interface ReviewNode {
  id: string;
  type: "pr-create" | "review-loop" | "final-merge";
  label: string;
  sublabel?: string;
  iterations?: number;
}

export interface OrchestrationData {
  phases: OrchestrationPhase[];
  featureBranch: string;
  planning: PlanningNode[];
  execution: { waves: WaveNode[] };
  review: ReviewNode[];
}

export const orchestrationData: OrchestrationData = {
  phases: [
    {
      id: "planning",
      label: "Planning",
      shortLabel: "Plan",
      description: "PRD decomposition on main",
    },
    {
      id: "execution",
      label: "Execution",
      shortLabel: "Exec",
      description: "Feature branch + wave execution",
    },
    {
      id: "review",
      label: "Review & Merge",
      shortLabel: "Review",
      description: "PR review and merge to main",
    },
  ],
  featureBranch: "feature/auth-system",
  planning: [
    {
      id: "prd",
      label: "PRD Created",
      sublabel: "/karimo:plan",
      type: "prd",
    },
    {
      id: "briefs",
      label: "Task Briefs",
      sublabel: "Decomposed",
      type: "briefs",
    },
    {
      id: "deps",
      label: "Dependency Graph",
      sublabel: "tasks.yaml",
      type: "dependencies",
    },
  ],
  execution: {
    waves: [
      {
        wave: 1,
        tasks: [
          {
            id: "task-1a",
            name: "Setup auth types",
            status: "complete",
            worktreeBranch: "worktree/prd-1-task-1a",
            mergeTarget: "feature/auth-system",
          },
          {
            id: "task-1b",
            name: "Create user model",
            status: "complete",
            worktreeBranch: "worktree/prd-1-task-1b",
            mergeTarget: "feature/auth-system",
          },
        ],
      },
      {
        wave: 2,
        tasks: [
          {
            id: "task-2a",
            name: "Implement login",
            status: "complete",
            worktreeBranch: "worktree/prd-1-task-2a",
            mergeTarget: "feature/auth-system",
          },
          {
            id: "task-2b",
            name: "Add session middleware",
            status: "complete",
            worktreeBranch: "worktree/prd-1-task-2b",
            mergeTarget: "feature/auth-system",
          },
        ],
      },
      {
        wave: 3,
        tasks: [
          {
            id: "task-3a",
            name: "Build login UI",
            status: "active",
            worktreeBranch: "worktree/prd-1-task-3a",
            mergeTarget: "feature/auth-system",
          },
          {
            id: "task-3b",
            name: "Add auth tests",
            status: "pending",
            worktreeBranch: "worktree/prd-1-task-3b",
            mergeTarget: "feature/auth-system",
          },
        ],
      },
    ],
  },
  review: [
    {
      id: "pr",
      type: "pr-create",
      label: "PR Created",
      sublabel: "feature → main",
    },
    {
      id: "review",
      type: "review-loop",
      label: "Code Review",
      sublabel: "Greptile",
      iterations: 2,
    },
    {
      id: "merge",
      type: "final-merge",
      label: "Merged",
      sublabel: "→ main",
    },
  ],
};
