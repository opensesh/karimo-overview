// KARIMO architecture data — hand-authored hierarchy reflecting opensesh/KARIMO
// Drives the Architecture Explorer treemap in SolutionSection.

export type Category =
  | "agents"
  | "skills"
  | "commands"
  | "plugins"
  | "hooks"
  | "templates";

export interface ArchNode {
  id: string;
  name: string;
  category: Category;
  fileCount: number;
  description?: string;
  githubUrl?: string;
  children?: ArchNode[];
}

export interface CategoryMeta {
  label: string;
  fill: string;
  stroke: string;
  text: string;
}

// Muted, brand-aligned palette — desaturated to ~50% so categories read as
// "designed" against #191919 without competing with the Aperol brand orange.
export const CATEGORY_META: Record<Category, CategoryMeta> = {
  agents:    { label: "Agents",       fill: "#9C5E26", stroke: "#C9772E", text: "#F2D9C2" },
  skills:    { label: "Skills",       fill: "#5E6E54", stroke: "#7A8C6E", text: "#DAE2D2" },
  commands:  { label: "Commands",     fill: "#465E6E", stroke: "#5C7A8C", text: "#CFDDE6" },
  plugins:   { label: "Plugins",      fill: "#7A4530", stroke: "#A05A3D", text: "#EBCDB6" },
  hooks:     { label: "Hooks/Config", fill: "#52504C", stroke: "#6B6660", text: "#D6D2CC" },
  templates: { label: "Templates",    fill: "#6B5266", stroke: "#8C6E84", text: "#E2D2DD" },
};

const KARIMO_TREE = "https://github.com/opensesh/KARIMO/tree/main";

