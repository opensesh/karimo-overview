# KARIMO Overview

Interactive visual explainer for [KARIMO](https://github.com/opensesh/KARIMO) — the autonomous development framework for Claude Code.

**Live site:** [karimo-overview.vercel.app](https://karimo-overview.vercel.app)

---

## What is KARIMO?

KARIMO is a **framework and Claude Code plugin** for PRD-driven autonomous development. Think of it as **plan mode on steroids** — leveraging Anthropic's latest innovations, including [native worktree isolation](https://code.claude.com/docs/en/common-workflows), [sub-agents](https://code.claude.com/docs/en/sub-agents), [agent teams](https://code.claude.com/docs/en/agent-teams), [skills](https://code.claude.com/docs/en/skills), [hooks](https://code.claude.com/docs/en/hooks), and [model routing](https://code.claude.com/docs/en/model-config).

> **Philosophy:** You are the architect, agents are the builders

## How It Works

```
┌──────────┐   ┌──────┐   ┌───────┐   ┌────────┐   ┌─────────────┐   ┌─────────┐
│ RESEARCH │──▸│ PLAN │──▸│ TASKS │──▸│ REVIEW │──▸│ ORCHESTRATE │──▸│ INSPECT │
└──────────┘   └──────┘   └───────┘   └────────┘   └─────────────┘   └─────────┘
      │            │           │              │                 │              │
      └────────────┘           └──────────────┘                 └──────────────┘
          Loop 1                    Loop 2                           Loop 3
          Human                     Claude                        Configurable
```

| Step | What Happens |
|------|--------------|
| **Research** | Discover patterns, libraries, gaps — creates PRD folder |
| **Plan** | Structured interview captures requirements |
| **Tasks** | Generate task briefs from research + PRD |
| **Review** | Claude validates briefs against codebase |
| **Orchestrate** | Execute in waves with agent teams |
| **Inspect** | Review each PR (manual, Code Review, or Greptile) |
| **Merge** | Final PR to main |

---

> **This is the explainer site repo.** For full documentation, installation, agent architecture, and configuration, see the main repository:
>
> **[opensesh/KARIMO](https://github.com/opensesh/KARIMO)**

---

## About This Site

This site walks through KARIMO's pipeline visually — from research through merge — with interactive animations, a live VS Code simulation, and a deep dive into context architecture. Built to help teams understand what KARIMO does before diving into the framework itself.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Animation:** Framer Motion, Three.js (React Three Fiber)
- **Language:** TypeScript
- **Deployment:** Vercel

## License

MIT

---

*Built with Claude Code by [Open Session](https://opensesh.com)*
