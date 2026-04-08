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

// Wave animation data
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
