// ─── VS Code Emulator Data ────────────────────────────────
// Static data for the Live Example section's VS Code emulator.
// File tree, content excerpts, chat script, and timeline events
// sourced from the real framer-cms-migration PRD output.

// ─── Types ────────────────────────────────────────────────

export interface FileNode {
  name: string;
  type: "file" | "directory";
  children?: FileNode[];
  contentKey?: string;
}

export interface ChatMessage {
  role: "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
}

export type TimelineEventType =
  | "chat"
  | "tree-reveal"
  | "tab-open"
  | "editor-content";

export interface TimelineEvent {
  time: number;
  type: TimelineEventType;
  payload: string;
}

// ─── VS Code Dark+ Palette ───────────────────────────────

export const VSCODE = {
  bg: "#1e1e1e",
  sidebarBg: "#252526",
  activityBarBg: "#181818",
  titleBarBg: "#323233",
  statusBarBg: "#007acc",
  tabActiveBg: "#1e1e1e",
  tabInactiveBg: "#2d2d2d",
  selectionBg: "#094771",
  hoverBg: "#2a2d2e",
  border: "#3c3c3c",
  borderLight: "#474747",
  text: "#cccccc",
  textDim: "#858585",
  textBright: "#d4d4d4",
  accent: "#007acc",
  green: "#28c840",
  yellow: "#febc2e",
  red: "#ff5f57",
} as const;

// ─── File Extension → Language ────────────────────────────

export const EXT_LANG: Record<string, string> = {
  md: "markdown",
  json: "json",
  yaml: "yaml",
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  sh: "bash",
};

export const EXT_COLOR: Record<string, string> = {
  md: "#519aba",
  json: "#f5d02e",
  yaml: "#cb171e",
  ts: "#3178c6",
  tsx: "#3178c6",
  js: "#f5d02e",
  sh: "#89e051",
};

// ─── File Tree ────────────────────────────────────────────

export const FILE_TREE: FileNode = {
  name: ".karimo/prds/002_framer-cms-migration",
  type: "directory",
  children: [
    {
      name: "PRD_framer-cms-migration.md",
      type: "file",
      contentKey: "prd",
    },
    { name: "status.json", type: "file", contentKey: "status" },
    { name: "tasks.yaml", type: "file", contentKey: "tasks" },
    {
      name: "execution_plan.yaml",
      type: "file",
      contentKey: "execution",
    },
    { name: "findings.md", type: "file", contentKey: "findings" },
    {
      name: "recommendations.md",
      type: "file",
      contentKey: "recommendations",
    },
    { name: "metrics.json", type: "file", contentKey: "metrics" },
    {
      name: "briefs",
      type: "directory",
      children: [
        {
          name: "briefs.overview.md",
          type: "file",
          contentKey: "briefs-overview",
        },
        {
          name: "T001_image-download-script.md",
          type: "file",
          contentKey: "brief-t001",
        },
        {
          name: "T002_typescript-schemas.md",
          type: "file",
          contentKey: "brief-t002",
        },
        {
          name: "T005_framer-cms-migration.md",
          type: "file",
          contentKey: "brief-t005",
        },
        {
          name: "T006_framer-cms-migration.md",
          type: "file",
          contentKey: "brief-t006",
        },
        {
          name: "T010_project-detail-page.md",
          type: "file",
          contentKey: "brief-t010",
        },
        {
          name: "T011_blog-mdx-renderer.md",
          type: "file",
          contentKey: "brief-t011",
        },
        {
          name: "T016_seo-metadata.md",
          type: "file",
          contentKey: "brief-t016",
        },
        {
          name: "T020_about-images.md",
          type: "file",
          contentKey: "brief-t020",
        },
      ],
    },
    {
      name: "research",
      type: "directory",
      children: [
        { name: "summary.md", type: "file", contentKey: "research-summary" },
        {
          name: "findings.md",
          type: "file",
          contentKey: "research-findings",
        },
        { name: "meta.json", type: "file", contentKey: "research-meta" },
        {
          name: "internal",
          type: "directory",
          children: [
            {
              name: "structure.md",
              type: "file",
              contentKey: "internal-structure",
            },
            {
              name: "dependencies.md",
              type: "file",
              contentKey: "internal-deps",
            },
            {
              name: "patterns.md",
              type: "file",
              contentKey: "internal-patterns",
            },
            { name: "errors.md", type: "file", contentKey: "internal-errors" },
          ],
        },
        {
          name: "external",
          type: "directory",
          children: [
            {
              name: "best-practices.md",
              type: "file",
              contentKey: "external-practices",
            },
            {
              name: "libraries.md",
              type: "file",
              contentKey: "external-libs",
            },
            {
              name: "references.md",
              type: "file",
              contentKey: "external-refs",
            },
            {
              name: "sources.yaml",
              type: "file",
              contentKey: "external-sources",
            },
          ],
        },
      ],
    },
  ],
};