export const architectureRoot: ArchNode = {
  id: "karimo",
  name: "KARIMO",
  category: "agents",
  fileCount: 0,
  children: [
    {
      id: "agents",
      name: "agents/",
      category: "agents",
      fileCount: 22,
      description:
        "22 specialist subagents that plan, build, review, and merge — the heart of KARIMO orchestration.",
      githubUrl: `${KARIMO_TREE}/agents`,
      children: [
        { id: "agents/pm", name: "pm.md", category: "agents", fileCount: 1, description: "PM agent — coordinates waves, dispatches tasks, propagates findings between waves.", githubUrl: `${KARIMO_TREE}/agents/pm.md` },
        { id: "agents/investigator", name: "investigator.md", category: "agents", fileCount: 1, description: "Scans the codebase and the web for patterns and prior art before planning begins.", githubUrl: `${KARIMO_TREE}/agents/investigator.md` },
        { id: "agents/interviewer", name: "interviewer.md", category: "agents", fileCount: 1, description: "Runs the 5-round PRD interview that turns a vague feature idea into a structured plan.", githubUrl: `${KARIMO_TREE}/agents/interviewer.md` },
        { id: "agents/brief-writer", name: "brief-writer.md", category: "agents", fileCount: 1, description: "Generates detailed task briefs from the approved PRD before execution dispatch.", githubUrl: `${KARIMO_TREE}/agents/brief-writer.md` },
        { id: "agents/brief-reviewer", name: "brief-reviewer.md", category: "agents", fileCount: 1, description: "Challenges briefs for risks, conflicts, and missing scope — produces recommendations.md.", githubUrl: `${KARIMO_TREE}/agents/brief-reviewer.md` },
        { id: "agents/implementer", name: "implementer.md", category: "agents", fileCount: 1, description: "Writes the code inside an isolated worktree and opens the task PR.", githubUrl: `${KARIMO_TREE}/agents/implementer.md` },
        { id: "agents/tester", name: "tester.md", category: "agents", fileCount: 1, description: "Runs the full test, build, and typecheck loop on each task before marking it complete.", githubUrl: `${KARIMO_TREE}/agents/tester.md` },
        { id: "agents/reviewer", name: "reviewer.md", category: "agents", fileCount: 1, description: "Performs structural review on PRs that don't go through Greptile.", githubUrl: `${KARIMO_TREE}/agents/reviewer.md` },
        { id: "agents/review-architect", name: "review-architect.md", category: "agents", fileCount: 1, description: "Sequences and configures the review loop — provider, threshold, escalation rules.", githubUrl: `${KARIMO_TREE}/agents/review-architect.md` },
        { id: "agents/greptile-remediator", name: "greptile-remediator.md", category: "agents", fileCount: 1, description: "Auto-fixes Greptile findings, escalates from Sonnet to Opus when needed.", githubUrl: `${KARIMO_TREE}/agents/greptile-remediator.md` },
        { id: "agents/pm-reviewer", name: "pm-reviewer.md", category: "agents", fileCount: 1, description: "Validates wave-completion before the next wave dispatches.", githubUrl: `${KARIMO_TREE}/agents/pm-reviewer.md` },
        { id: "agents/dependency-mapper", name: "dependency-mapper.md", category: "agents", fileCount: 1, description: "Builds the dependency graph that decides which tasks can run in parallel.", githubUrl: `${KARIMO_TREE}/agents/dependency-mapper.md` },
        { id: "agents/wave-planner", name: "wave-planner.md", category: "agents", fileCount: 1, description: "Slices the dependency graph into parallelizable waves with gate placement.", githubUrl: `${KARIMO_TREE}/agents/wave-planner.md` },
        { id: "agents/gate-keeper", name: "gate-keeper.md", category: "agents", fileCount: 1, description: "Holds execution at human-in-the-loop checkpoints between waves.", githubUrl: `${KARIMO_TREE}/agents/gate-keeper.md` },
        { id: "agents/merge-captain", name: "merge-captain.md", category: "agents", fileCount: 1, description: "Validates the feature branch and creates the consolidated PR to main.", githubUrl: `${KARIMO_TREE}/agents/merge-captain.md` },
        { id: "agents/worktree-manager", name: "worktree-manager.md", category: "agents", fileCount: 1, description: "Creates, tracks, and cleans up the per-task git worktrees.", githubUrl: `${KARIMO_TREE}/agents/worktree-manager.md` },
        { id: "agents/config-doctor", name: "config-doctor.md", category: "agents", fileCount: 1, description: "Diagnoses .karimo/config.yaml drift and missing tooling.", githubUrl: `${KARIMO_TREE}/agents/config-doctor.md` },
        { id: "agents/research-curator", name: "research-curator.md", category: "agents", fileCount: 1, description: "Curates internal + external research into a single findings.md.", githubUrl: `${KARIMO_TREE}/agents/research-curator.md` },
        { id: "agents/feedback-collector", name: "feedback-collector.md", category: "agents", fileCount: 1, description: "Captures patterns and anti-patterns from completed PRDs for compound learning.", githubUrl: `${KARIMO_TREE}/agents/feedback-collector.md` },
        { id: "agents/learning-applier", name: "learning-applier.md", category: "agents", fileCount: 1, description: "Applies stored learnings to new PRDs as soft constraints.", githubUrl: `${KARIMO_TREE}/agents/learning-applier.md` },
        { id: "agents/dashboard-reporter", name: "dashboard-reporter.md", category: "agents", fileCount: 1, description: "Aggregates task rate, model selection, and gate outcomes for /karimo:dashboard.", githubUrl: `${KARIMO_TREE}/agents/dashboard-reporter.md` },
        { id: "agents/router", name: "router.md", category: "agents", fileCount: 1, description: "Routes work between Sonnet and Opus based on task complexity.", githubUrl: `${KARIMO_TREE}/agents/router.md` },
      ],
    },
    {
      id: "skills",
      name: "skills/",
      category: "skills",
      fileCount: 14,
      description:
        "Auto-activating contextual knowledge packs — agents pick them up based on the work in front of them.",
      githubUrl: `${KARIMO_TREE}/skills`,
      children: [
        { id: "skills/writing-plans", name: "writing-plans/", category: "skills", fileCount: 1, description: "House style for PRDs, task briefs, and recommendation reports.", githubUrl: `${KARIMO_TREE}/skills/writing-plans` },
        { id: "skills/systematic-debugging", name: "systematic-debugging/", category: "skills", fileCount: 1, description: "Hypothesis-first debugging methodology baked into the implementer agent.", githubUrl: `${KARIMO_TREE}/skills/systematic-debugging` },
        { id: "skills/incremental-commits", name: "incremental-commits/", category: "skills", fileCount: 1, description: "Commit-after-each-task discipline for clean audit trails.", githubUrl: `${KARIMO_TREE}/skills/incremental-commits` },
        { id: "skills/verification-before-completion", name: "verification-before-completion/", category: "skills", fileCount: 1, description: "Pre-flight checks the tester runs before declaring a task complete.", githubUrl: `${KARIMO_TREE}/skills/verification-before-completion` },
        { id: "skills/subagent-driven-development", name: "subagent-driven-development/", category: "skills", fileCount: 1, description: "When and how to spawn helper agents instead of working monolithically.", githubUrl: `${KARIMO_TREE}/skills/subagent-driven-development` },
        { id: "skills/frontend-design", name: "frontend-design/", category: "skills", fileCount: 1, description: "Component, layout, and motion patterns for production UI work.", githubUrl: `${KARIMO_TREE}/skills/frontend-design` },
        { id: "skills/design-system-quality", name: "design-system-quality/", category: "skills", fileCount: 1, description: "Token discipline review for any UI changes.", githubUrl: `${KARIMO_TREE}/skills/design-system-quality` },
        { id: "skills/brand-guidelines", name: "brand-guidelines/", category: "skills", fileCount: 1, description: "Voice, tone, and visual rules applied to user-facing artifacts.", githubUrl: `${KARIMO_TREE}/skills/brand-guidelines` },
        { id: "skills/security-guidance", name: "security-guidance/", category: "skills", fileCount: 1, description: "OWASP-aware checks the reviewer applies to code changes.", githubUrl: `${KARIMO_TREE}/skills/security-guidance` },
        { id: "skills/mcp-builder", name: "mcp-builder/", category: "skills", fileCount: 1, description: "Patterns for designing MCP servers and tool wrappers.", githubUrl: `${KARIMO_TREE}/skills/mcp-builder` },
        { id: "skills/skill-creator", name: "skill-creator/", category: "skills", fileCount: 1, description: "Meta-skill — guides authoring new skills correctly.", githubUrl: `${KARIMO_TREE}/skills/skill-creator` },
        { id: "skills/website-intelligence", name: "website-intelligence/", category: "skills", fileCount: 1, description: "Web scraping + analysis patterns for the investigator agent.", githubUrl: `${KARIMO_TREE}/skills/website-intelligence` },
        { id: "skills/create-post-copy", name: "create-post-copy/", category: "skills", fileCount: 1, description: "Channel-optimized content writing skill for marketing artifacts.", githubUrl: `${KARIMO_TREE}/skills/create-post-copy` },
        { id: "skills/bos-code-quality", name: "bos-code-quality/", category: "skills", fileCount: 1, description: "Open Session house code-quality checks layered into review.", githubUrl: `${KARIMO_TREE}/skills/bos-code-quality` },
      ],
    },
    {
      id: "commands",
      name: "commands/",
      category: "commands",
      fileCount: 11,
      description:
        "User-invoked slash commands — the public API of KARIMO. From /karimo:configure to /karimo:merge.",
      githubUrl: `${KARIMO_TREE}/commands/karimo`,
      children: [
        { id: "commands/configure", name: "configure.md", category: "commands", fileCount: 1, description: "Auto-detect runtime, framework, and tooling — write .karimo/config.yaml.", githubUrl: `${KARIMO_TREE}/commands/karimo/configure.md` },
        { id: "commands/research", name: "research.md", category: "commands", fileCount: 1, description: "Internal + external scan that produces research/findings.md.", githubUrl: `${KARIMO_TREE}/commands/karimo/research.md` },
        { id: "commands/plan", name: "plan.md", category: "commands", fileCount: 1, description: "5-round PRD interview → tasks, waves, dependencies.", githubUrl: `${KARIMO_TREE}/commands/karimo/plan.md` },
        { id: "commands/run", name: "run.md", category: "commands", fileCount: 1, description: "Generates briefs, auto-reviews, dispatches the PM agent.", githubUrl: `${KARIMO_TREE}/commands/karimo/run.md` },
        { id: "commands/merge", name: "merge.md", category: "commands", fileCount: 1, description: "Validate feature branch, run full test suite, open consolidated PR to main.", githubUrl: `${KARIMO_TREE}/commands/karimo/merge.md` },
        { id: "commands/dashboard", name: "dashboard.md", category: "commands", fileCount: 1, description: "Live view: task rate, model routing, gate outcomes, review feedback.", githubUrl: `${KARIMO_TREE}/commands/karimo/dashboard.md` },
        { id: "commands/feedback", name: "feedback.md", category: "commands", fileCount: 1, description: "Capture project-wide learnings — patterns and anti-patterns to apply going forward.", githubUrl: `${KARIMO_TREE}/commands/karimo/feedback.md` },
        { id: "commands/doctor", name: "doctor.md", category: "commands", fileCount: 1, description: "Diagnose config drift, missing tools, and broken integrations.", githubUrl: `${KARIMO_TREE}/commands/karimo/doctor.md` },
        { id: "commands/help", name: "help.md", category: "commands", fileCount: 1, description: "Searchable docs for every command and skill.", githubUrl: `${KARIMO_TREE}/commands/karimo/help.md` },
        { id: "commands/update", name: "update.md", category: "commands", fileCount: 1, description: "Pull the latest agents, skills, and templates from upstream.", githubUrl: `${KARIMO_TREE}/commands/karimo/update.md` },
        { id: "commands/greptile-review", name: "greptile-review.md", category: "commands", fileCount: 1, description: "Standalone review loop you can run on any open PR.", githubUrl: `${KARIMO_TREE}/commands/karimo/greptile-review.md` },
      ],
    },
    {
      id: "templates",
      name: "templates/",
      category: "templates",
      fileCount: 18,
      description:
        "18 prompt and document templates — the connective tissue between agents and your project.",
      githubUrl: `${KARIMO_TREE}/templates`,
      children: [
        { id: "templates/prd", name: "prd.md", category: "templates", fileCount: 1, description: "Master PRD template the interviewer fills out.", githubUrl: `${KARIMO_TREE}/templates/prd.md` },
        { id: "templates/task-brief", name: "task-brief.md", category: "templates", fileCount: 1, description: "Per-task implementation brief with acceptance criteria.", githubUrl: `${KARIMO_TREE}/templates/task-brief.md` },
        { id: "templates/recommendations", name: "recommendations.md", category: "templates", fileCount: 1, description: "Brief-review output: critical / warning / observation findings.", githubUrl: `${KARIMO_TREE}/templates/recommendations.md` },
        { id: "templates/findings", name: "findings.md", category: "templates", fileCount: 1, description: "Per-PRD running notes propagated wave-to-wave.", githubUrl: `${KARIMO_TREE}/templates/findings.md` },
        { id: "templates/research", name: "research.md", category: "templates", fileCount: 1, description: "Internal + external research compendium.", githubUrl: `${KARIMO_TREE}/templates/research.md` },
        { id: "templates/execution-plan", name: "execution-plan.yaml", category: "templates", fileCount: 1, description: "Wave order, task dependencies, gate placement.", githubUrl: `${KARIMO_TREE}/templates/execution-plan.yaml` },
        { id: "templates/tasks", name: "tasks.yaml", category: "templates", fileCount: 1, description: "Flat list of tasks with their wave and worktree assignment.", githubUrl: `${KARIMO_TREE}/templates/tasks.yaml` },
        { id: "templates/config", name: "config.yaml", category: "templates", fileCount: 1, description: "Default .karimo/config.yaml shape.", githubUrl: `${KARIMO_TREE}/templates/config.yaml` },
        { id: "templates/learnings", name: "learnings.md", category: "templates", fileCount: 1, description: "Project-wide patterns and anti-patterns store.", githubUrl: `${KARIMO_TREE}/templates/learnings.md` },
        { id: "templates/pr-body", name: "pr-body.md", category: "templates", fileCount: 1, description: "Audit-trail-ready PR description.", githubUrl: `${KARIMO_TREE}/templates/pr-body.md` },
        { id: "templates/commit", name: "commit.md", category: "templates", fileCount: 1, description: "Conventional commit message template.", githubUrl: `${KARIMO_TREE}/templates/commit.md` },
        { id: "templates/interview-rounds", name: "interview-rounds.md", category: "templates", fileCount: 1, description: "Question banks for each of the 5 PRD interview rounds.", githubUrl: `${KARIMO_TREE}/templates/interview-rounds.md` },
        { id: "templates/gate-policy", name: "gate-policy.yaml", category: "templates", fileCount: 1, description: "Pause / conditional / skip rules for gates.", githubUrl: `${KARIMO_TREE}/templates/gate-policy.yaml` },
        { id: "templates/review-policy", name: "review-policy.yaml", category: "templates", fileCount: 1, description: "Provider, threshold, and trigger config for code review.", githubUrl: `${KARIMO_TREE}/templates/review-policy.yaml` },
        { id: "templates/dashboard-card", name: "dashboard-card.md", category: "templates", fileCount: 1, description: "Card layout for /karimo:dashboard panels.", githubUrl: `${KARIMO_TREE}/templates/dashboard-card.md` },
        { id: "templates/agent-spec", name: "agent-spec.md", category: "templates", fileCount: 1, description: "Shape every agent definition follows.", githubUrl: `${KARIMO_TREE}/templates/agent-spec.md` },
        { id: "templates/skill-spec", name: "skill-spec.md", category: "templates", fileCount: 1, description: "Shape every skill follows.", githubUrl: `${KARIMO_TREE}/templates/skill-spec.md` },
        { id: "templates/feedback", name: "feedback.md", category: "templates", fileCount: 1, description: "Structured feedback capture for /karimo:feedback.", githubUrl: `${KARIMO_TREE}/templates/feedback.md` },
      ],
    },
    {
      id: "hooks",
      name: "hooks/",
      category: "hooks",
      fileCount: 9,
      description:
        "Settings, hooks, and lifecycle scripts that keep agents and your local environment in sync.",
      githubUrl: `${KARIMO_TREE}/hooks`,
      children: [
        { id: "hooks/settings", name: "settings.json", category: "hooks", fileCount: 1, description: "Permissions, environment variables, MCP allowlists.", githubUrl: `${KARIMO_TREE}/hooks/settings.json` },
        { id: "hooks/pre-task", name: "pre-task.sh", category: "hooks", fileCount: 1, description: "Runs before each task — fresh worktree, branch, env.", githubUrl: `${KARIMO_TREE}/hooks/pre-task.sh` },
        { id: "hooks/post-task", name: "post-task.sh", category: "hooks", fileCount: 1, description: "Runs after each task — cleanup, status emit, dashboard update.", githubUrl: `${KARIMO_TREE}/hooks/post-task.sh` },
        { id: "hooks/pre-wave", name: "pre-wave.sh", category: "hooks", fileCount: 1, description: "Wave-level setup — propagate findings.md, refresh routing.", githubUrl: `${KARIMO_TREE}/hooks/pre-wave.sh` },
        { id: "hooks/post-wave", name: "post-wave.sh", category: "hooks", fileCount: 1, description: "Wave-level teardown — gate evaluation, audit log emission.", githubUrl: `${KARIMO_TREE}/hooks/post-wave.sh` },
        { id: "hooks/pre-merge", name: "pre-merge.sh", category: "hooks", fileCount: 1, description: "Final-validation hook — full test suite, lint, typecheck.", githubUrl: `${KARIMO_TREE}/hooks/pre-merge.sh` },
        { id: "hooks/post-merge", name: "post-merge.sh", category: "hooks", fileCount: 1, description: "Cleanup hook — drop worktrees, archive PRD, capture learnings.", githubUrl: `${KARIMO_TREE}/hooks/post-merge.sh` },
        { id: "hooks/on-gate", name: "on-gate.sh", category: "hooks", fileCount: 1, description: "Triggered each time a gate is reached — notification, dashboard pin.", githubUrl: `${KARIMO_TREE}/hooks/on-gate.sh` },
        { id: "hooks/on-feedback", name: "on-feedback.sh", category: "hooks", fileCount: 1, description: "Captures /karimo:feedback output into the project-wide learnings store.", githubUrl: `${KARIMO_TREE}/hooks/on-feedback.sh` },
      ],
    },
    {
      id: "plugins",
      name: "plugins/",
      category: "plugins",
      fileCount: 6,
      description:
        "Optional integrations — plug your review provider, observability, or research tooling into KARIMO.",
      githubUrl: `${KARIMO_TREE}/plugins`,
      children: [
        { id: "plugins/greptile", name: "greptile/", category: "plugins", fileCount: 1, description: "Greptile review provider with score thresholds and auto-remediation.", githubUrl: `${KARIMO_TREE}/plugins/greptile` },
        { id: "plugins/claude-review", name: "claude-review/", category: "plugins", fileCount: 1, description: "Claude as the review provider — model routing built in.", githubUrl: `${KARIMO_TREE}/plugins/claude-review` },
        { id: "plugins/firecrawl", name: "firecrawl/", category: "plugins", fileCount: 1, description: "Firecrawl MCP for deeper external research during the planning loop.", githubUrl: `${KARIMO_TREE}/plugins/firecrawl` },
        { id: "plugins/sentry", name: "sentry/", category: "plugins", fileCount: 1, description: "Pulls live error context into briefs and findings.", githubUrl: `${KARIMO_TREE}/plugins/sentry` },
        { id: "plugins/linear", name: "linear/", category: "plugins", fileCount: 1, description: "Two-way sync between PRDs and Linear projects.", githubUrl: `${KARIMO_TREE}/plugins/linear` },
        { id: "plugins/github", name: "github/", category: "plugins", fileCount: 1, description: "PR creation, status checks, and review aggregation via the GitHub MCP.", githubUrl: `${KARIMO_TREE}/plugins/github` },
      ],
    },
  ],
};