// ─── File Contents (excerpts) ─────────────────────────────

export const FILE_CONTENTS: Record<
  string,
  { content: string; language: string }
> = {
  prd: {
    language: "markdown",
    content: `# PRD: Framer CMS Migration
## Created: 2026-04-07
## Status: approved
## Slug: framer-cms-migration

---

## Executive Summary

Migrate all content from opensession.co (hosted on Framer)
into the existing Next.js 16+ codebase at OS-Portfolio.
The migration is content-first: get all data, images, and
structured content into the codebase with correct TypeScript
schemas before any visual polish.

**Scope:** 5 projects, 4 blog posts, 5 free resources,
  2 legal pages, ~75 images.
**Approach:** Static download of assets, file-based CMS
  (MDX + TypeScript data files), no external CMS dependency.
**Timeline:** Phased waves. Get it right over ship fast.

---

## Goals

- Download all ~75 images from framerusercontent.com
- Define enriched TypeScript schemas for all content types
- Populate all project data with structured sections
- Convert 4 blog posts from Framer HTML to MDX
- Migrate 5 free resources into the portfolio codebase
- Implement a template-stripping script
- Add SEO metadata generation from all content types`,
  },

  status: {
    language: "json",
    content: `{
  "status": "complete",
  "created": "2026-04-07",
  "last_updated": "2026-04-07",
  "research_complete": true,
  "prd_complete": true,
  "tasks_defined": 20,
  "phases": 4,
  "current_phase": 4,
  "completed_tasks": 20,
  "execution_mode": "feature-branch",
  "feature_branch": "feat/framer-cms-migration",
  "tasks": {
    "T001": "done", "T002": "done",
    "T003": "done", "T004": "done",
    "T005": "done", "T006": "done",
    "T007": "done", "T008": "done",
    "T009": "done", "T010": "done",
    "T011": "done", "T012": "done",
    "T013": "done", "T014": "done",
    "T015": "done", "T016": "done",
    "T017": "done", "T018": "done",
    "T019": "done", "T020": "done"
  }
}`,
  },

  tasks: {
    language: "yaml",
    content: `version: "1.0"
project: framer-cms-migration
created: "2026-04-07"

tasks:
  # ─── WAVE 1: Foundation ───────────────────
  - id: T001
    title: Write image download script
    type: chore
    complexity: 4
    priority: must
    depends_on: []
    acceptance_criteria:
      - Script downloads all ~75 images
      - Already-downloaded files are skipped
      - Failures logged without stopping

  - id: T002
    title: Define enriched TypeScript schemas
    type: refactor
    complexity: 5
    priority: must
    depends_on: []

  - id: T003
    title: Set up content directory structure
    type: chore
    complexity: 2
    priority: must

  - id: T004
    title: Update next.config for images
    type: chore
    complexity: 2
    priority: must

  # ─── WAVE 2: Content Migration ────────────
  - id: T005
    title: Populate all project data
    type: feature
    complexity: 8
    priority: must
    depends_on: [T001, T002, T003]

  - id: T006
    title: Convert blog posts to MDX
    type: feature
    complexity: 6
    depends_on: [T002, T003]`,
  },

  execution: {
    language: "yaml",
    content: `version: "1.0"
project: framer-cms-migration
total_tasks: 20
total_waves: 4
principle: "Get it right over ship fast."

git:
  base_branch: main
  feature_branch: feat/framer-cms-migration
  workflow: "feature branch → worktrees → PR per wave"

waves:
  - wave: 1
    name: Foundation
    description: >
      All tasks have no inter-task dependencies.
      Establishes asset pipeline, type system, content
      directory structure, and image configuration.
    tasks: [T001, T002, T003, T004]

  - wave: 2
    name: Content Migration
    description: >
      Populates data files, converts HTML to MDX,
      migrates free resources and legal pages.
    tasks: [T005, T006, T007, T008, T013]

  - wave: 3
    name: Component Updates
    tasks: [T009, T010, T011, T012, T014, T019, T020]

  - wave: 4
    name: Integration & Polish
    tasks: [T015, T016, T017, T018]`,
  },

  findings: {
    language: "markdown",
    content: `# Cross-Task Execution Findings
# PRD: framer-cms-migration (002)

---

## Wave 1: Foundation (T001-T004)

### Discovery: Framer CDN URL stability
- **Task:** T001 (image download script)
- **Finding:** All ~75 framerusercontent.com URLs valid.
  CDN uses content-addressed hashing, URLs are stable.
- **Impact:** No fallback image handling needed.

### Discovery: next-mdx-remote compatibility
- **Task:** T002 (TypeScript schemas)
- **Finding:** next-mdx-remote@6.0.0 installed cleanly
  with Next.js 16.2.1 and React 19. No peer conflicts.

---

## Wave 2: Content Migration (T005-T008, T013)

### Discovery: HTML-to-MDX conversion quality
- **Finding:** Framer HTML includes nested div wrappers
  and inline styles. Manual cleanup was required for
  all 4 blog posts.

### Discovery: Project slug mismatch
- **Finding:** Codebase used gemini-infinite-nature,
  Framer used google-gemini-infinite-nature.
  Permanent redirect added in next.config.ts.`,
  },

  recommendations: {
    language: "markdown",
    content: `# Brief Review: framer-cms-migration

**Reviewed:** 2026-04-07
**Briefs reviewed:** T001-T020 (20 tasks)

---

## Critical Issues (must fix before execution)

### C1 — Build Break: post.content removed but
  blog detail page reads it at runtime

T006 instructs removing content: string from blog
records and replacing with contentPath. However,
blog-post.tsx directly renders post.content — this
will throw at runtime.

**Fix:** Add temporary content: "" stub alongside
contentPath in blog.ts records.

### C2 — Schema Conflict: badge field type
  inconsistent across three tasks

T002 defines badge as string union.
T007 defines badge as object.
T012 renders badge as string comparison.

**Fix:** Align on T002's simple string union.`,
  },

  metrics: {
    language: "json",
    content: `{
  "version": "1.0",
  "prd_slug": "framer-cms-migration",
  "execution_date": "2026-04-07",
  "total_duration_minutes": 180,
  "waves": {
    "wave_1": {
      "name": "Foundation",
      "tasks": ["T001", "T002", "T003", "T004"],
      "duration_minutes": 35,
      "status": "complete"
    },
    "wave_2": {
      "name": "Content Migration",
      "tasks": ["T005", "T006", "T007", "T008", "T013"],
      "duration_minutes": 55,
      "status": "complete"
    },
    "wave_3": {
      "name": "Component Updates",
      "tasks": ["T009", "T010", "T011", "T012", "T014", "T019", "T020"],
      "duration_minutes": 60,
      "status": "complete"
    },
    "wave_4": {
      "name": "Integration & Polish",
      "tasks": ["T015", "T016", "T017", "T018"],
      "duration_minutes": 30,
      "status": "complete"
    }
  },
  "summary": {
    "total_tasks": 20,
    "completed": 20,
    "failed": 0,
    "escalated": 0,
    "total_loops": 22,
    "avg_loops_per_task": 1.1,
    "total_complexity_points": 89
  }
}`,
  },

  "briefs-overview": {
    language: "markdown",
    content: `# Briefs Overview — framer-cms-migration

| ID   | Title                          | Wave | Cx | Priority |
|------|--------------------------------|------|----|----------|
| T001 | Write image download script    | 1    | 4  | must     |
| T002 | Define TypeScript schemas      | 1    | 5  | must     |
| T003 | Set up content directories     | 1    | 2  | must     |
| T004 | Update next.config             | 1    | 2  | must     |
| T005 | Populate all project data      | 2    | 8  | must     |
| T006 | Convert blog posts to MDX      | 2    | 6  | must     |
| T007 | Migrate free resources         | 2    | 4  | must     |
| T008 | Migrate legal pages            | 2    | 3  | must     |
| T009 | Implement category system      | 3    | 4  | must     |
| T010 | Build project detail page      | 3    | 7  | must     |
| T011 | Build blog MDX renderer        | 3    | 6  | must     |
| T012 | Build free resource components | 3    | 4  | must     |
| T013 | Scaffold playbook data         | 2    | 3  | must     |
| T014 | Update project listing filter  | 3    | 4  | must     |
| T015 | Build lab page                 | 4    | 5  | must     |
| T016 | Add SEO metadata generation    | 4    | 4  | must     |
| T017 | Write content validation       | 4    | 4  | should   |
| T018 | Write template stripping       | 4    | 3  | should   |
| T019 | Wire up homepage images        | 3    | 3  | must     |
| T020 | Wire up about page images      | 3    | 4  | must     |

**Total:** 20 tasks, 89 complexity points, 4 waves`,
  },

  "brief-t001": {
    language: "markdown",
    content: `# Task Brief: T001

**Title:** Write image download script
**Priority:** must | **Complexity:** 4/10
**Wave:** 1 | **Model:** sonnet

---

## Objective

Write a Node.js script at scripts/download-framer-images.js
that downloads all ~75 images from framerusercontent.com
into /public/images/ with correct subdirectory layout.
Script must be idempotent, resilient to failures,
and log progress clearly.

## Success Criteria
- [ ] Script exists at scripts/download-framer-images.js
- [ ] Downloads all ~75 images to correct subdirectories
- [ ] Already-downloaded files are skipped (idempotent)
- [ ] Failures logged without stopping remaining downloads
- [ ] All project hero SVGs in /public/images/projects/
- [ ] Blog thumbnails in /public/images/blog/`,
  },

  "brief-t002": {
    language: "markdown",
    content: `# Task Brief: T002

**Title:** Define enriched TypeScript schemas
**Priority:** must | **Complexity:** 5/10
**Wave:** 1 | **Model:** sonnet

---

## Objective

Update /src/types/ to reflect the enriched data model:
1. Enrich Project type with sections, images,
   testimonials, results, services, duration
2. Update BlogPost type: replace content with contentPath
3. Add new Playbook type (mirrors BlogPost)
4. Add new FreeResource type with badge, media, href

Also install next-mdx-remote and verify no conflicts
with Next.js 16+.`,
  },

  "brief-t005": {
    language: "markdown",
    content: `# Task Brief: T005

**Title:** Populate all project data
**Priority:** must | **Complexity:** 8/10
**Wave:** 2 | **Model:** sonnet

---

## Objective

Populate src/data/projects.ts with complete structured
content for all 5 projects using the enriched schema
from T002. Each project gets full Challenge / Solution /
Impact sections, gallery images, testimonials, and
results metrics.

## Projects to Populate
1. Panasonic Product Page
2. Google Gemini Infinite Nature
3. Fitbit Sense Design System
4. Delos Design System
5. Past Design Clients`,
  },

  "brief-t006": {
    language: "markdown",
    content: `# Task Brief: T006

**Title:** Convert blog posts to MDX
**Priority:** must | **Complexity:** 6/10
**Wave:** 2 | **Model:** sonnet

---

## Objective

Convert 4 blog posts from Framer HTML (scraped via CSV)
into clean MDX files at src/content/blog/{slug}.mdx.
Strip Framer wrapper divs, convert inline styles to
markdown, preserve semantic structure.

## Blog Posts
1. brand-strategy-meets-design-systems
2. beyond-the-brief
3. digital-design-2024
4. creative-philosophy`,
  },

  "brief-t010": {
    language: "markdown",
    content: `# Task Brief: T010

**Title:** Build project detail page
**Priority:** must | **Complexity:** 7/10
**Wave:** 3 | **Model:** sonnet

---

## Objective

Update the project detail page to render the enriched
schema from T005. Create sub-components:
- ProjectSection (challenge/solution/impact)
- ProjectGallery (image grid with lightbox)
- ProjectTestimonial (quote + author)
- ProjectResults (metrics grid)

Verify all 5 project pages render correctly with
hero images, sections, gallery, and CTAs.`,
  },

  "brief-t011": {
    language: "markdown",
    content: `# Task Brief: T011

**Title:** Build blog MDX renderer
**Priority:** must | **Complexity:** 6/10
**Wave:** 3 | **Model:** sonnet

---

## Objective

Set up the MDX rendering pipeline for blog posts.
Use next-mdx-remote/rsc compileMDX for server-side
compilation. Create the blog post layout component
and wire up static generation via generateStaticParams.`,
  },

  "brief-t016": {
    language: "markdown",
    content: `# Task Brief: T016

**Title:** Add SEO metadata generation
**Priority:** must | **Complexity:** 4/10
**Wave:** 4 | **Model:** sonnet

---

## Objective

Add generateMetadata to all route pages sourcing
from local data arrays. Cover all dynamic routes:
- /projects/[slug]
- /blog/[slug]
- /playbooks/[slug]

Include OpenGraph images, descriptions, and canonical
URLs for every content page.`,
  },

  "brief-t020": {
    language: "markdown",
    content: `# Task Brief: T020

**Title:** Wire up about page images
**Priority:** must | **Complexity:** 4/10
**Wave:** 3 | **Model:** sonnet

---

## Objective

Replace all placeholder/Framer CDN image references
on the about page with locally downloaded images from
/public/images/about/. Update hero, team photos, and
story section images with correct next/image props.`,
  },

  "research-summary": {
    language: "markdown",
    content: `# Research Summary — Framer CMS Migration
# Status: Post-execution (all 20 tasks complete)

---

## Migration Accomplishments

1. All content migrated to TypeScript data arrays
   16 src/data/*.ts files, fully typed, no API calls

2. All project images downloaded locally
   5 projects x 8 images + blog, about, homepage (~85 files)

3. MDX pipeline established
   next-mdx-remote/rsc + compileMDX, 4 live posts

4. Static params for all dynamic routes
   generateStaticParams from local data arrays

5. Animation system centralized
   src/lib/motion.ts: 20+ variant sets, 47 components

## Architecture Post-Migration

  Framer CMS (before)      →  Next.js 16 App Router (now)
  Hosted CMS content       →  src/data/*.ts (typed arrays)
  framerusercontent CDN    →  public/images/** (local)
  Framer page routing      →  src/app/**/page.tsx
  Framer rich text         →  src/content/**/*.mdx
  No version control       →  Git-tracked TypeScript`,
  },

  "research-findings": {
    language: "markdown",
    content: `# Research Findings — Pre-Execution
# Date: 2026-04-07

## Content Inventory

| Type           | Count | Source             |
|----------------|-------|--------------------|
| Projects       | 5     | Framer CMS         |
| Blog Posts     | 4     | Framer CMS + CSV   |
| Free Resources | 5     | OS_our-links repo  |
| Legal Pages    | 2     | Framer HTML + CSV  |
| Images         | ~75   | framerusercontent   |

## Key Gaps Identified

1. Project schema too flat — needs sections, gallery,
   testimonials, results
2. Blog uses embedded string, needs MDX pipeline
3. No image download script exists
4. Category system is single-enum, needs multi-tag
5. No /lab aggregation page exists`,
  },

  "research-meta": {
    language: "json",
    content: `{
  "project": "framer-cms-migration",
  "research_date": "2026-04-07",
  "internal_files_scanned": 847,
  "external_sources_consulted": 12,
  "findings_count": 8,
  "recommendations_count": 10,
  "image_urls_cataloged": 75,
  "content_types_analyzed": 4,
  "status": "complete"
}`,
  },

  "internal-structure": {
    language: "markdown",
    content: `# Internal Codebase Structure
# OS-Portfolio — scanned 2026-04-07

src/
├── app/           # Next.js 16 App Router pages
│   ├── page.tsx   # Homepage
│   ├── about/     # About page
│   ├── blog/      # Blog listing + [slug]
│   ├── contact/   # Contact form
│   ├── projects/  # Projects listing + [slug]
│   └── legal/     # Terms, Privacy
├── components/    # 47 React components
│   ├── ui/        # Shared primitives
│   ├── blog/      # Blog-specific
│   └── projects/  # Project-specific
├── data/          # TypeScript data arrays
├── types/         # Type definitions
├── lib/           # Utilities, motion variants
└── content/       # MDX files (empty pre-migration)`,
  },

  "internal-deps": {
    language: "markdown",
    content: `# Dependencies Analysis

## Core Stack
- Next.js 16.2.1 (App Router, Turbopack default)
- React 19.2.4
- TypeScript 5.x (strict mode)
- Tailwind CSS 4.x
- Framer Motion 12.38

## Key Libraries
- three.js 0.183.2 (3D hero)
- gsap 3.14.2 (scroll animations)
- next-mdx-remote 6.0.0 (to be installed)

## Dev Dependencies
- ESLint 9, eslint-config-next
- @tailwindcss/postcss 4.x`,
  },

  "internal-patterns": {
    language: "markdown",
    content: `# Codebase Patterns

## 1. Data Pattern
All content in src/data/*.ts as typed arrays
Exported as: export const projects: Project[] = [...]

## 2. Motion Pattern
Variants from src/lib/motion.ts
All components use whileInView + viewport: { once: true }

## 3. DevProps Pattern
Every component accepts optional devProps()
Debug attributes added in development only

## 4. Image Pattern
next/image with fill prop for responsive images
Sizes prop always specified for optimization`,
  },

  "internal-errors": {
    language: "markdown",
    content: `# Errors & Gaps Identified

1. Project schema too flat for rich content
2. Blog content embedded as string, not MDX
3. No local images — all on Framer CDN
4. Category is single enum, needs multi-tag
5. No /lab aggregation page
6. No SEO metadata on dynamic routes
7. No template-stripping capability`,
  },

  "external-practices": {
    language: "markdown",
    content: `# Next.js 16 Best Practices

## Static Site Generation
- generateStaticParams as core SSG primitive
- dynamicParams = false for fixed content sets
- 87% faster next dev with Turbopack
- 25-60% faster RSC rendering

## MDX with Next.js
- next-mdx-remote/rsc for server components
- compileMDX for build-time compilation
- No frontmatter — metadata in data files
- Turbopack compatible`,
  },

  "external-libs": {
    language: "markdown",
    content: `# Library Evaluations

## MDX Processing
- next-mdx-remote/rsc — CHOSEN
  Server component compatible, compileMDX API
- @next/mdx — Alternative
  Tighter integration but less flexible

## Image Optimization
- next/image built-in — CHOSEN
  Automatic optimization, lazy loading
- sharp — Used internally by Next.js

## Animation
- framer-motion 12 — Already in project
  20+ variant sets centralized in motion.ts`,
  },

  "external-refs": {
    language: "markdown",
    content: `# External References

1. Next.js 16 Migration Guide
2. next-mdx-remote Documentation
3. React 19 Server Components RFC
4. Tailwind CSS v4 Migration Guide
5. Framer CMS API Documentation
6. Web.dev Image Optimization Guide
7. Google SEO Starter Guide
8. MDX Specification v3`,
  },

  "external-sources": {
    language: "yaml",
    content: `sources:
  - name: Next.js Documentation
    url: nextjs.org/docs
    relevance: high
    used_for: [SSG, App Router, Image]

  - name: next-mdx-remote
    url: github.com/hashicorp/next-mdx-remote
    relevance: high
    used_for: [MDX pipeline, compileMDX]

  - name: Framer Developer Docs
    url: framer.com/developers
    relevance: medium
    used_for: [CMS structure, CDN URLs]`,
  },
};

// ─── Chat Script ──────────────────────────────────────────

export const CHAT_SCRIPT: ChatMessage[] = [
  {
    role: "system",
    content: "KARIMO initialized \u00b7 PRD: framer-cms-migration",
    timestamp: 0,
  },
  {
    role: "assistant",
    content:
      "Starting research phase. Scanning codebase for structure, patterns, and conventions...",
    timestamp: 2000,
  },
  {
    role: "tool",
    content: "Scanned 847 files \u00b7 Next.js 16+ \u00b7 React 19 \u00b7 TypeScript",
    timestamp: 4500,
  },
  {
    role: "assistant",
    content:
      "Research complete. Found 75 image URLs to download, 4 content types to migrate, and 7 schema gaps to address.",
    timestamp: 7000,
  },
  {
    role: "assistant",
    content:
      "Planning phase: Breaking migration into 20 tasks across 4 waves. Total complexity: 89 points.",
    timestamp: 10000,
  },
  {
    role: "tool",
    content:
      "Generated: tasks.yaml (20 tasks) \u00b7 execution_plan.yaml \u00b7 8 task briefs",
    timestamp: 12500,
  },
  {
    role: "assistant",
    content:
      "Wave 1 \u2014 Foundation: Image download script, TypeScript schemas, content directories, next.config updates.",
    timestamp: 15000,
  },
  {
    role: "assistant",
    content:
      "Executing Wave 1: 4 parallel worktrees spawned. T001 downloading 75 images...",
    timestamp: 18000,
  },
  {
    role: "tool",
    content:
      "Wave 1 complete \u00b7 4/4 tasks done \u00b7 35 min \u00b7 All images downloaded",
    timestamp: 21000,
  },
  {
    role: "assistant",
    content:
      "Propagating findings to Wave 2. Starting content migration: project data, blog MDX, free resources.",
    timestamp: 23500,
  },
  {
    role: "tool",
    content:
      "Wave 2 complete \u00b7 5/5 tasks \u00b7 Wave 3 complete \u00b7 7/7 tasks",
    timestamp: 27000,
  },
  {
    role: "assistant",
    content:
      "Wave 4 \u2014 Integration & Polish: Lab page, SEO metadata, validation script, template stripping.",
    timestamp: 29500,
  },
  {
    role: "tool",
    content:
      "Wave 4 complete \u00b7 4/4 tasks \u00b7 All 20 tasks done \u00b7 0 failures",
    timestamp: 33000,
  },
  {
    role: "assistant",
    content:
      "PRD execution complete. 20/20 tasks, 89 complexity points, 180 minutes total. Feature branch ready for merge.",
    timestamp: 36000,
  },
];

// ─── Timeline Events ──────────────────────────────────────

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // Init
  { time: 0, type: "chat", payload: "0" },
  { time: 500, type: "tree-reveal", payload: "root" },

  // Research phase
  { time: 2000, type: "chat", payload: "1" },
  { time: 3000, type: "tree-reveal", payload: "research" },
  { time: 3500, type: "tree-reveal", payload: "research/internal" },
  { time: 4000, type: "tree-reveal", payload: "research/external" },
  { time: 4500, type: "chat", payload: "2" },
  { time: 5000, type: "tab-open", payload: "research-findings" },
  { time: 5000, type: "editor-content", payload: "research-findings" },

  // Research complete
  { time: 7000, type: "chat", payload: "3" },
  { time: 7500, type: "tab-open", payload: "research-summary" },
  { time: 7500, type: "editor-content", payload: "research-summary" },

  // Planning
  { time: 10000, type: "chat", payload: "4" },
  { time: 10500, type: "tab-open", payload: "prd" },
  { time: 10500, type: "editor-content", payload: "prd" },
  { time: 11500, type: "tree-reveal", payload: "tasks.yaml" },
  { time: 12000, type: "tree-reveal", payload: "execution_plan.yaml" },
  { time: 12500, type: "chat", payload: "5" },

  // Task briefs
  { time: 13500, type: "tree-reveal", payload: "briefs" },
  { time: 14000, type: "tab-open", payload: "tasks" },
  { time: 14000, type: "editor-content", payload: "tasks" },
  { time: 15000, type: "chat", payload: "6" },

  // Wave 1 execution
  { time: 16500, type: "tab-open", payload: "execution" },
  { time: 16500, type: "editor-content", payload: "execution" },
  { time: 18000, type: "chat", payload: "7" },
  { time: 19000, type: "tab-open", payload: "brief-t001" },
  { time: 19000, type: "editor-content", payload: "brief-t001" },
  { time: 21000, type: "chat", payload: "8" },

  // Wave 2-3
  { time: 22000, type: "tab-open", payload: "brief-t005" },
  { time: 22000, type: "editor-content", payload: "brief-t005" },
  { time: 23500, type: "chat", payload: "9" },
  { time: 24500, type: "tab-open", payload: "brief-t010" },
  { time: 24500, type: "editor-content", payload: "brief-t010" },
  { time: 27000, type: "chat", payload: "10" },

  // Wave 4
  { time: 28000, type: "tab-open", payload: "findings" },
  { time: 28000, type: "editor-content", payload: "findings" },
  { time: 29500, type: "chat", payload: "11" },

  // Completion
  { time: 31000, type: "tab-open", payload: "metrics" },
  { time: 31000, type: "editor-content", payload: "metrics" },
  { time: 33000, type: "chat", payload: "12" },
  { time: 34000, type: "tab-open", payload: "status" },
  { time: 34000, type: "editor-content", payload: "status" },
  { time: 36000, type: "chat", payload: "13" },
];

export const TIMELINE_DURATION = 40000;

// ─── Helpers ──────────────────────────────────────────────

export function getFileExtension(filename: string): string {
  return filename.split(".").pop() ?? "";
}

export function getLanguage(filename: string): string {
  return EXT_LANG[getFileExtension(filename)] ?? "text";
}

export function getExtColor(filename: string): string {
  return EXT_COLOR[getFileExtension(filename)] ?? VSCODE.textDim;
}
