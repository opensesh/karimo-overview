// --- VS Code Emulator Data --------------------------------
// Static data for the Live Example section's VS Code emulator.
// File tree, content excerpts, chat script, and timeline events
// sourced from the real framer-cms-migration PRD output.

// --- Types ------------------------------------------------

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

// --- VS Code Dark+ Palette -------------------------------

export const VSCODE = {
  bg: "#1e1e1e",
  sidebarBg: "#252526",
  activityBarBg: "#181818",
  titleBarBg: "#323233",
  statusBarBg: "#fe5102",
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

// --- File Extension -> Language ----------------------------

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


// --- File Tree --------------------------------------------

export const FILE_TREE: FileNode = {
  name: "OS-Portfolio",
  type: "directory",
  children: [
    {
      name: ".claude",
      type: "directory",
      children: [
        {
          name: "plugins",
          type: "directory",
          children: [
            {
              name: "karimo",
              type: "directory",
              children: [
                { name: "README.md", type: "file" },
                { name: "KARIMO_RULES.md", type: "file" },
                {
                  name: ".claude-plugin",
                  type: "directory",
                  children: [{ name: "plugin.json", type: "file" }],
                },
                {
                  name: "agents",
                  type: "directory",
                  children: [
                    { name: "brief-writer.md", type: "file" },
                    { name: "brief-reviewer.md", type: "file" },
                    { name: "brief-corrector.md", type: "file" },
                    { name: "implementer.md", type: "file" },
                    { name: "implementer-opus.md", type: "file" },
                    { name: "interviewer.md", type: "file" },
                    { name: "investigator.md", type: "file" },
                    { name: "pm.md", type: "file" },
                    { name: "pm-reviewer.md", type: "file" },
                    { name: "pm-finalizer.md", type: "file" },
                    { name: "review-architect.md", type: "file" },
                    { name: "tester.md", type: "file" },
                    { name: "tester-opus.md", type: "file" },
                    { name: "documenter.md", type: "file" },
                    { name: "greptile-remediator.md", type: "file" },
                    { name: "coverage-reviewer.md", type: "file" },
                  ],
                },
                {
                  name: "commands",
                  type: "directory",
                  children: [
                    { name: "plan.md", type: "file" },
                    { name: "run.md", type: "file" },
                    { name: "merge.md", type: "file" },
                    { name: "feedback.md", type: "file" },
                    { name: "research.md", type: "file" },
                    { name: "configure.md", type: "file" },
                    { name: "dashboard.md", type: "file" },
                    { name: "doctor.md", type: "file" },
                    { name: "help.md", type: "file" },
                    { name: "update.md", type: "file" },
                  ],
                },
                {
                  name: "skills",
                  type: "directory",
                  children: [
                    { name: "bash-utilities.md", type: "file" },
                    { name: "code-standards.md", type: "file" },
                    { name: "doc-standards.md", type: "file" },
                    { name: "external-research.md", type: "file" },
                    { name: "research-methods.md", type: "file" },
                    { name: "testing-standards.md", type: "file" },
                  ],
                },
              ],
            },
          ],
        },
        { name: "settings.json", type: "file" },
        { name: "worktrees", type: "directory", children: [] },
      ],
    },
    {
      name: ".karimo",
      type: "directory",
      children: [
        { name: "docs", type: "directory", children: [] },
        { name: "learnings", type: "directory", children: [] },
        { name: "migrations", type: "directory", children: [] },
        { name: "plugins", type: "directory", children: [] },
        {
          name: "prds",
          type: "directory",
          children: [
            {
              name: "001_framer-cms-migration",
              type: "directory",
              children: [
                { name: "PRD_framer-cms-migration.md", type: "file", contentKey: "prd" },
                { name: "tasks.yaml", type: "file", contentKey: "tasks" },
                { name: "execution_plan.yaml", type: "file", contentKey: "execution" },
                { name: "status.json", type: "file", contentKey: "status" },
                { name: "recommendations.md", type: "file", contentKey: "recommendations" },
                { name: "findings.md", type: "file", contentKey: "findings" },
                { name: "metrics.json", type: "file", contentKey: "metrics" },
                { name: "assets.json", type: "file", contentKey: "assets-json" },
                { name: "assets", type: "directory", children: [{ name: ".gitkeep", type: "file" }] },
                {
                  name: "research",
                  type: "directory",
                  children: [
                    { name: "summary.md", type: "file", contentKey: "research-summary" },
                    { name: "findings.md", type: "file", contentKey: "research-findings" },
                    { name: "meta.json", type: "file", contentKey: "research-meta" },
                    {
                      name: "internal",
                      type: "directory",
                      children: [
                        { name: "structure.md", type: "file", contentKey: "internal-structure" },
                        { name: "dependencies.md", type: "file", contentKey: "internal-deps" },
                        { name: "patterns.md", type: "file", contentKey: "internal-patterns" },
                        { name: "errors.md", type: "file", contentKey: "internal-errors" },
                        { name: "findings.md", type: "file", contentKey: "internal-findings" },
                      ],
                    },
                    {
                      name: "external",
                      type: "directory",
                      children: [
                        { name: "best-practices.md", type: "file", contentKey: "external-practices" },
                        { name: "libraries.md", type: "file", contentKey: "external-libs" },
                        { name: "references.md", type: "file", contentKey: "external-refs" },
                        { name: "sources.yaml", type: "file", contentKey: "external-sources" },
                        { name: "findings.md", type: "file", contentKey: "external-findings" },
                      ],
                    },
                  ],
                },
                {
                  name: "briefs",
                  type: "directory",
                  children: [
                    { name: "briefs.overview.md", type: "file", contentKey: "briefs-overview" },
                    { name: "T001_image-download-script.md", type: "file", contentKey: "brief-t001" },
                    { name: "T002_typescript-schemas.md", type: "file", contentKey: "brief-t002" },
                    { name: "T003_content-directory-structure.md", type: "file" },
                    { name: "T004_next-config-image-optimization.md", type: "file" },
                    { name: "T005_framer-cms-migration.md", type: "file", contentKey: "brief-t005" },
                    { name: "T006_framer-cms-migration.md", type: "file", contentKey: "brief-t006" },
                    { name: "T007_framer-cms-migration.md", type: "file" },
                    { name: "T008_framer-cms-migration.md", type: "file" },
                    { name: "T009_category-system.md", type: "file" },
                    { name: "T010_project-detail-page.md", type: "file", contentKey: "brief-t010" },
                    { name: "T011_blog-mdx-renderer.md", type: "file", contentKey: "brief-t011" },
                    { name: "T012_free-resources-components.md", type: "file" },
                    { name: "T013_framer-cms-migration.md", type: "file" },
                    { name: "T014_project-listing-filter.md", type: "file" },
                    { name: "T015_lab-page.md", type: "file" },
                    { name: "T016_seo-metadata.md", type: "file", contentKey: "brief-t016" },
                    { name: "T017_content-validation.md", type: "file" },
                    { name: "T018_template-stripping.md", type: "file" },
                    { name: "T019_homepage-images.md", type: "file" },
                    { name: "T020_about-images.md", type: "file", contentKey: "brief-t020" },
                  ],
                },
              ],
            },
          ],
        },
        { name: "research", type: "directory", children: [] },
        { name: "templates", type: "directory", children: [] },
        { name: "workflow-templates", type: "directory", children: [] },
        { name: "config.yaml", type: "file" },
        { name: "install.sh", type: "file" },
        { name: "remote-install.sh", type: "file" },
        { name: "uninstall.sh", type: "file" },
        { name: "update.sh", type: "file" },
      ],
    },
  ],
};

// --- File Contents (carbon copies from real PRD) ------------

export const FILE_CONTENTS: Record<
  string,
  { content: string; language: string }
> = {
  "prd": {
    language: "markdown",
    content: `# PRD: Framer CMS Migration
## Created: 2026-04-07
## Status: approved
## Slug: framer-cms-migration

---

## Executive Summary

Migrate all content from opensession.co (hosted on Framer) into the existing Next.js 16+ codebase at OS-Portfolio. The migration is content-first: get all data, images, and structured content into the codebase with correct TypeScript schemas before any visual polish. The codebase will also be released as a free template, so all proprietary content must be strippable via a clean directory structure.

**Scope:** 5 projects, 4 blog posts, 5 free resources, 2 legal pages, ~75 images.
**Approach:** Static download of assets, file-based CMS (MDX + TypeScript data files), no external CMS dependency.
**Timeline:** Phased waves. Get it right over ship fast.

---

## Goals & Non-Goals

### Goals

- Download all ~75 images from framerusercontent.com to \`/public/images/\`
- Define enriched TypeScript schemas for all 4 content types (projects, blog, playbooks, free resources)
- Populate all project data with full structured sections (Challenge / Solution / Impact), gallery images, testimonials, and results
- Convert 4 blog posts from Framer HTML to MDX files in \`/src/content/blog/\`
- Migrate 5 free resources from the OS_our-links repo into the portfolio codebase
- Migrate legal pages (Terms & Privacy) from CSV HTML into usable form
- Update components to render the enriched data (project detail, blog MDX, free resource cards)
- Create a \`/lab\` or view-all page aggregating blog posts, playbooks, and free resources
- Implement a template-stripping script so proprietary content is cleanly separable
- Add SEO metadata generation from all content types

### Non-Goals

- Visual redesign or UI polish (that is a separate phase)
- External CMS integration (Contentful, Sanity, etc.)
- Live sync with Framer CMS
- New service pages (services remain category filters on the projects listing)
- Playbook content authoring (schema only — content is future work)
- A/B testing or analytics beyond existing setup

---

## Research Findings (Summary)

Full findings at: \`/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/.karimo/prds/framer-cms-migration/research/findings.md\`

### Content Inventory

| Type | Count | Source |
|------|-------|--------|
| Projects | 5 | Framer CSV + scraped detail pages |
| Blog posts | 4 | Framer CSV (HTML content) |
| Free resources | 5 | OS_our-links repo |
| Legal pages | 2 | Legal.csv |
| Team members | 2 | Already partially in codebase |
| Client logos | 8 SVGs | Already in \`/public/logos/clients/\` |

### Key Gaps Identified

- Project type lacks: \`sections\`, \`gallery images\`, \`testimonials\`, \`results\`, \`services\`, \`duration\`, \`button link\`
- Blog type has embedded markdown content — needs to change to MDX file references
- Blog categories missing: "Creative Philosophy", "About Us", "Digital Design"
- Project categories use a single enum — need to migrate to multi-tag system
- 4th blog post (MCP for Designers) exists in Framer but not in the codebase
- ~75 images exist on framerusercontent.com CDN but are not downloaded locally
- No MDX pipeline exists yet (\`@next/mdx\` or \`next-mdx-remote\` not installed)
- \`next.config.ts\` has no image domain allowlisting

### Image Catalog Summary

- **Project images (40):** 5 hero SVGs + ~30 gallery JPGs + 1 GIF (Universal Audio)
- **Homepage (8):** 1 hero PNG, 4 service JPGs, 3 blog thumbnail JPGs (team photo is separate)
- **About page (9):** 1 hero JPG (7008x4672), 2 team photos, 4 story images, 1 new logo SVG
- **Blog thumbnails (4 JPGs):** One per post (EP02, EP01, Democratizing, MCP Guide)

All source URLs follow the pattern: \`https://framerusercontent.com/images/{hash}.{ext}\` — strip query params to get originals.

---

## Architecture Decisions

### CMS: File-Based Only

- **Blog / Playbooks:** MDX files in \`/src/content/blog/{slug}.mdx\` and \`/src/content/playbooks/{slug}.mdx\`
- **Structured content (projects, resources, team):** TypeScript data files in \`/src/data/\`
- **Rationale:** No external dependency, works with static generation, content is strippable, aligns with existing codebase pattern

### Image Handling

- Download all images to \`/public/images/\` at migration time
- Subdirectory structure: \`/public/images/projects/\`, \`/public/images/blog/\`, \`/public/images/about/\`, \`/public/images/homepage/\`
- Use \`next/image\` with existing fill-based layout — no changes needed to component image rendering logic
- The large about hero (7008x4672) should be downloaded as-is and served via Next.js Image optimization

### Category System

- Migrate from single \`ProjectCategory\` enum to multi-tag \`string[]\`
- Canonical tag slugs from Framer CSV: \`art-direction\`, \`strategy\`, \`digital-design\`, \`brand-identity\`, \`web-design\`
- Project listing filter updated to handle array intersection

### Blog MDX Pipeline

- Use \`next-mdx-remote\` (or \`@next/mdx\`) for rendering MDX at build time
- Blog data file (\`/src/data/blog.ts\`) changes from embedded \`content: string\` to \`contentPath: string\` (relative MDX file path)
- \`generateStaticParams()\` reads slugs from MDX filenames

### Free Resources

- New data file: \`/src/data/free-resources.ts\`
- New type: \`FreeResource\` with fields: \`id\`, \`badge\`, \`media\`, \`hoverImage\`, \`title\`, \`description\`, \`href\`, \`buttonLabel\`
- Assets (images/videos) copied from \`/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/\` into \`/public/images/resources/\`

### Template Stripping Design

Content directory structure is designed so proprietary content can be removed with:

\`\`\`bash
rm -rf src/content/*          # Remove all MDX files
# Replace src/data/*.ts with example/stub versions
# Replace public/images/ with placeholder assets
\`\`\`

All content data files should contain a clear \`// TEMPLATE: replace with your content\` comment at the top.

### Git Workflow

Feature branch (\`feat/framer-cms-migration\`) -> individual task branches as worktrees -> merge to main via PR per wave.

---

## Content Types

### 1. Projects

**Schema additions (on top of existing fields):**

\`\`\`typescript
interface ProjectSection {
  heading: string;       // "The Challenge" / "The Solution" / "The Impact"
  headline: string;      // Bold intro sentence
  body: string;          // Full paragraph (may contain HTML from Framer)
}

interface ProjectImage {
  src: string;           // /images/projects/{project-slug}/{filename}
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

// Enriched Project (extends current)
interface Project {
  // --- existing ---
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  // --- new ---
  categories: string[];          // replaces single category enum
  services: string[];            // e.g. ["Brand Identity", "Guidelines"]
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];    // [challenge, solution, impact]
  images: ProjectImage[];        // hero + gallery grouped
  testimonials?: ProjectTestimonial[];
  results?: string[];            // bullet metrics
}
\`\`\`

**Data source:** Framer CSV (\`Projects.csv\`) + scraped detail pages.
**Files to enrich:** 5 projects — Iterra, BILTFOUR, NEXT, Infinite Nature, Universal Audio.

### 2. Blog Posts

**Schema change:**

\`\`\`typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;    // replaces embedded content string — e.g. "blog/ep02-creative-ai.mdx"
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory; // union expanded to include new categories
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

type BlogCategory =
  | 'Creative Philosophy'
  | 'About Us'
  | 'Digital Design'
  | 'Design Strategy'
  | 'Brand Identity';
\`\`\`

**MDX files location:** \`/src/content/blog/{slug}.mdx\`
**4 posts to create:** EP02 Creative AI Framework, EP01 Creativity over Compute, Democratizing Fortune 500 Design, MCP for Designers.
**Source:** Framer CSV HTML -> convert to MDX.

### 3. Playbooks

**Schema defined, content empty (future work):**

\`\`\`typescript
interface Playbook {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // /src/content/playbooks/{slug}.mdx
  author: { name: string; image?: string };
  date: string;
  category: string;
  thumbnail: string;
  readingTime: string;
}
\`\`\`

**Files:** \`/src/data/playbooks.ts\` (empty array), \`/src/content/playbooks/\` (empty directory with \`.gitkeep\`).

### 4. Free Resources

**New type and data file:**

\`\`\`typescript
type ResourceBadge = 'live' | 'coming-soon';

interface ResourceMedia {
  type: 'image' | 'video';
  src: string;
}

interface FreeResource {
  id: string;
  badge: ResourceBadge;
  media: ResourceMedia;
  hoverImage?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}
\`\`\`

**5 resources:** Portfolio Template, Design Directory, Brand Design System, Linktree Template, KARIMO.
**Asset source:** \`/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/\` -> copy to \`/public/images/resources/\`.

---

## Task Summary

Tasks are organized in 4 waves. Full detail in \`tasks.yaml\`.

| Wave | Focus | Tasks | Key Outputs |
|------|-------|-------|-------------|
| 1 | Foundation | T001--T004 | Image download script, enriched schemas, content directories, next.config update |
| 2 | Content Migration | T005--T008, T013 | All project/blog/resource/legal data populated, playbook scaffolding |
| 3 | Component Updates | T009--T012, T014, T019--T020 | Project detail, blog MDX, resource cards, filter update, homepage + about images |
| 4 | Integration & Polish | T015--T018 | Lab page, SEO, validation script, template strip script |

**Total tasks:** 20
**Estimated complexity sum:** 89 points

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| framerusercontent.com URLs change or expire | Medium | High | Download immediately as Wave 1 priority |
| HTML-to-MDX conversion produces broken markup | Medium | Medium | Manual review each post; keep original HTML as fallback comment |
| About page hero (7008x4672) causes build issues | Low | Medium | Let Next.js Image handle optimization; set \`quality: 85\` |
| \`next-mdx-remote\` version conflicts with Next.js 16 | Low | High | Pin compatible version; test in Wave 1 as part of schema task |
| OS_our-links asset paths differ from expected structure | Low | Low | Audit repo structure before T007 |
| Multi-tag filter breaks existing project listing | Medium | Medium | Update filter logic in same task as schema change (T005) |

---

## Success Criteria

- [ ] All ~75 images downloaded to \`/public/images/\` with no 404s at build time
- [ ] \`npm run build\` passes cleanly with zero TypeScript errors after each wave
- [ ] All 5 project detail pages render Challenge / Solution / Impact sections with gallery images
- [ ] All 4 blog posts render as MDX with correct metadata (author, date, reading time, category)
- [ ] Multi-tag project filtering works on \`/projects\` listing page
- [ ] Free resources section renders 5 cards with correct media and links
- [ ] Legal pages are accessible at \`/legal/terms\` and \`/legal/privacy\`
- [ ] Template strip command removes all proprietary content without breaking build
- [ ] \`npm run lint\` passes with zero errors after all waves complete
- [ ] No images reference external CDN domains in production build`,
  },

  "status": {
    language: "json",
    content: `{
  "status": "researching",
  "created": "2026-04-07",
  "last_updated": "2026-04-07",
  "research_complete": false,
  "prd_complete": false,
  "tasks_defined": 0,
  "phases": 0,
  "current_phase": 0,
  "completed_tasks": 0,
  "execution_mode": "feature-branch",
  "feature_branch": null,
  "final_pr_number": null,
  "final_pr_created_at": null
}`,
  },

  "tasks": {
    language: "yaml",
    content: `version: "1.0"
project: framer-cms-migration
created: "2026-04-07"

tasks:
  # ---------------------------------------------
  # WAVE 1: Foundation
  # ---------------------------------------------

  - id: T001
    title: Write image download script
    description: >
      Write a Node.js script at scripts/download-framer-images.js that reads
      the full image URL catalog (from research/findings.md) and downloads all
      ~75 images from framerusercontent.com to /public/images/ with correct
      subdirectory structure: projects/{slug}/, blog/, about/, homepage/,
      resources/. Strip CDN query params before downloading to get originals.
      Script should be idempotent (skip already-downloaded files), log progress,
      and report any failures without crashing the full run.
    type: chore
    complexity: 4
    priority: must
    depends_on: []
    acceptance_criteria:
      - Script exists at scripts/download-framer-images.js
      - Running the script downloads all ~75 images to correct subdirectories
      - Already-downloaded files are skipped (idempotent)
      - Failures are logged but do not stop the remaining downloads
      - All 5 project hero SVGs land in /public/images/projects/{slug}/
      - All gallery JPGs land in /public/images/projects/{slug}/
      - About page hero, team photos, and story images land in /public/images/about/
      - Homepage images land in /public/images/homepage/
      - Blog thumbnails land in /public/images/blog/
    files_likely_affected:
      - scripts/download-framer-images.js

  - id: T002
    title: Define enriched TypeScript schemas for all content types
    description: >
      Update /src/types/ to reflect the enriched data model. Specifically:
      (1) Enrich the Project type with sections (ProjectSection[]),
      images (ProjectImage[]), testimonials, results, services, duration,
      buttonText, buttonHref, and change category to categories (string[]).
      (2) Update BlogPost type to replace embedded content string with
      contentPath string. Expand BlogCategory union to include
      "Creative Philosophy", "About Us", "Digital Design".
      (3) Add new Playbook type (mirrors BlogPost with contentPath).
      (4) Add new FreeResource type with badge, media, hoverImage, href,
      buttonLabel fields.
      Also install next-mdx-remote (or @next/mdx) and verify no version
      conflicts with Next.js 16+.
    type: refactor
    complexity: 5
    priority: must
    depends_on: []
    acceptance_criteria:
      - /src/types/project.ts exports enriched Project, ProjectSection, ProjectImage, ProjectTestimonial types
      - Project.category field replaced with Project.categories (string[])
      - /src/types/blog.ts exports updated BlogPost with contentPath field
      - BlogCategory union includes Creative Philosophy, About Us, Digital Design
      - /src/types/playbook.ts exports Playbook type
      - /src/types/free-resources.ts exports FreeResource, ResourceBadge, ResourceMedia types
      - next-mdx-remote (or equivalent) installed and resolvable
      - npm run build passes after schema changes (existing data files updated to match new types)
    files_likely_affected:
      - src/types/project.ts
      - src/types/blog.ts
      - src/types/playbook.ts
      - src/types/free-resources.ts
      - src/types/index.ts
      - package.json
      - package-lock.json

  - id: T003
    title: Set up content directory structure for MDX files
    description: >
      Create the directory structure for file-based MDX content.
      Create /src/content/blog/ and /src/content/playbooks/ with .gitkeep
      files so empty directories are tracked. Add a README.md in each
      explaining the file format. Ensure Next.js can resolve these paths
      at build time (update tsconfig.json paths if needed).
    type: chore
    complexity: 2
    priority: must
    depends_on: []
    acceptance_criteria:
      - /src/content/blog/ directory exists and is tracked in git
      - /src/content/playbooks/ directory exists and is tracked in git
      - tsconfig.json includes a path alias or baseUrl that resolves src/content/
      - npm run build does not error on empty content directories
    files_likely_affected:
      - src/content/blog/.gitkeep
      - src/content/playbooks/.gitkeep
      - tsconfig.json

  - id: T004
    title: Update next.config.ts for image optimization
    description: >
      Update next.config.ts to ensure Next.js Image is configured correctly
      for local images. Remove any stale framerusercontent.com domain
      allowlisting if present. Confirm remotePatterns is clean. Add any
      image size or format configuration needed for the large about hero
      (7008x4672). Document the config changes inline.
    type: chore
    complexity: 2
    priority: must
    depends_on: []
    acceptance_criteria:
      - next.config.ts does not allowlist framerusercontent.com
      - All images reference /public/images/ paths (local)
      - npm run build passes with no image configuration warnings
    files_likely_affected:
      - next.config.ts

  # ---------------------------------------------
  # WAVE 2: Content Migration
  # ---------------------------------------------

  - id: T005
    title: Migrate all 5 project data records
    description: >
      Populate /src/data/projects.ts with the full enriched data for all 5
      projects (Iterra, BILTFOUR, NEXT, Infinite Nature, Universal Audio).
      Each project must include: categories (multi-tag string[]), services[],
      sections[] (Challenge/Solution/Impact each with heading, headline, body),
      images[] (hero + gallery grouped by section context), testimonials (where
      available — Iterra has one), results (where available — BILTFOUR, NEXT,
      Universal Audio have them), duration, buttonText, buttonHref.
      Source data from Framer CSV and scraped detail pages in research findings.
      Also add a redirect in next.config.ts from /projects/gemini-infinite-nature
      to /projects/google-gemini-infinite-nature (slug changed to match Framer CSV).
      Filter logic changes are owned by T009 — do not modify projects/page.tsx.
    type: feature
    complexity: 8
    priority: must
    depends_on:
      - T001
      - T002
    acceptance_criteria:
      - All 5 projects have non-empty sections[] with Challenge, Solution, Impact
      - All 5 projects have images[] including hero SVG and 7-8 gallery images
      - All 5 projects have categories as string[] using canonical slugs
      - Iterra project has testimonials[] with at least 1 entry
      - BILTFOUR, NEXT, Universal Audio projects have results[] with metrics
      - All image paths reference /public/images/projects/{slug}/ (local, no CDN)
      - Redirect rule present in next.config.ts for old gemini-infinite-nature slug
      - npm run build passes with TypeScript strict mode
      - npm run lint passes with no errors
    files_likely_affected:
      - src/data/projects.ts
      - src/types/project.ts
      - next.config.ts

  - id: T006
    title: Convert 4 blog posts from HTML to MDX files
    description: >
      Create MDX files for all 4 blog posts in /src/content/blog/.
      Posts: ep02-creative-ai-framework.mdx, ep01-creativity-over-compute.mdx,
      democratizing-fortune-500-design.mdx, mcp-for-designers.mdx.
      Convert Framer HTML content to clean MDX (strip inline styles, convert
      <h2>/<p>/<ul> to markdown, preserve any code blocks or special formatting).
      Update /src/data/blog.ts to use contentPath field instead of embedded
      content. Add the 4th post (MCP for Designers) which is currently missing
      from the codebase. Expand BlogCategory union for new categories.
    type: feature
    complexity: 6
    priority: must
    depends_on:
      - T002
      - T003
    acceptance_criteria:
      - 4 MDX files exist in /src/content/blog/ with correct slugs
      - Each MDX file has clean markdown (no inline styles or raw HTML unless unavoidable)
      - /src/data/blog.ts has contentPath fields pointing to the MDX files
      - MCP for Designers post is present in blog data with correct metadata
      - BlogCategory union includes Creative Philosophy, About Us, Digital Design
      - All 4 posts have correct date, readingTime, author, thumbnail path
      - Thumbnail paths reference /public/images/blog/ (local)
      - Blog listing page at /blog renders all 4 posts with correct thumbnails and metadata
      - npm run build passes
    files_likely_affected:
      - src/content/blog/ep02-creative-ai-framework.mdx
      - src/content/blog/ep01-creativity-over-compute.mdx
      - src/content/blog/democratizing-fortune-500-design.mdx
      - src/content/blog/mcp-for-designers.mdx
      - src/data/blog.ts
      - src/types/blog.ts

  - id: T007
    title: Migrate free resources data and copy assets from OS_our-links
    description: >
      Create /src/data/free-resources.ts with all 5 free resource records:
      Portfolio Template, Design Directory, Brand Design System,
      Linktree Template, KARIMO.
      Copy all associated images/videos from
      /Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/
      into /public/images/resources/.
      Each resource must have: id, badge (live/coming-soon), media (image or
      video with src), hoverImage (if applicable), title, description, href
      (external link), buttonLabel.
    type: feature
    complexity: 4
    priority: must
    depends_on:
      - T001
      - T002
    acceptance_criteria:
      - /src/data/free-resources.ts exports an array of 5 FreeResource objects
      - All 5 records have complete fields (no undefined required fields)
      - All image/video assets copied to /public/images/resources/
      - All media src paths reference /public/images/resources/ (local)
      - External href values are valid URLs
      - npm run build passes
    files_likely_affected:
      - src/data/free-resources.ts
      - public/images/resources/ (directory + files)

  - id: T008
    title: Migrate legal page content from CSV HTML
    description: >
      Parse Legal.csv and extract Terms & Conditions and Privacy Policy content.
      Create route pages at /src/app/legal/terms/page.tsx and
      /src/app/legal/privacy/page.tsx. Either render as MDX files in
      /src/content/legal/ or as static HTML within a shared layout component.
      Add a /src/app/legal/layout.tsx for shared legal page chrome (heading,
      back navigation). Add links to legal pages in the site footer.
    type: feature
    complexity: 4
    priority: should
    depends_on:
      - T002
      - T003
    acceptance_criteria:
      - /legal/terms renders Terms & Conditions content without 404
      - /legal/privacy renders Privacy Policy content without 404
      - Content is readable and properly formatted (no raw HTML tags visible)
      - Both pages share a consistent legal layout
      - Footer includes links to both legal pages
      - Old /terms and /privacy routes either removed or redirect to /legal/ equivalents
      - npm run build passes
    files_likely_affected:
      - src/app/legal/layout.tsx
      - src/app/legal/terms/page.tsx
      - src/app/legal/privacy/page.tsx
      - src/content/legal/terms.mdx
      - src/content/legal/privacy.mdx
      - src/components/layout/footer.tsx
      - src/app/terms/page.tsx
      - src/app/privacy/page.tsx

  - id: T013
    title: Create playbook schema and empty content infrastructure
    description: >
      Set up the playbook content type so it is ready for future content without
      blocking any other work. Create /src/data/playbooks.ts exporting an empty
      array typed as Playbook[]. Create /src/app/playbooks/[slug]/page.tsx with
      generateStaticParams() that handles an empty array gracefully. Create
      /src/app/playbooks/page.tsx with an empty listing state. Add an index
      export in /src/types/ for Playbook.
    type: chore
    complexity: 3
    priority: should
    depends_on:
      - T002
      - T003
    acceptance_criteria:
      - /src/data/playbooks.ts exports an empty Playbook[] array
      - /src/app/playbooks/page.tsx renders without errors (empty state)
      - /src/app/playbooks/[slug]/page.tsx handles empty generateStaticParams gracefully
      - npm run build passes
    files_likely_affected:
      - src/data/playbooks.ts
      - src/app/playbooks/page.tsx
      - src/app/playbooks/[slug]/page.tsx
      - src/types/playbook.ts

  # ---------------------------------------------
  # WAVE 3: Component Updates
  # ---------------------------------------------

  - id: T009
    title: Update category system to multi-tag with canonical slugs
    description: >
      Define canonical category slugs as a const array in /src/data/categories.ts:
      art-direction, strategy, digital-design, brand-identity, web-design.
      Derive the Category type from this array. Update any existing components
      that use the old single ProjectCategory enum to use the new string-based
      system. Ensure the filter UI on /projects handles multi-tag intersection
      (a project with categories ["brand-identity", "web-design"] appears under
      both filters). Also pull display labels from Categories.csv data.
    type: refactor
    complexity: 3
    priority: must
    depends_on:
      - T005
    acceptance_criteria:
      - /src/data/categories.ts exports canonical slugs and display labels
      - No remaining references to old ProjectCategory enum in components
      - Project listing filter shows correct projects for each category tab
      - Projects with multiple categories appear under each applicable filter
      - npm run lint passes
    files_likely_affected:
      - src/data/categories.ts
      - src/types/project.ts
      - src/app/projects/page.tsx

  - id: T010
    title: Update project detail page to render enriched schema
    description: >
      Update /src/app/projects/[slug]/page.tsx and related components to render
      the enriched project data: structured sections (Challenge/Solution/Impact
      each with heading, headline, and body text), gallery images grouped by
      section, testimonials block (if present), results/metrics list (if present),
      services tags, duration, and a CTA button using buttonText/buttonHref.
      Use next/image for all gallery images. Ensure graceful fallback if optional
      fields (testimonials, results) are absent.
    type: feature
    complexity: 7
    priority: must
    depends_on:
      - T005
    acceptance_criteria:
      - All 5 project detail pages render without errors
      - Challenge, Solution, and Impact sections display with correct headings and body
      - Gallery images display correctly using next/image (no layout shift)
      - Testimonial block renders on Iterra project page; absent on others
      - Results block renders on BILTFOUR, NEXT, Universal Audio pages; absent on others
      - Services tags visible on project detail
      - CTA button links to correct external URL
      - npm run build passes with no TypeScript errors
      - npm run lint passes
    files_likely_affected:
      - src/app/projects/[slug]/page.tsx
      - src/components/projects/project-detail.tsx
      - src/components/projects/project-gallery.tsx
      - src/components/projects/project-section.tsx
      - src/components/projects/project-testimonial.tsx
      - src/components/projects/project-results.tsx

  - id: T011
    title: Update blog system to render MDX files
    description: >
      Update the blog detail page (/src/app/blog/[slug]/page.tsx) to load and
      render MDX content from /src/content/blog/{slug}.mdx using next-mdx-remote
      (or @next/mdx). The data layer in /src/data/blog.ts now provides contentPath
      — the page component should read the file contents and pass through the
      MDX renderer. Update generateStaticParams() to derive slugs from MDX
      filenames. Ensure custom MDX components (if needed) are passed as components
      prop for consistent heading/paragraph/link styling.
    type: feature
    complexity: 6
    priority: must
    depends_on:
      - T006
    acceptance_criteria:
      - All 4 blog post detail pages render MDX content without errors
      - generateStaticParams() correctly returns all 4 slugs
      - MDX headings, paragraphs, lists, and any code blocks render correctly
      - Blog listing page shows all 4 posts with correct metadata
      - npm run build passes (static generation includes all 4 posts)
      - npm run lint passes
    files_likely_affected:
      - src/app/blog/[slug]/page.tsx
      - src/app/blog/page.tsx
      - src/lib/mdx.ts
      - src/components/blog/MDXComponents.tsx

  - id: T012
    title: Create free resources data structure and card component
    description: >
      Build a FreeResourceCard component that renders a single free resource:
      media (image or video autoplay), hover image overlay, badge (live/coming-soon),
      title, description, and CTA button linking to the external href.
      Create a FreeResourcesGrid component that maps over the resources array.
      These components will be used in the Lab page (T015) and potentially
      on the homepage.
    type: feature
    complexity: 5
    priority: must
    depends_on:
      - T007
    acceptance_criteria:
      - FreeResourceCard renders image media correctly using next/image
      - FreeResourceCard renders video media with autoplay, muted, loop attributes
      - Badge displays "Live" or "Coming Soon" with appropriate styling
      - CTA button opens href in a new tab
      - Hover state shows hoverImage if provided
      - FreeResourcesGrid renders all 5 resource cards
      - Components are typed with FreeResource interface (no any)
      - npm run build passes
    files_likely_affected:
      - src/components/resources/free-resource-card.tsx
      - src/components/resources/free-resources-grid.tsx

  - id: T014
    title: Update project listing to use multi-tag filtering
    description: >
      Update the /projects listing page filter UI to work with the new
      multi-tag category system. A project should appear under a category
      filter if any of its categories array values match. Ensure the "All"
      tab shows all projects. Use the canonical categories from
      /src/data/categories.ts for the filter tabs (not hardcoded strings).
      Update URL params or filter state as needed.
    type: refactor
    complexity: 4
    priority: must
    depends_on:
      - T009
    acceptance_criteria:
      - Selecting a category filter shows all projects with that category in their array
      - "All" tab shows all 5 projects
      - Category tab labels use display names from /src/data/categories.ts
      - No TypeScript errors related to old ProjectCategory enum
      - npm run lint passes
    files_likely_affected:
      - src/app/projects/page.tsx
      - src/components/projects/project-filters.tsx

  - id: T019
    title: Update homepage components with downloaded image paths
    description: >
      Update homepage components to reference locally downloaded images instead
      of placeholders or external URLs. This includes: hero image in hero.tsx,
      service images in the expertise/what-we-do section, team photo, and blog
      post thumbnails in the featured work section. All image paths should point
      to /public/images/homepage/ and /public/images/blog/ as downloaded by T001.
      Use next/image for all images.
    type: feature
    complexity: 4
    priority: must
    depends_on:
      - T001
      - T005
    acceptance_criteria:
      - Homepage hero renders the downloaded hero image from /public/images/homepage/
      - Service/expertise section renders 4 downloaded service images
      - Featured work section renders project thumbnails from /public/images/projects/
      - Blog thumbnails on homepage reference /public/images/blog/
      - No images reference framerusercontent.com or external CDNs
      - npm run build passes
    files_likely_affected:
      - src/components/home/hero.tsx
      - src/components/home/what-we-do-section.tsx
      - src/components/home/featured-work-section.tsx
      - src/data/what-we-do.ts

  - id: T020
    title: Update about page components with downloaded image paths
    description: >
      Update about page components to use locally downloaded images. This includes:
      the about hero image (7008x4672 JPG), team member photos (Karim + Morgan),
      team story images (4 images), and any additional logos. Update the team
      data in /src/data/team.ts with correct local image paths. Use next/image
      for all images with appropriate sizes prop.
    type: feature
    complexity: 4
    priority: must
    depends_on:
      - T001
    acceptance_criteria:
      - About page hero renders downloaded image from /public/images/about/
      - Team member photos render from /public/images/about/ (not external URLs)
      - Team story images render correctly
      - /src/data/team.ts has updated image paths pointing to local files
      - No images reference framerusercontent.com or external CDNs
      - npm run build passes
    files_likely_affected:
      - src/app/about/page.tsx
      - src/data/team.ts
      - src/components/about/about-hero.tsx
      - src/components/about/team-showcase.tsx

  # ---------------------------------------------
  # WAVE 4: Integration & Polish
  # ---------------------------------------------

  - id: T015
    title: Build Lab / View All page aggregating blog, playbooks, and free resources
    description: >
      Create /src/app/lab/page.tsx as a unified content hub that shows:
      - Free resources section (using FreeResourcesGrid from T012)
      - Blog posts section (latest posts, linking to /blog/[slug])
      - Playbooks section (empty state until content exists)
      Design the layout to handle the empty playbooks state gracefully.
      Add Lab to the site navigation.
    type: feature
    complexity: 5
    priority: should
    depends_on:
      - T011
      - T012
      - T013
    acceptance_criteria:
      - /lab page renders without errors
      - Free resources section shows all 5 resource cards
      - Blog section shows all 4 posts with correct metadata
      - Playbooks section shows appropriate empty state (not an error)
      - Lab link present in site navigation
      - npm run build passes
    files_likely_affected:
      - src/app/lab/page.tsx
      - src/components/lab/LabHero.tsx
      - src/data/navigation.ts

  - id: T016
    title: Add SEO metadata generation from content
    description: >
      Add generateMetadata() exports to all dynamic content pages:
      /projects/[slug], /blog/[slug], /playbooks/[slug], /lab.
      Metadata should derive title, description, and Open Graph image from
      the content data (project.title + project.description, post.title +
      post.excerpt, etc.). Use the thumbnail/hero image as og:image where
      available. Add canonical URLs. Ensure static pages (/, /projects,
      /blog, /about, /contact) also have appropriate static metadata.
    type: feature
    complexity: 4
    priority: should
    depends_on:
      - T010
      - T011
      - T015
    acceptance_criteria:
      - All dynamic route pages export generateMetadata()
      - Page titles follow pattern: "{Content Title} | Open Session"
      - og:image set to content thumbnail where available
      - Canonical URLs present on all pages
      - npm run build passes
    files_likely_affected:
      - src/app/projects/[slug]/page.tsx
      - src/app/blog/[slug]/page.tsx
      - src/app/playbooks/[slug]/page.tsx
      - src/app/lab/page.tsx
      - src/app/layout.tsx

  - id: T017
    title: Write content validation script
    description: >
      Write a Node.js script at scripts/validate-content.js that checks:
      (1) All image paths referenced in data files exist in /public/images/
      (2) All contentPath values in blog/playbook data point to existing MDX files
      (3) All required fields are present on each data record (no undefined slugs,
      no empty titles, etc.)
      (4) All external hrefs in free-resources use https://
      Script should exit with code 1 on failures and print a clear list of issues.
    type: chore
    complexity: 4
    priority: should
    depends_on:
      - T005
      - T006
      - T007
    acceptance_criteria:
      - scripts/validate-content.js exists and is runnable with node
      - Script checks image path existence for all data records
      - Script checks MDX file existence for all contentPath references
      - Script exits 0 when all content is valid
      - Script exits 1 with a list of issues when content is invalid
      - Running against complete Wave 2 content exits 0
    files_likely_affected:
      - scripts/validate-content.js

  - id: T018
    title: Write template stripping script
    description: >
      Write a shell script or Node.js script at scripts/strip-for-template.sh
      (or .js) that transforms the repo into a clean template by:
      (1) Removing /src/content/* (all MDX files)
      (2) Replacing data files (/src/data/projects.ts, blog.ts, free-resources.ts,
      team.ts, etc.) with example stub versions containing a single placeholder
      record and a comment "// TEMPLATE: replace with your content"
      (3) Replacing /public/images/ contents with placeholder gradient images
      or empty directories
      (4) Verifying npm run build still passes after stripping
      Add a comment at the top of each data file: "// TEMPLATE: replace with your content"
      (this must be in the data files before this task runs).
    type: chore
    complexity: 5
    priority: could
    depends_on:
      - T017
    acceptance_criteria:
      - scripts/strip-for-template.sh (or .js) exists and is documented
      - Running the script removes all MDX content files
      - Running the script replaces data files with stub versions
      - npm run build passes after stripping (no broken image references, no missing slugs)
      - All data files have "// TEMPLATE: replace with your content" comment
      - Script is idempotent (safe to run twice)
    files_likely_affected:
      - scripts/strip-for-template.sh
      - src/data/projects.ts
      - src/data/blog.ts
      - src/data/free-resources.ts
      - src/data/team.ts`,
  },

  "execution": {
    language: "yaml",
    content: `version: "1.0"
project: framer-cms-migration
created: "2026-04-07"
total_tasks: 20
total_waves: 4
principle: "Get it right over ship fast. Commit after each task. PR per wave."

git:
  base_branch: main
  feature_branch: feat/framer-cms-migration
  workflow: "feature branch -> task branches as worktrees -> merge via PR per wave"

waves:
  - wave: 1
    name: Foundation
    description: >
      All tasks in this wave have no inter-task dependencies. They can be
      executed in any order, or in parallel across worktrees. This wave
      establishes the asset pipeline, type system, content directory structure,
      and image configuration that all subsequent waves depend on.
    tasks:
      - id: T001
        title: Write image download script
        priority: must
        complexity: 4
        run_order: 1
        notes: >
          Run the script immediately after writing it to download all images
          before framerusercontent.com URLs change. Do not wait for Wave 2.
      - id: T002
        title: Define enriched TypeScript schemas for all content types
        priority: must
        complexity: 5
        run_order: 1
        notes: >
          Install next-mdx-remote as part of this task. Verify build passes
          after type changes — existing data files will need temporary stub
          updates to satisfy strict TypeScript until Wave 2 populates them.
      - id: T003
        title: Set up content directory structure for MDX files
        priority: must
        complexity: 2
        run_order: 1
        notes: Trivial task. Complete first to unblock T006.
      - id: T004
        title: Update next.config.ts for image optimization
        priority: must
        complexity: 2
        run_order: 1
        notes: Ensure no framerusercontent.com domain leaks into config.
    exit_criteria:
      - All ~75 images downloaded to /public/images/ with correct subdirectory structure
      - Enriched types compile with npm run build
      - /src/content/blog/ and /src/content/playbooks/ directories exist
      - next.config.ts is clean (no external image domains)
      - Wave 1 changes merged to main via PR

  - wave: 2
    name: Content Migration
    description: >
      Populate all data files and MDX content. T005 (projects) is the most
      complex single task. T006 requires manual HTML-to-MDX conversion.
      T007, T008, and T013 are self-contained and can run in parallel.
      T013 (playbook scaffolding) moved here from Wave 3 to unblock T015 earlier.
    depends_on_waves:
      - 1
    tasks:
      - id: T005
        title: Migrate all 5 project data records
        priority: must
        complexity: 8
        run_order: 1
        notes: >
          Heaviest task. Data population only — do not update filter UI.
          Reference research/findings.md Section 7 for all image hashes.
          Source section content from Framer CSV and scraped detail pages.
      - id: T006
        title: Convert 4 blog posts from HTML to MDX files
        priority: must
        complexity: 6
        run_order: 1
        notes: >
          Convert HTML to clean MDX manually. Keep original HTML as a comment
          block at the top of each MDX file for reference until review complete.
          The 4th post (MCP for Designers) does not exist yet — create from
          Framer CSV data.
      - id: T007
        title: Migrate free resources data and copy assets from OS_our-links
        priority: must
        complexity: 4
        run_order: 1
        notes: >
          Audit OS_our-links/public/images/ first to confirm file names
          before writing data records.
      - id: T008
        title: Migrate legal page content from CSV HTML
        priority: should
        complexity: 4
        run_order: 1
        notes: >
          Also handle removing/redirecting existing /terms and /privacy routes
          to the new /legal/ paths.
      - id: T013
        title: Create playbook schema and empty content infrastructure
        priority: should
        complexity: 3
        run_order: 1
        notes: >
          Moved from Wave 3 to Wave 2. Depends only on T002 and T003 (Wave 1).
          Early completion unblocks T015 (Lab page) in Wave 4.
    exit_criteria:
      - All 5 projects have complete data including sections, gallery images, and categories
      - 4 MDX blog post files exist with clean content
      - Free resources data file has 5 complete records
      - Legal pages accessible at /legal/terms and /legal/privacy
      - Old /terms and /privacy routes cleaned up
      - Playbook scaffolding in place (empty data, route pages)
      - npm run build passes cleanly
      - Wave 2 changes merged to main via PR

  - wave: 3
    name: Component Updates
    description: >
      Update and create all components required to render the enriched data.
      T009 (category system) moved here from Wave 2 since it depends on T005.
      T010 and T011 are the critical path. T019 and T020 wire downloaded
      images into homepage and about page components.
    depends_on_waves:
      - 2
    tasks:
      - id: T009
        title: Update category system to multi-tag with canonical slugs
        priority: must
        complexity: 3
        run_order: 1
        notes: >
          Moved from Wave 2. Depends on T005 completing so category data
          exists to validate against.
      - id: T010
        title: Update project detail page to render enriched schema
        priority: must
        complexity: 7
        run_order: 1
        notes: >
          Build new sub-components (ProjectSection, ProjectGallery,
          ProjectTestimonial, ProjectResults) as separate files.
          Test each of the 5 project detail pages individually.
      - id: T011
        title: Update blog system to render MDX files
        priority: must
        complexity: 6
        run_order: 1
        notes: >
          Create /src/lib/mdx.ts as a utility module for reading and
          serializing MDX content. Pass custom MDX components for
          consistent styling.
      - id: T012
        title: Create free resources data structure and card component
        priority: must
        complexity: 5
        run_order: 1
        notes: >
          Video media should use autoplay, muted, loop, playsInline.
          Use next/image for image media. Hover crossfade with Framer Motion.
      - id: T014
        title: Update project listing to use multi-tag filtering
        priority: must
        complexity: 4
        run_order: 2
        notes: >
          Depends on T009 completing. Run after T009 is confirmed.
          Verify filter behavior manually for all 5 category tabs.
      - id: T019
        title: Update homepage components with downloaded image paths
        priority: must
        complexity: 4
        run_order: 1
        notes: >
          Wire downloaded images into hero, expertise section, featured
          work, and blog thumbnails. No external CDN references should remain.
      - id: T020
        title: Update about page components with downloaded image paths
        priority: must
        complexity: 4
        run_order: 1
        notes: >
          Wire downloaded images into about hero, team photos, story images.
          Update team data with local image paths.
    exit_criteria:
      - All 5 project detail pages render sections, galleries, testimonials, and results
      - All 4 blog posts render MDX content on their detail pages
      - FreeResourceCard and FreeResourcesGrid components exist and render correctly
      - Project listing filter correctly handles multi-tag categories
      - Homepage renders all images from local /public/images/ paths
      - About page renders all images from local /public/images/ paths
      - No framerusercontent.com references remain in any component
      - npm run build and npm run lint both pass
      - Wave 3 changes merged to main via PR

  - wave: 4
    name: Integration & Polish
    description: >
      Final integration wave. Lab page aggregates all content types. SEO
      metadata generation adds discoverability. Validation and template
      stripping scripts close out the migration with quality guarantees.
    depends_on_waves:
      - 3
    tasks:
      - id: T015
        title: Build Lab / View All page aggregating blog, playbooks, and free resources
        priority: should
        complexity: 5
        run_order: 1
        notes: >
          Design the layout to make the empty playbooks section feel
          intentional. Add Lab to navigation in /src/data/navigation.ts.
      - id: T016
        title: Add SEO metadata generation from content
        priority: should
        complexity: 4
        run_order: 1
        notes: >
          Can run in parallel with T015. Use the Next.js App Router
          generateMetadata() API.
      - id: T017
        title: Write content validation script
        priority: should
        complexity: 4
        run_order: 2
        notes: >
          Run this script as the final check before declaring migration
          complete. Fix any issues it surfaces before closing the PR.
      - id: T018
        title: Write template stripping script
        priority: could
        complexity: 5
        run_order: 3
        notes: >
          Lower priority — complete only after T015-T017 are done.
          Nice-to-have for the open-source template release.
    exit_criteria:
      - /lab page renders with all content sections
      - All dynamic content pages have generateMetadata() with correct title and og:image
      - scripts/validate-content.js runs and exits 0
      - scripts/strip-for-template.sh exists (T018 optional)
      - Final npm run build and npm run lint both pass with zero errors
      - All Wave 4 changes merged to main via PR
      - Migration declared complete

complexity_summary:
  wave_1_total: 13
  wave_2_total: 25
  wave_3_total: 33
  wave_4_total: 18
  grand_total: 89
  model_assignment: "complexity >= 5 tasks -> Opus preferred; complexity <= 4 -> Sonnet"

high_complexity_tasks:
  - id: T005
    complexity: 8
    reason: 5 projects x full structured content + gallery images (data only)
  - id: T010
    complexity: 7
    reason: Multiple new sub-components, 5 project pages to validate, image rendering
  - id: T011
    complexity: 6
    reason: MDX pipeline setup, custom components, static generation update
  - id: T006
    complexity: 6
    reason: Manual HTML-to-MDX conversion for 4 posts, new 4th post creation
  - id: T002
    complexity: 5
    reason: 4 type files changed, MDX dependency install, full build validation
  - id: T012
    complexity: 5
    reason: Video + image media cards, hover states, responsive grid
  - id: T015
    complexity: 5
    reason: Aggregation page across 3 content types with empty state handling
  - id: T018
    complexity: 5
    reason: Script must strip content while keeping build passing`,
  },

  "findings": {
    language: "markdown",
    content: `# Cross-Task Execution Findings
# PRD: framer-cms-migration (002)
# Maintained by: PM Agent during /karimo:run

---

## Overview

This document tracks cross-task discoveries, shared issues, and emergent patterns found by the PM agent during execution of all 4 waves (20 tasks).

---

## Wave 1: Foundation (T001--T004)

### Discovery: Framer CDN URL stability
- **Task:** T001 (image download script)
- **Finding:** All ~75 framerusercontent.com URLs were valid at download time. No 404s encountered. CDN uses content-addressed hashing, so URLs are stable as long as the Framer project exists.
- **Impact:** No fallback image handling needed in downstream tasks.

### Discovery: next-mdx-remote compatibility
- **Task:** T002 (TypeScript schemas)
- **Finding:** \`next-mdx-remote@6.0.0\` installed cleanly with Next.js 16.2.1 and React 19. No peer dependency conflicts. Both \`compileMDX\` (RSC) and \`MDXRemote\` (RSC) patterns work.
- **Impact:** Unblocked T011 (blog MDX renderer) and legal page migration.

### Discovery: About page hero image dimensions
- **Task:** T004 (next.config image optimization)
- **Finding:** The about page hero (\`Sj4TYZrc68BDHPXs5O5D19mVik.jpg\`) is 7008x4672px — significantly larger than any other image. Next.js Image optimization handles it at build time, but it adds ~2s to first build.
- **Impact:** No code changes needed, but noted for future optimization (blurDataURL, manual resize).

---

## Wave 2: Content Migration (T005--T008, T013)

### Discovery: Framer HTML-to-MDX conversion quality
- **Task:** T005--T006 (project data, blog MDX)
- **Finding:** Framer's HTML export includes nested \`<div>\` wrappers and inline styles that don't map cleanly to MDX. Manual cleanup was required for all 4 blog posts. The \`<em>\` and \`<strong>\` tags converted cleanly; \`<div>\` containers were stripped.
- **Impact:** Future blog post imports from Framer will need the same manual cleanup pass.

### Discovery: Project slug mismatch
- **Task:** T005 (project data population)
- **Finding:** The codebase used \`gemini-infinite-nature\` as the project slug, but the Framer CMS and canonical URL used \`google-gemini-infinite-nature\`. A permanent redirect was added in \`next.config.ts\` to preserve SEO.
- **Impact:** T004 updated to add the redirect. No broken links in production.

### Discovery: Free resource video assets
- **Task:** T007 (free resources migration)
- **Finding:** One resource (Design Directory) uses a \`.mp4\` video instead of a static image. The \`FreeResource\` type's \`ResourceMedia\` union (\`type: 'image' | 'video'\`) handles this, and \`FreeResourceCard\` renders \`<video>\` for video media.
- **Impact:** Component pattern established for mixed media resource cards.

---

## Wave 3: Component Updates (T009--T012, T014, T019--T020)

### Discovery: Category filter multi-select complexity
- **Task:** T009 (category system) + T014 (project listing filter)
- **Finding:** Migrating from single \`ProjectCategory\` enum to multi-tag \`string[]\` required updating the filter logic from exact match to array intersection. The URL query param encoding also changed (comma-separated slugs).
- **Impact:** Filter component rewritten. No backward compatibility issues since the old filter wasn't deployed.

### Discovery: Blog images intentionally deferred
- **Task:** T011 (blog MDX renderer)
- **Finding:** Blog card and blog post hero \`<Image>\` tags were left commented out pending design review. The thumbnail images exist in \`/public/images/blog/\` but aren't rendered yet. This was a deliberate decision — the image treatment needs design direction before enabling.
- **Impact:** Blog pages render without images. Tracked as a known gap, not a bug.

### Discovery: Scroll-driven project detail performance
- **Task:** T010 (project detail page)
- **Finding:** The scroll-driven two-column layout with \`useScroll\` + \`useTransform\` performs well on desktop but required a mobile fallback. On mobile, the layout flattens to interleaved text/image blocks without scroll pinning.
- **Impact:** Mobile-specific CSS and conditional animation logic added.

---

## Wave 4: Integration & Polish (T015--T018)

### Discovery: Lab page aggregation pattern
- **Task:** T015 (lab page)
- **Finding:** The \`/lab\` page aggregates blog posts, playbooks, and free resources into a single feed. Since playbooks array is empty, the section renders but shows no items. The component handles empty state gracefully.
- **Impact:** No changes needed — playbook content will appear automatically when data is added.

### Discovery: Template stripping scope
- **Task:** T018 (template strip script)
- **Finding:** The template strip script removes \`src/content/*\` and replaces \`src/data/*.ts\` with stub versions. However, it does not touch \`public/images/\` — that directory must be manually cleared or replaced with placeholder assets.
- **Impact:** Documented in script output. Future improvement: generate placeholder gradient images.

### Discovery: SEO metadata completeness
- **Task:** T016 (SEO metadata)
- **Finding:** \`generateMetadata\` was added to all route pages. However, JSON-LD structured data (Article, CreativeWork, Organization schemas) was not implemented — identified as a future optimization opportunity in external research.
- **Impact:** Basic SEO is complete. Rich results require separate implementation.

---

## Cross-Cutting Observations

1. **Commit discipline held:** All 20 tasks produced individual commits. No bundled changes across tasks.
2. **No type regressions:** \`npm run build\` passed after every wave merge.
3. **devProps pattern adopted:** All new components followed the existing \`devProps()\` pattern for debug attributes.
4. **Animation consistency:** All new components used variants from \`src/lib/motion.ts\` rather than defining inline animations.`,
  },

  "recommendations": {
    language: "markdown",
    content: `# Brief Review: framer-cms-migration

**Reviewed:** 2026-04-07
**Briefs reviewed:** T001--T020 (20 tasks)
**Codebase verified against:** \`main\` branch at \`/Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio\`

---

## Critical Issues (must fix before execution)

### C1 — T006/T011 Build Break: \`post.content\` removed but blog detail page reads it at runtime

**Affected briefs:** T006 (line 293--355), T011 (line 25--42)
**Codebase evidence:** \`src/app/blog/[slug]/page.tsx\` line 53 calls \`p.category === post.category\`; \`src/components/blog/blog-post.tsx\` line 117 calls \`post.content.split("\\n\\n")\`.

T006 instructs removing \`content: string\` from blog.ts records and replacing with \`contentPath\`. However, \`blog-post.tsx\` directly renders \`post.content.split("\\n\\n")\` — this will throw at runtime the moment T006 removes the field, causing all 4 blog post pages to crash. T006's guidance acknowledges this (the "bridge" options) but leaves the resolution ambiguous, which will cause a broken build in Wave 2 before T011 arrives in Wave 3.

**Fix:** Update T006 to explicitly require adding a temporary \`content: ""\` stub alongside \`contentPath\` in blog.ts records, OR explicitly require updating the blog detail page to guard against undefined \`post.content\` before the MDX renderer is ready. Also note that \`src/app/blog/[slug]/page.tsx\` line 53 uses \`p.category === post.category\` for related posts filtering — after T002 changes BlogCategory values, old category strings will produce no matches (not a crash, but silently broken related posts).

---

### C2 — T007/T002/T012 Schema Conflict: \`badge\` field type is inconsistent across three tasks

**Affected briefs:** T002 (line 263--272), T007 (lines 40, 162--178, 202+), T012 (line 62, 138, 143)
**Detail:**

- T002 defines: \`export type ResourceBadge = 'live' | 'coming-soon'\` and \`badge: ResourceBadge\` on \`FreeResource\` — meaning \`badge\` is a plain string union.
- T007 defines in its own "Expected FreeResource Type" section: \`badge: ResourceBadge\` where \`ResourceBadge = { text: string; variant: BadgeVariant }\` — meaning badge is an **object**.
- T007's actual data records use: \`badge: { text: "Live", variant: "live" }\` — the object shape.
- T012's \`ResourceBadgeChip\` component renders: \`badge === "live"\` and \`badge === "coming-soon"\` — treating badge as a **plain string**.

The type is incompatible between T002 (string) -> T007 (object) -> T012 (string comparison). Whichever shape T002 ships will break either T007's data or T012's rendering.

**Fix:** Decide on one canonical shape and propagate it consistently. The PRD (research/findings section 6) uses the object shape \`{ quote, author }\` but the PRD type definition uses the simple string union. The most practical fix is to align on T002's simple string union (\`badge: 'live' | 'coming-soon'\`) and update T007 data records to use \`badge: "live"\` not \`badge: { text: "Live", variant: "live" }\`. T012 badge rendering is already written for the string shape and won't need changes.

---

### C3 — T005 Slug Conflict: \`google-gemini-infinite-nature\` vs existing \`gemini-infinite-nature\`

**Affected brief:** T005 (lines 247, 266+, 410)
**Codebase evidence:** \`src/data/projects.ts\` line 47--48: \`id: "gemini-infinite-nature"\`, \`slug: "gemini-infinite-nature"\`.

T005 instructs using slug \`google-gemini-infinite-nature\` (matching the Framer CSV and T001 image download paths). The existing codebase record uses \`gemini-infinite-nature\`. T001 downloads images to \`/public/images/projects/google-gemini-infinite-nature/\`. If T005 changes the slug to \`google-gemini-infinite-nature\`, the existing \`/projects/gemini-infinite-nature\` URL will 404 and any hardcoded references will break. T005 acknowledges the discrepancy but doesn't mandate a redirect.

**Fix:** Add a redirect rule to \`next.config.ts\` for \`/projects/gemini-infinite-nature\` -> \`/projects/google-gemini-infinite-nature\`, OR instruct T001 to use \`/public/images/projects/gemini-infinite-nature/\` to match the existing slug. The brief currently says "Use the Framer CSV slug" but that breaks existing URL. Document the chosen approach explicitly.

---

### C4 — T008 Incorrect Assumption: \`/terms\` and \`/privacy\` routes already exist

**Affected brief:** T008 (lines 662--664)
**Codebase evidence:** \`src/app/terms/\` and \`src/app/privacy/\` both exist (\`page.tsx\` confirmed in each directory).

T008 says: "There are no existing \`/src/app/terms/\` or \`/src/app/privacy/\` directories (confirmed via codebase check). No redirect needed — the old hrefs simply didn't have corresponding pages." This is factually wrong — both directories exist. T008 will need to either remove or redirect these existing routes, not just create new \`/legal/\` pages.

**Fix:** Update T008 to require removing or redirecting the existing \`/src/app/terms/page.tsx\` and \`/src/app/privacy/page.tsx\` routes. Add a step to verify the existing routes and decide: delete them (simplest) or add \`redirect()\` calls to the new \`/legal/terms\` and \`/legal/privacy\` routes.

---

### C5 — T018 Stub Schema Mismatch: \`ProjectSection\` stub has \`type\` field that doesn't exist in T002's schema

**Affected brief:** T018 (lines 116--128)
**T002 schema:** \`ProjectSection\` has \`{ heading: string; headline: string; body: string }\` — no \`type\` field.

The T018 \`projects.ts\` stub includes \`type: "challenge"\` on each section object:
\`\`\`
{ type: "challenge", heading: "...", headline: "...", body: "..." }
\`\`\`
This extra \`type\` field doesn't exist in the \`ProjectSection\` interface defined by T002. TypeScript strict mode will reject this, causing \`npm run build\` to fail after the strip script runs.

**Fix:** Remove the \`type\` field from all three section objects in the T018 \`PROJECTS_STUB\` constant. The stub sections should match T002's interface exactly: \`{ heading, headline, body }\`.

---

### C6 — T018 Stub Schema Mismatch: \`FreeResource\` badge field

**Affected brief:** T018 (lines 183--191)
**T002 schema:** \`badge: ResourceBadge = 'live' | 'coming-soon'\` (simple string) OR per T007's object shape — see C2.

T018's free-resources stub uses \`badge: "live"\` which matches T002's simple string union. However if T007's object shape wins (badge as \`{ text, variant }\`), the T018 stub will also break TypeScript.

**Fix:** Resolve C2 first, then ensure T018 stub matches the settled schema.

---

### C7 — T005/T009 Filter Logic Duplication with Conflicting Scope

**Affected briefs:** T005 (lines 83--101, 335--336), T009 (lines 63--99)
**Detail:** T005 instructs updating the filter logic in \`src/app/projects/page.tsx\` (change \`p.category ===\` to \`p.categories.includes()\`). T009 also instructs the same change to the same file (lines 63--70). Both tasks are in different waves (Wave 2 and Wave 3) and both claim ownership of this change in \`projects/page.tsx\`.

If T005 makes the change in Wave 2, T009 will find nothing to do (or will apply a redundant change). If T005 doesn't fully complete it, T009 won't know what state the file is in. The execution plan assigns them to different waves with T009 depending on T005 — but both briefs list \`projects/page.tsx\` as a file to modify for the same filter logic change.

**Fix:** Explicitly scope T005 to **only** populating project data records in \`projects.ts\`, and move the filter logic update entirely to T009. T005's current brief has a filter logic section (Implementation Guidance, lines 380--405) that should be removed and owned solely by T009. This prevents conflicting edits.

---

### C8 — T015 Navigation Assumption: \`footerNavItems.theLab\` structure differs from brief

**Affected brief:** T015 (lines 87--98)
**Codebase evidence:** \`src/data/navigation.ts\` lines 27--31: \`footerNavItems.theLab\` contains \`[Blog, Playbooks, Free Assets, View All]\`. T015 says it should change \`"View All" href /templates -> /lab\`. The actual "View All" entry exists and does point to \`/templates\` — this part is correct.

However, T015 also says the \`overlayNavItems\` "The Lab" href should change from \`/templates\` to \`/lab\`. The actual \`overlayNavItems\` array has \`The Lab\` children including \`{ label: "Resources", href: "/resources" }\` — not \`{ label: "Free Assets", href: "/free-assets" }\` as described. This is a minor discrepancy but could cause the agent to update the wrong entry or miss an entry.

Additionally, \`footerNavItems.theLab\` has a \`{ label: "Free Assets", href: "/free-assets" }\` entry that does not have a corresponding route — the brief doesn't address this orphaned link.

**Fix:** Update T015 to reflect the actual \`footerNavItems.theLab\` array (4 items, not 3). Remove the navigation description that doesn't match what's in the file. The agent should be told to check the file before editing rather than given a simplified description.

---

## Warnings (should address)

### W1 — T002 Instructs Removing Old BlogCategory Values But They May Still Be Used

**Affected briefs:** T002 (line 94), T006 (line 321--323)
**Detail:** T002 replaces BlogCategory with \`'Creative Philosophy' | 'About Us' | 'Digital Design' | 'Design Strategy' | 'Brand Identity'\`, removing \`"Design" | "AI" | "Process" | "Insights"\`. The existing 3 blog posts in \`blog.ts\` use \`"Design"\`, \`"AI"\`, and \`"Process"\`. T002 also instructs replacing the posts in \`blog.ts\` with the 4 real posts — but T006 shows the expected type still includes the old values \`"Design" | "AI" | "Process" | "Insights"\` in the "Expected BlogPost Type After T002" section (line 321--323). This suggests T006 thinks T002 keeps the old values, but T002 removes them entirely.

**Fix:** T006's "Expected BlogPost Type After T002" section should be updated to show only the new BlogCategory values from T002. The old values should not appear in T006's documentation.

---

### W2 — T019 Component Name Mismatch in Files-to-Modify Table

**Affected brief:** T019 (line 197)
**Detail:** T019's "Files to Modify" table lists \`src/components/home/what-we-do-section.tsx\`. The component function inside that file is \`OurExpertiseSection\` (renamed in a recent commit per the git log: "rename WhatWeDoSection to OurExpertiseSection"). The file path is correct but any instructions that refer to the export name should say \`OurExpertiseSection\`, not \`WhatWeDoSection\`. The brief's body text correctly says \`(now named OurExpertiseSection)\` but the component is imported elsewhere — the agent should verify import sites are correct.

---

### W3 — T015 \`FreeResourcesGrid\` API Assumption May Conflict with T012

**Affected briefs:** T015 (line 125), T012 (lines 107--123)
**Detail:** T015's implementation example shows \`<FreeResourcesGrid resources={freeResources} />\` — passing a \`resources\` prop. T012 defines \`FreeResourcesGrid\` with no props (it imports \`freeResources\` directly from \`@/data/free-resources\`). If T012 ships without a \`resources\` prop, T015's usage will cause a TypeScript error.

T015 does acknowledge this in the edge cases section ("If FreeResourcesGrid doesn't accept a resources prop, check the actual component signature") — but the example code will mislead the agent.

**Fix:** Update T015's example code to match T012's no-prop design: \`<FreeResourcesGrid />\`. The note in edge cases is not sufficient when the primary example is wrong.

---

### W4 — T009 and T010 Both Modify \`project-detail.tsx\` with Overlapping Category Logic

**Affected briefs:** T009 (line 75--79), T010 (line 52--53)
**Detail:** T009 modifies \`project-detail.tsx\` line 54 to change \`{project.category}\` -> joined category labels. T010 also modifies \`project-detail.tsx\` extensively. Both are Wave 3 tasks and both list \`project-detail.tsx\` as a file they touch. T009 makes the category display change, T010 makes the full enriched layout change. If run in parallel (both are Wave 3, run_order: 1), there will be a merge conflict on this file.

**Fix:** T010 should note that \`project-detail.tsx\` also requires the category rendering change from T009, and include T009 as a blocking dependency (run T009 first, then T010). The current execution plan doesn't sequence them — add \`run_order: 1\` for T009 and \`run_order: 2\` for T010 in Wave 3.

---

### W5 — T019 Accesses \`src/data/blog.ts\` Already Claimed by T006

**Affected briefs:** T019 (lines 158--166, 197), T006 (lines 283--287)
**Detail:** T019 says "Update \`src/data/blog.ts\` thumbnail paths — verify or update". T006 already claims ownership of blog.ts and sets thumbnail paths as part of populating the 4 real posts. T019's modification is a verification/correction step but is listed as a file modification, which could create confusion about ownership.

**Fix:** Change T019's action for \`src/data/blog.ts\` from "modify" to "verify only". If paths don't match, the fix should be applied in T006 not T019. This prevents T019 from accidentally overwriting T006's work.

---

### W6 — T001 Missing 4 Blog Thumbnails from Total Count

**Affected brief:** T001 (line 151--166, overall count)
**Detail:** T001's brief claims to download ~75 images. Counting the catalog: 40 project images + 6 homepage images (hero + 4 service + 1 team) + 7 about images + 4 blog thumbnails = 57 unique downloads. The 75 figure from the PRD includes the about BILTFOUR logo SVG and client logos already in \`/public/logos/\`. The script's catalog in T001 only lists 57 images, not 75. The MCP thumbnail (\`6zZWCJwMNLKAwcShUSZbwsO7prA.jpg\`) is listed correctly.

The discrepancy is ~18 images. The success criteria say "~75 images downloaded" but the script will only produce ~57. The PRD count likely includes client logos already present locally.

**Fix:** Clarify in T001 that the ~75 figure includes assets already locally present. The script only needs to download the ~57 framerusercontent.com images. Update the success criteria summary line to say "~57 new images downloaded" to prevent the executing agent from thinking the script failed.

---

### W7 — T011 Doesn't Instruct Updating \`p.category === post.category\` Related Posts Filter

**Affected brief:** T011 (reviewing blog detail page)
**Codebase evidence:** \`src/app/blog/[slug]/page.tsx\` line 53: \`(p) => p.id !== post.id && p.category === post.category\`.

After T002 changes BlogCategory values (removing old values, adding new ones), this filter will still work syntactically but all 3 existing posts with old category values will produce empty related posts arrays until T006 updates their category values. T011 doesn't instruct fixing this filter logic to use the new BlogCategory values.

This is not a crash but a silent functional regression (no related posts shown). T011 should note that this filter requires the T002/T006 BlogCategory migration to be complete before it works correctly.

---

## Observations (nice to know)

### O1 — External Data Source Confirmed: \`OS_our-links\` assets exist at flat path, not subdirectory

**Detail:** The \`OS_our-links\` repo stores images at \`/Users/alexbouhdary/Documents/GitHub.nosync/OS_our-links/public/images/\` (confirmed). T007 correctly identifies this path and notes the alternative subdirectory possibility. All 10 required asset files (9 JPGs + 1 MP4) are present at that flat path. T007's implementation guidance is accurate.

---

### O2 — \`src/lib/\` exists but has no \`mdx.ts\` yet

**Detail:** T011 creates \`src/lib/mdx.ts\`. The directory exists (\`motion.ts\`, \`utils.ts\`, \`tv-channels.ts\` confirmed). No conflict — \`mdx.ts\` is a net-new file.

---

### O3 — \`src/types/index.ts\` Does Not Yet Exist

**Detail:** T002 instructs creating \`src/types/index.ts\` as a barrel export. The current \`src/types/\` directory only has \`blog.ts\` and \`project.ts\`. This is as expected for Wave 1 — no issue.

---

### O4 — \`src/data/\` Has No \`categories.ts\`, \`free-resources.ts\`, or \`playbooks.ts\` Yet

**Detail:** These files don't exist in the codebase (confirmed via directory listing). They are all net-new files created by T009, T007, and T013 respectively. No conflicts.

---

### O5 — \`next.config.ts\` Is Clean (Matches T004's Expected Starting State)

**Detail:** The current \`next.config.ts\` has an empty config object and no \`remotePatterns\`. This exactly matches what T004 describes as the current state. T004's implementation is straightforward.

---

### O6 — \`BlogCard\` Component Exists and Has Correct Props Interface

**Detail:** \`src/components/blog/blog-card.tsx\` exports a \`BlogCard\` component taking \`{ post: BlogPost }\` — matches exactly what T015 expects when building the Lab page. No prop interface mismatch.

---

### O7 — T013 References \`Playbook.featured\` Field But T002 Doesn't Define It

**Detail:** T013's \`playbooks.ts\` data file calls \`playbooks.filter((p) => p.featured)\` but the \`Playbook\` interface in T002 doesn't include a \`featured?: boolean\` field (unlike \`BlogPost\` which has it). This means \`featuredPlaybooks\` will always be empty and TypeScript may warn. Since the array is empty anyway, it won't cause a build failure — but it's worth fixing for consistency.

---

### O8 — \`PixelTransition\` in \`what-we-do-section.tsx\` Uses GSAP

**Detail:** T019 says the component uses \`PixelTransition\` with GSAP crossfade. This is a custom component. The agent will need to read the actual component to understand the \`firstContent\`/\`secondContent\` API. T019's implementation guidance is prescriptive about this pattern — the agent should verify it against the actual component rather than following the brief blindly.

---

## Summary

**Total findings:** 8 Critical, 7 Warnings, 8 Observations

### Critical issues requiring brief corrections before execution:

| ID | Task(s) | Issue | Risk |
|----|---------|-------|------|
| C1 | T006, T011 | \`post.content\` removed by T006 but blog detail page reads it — Wave 2 build break | Build fails |
| C2 | T002, T007, T012 | \`badge\` field type is string in T002, object in T007, string comparison in T012 | TypeScript errors |
| C3 | T001, T005 | Slug \`google-gemini-infinite-nature\` vs existing \`gemini-infinite-nature\` | 404 on existing URL |
| C4 | T008 | Claims \`/terms\` and \`/privacy\` routes don't exist — they do | Missing cleanup step |
| C5 | T018 | Stub \`ProjectSection\` has \`type\` field not in T002 interface | Build fails after strip |
| C6 | T018 | FreeResource stub \`badge\` shape depends on resolution of C2 | Build fails after strip |
| C7 | T005, T009 | Both briefs claim filter logic change in \`projects/page.tsx\` | Double-edit conflict |
| C8 | T015 | \`footerNavItems.theLab\` structure description doesn't match actual nav file | Agent edits wrong entries |

### Priority order for corrections:
1. **C2** (badge schema) — affects T002, T007, T012, T018 in a chain; must be resolved first
2. **C1** (post.content bridge) — affects Wave 2 build stability
3. **C5/C6** (T018 stub fields) — quick fix once C2 is resolved
4. **C4** (T008 \`/terms\` assumption) — adds a missing step
5. **C3** (slug conflict) — needs a product decision on URL strategy
6. **C7** (filter logic ownership) — clarify task scope boundary
7. **C8** (nav description) — update T015 to match actual file`,
  },

  "metrics": {
    language: "json",
    content: `{
  "version": "1.0",
  "prd_slug": "framer-cms-migration",
  "prd_id": "002",
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
  "tasks": {
    "T001": {
      "title": "Write image download script",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 8,
      "status": "done"
    },
    "T002": {
      "title": "Define enriched TypeScript schemas",
      "complexity": 5,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 10,
      "status": "done"
    },
    "T003": {
      "title": "Create content directory structure",
      "complexity": 2,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 5,
      "status": "done"
    },
    "T004": {
      "title": "Update next.config for image optimization",
      "complexity": 3,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 7,
      "status": "done"
    },
    "T005": {
      "title": "Populate all project data",
      "complexity": 7,
      "model": "sonnet",
      "loop_count": 2,
      "escalated": false,
      "duration_minutes": 15,
      "status": "done"
    },
    "T006": {
      "title": "Convert blog posts to MDX",
      "complexity": 5,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 12,
      "status": "done"
    },
    "T007": {
      "title": "Migrate free resources",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 8,
      "status": "done"
    },
    "T008": {
      "title": "Migrate legal pages to MDX",
      "complexity": 3,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 7,
      "status": "done"
    },
    "T009": {
      "title": "Implement category system",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 8,
      "status": "done"
    },
    "T010": {
      "title": "Build project detail page",
      "complexity": 7,
      "model": "sonnet",
      "loop_count": 2,
      "escalated": false,
      "duration_minutes": 14,
      "status": "done"
    },
    "T011": {
      "title": "Build blog MDX renderer",
      "complexity": 5,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 10,
      "status": "done"
    },
    "T012": {
      "title": "Build free resource components",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 8,
      "status": "done"
    },
    "T013": {
      "title": "Scaffold playbook data and routes",
      "complexity": 3,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 6,
      "status": "done"
    },
    "T014": {
      "title": "Update project listing filter",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 8,
      "status": "done"
    },
    "T015": {
      "title": "Build lab page",
      "complexity": 5,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 9,
      "status": "done"
    },
    "T016": {
      "title": "Add SEO metadata generation",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 7,
      "status": "done"
    },
    "T017": {
      "title": "Write content validation script",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 8,
      "status": "done"
    },
    "T018": {
      "title": "Write template stripping script",
      "complexity": 3,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 6,
      "status": "done"
    },
    "T019": {
      "title": "Wire up homepage images",
      "complexity": 3,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 5,
      "status": "done"
    },
    "T020": {
      "title": "Wire up about page images",
      "complexity": 4,
      "model": "sonnet",
      "loop_count": 1,
      "escalated": false,
      "duration_minutes": 7,
      "status": "done"
    }
  },
  "summary": {
    "total_tasks": 20,
    "completed": 20,
    "failed": 0,
    "escalated": 0,
    "total_loops": 22,
    "avg_loops_per_task": 1.1,
    "total_complexity_points": 89,
    "primary_model": "sonnet",
    "escalation_model": "opus"
  }
}`,
  },

  "assets-json": {
    language: "json",
    content: `{
  "version": "1.0",
  "prd_slug": "framer-cms-migration",
  "imported": [],
  "note": "No reference screenshots or mockups were provided during research init. Migration was driven by Framer CMS content inventory in research/findings.md."
}`,
  },

  "research-summary": {
    language: "markdown",
    content: `# Research Summary — Framer CMS Migration
# Project: OS-Portfolio | Date: 2026-04-09
# Status: Post-execution research (all 20 tasks complete)

---

## Overview

This research was conducted **after full execution** of the framer-cms-migration PRD to document the completed migration state and identify remaining optimization opportunities. It combines internal codebase analysis with external best-practices research.

---

## Migration Accomplishments

1. **All content migrated to TypeScript data arrays** — 16 \`src/data/*.ts\` files hold every piece of site content, fully typed. No API calls, no CMS tokens at runtime.

2. **All project images downloaded locally** — 5 projects x 8 images each (40 project images) plus blog, about, homepage, and resource images (~85 files total). \`next.config.ts\` explicitly removes \`framerusercontent.com\` from \`remotePatterns\`.

3. **MDX pipeline established** — \`next-mdx-remote/rsc\` + \`compileMDX\` powers the blog. 4 live posts in \`src/content/blog/\`. No frontmatter — metadata in \`src/data/blog.ts\`.

4. **Static params for all dynamic routes** — \`generateStaticParams\` sourcing from local data arrays for \`/projects/[slug]\`, \`/blog/[slug]\`, \`/playbooks/[slug]\`.

5. **Animation system centralized** — \`src/lib/motion.ts\` provides 20+ variant sets used across 47 components.

6. **Old slug redirect in place** — \`next.config.ts\` redirects \`/projects/gemini-infinite-nature\` -> \`/projects/google-gemini-infinite-nature\`.

---

## Architecture Post-Migration

\`\`\`
Framer CMS (before)          Next.js 16 App Router (now)
-------------------------    ------------------------------
Hosted CMS content     ->     src/data/*.ts (typed arrays)
framerusercontent CDN  ->     public/images/** (local files)
Framer page routing    ->     src/app/**/page.tsx (App Router)
Framer CMS rich text   ->     src/content/**/*.mdx (no frontmatter)
No version control     ->     Git-tracked TypeScript source
\`\`\`

---

## Critical Issues (Must Fix)

| # | Issue | Source | Impact |
|---|---|---|---|
| 1 | \`next-mdx-remote\` archived by HashiCorp | External | No future security patches; migrate to \`next-mdx-remote-client\` |
| 2 | Missing \`public/images/templates/\` directory | Internal | 4 broken image refs on \`/templates\` page |
| 3 | Blog card/post images commented out | Internal | Thumbnails exist but are not rendered |
| 4 | \`/resources\` nav link -> 404 | Internal | Dead link in overlay menu (should be \`/free-assets\`) |

---

## Optimization Opportunities

| # | Opportunity | Priority | Source |
|---|---|---|---|
| 1 | Add \`dynamicParams = false\` to slug routes | Medium | External |
| 2 | Add \`priority\` prop to LCP hero images | Medium | External |
| 3 | Add JSON-LD structured data (Article, CreativeWork, Organization) | Medium | External |
| 4 | Increase \`minimumCacheTTL\` from 60s to 14400s | Low | External |
| 5 | Plan \`framer-motion\` -> \`motion/react\` migration | Low | External |
| 6 | Use \`LazyMotion\` to reduce initial JS by ~30 kB | Low | External |
| 7 | Add \`blurDataURL\` to about page hero (7008x4672px) | Low | External |
| 8 | Expand sitemap to include \`/free-assets\` and \`/playbooks\` | Low | External |
| 9 | Wire up contact + newsletter form submission | Medium | Internal |
| 10 | Move 11 inline interfaces to \`src/types/\` for consistency | Low | Internal |

---

## Dependency Highlights

| Package | Version | Note |
|---|---|---|
| \`next\` | 16.2.1 | App Router, \`generateStaticParams\`, Image (AVIF/WebP) |
| \`framer-motion\` | ^12.38.0 | 47 files; canonical package now \`motion\` |
| \`next-mdx-remote\` | ^6.0.0 | **ARCHIVED** — migrate to \`next-mdx-remote-client\` |
| \`three\` + fiber + drei | ^0.183.2 | CRT TV 3D scene |
| \`gsap\` | ^3.14.2 | Present but secondary to framer-motion |

---

## Post-Migration File Counts

| Category | Count |
|---|---|
| Data files | 16 |
| Type definition files | 4 (+11 inline) |
| MDX content files | 6 (4 blog + 2 legal) |
| Route pages | 18 |
| Dynamic route segments | 3 |
| Public images | ~85 files |
| Components using framer-motion | 47 |
| Animation variant sets | 20+ |

---

## Research Artifacts

### Internal Research
- [patterns.md](./internal/patterns.md) — 7 pattern categories with code samples
- [errors.md](./internal/errors.md) — 7 error/gap categories
- [dependencies.md](./internal/dependencies.md) — NPM deps, type graph, utility map
- [structure.md](./internal/structure.md) — Full directory trees
- [findings.md](./internal/findings.md) — Consolidated internal summary

### External Research
- [best-practices.md](./external/best-practices.md) — Next.js 16, MDX, image optimization, SEO
- [libraries.md](./external/libraries.md) — Library evaluations and alternatives
- [references.md](./external/references.md) — 60+ curated links
- [sources.yaml](./external/sources.yaml) — Source attribution
- [findings.md](./external/findings.md) — Consolidated external summary

### Legacy
- [findings.md](./findings.md) — Original pre-execution research (content inventory, gap analysis, image catalog)`,
  },

  "research-findings": {
    language: "markdown",
    content: `# Research Findings: Framer CMS Migration

## Executive Summary

Migration of opensession.co Framer CMS content into the existing Next.js portfolio codebase. The codebase already has CMS-ready TypeScript data structures — the main work is enriching data types, downloading assets, and populating content.

---

## 1. Framer CMS Content Inventory

### Projects (5 total)

| Project | Client | Year | Category | Images |
|---------|--------|------|----------|--------|
| Iterra | Iterra | 2025 | Brand Identity & Guidelines | 8 (1 hero SVG + 7 gallery JPG) |
| BILTFOUR | BILTFOUR | 2024-2025 | Brand Identity, E-commerce, Community | 8 (1 hero SVG + 7 gallery JPG) |
| NEXT | Google Cloud | 2023-2024 | Demo Design System, UX Strategy | 8 (1 hero SVG + 7 gallery JPG) |
| Infinite Nature | Google Cloud | 2023-2024 | UX/UI, Art Direction, Design System | 8 (1 hero SVG + 7 gallery JPG) |
| Universal Audio | Universal Audio | 2022-present | Visual Design, Campaign Creative | 8 (1 hero SVG + 6 gallery JPG + 1 GIF) |

**Each project includes:**
- Title, client, year, category/services
- Description (full paragraph)
- 3 structured sections: Challenge, Solution, Impact (each with heading + body)
- Gallery images (hero + 4 challenge/solution + 3 impact mockups)
- Testimonials (optional — Iterra has one)
- Results/metrics (optional — BILTFOUR, NEXT, UA have them)

### Blog Posts (4 total)

| Title | Category | Date | Reading Time |
|-------|----------|------|-------------|
| EP02: Creative AI Framework | Creative Philosophy | Feb 3, 2026 | 5 min |
| EP01: Creativity over Compute | Creative Philosophy | Jan 20, 2026 | 6 min |
| Democratizing Fortune 500 Design | About Us | Sep 13, 2025 | 7 min |
| MCP for Designers | Digital Design | Sep 12, 2025 | 5 min |

### Team Members (2)

| Name | Role | Has Photo |
|------|------|-----------|
| Karim Bouhdary | Head of Design | Yes (webp) |
| Morgan MacKean | Chief Creative Officer | Yes (webp) |

### Client Logos (8 SVGs)

Google Cloud, Fitbit, SAP, Iterra, Universal Audio, BILTFOUR, Salesforce, Jalapajar

### Site-Wide Images

- **Homepage**: Hero image, 5 project thumbnail SVGs, 4 service images (JPG), 3 blog thumbnails (JPG), team photo (JPG)
- **About page**: Main hero (7008x4672 JPG), team photos, 4 team story images, client logos
- **Favicon**: PNG from framerusercontent

---

## 2. Current Codebase Architecture

### Data Storage: TypeScript Constants in \`/src/data/\`

| File | Content | Count |
|------|---------|-------|
| \`projects.ts\` | Project objects | 5 |
| \`blog.ts\` | Blog posts with markdown | 3 |
| \`team.ts\` | Team members | 2 |
| \`clients.ts\` | Client logos | 8 |
| \`tools.ts\` | Tool logos | 16 |
| \`services.ts\` | Service offerings | 4 |
| \`faq.ts\` | FAQ pairs | varies |
| \`process.ts\` | Process steps | 4 |
| \`values.ts\` | Company values | 4 |
| \`stats.ts\` | Metrics | 4 |
| \`what-we-do.ts\` | Service categories | 5 |
| \`templates.ts\` | Template metadata | varies |
| \`navigation.ts\` | Nav items + social | varies |

### Type Definitions in \`/src/types/\`

**Current Project type:**
\`\`\`typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory; // "Brand Identity" | "Digital Design" | "Art Direction" | "Strategy"
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
}
\`\`\`

**Current BlogPost type:**
\`\`\`typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // embedded markdown
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}
\`\`\`

### Image Handling

- Images referenced as paths in data objects (e.g., \`/images/projects/iterra-thumb.jpg\`)
- Using \`next/image\` with fill-based layout + sizes prop
- **Many image directories are empty** — placeholder gradients used instead
- No external domain allowlisting in \`next.config.ts\`
- Client/tool logos stored as SVGs in \`/public/logos/\`

### Routing

- \`/projects\` — Listing with filtering by category
- \`/projects/[slug]\` — Detail pages via \`generateStaticParams()\`
- \`/blog\` — Listing with featured section
- \`/blog/[slug]\` — Detail pages via \`generateStaticParams()\`
- Static generation — all routes pre-rendered at build time

---

## 3. Gap Analysis: Framer vs Codebase

### Data Gaps (Framer has, codebase lacks)

| Field | Framer | Codebase |
|-------|--------|----------|
| Project sections (Challenge/Solution/Impact) | Full structured content | Not in type |
| Project gallery images (7-8 per project) | Full URLs | Empty directories |
| Project testimonials | Optional per project | Not in type |
| Project results/metrics | Optional per project | Not in type |
| Project services list | Per project | Not in type |
| Blog post #4 (MCP for Designers) | Exists | Missing |
| Blog category "Creative Philosophy" | Used | Not in BlogCategory union |
| Blog category "About Us" | Used | Not in BlogCategory union |
| Blog category "Digital Design" | Used | Not in BlogCategory union |
| About page team story images | 4 images | Not present |
| Service page images | 4 images | Not present |
| Homepage hero image | framerusercontent | Not downloaded |

### Category Mismatch

**Framer project categories** (multi-tag, comma-separated):
- "Brand Identity & Guidelines"
- "Brand Identity, E-commerce, Community Building"
- "Demo Design System, UX Strategy, Experience Design"
- "UX/UI, Art Direction, Design System"
- "Visual Design, Campaign Creative, Product Launches"

**Codebase project categories** (single enum):
- "Brand Identity" | "Digital Design" | "Art Direction" | "Strategy"

**Decision needed:** Keep simplified categories or migrate to multi-tag system?

---

## 4. Image Asset Catalog

### Total Unique Images to Download: ~75

**Project Images (40):** 5 projects x ~8 images each
- Hero SVGs (5) — project thumbnail/cover
- Gallery JPGs (~30) — case study images
- GIF (1) — Universal Audio mockup

**Homepage Images (12):**
- Hero image (1 PNG)
- Service images (4 JPG)
- Blog thumbnails (3 JPG)
- Team photo (1 JPG)
- Client logos already exist locally as SVG

**About Page Images (9):**
- Main hero (1 JPG, 7008x4672 — needs optimization)
- Team photos (2)
- Team story images (4)
- BILTFOUR logo SVG (1, new — not in current logos)

**Blog Thumbnails (4 JPG)**

### Image Source: \`framerusercontent.com\`

All images hosted on Framer's CDN with URL pattern:
\`\`\`
https://framerusercontent.com/images/{hash}.{ext}?width={w}&height={h}
\`\`\`

Width/height params are for CDN resizing — download without params for originals.

---

## 5. Recommended Migration Approach

### Option A: Static Download (Recommended)

1. **Download all images** from framerusercontent to \`/public/images/\`
2. **Enrich TypeScript types** to include sections, gallery, testimonials, results
3. **Update data files** with full Framer content
4. **Update components** to render richer data (case study sections, image galleries)

**Pros:** No external dependencies, fastest load times, full control
**Cons:** Manual update process for future changes

### Option B: Framer CMS API (If MCP connected)

1. **Pull CMS collections** via Framer MCP
2. **Generate TypeScript data** from CMS response
3. **Download images** to public/ or use external domain allowlisting

**Pros:** Automated sync possible
**Cons:** Framer MCP not currently connected; adds dependency

### Option C: Hybrid (Keep framerusercontent URLs)

1. **Allowlist framerusercontent.com** in next.config.ts
2. **Reference images directly** from Framer CDN
3. **Update data + types** as in Option A

**Pros:** No download step, always up to date
**Cons:** External dependency, slower loads, CDN could change

### Recommendation: Option A

Static download gives full control, best performance, and matches the existing pattern. The content doesn't change frequently enough to justify a live CMS connection.

---

## 6. Proposed Type Enrichments

\`\`\`typescript
interface ProjectSection {
  heading: string;
  body: string;
}

interface ProjectImage {
  src: string;
  alt: string;
  context: "hero" | "gallery" | "mockup";
}

interface Project {
  // existing fields...
  services: string[];
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: { quote: string; author: string }[];
  results?: string[];
}
\`\`\`

---

## 7. Framer Image URLs (Full Catalog)

### Iterra
- Hero: \`framerusercontent.com/images/vvl6xyIdUMskDBgstfyClKSxE8.svg\`
- Gallery: \`i8dim26bhvu5qQR9wg3QosYwH30.jpg\`, \`dNN6V4QOZliCydifbZq9mZHgs.jpg\`, \`4iGWtlK9qyEQGR3kn226neLeOx0.jpg\`, \`8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg\`
- Mockups: \`ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg\`, \`iKQP3E2D7UXucYJbubSRc3A7I.jpg\`, \`oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg\`

### BILTFOUR
- Hero: \`framerusercontent.com/images/ZwDzuAZjuENRwaTtArVGJQsGc.svg\`
- Gallery: \`sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg\`, \`pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg\`, \`fQNXA7iFcdLekr5tbHmESnMDE.jpg\`, \`5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg\`
- Mockups: \`VWj6qlkvnLdlyTExZDWZiezC104.jpg\`, \`rPlUBgrbosziZBcZfJfPe8sIHA.jpg\`, \`WUB4oauOJh26lOozw9rKdgUYRk.jpg\`

### NEXT (Google Cloud)
- Hero: \`framerusercontent.com/images/zwWkHCt1g0HSk5r9elbNigK55dk.svg\`
- Gallery: \`EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg\`, \`Zcgxim04ZIbn7CooJkyUahMgtU.jpg\`, \`vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg\`, \`Y1GhTfRUj1WegONQQcS7bRybV8I.jpg\`
- Mockups: \`TVWePxkVuYJ2ynKwvW8na7Gz8.jpg\`, \`1PeraZj4rwCBVywk3sEvPzcRvYw.jpg\`, \`kdIwpWfuzthCYLWztP0haNTzq0.jpg\`

### Infinite Nature (Google Gemini)
- Hero: \`framerusercontent.com/images/enyu0AxPncALYsOKGqBz5dcGo.svg\`
- Gallery: \`0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg\`, \`akEhFihTl9pdmzuHDf5W4UluIjA.jpg\`, \`q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg\`, \`69we6OfP9rfNdtqOohJDJYMYcC4.jpg\`
- Mockups: \`ZWM3jBNXCq5MI740NZoGE0owGx4.jpg\`, \`FhgyvB0QzTK3QC0aY40xLmw4K8.jpg\`, \`fEgHnqjSmKjGa0On2DRyNU9HTo.jpg\`

### Universal Audio
- Hero: \`framerusercontent.com/images/Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg\`
- Gallery: \`5rY7sMJWPqahP45iscJTiYEOw.jpg\`, \`gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg\`, \`VKLBL93wfWhPj6VObEt1a4HlEA.jpg\`, \`2MalmzAFsqsCILwoPC2A6s6Hs.jpg\`
- Mockups: \`UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif\`, \`CJC7mcxaL9DGEYB4HGificxTbA.jpg\`, \`PWbwliRrvDvOr6Iw28xulNrFSc.jpg\`

### Homepage
- Hero: \`5tYWjZYwckbQWoi9rQ9mkhAoLG8.png\`
- Services: \`CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg\`, \`Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg\`, \`XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg\`, \`p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg\`
- Team: \`nQ5h9VMZNz5knXmzATISCBWqakc.jpg\`
- Blog thumbs: \`KKSflaBzLhQtCCknGCHsQqbqU2s.jpg\`, \`dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg\`, \`c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg\`

### About Page
- Hero: \`Sj4TYZrc68BDHPXs5O5D19mVik.jpg\` (7008x4672)
- Team: \`HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg\`, \`Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp\`
- Story images: \`TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg\`, \`wKJt8b9CgcZCyP5NKky2RDcdQ.jpg\`, \`hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg\`, \`qvzOeu5vdocdhOTq2yANNjMg0.jpg\`

### Blog Thumbnails
- EP02: \`KKSflaBzLhQtCCknGCHsQqbqU2s.jpg\`
- EP01: \`dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg\`
- Democratizing: \`c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg\`
- MCP Guide: \`6zZWCJwMNLKAwcShUSZbwsO7prA.jpg\`

### Client Logos (SVGs)
- Google Cloud: \`Lx8koBJOgiYp5zwEsfuox8FaaU.svg\`
- Fitbit: \`onjgBMqUJiYIWz4owgwIg988Dwo.svg\`
- Google (alt): \`uKBT4E9GTqDuY4zCTomIHK1zeQ.svg\`
- Iterra: \`ydfYD7UbY2ClV75a1Klgwg9CcI.svg\`
- BILTFOUR: \`b2QgKdGpeKLVkmcCq7hadnYA.svg\`
- SAP: \`U7vHh8rm5p3Sb3XpnaZ3jU4rzk.svg\`
- Universal Audio: \`I5kNOlJYn3GNBcvpUALAUoHSkw.svg\`
- Salesforce: \`V9vpY3UkjxrIrwuS63gykG4RC4.svg\`
- BILTFOUR (about): \`TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg\``,
  },

  "research-meta": {
    language: "json",
    content: `{
  "prd_slug": "framer-cms-migration",
  "prd_id": "002",
  "research_date": "2026-04-09",
  "research_mode": "prd-scoped",
  "status": "complete",
  "phases": {
    "internal": {
      "status": "complete",
      "files": [
        "internal/patterns.md",
        "internal/errors.md",
        "internal/dependencies.md",
        "internal/structure.md",
        "internal/findings.md"
      ],
      "patterns_discovered": 7,
      "errors_identified": 7,
      "dependencies_mapped": 20
    },
    "external": {
      "status": "complete",
      "files": [
        "external/best-practices.md",
        "external/libraries.md",
        "external/references.md",
        "external/sources.yaml",
        "external/findings.md"
      ],
      "best_practices": 6,
      "libraries_evaluated": 5,
      "references_collected": 60
    }
  },
  "summary_file": "summary.md",
  "legacy_findings": "findings.md",
  "context": "Post-execution research conducted after all 20 tasks complete. Documents final migration state and identifies optimization opportunities."
}`,
  },

  "internal-structure": {
    language: "markdown",
    content: `# structure.md — Post-Migration Directory & Route Structure
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. src/data/ — Full Tree

\`\`\`
src/data/
├-- blog.ts            BlogPost[] (4 posts)
├-- categories.ts      Category slugs + labels + categoryLabel()
├-- clients.ts         Client[] (8 clients)
├-- faq.ts             FAQItem[] (5 items)
├-- free-resources.ts  FreeResource[] (5 resources)
├-- navigation.ts      NavItem[], SocialLink[], contactEmails, statusLines
├-- playbooks.ts       Playbook[] (empty — 0 items)
├-- process.ts         ProcessStep[] (4 steps)
├-- projects.ts        Project[] (5 projects) + featuredProjects
├-- services.ts        Service[] (4 services)
├-- stats.ts           Stat[] (4 stats)
├-- team.ts            TeamMember[] (1 in team) + showcase[] (2) + storyImages[]
├-- templates.ts       Template[] (4 templates — images missing)
├-- tools.ts           Tool[] (16 tools)
├-- values.ts          Value[] (4 values)
└-- what-we-do.ts      WhatWeDoItem[] (5 items)
\`\`\`

---

## 2. src/types/ — Full Tree

\`\`\`
src/types/
├-- index.ts           Barrel — re-exports all 4 type modules
├-- blog.ts            BlogPost, BlogCategory, blogCategories[]
├-- free-resources.ts  FreeResource, ResourceBadge, ResourceMedia
├-- playbook.ts        Playbook
└-- project.ts         Project, ProjectSection, ProjectImage, ProjectTestimonial, ViewMode
\`\`\`

Note: 11 additional interfaces (TeamMember, NavItem, Client, Stat, etc.) are defined inline in their data files.

---

## 3. src/content/ — Full Tree

\`\`\`
src/content/
├-- blog/
│   ├-- .gitkeep
│   ├-- README.md
│   ├-- democratizing-fortune-500-design.mdx
│   ├-- ep01-creativity-over-compute.mdx
│   ├-- ep02-creative-ai-framework.mdx
│   └-- mcp-for-designers.mdx
├-- legal/
│   ├-- .gitkeep
│   ├-- privacy.mdx
│   └-- terms.mdx
└-- playbooks/
    ├-- .gitkeep
    └-- README.md            (stub — no MDX content yet)
\`\`\`

---

## 4. public/images/ — Full Tree

\`\`\`
public/images/
├-- about/
│   ├-- HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg     (Karim team photo)
│   ├-- Sj4TYZrc68BDHPXs5O5D19mVik.jpg       (hero — 7008x4672)
│   ├-- TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg
│   ├-- TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg
│   ├-- Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp     (Morgan team photo)
│   ├-- hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg
│   ├-- qvzOeu5vdocdhOTq2yANNjMg0.jpg
│   └-- wKJt8b9CgcZCyP5NKky2RDcdQ.jpg
├-- blog/
│   ├-- 6zZWCJwMNLKAwcShUSZbwsO7prA.jpg      (mcp-for-designers)
│   ├-- KKSflaBzLhQtCCknGCHsQqbqU2s.jpg      (ep02)
│   ├-- c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg      (fortune-500)
│   └-- dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg       (ep01)
├-- homepage/
│   ├-- 5tYWjZYwckbQWoi9rQ9mkhAoLG8.png      (hero)
│   ├-- CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg      (brand identity)
│   ├-- Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg      (design systems)
│   ├-- XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg      (content strategy)
│   ├-- nQ5h9VMZNz5knXmzATISCBWqakc.jpg      (context optimization)
│   └-- p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg       (creative AI)
├-- projects/
│   ├-- biltfour/              (8 files: 7x.jpg + 1x.svg hero)
│   ├-- google-cloud-next/     (8 files: 7x.jpg + 1x.svg hero)
│   ├-- google-gemini-infinite-nature/  (8 files: 7x.jpg + 1x.svg hero)
│   ├-- iterra/                (8 files: 7x.jpg + 1x.svg hero)
│   └-- universal-audio/       (8 files: 6x.jpg + 1x.svg + 1x.gif)
├-- resources/
│   ├-- brand-design-system-01.jpg
│   ├-- brand-design-system-02.jpg
│   ├-- design-directory-01.mp4
│   ├-- design-directory-02.jpg
│   ├-- karimo-01.jpg
│   ├-- karimo-02.jpg
│   ├-- linktree-template-01.jpg
│   ├-- linktree-template-02.jpg
│   ├-- portfolio-01.jpg
│   └-- portfolio-02.jpg
└-- team/
    ├-- karim.webp
    └-- morgan.webp
\`\`\`

**Missing directory:** \`public/images/templates/\` does not exist (4 broken refs in \`src/data/templates.ts\`).

---

## 5. Route Structure Under src/app/

\`\`\`
src/app/
├-- favicon.ico
├-- globals.css
├-- layout.tsx             Root layout — ThemeProvider, Header, Footer, PageLoader, SkipLink
├-- loading.tsx            Global loading UI
├-- not-found.tsx          404 page
├-- page.tsx               / (home)
├-- template.tsx           Global page transition wrapper (framer-motion)
├-- robots.ts              robots.txt generation
├-- sitemap.ts             sitemap.xml generation
│
├-- about/page.tsx
├-- blog/
│   ├-- loading.tsx
│   ├-- page.tsx           /blog — BlogGrid with all posts
│   └-- [slug]/page.tsx    /blog/:slug — MDX blog post
├-- contact/page.tsx
├-- free-assets/page.tsx   /free-assets — FreeResourcesGrid
├-- lab/page.tsx           /lab — LabHero + resources + blog + playbooks
├-- legal/
│   ├-- layout.tsx         Legal layout (max-w-3xl, back link)
│   ├-- privacy/page.tsx   /legal/privacy — MDX via MDXRemote
│   └-- terms/page.tsx     /legal/terms — MDX via MDXRemote
├-- playbooks/
│   ├-- page.tsx           /playbooks — empty state
│   └-- [slug]/page.tsx    /playbooks/:slug — stub
├-- privacy/page.tsx       redirect -> /legal/privacy
├-- projects/
│   ├-- layout.tsx
│   ├-- loading.tsx
│   ├-- page.tsx           /projects — carousel + grid + filter
│   └-- [slug]/page.tsx    /projects/:slug — scroll-driven ProjectDetail
├-- templates/page.tsx
└-- terms/page.tsx         redirect -> /legal/terms
\`\`\`

---

## 6. Overall src/ Organization Post-Migration

\`\`\`
src/
├-- app/           Next.js App Router pages + layouts (18 routes, 3 dynamic)
├-- components/
│   ├-- about/     AboutHero, TeamSection, TeamShowcase, ValuesSection
│   ├-- backgrounds/ FaultyTerminal (WebGL glitch effect)
│   ├-- blog/      BlogCard, BlogGrid, BlogPost, MDXComponents
│   ├-- contact/   ContactHero
│   ├-- home/      14 section components (Hero, ImpactSection, FeaturedWork, etc.)
│   ├-- lab/       LabHero
│   ├-- layout/    Footer, Header, Logo, OverlayMenu, PageTransition, ThemeToggle
│   ├-- projects/  11 project components (Card, Carousel, Detail, Filters, Grid, etc.)
│   ├-- providers/ ThemeProvider
│   ├-- resources/ FreeResourceCard, FreeResourcesGrid
│   ├-- shared/    14 reusable components (Button, ScrollReveal, SectionLabel, etc.)
│   ├-- three/     CRTScreenMaterial, CRTTVModel, CRTTVScene
│   ├-- ui/        DotPattern
│   └-- uui/       Full Untitled UI component library
├-- content/       MDX content (blog, legal, playbooks)
├-- data/          16 TypeScript data files (the migrated CMS content)
├-- hooks/         10 custom hooks
├-- lib/           mdx.ts, motion.ts, tv-channels.ts, utils.ts
├-- styles/        theme.css
├-- types/         4 type definition files + barrel index
└-- utils/         cx.ts, dev-props.ts, is-react-component.ts
\`\`\``,
  },

  "internal-deps": {
    language: "markdown",
    content: `# dependencies.md — Dependency Map
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. Key NPM Dependencies

### Production

| Package | Version | Role |
|---|---|---|
| \`next\` | 16.2.1 | Framework — App Router, ISR, Image optimization |
| \`react\` / \`react-dom\` | 19.2.4 | UI runtime |
| \`framer-motion\` | ^12.38.0 | Animations — variants, scroll, spring, layout |
| \`next-mdx-remote\` | ^6.0.0 | MDX compilation for blog + legal pages |
| \`gsap\` | ^3.14.2 | Available but used only in specific components (text scramble, faulty terminal) |
| \`three\` | ^0.183.2 | 3D CRT TV scene on home/lab pages |
| \`@react-three/fiber\` | ^9.5.0 | React bindings for Three.js |
| \`@react-three/drei\` | ^10.7.7 | Three.js helpers (OrbitControls, environment maps) |
| \`ogl\` | ^1.0.11 | Lightweight WebGL (lab/backgrounds) |
| \`clsx\` | ^2.1.1 | Conditional class names |
| \`tailwind-merge\` | ^3.5.0 | Tailwind class deduplication |
| \`@untitledui/icons\` | ^0.0.22 | Icon set (line icons) |
| \`@untitledui-pro/icons\` | ^0.0.3 | Pro icon set (ArrowLeft, ArrowRight, ArrowUpRight) |
| \`react-aria\` / \`react-aria-components\` | ^3.47.0 / ^1.16.0 | Accessible form primitives |
| \`react-powerglitch\` | ^1.1.0 | Glitch effect (faulty terminal background) |
| \`input-otp\` | ^1.4.2 | OTP input (uui component library) |
| \`@react-stately/utils\` | ^3.11.0 | React Aria state management |

### Dev

| Package | Version | Role |
|---|---|---|
| \`tailwindcss\` | ^4 | CSS framework (v4) |
| \`@tailwindcss/postcss\` | ^4 | PostCSS plugin for TW v4 |
| \`typescript\` | ^5 | Type checking |
| \`eslint\` / \`eslint-config-next\` | ^9 / 16.2.1 | Linting |

---

## 2. Cross-File Type Dependencies

### Types imported from \`src/types/\`

\`\`\`
src/types/project.ts
  ← src/data/projects.ts
  ← src/components/projects/project-detail.tsx
  ← src/components/projects/project-card.tsx
  ← src/components/projects/project-carousel.tsx
  ← src/components/projects/project-grid.tsx
  ← src/components/home/featured-work.tsx
  ← src/app/projects/[slug]/page.tsx

src/types/blog.ts
  ← src/data/blog.ts
  ← src/components/blog/blog-card.tsx
  ← src/components/blog/blog-post.tsx
  ← src/components/blog/blog-grid.tsx
  ← src/app/blog/[slug]/page.tsx
  ← src/app/blog/page.tsx

src/types/playbook.ts
  ← src/data/playbooks.ts
  ← src/app/playbooks/[slug]/page.tsx
  ← src/app/playbooks/page.tsx

src/types/free-resources.ts
  ← src/data/free-resources.ts
  ← src/components/resources/free-resource-card.tsx
  ← src/components/resources/free-resources-grid.tsx
\`\`\`

### Types imported from data files (not re-exported via index.ts)

\`\`\`
src/data/categories.ts  (Category, CATEGORY_SLUGS, categoryLabel)
  ← src/components/projects/project-card.tsx
  ← src/components/projects/project-filters.tsx
\`\`\`

---

## 3. Shared Utilities

### \`src/lib/motion.ts\`
Imported by ~47 components. Key exports:
- \`fadeInUp\`, \`staggerContainer\` — most common pair
- \`imageHover\` — blog-card.tsx
- \`pageVariants\` — page-transition.tsx (global via template.tsx)
- \`smoothTransition\`, \`springTransition\` — carousel, accordion
- \`accordionContent\` — faq-accordion.tsx
- \`overlayFullscreen\`, \`overlayColumn\`, \`overlayNavItem\`, \`menuTriggerText\` — overlay-menu.tsx

### \`src/lib/utils.ts\`
\`\`\`ts
cn()            // clsx + tailwind-merge — ~30+ components
formatDate()    // blog-card.tsx, blog-post.tsx
formatNumber()  // stats-counter.tsx
slugify()       // available but unused
truncate()      // available but unused
getReadingTime() // available but unused
\`\`\`

### \`src/lib/mdx.ts\`
\`\`\`ts
getMdxContent()  // blog/[slug]/page.tsx only
\`\`\`
(Legal pages use \`readFileSync\` directly, bypassing this utility.)

### \`src/utils/dev-props.ts\`
Used by every main UI component for \`data-component\` debug attributes.

### \`src/utils/cx.ts\`
Separate cx utility used within \`src/components/uui/\` component library only.

---

## 4. Content File -> Component Dependencies

\`\`\`
src/data/projects.ts
  -> src/components/projects/project-card.tsx
  -> src/components/projects/project-detail.tsx
  -> src/components/home/featured-work.tsx
  -> src/app/projects/page.tsx
  -> src/app/projects/[slug]/page.tsx
  -> src/app/sitemap.ts

src/data/blog.ts
  -> src/components/blog/blog-card.tsx
  -> src/components/blog/blog-post.tsx
  -> src/components/blog/blog-grid.tsx
  -> src/app/blog/page.tsx
  -> src/app/blog/[slug]/page.tsx
  -> src/app/lab/page.tsx
  -> src/app/sitemap.ts

src/data/free-resources.ts
  -> src/components/resources/free-resource-card.tsx
  -> src/components/resources/free-resources-grid.tsx
  -> src/app/free-assets/page.tsx
  -> src/app/lab/page.tsx

src/data/playbooks.ts
  -> src/app/playbooks/page.tsx
  -> src/app/playbooks/[slug]/page.tsx
  -> src/app/lab/page.tsx

src/data/navigation.ts
  -> src/components/layout/header.tsx
  -> src/components/layout/footer.tsx
  -> src/components/layout/overlay-menu.tsx

src/data/clients.ts -> src/components/home/logo-marquee.tsx
src/data/what-we-do.ts -> src/components/home/what-we-do-section.tsx
src/data/stats.ts -> src/components/home/stats-counter.tsx
src/data/team.ts -> src/components/about/team-showcase.tsx, team-section.tsx
src/data/faq.ts -> src/components/home/faq-section.tsx
src/data/services.ts -> src/components/home/services-section.tsx
src/data/values.ts -> src/components/about/values-section.tsx
src/data/process.ts -> src/components/home/process-section.tsx
src/data/tools.ts -> src/components/home/impact-section.tsx

src/content/blog/*.mdx -> src/lib/mdx.ts -> src/app/blog/[slug]/page.tsx
src/content/legal/*.mdx -> src/app/legal/*/page.tsx (readFileSync)
\`\`\``,
  },

  "internal-patterns": {
    language: "markdown",
    content: `# patterns.md — Post-Migration Code Patterns
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. Data Storage Patterns

All content is stored as **typed TypeScript arrays** in \`src/data/*.ts\` files. There is no database, no CMS API call at runtime, and no remote fetch. Every data file begins with a \`// TEMPLATE: replace with your content\` comment, indicating it was scaffolded during migration from Framer CMS.

### Pattern: Static TypeScript Arrays

**File:** \`src/data/projects.ts\`
\`\`\`ts
// TEMPLATE: replace with your content
import { Project } from "@/types/project";

export const projects: Project[] = [ ... ];
export const featuredProjects = projects.filter((p) => p.featured);
\`\`\`

Every data module follows the same structure:
- Import the relevant interface from \`src/types/\`
- Export a named const array (e.g. \`projects\`, \`blogPosts\`, \`freeResources\`, \`playbooks\`)
- Optionally export derived filtered arrays (\`featuredProjects\`, \`featuredBlogPosts\`)

### Inventory of Data Files

| File | Export | Type |
|---|---|---|
| \`src/data/projects.ts\` | \`projects\`, \`featuredProjects\` | \`Project[]\` |
| \`src/data/blog.ts\` | \`blogPosts\`, \`featuredBlogPosts\` | \`BlogPost[]\` |
| \`src/data/playbooks.ts\` | \`playbooks\`, \`featuredPlaybooks\` | \`Playbook[]\` (empty) |
| \`src/data/free-resources.ts\` | \`freeResources\` | \`FreeResource[]\` |
| \`src/data/categories.ts\` | \`CATEGORY_SLUGS\`, \`CATEGORY_LABELS\`, \`categoryLabel()\` | \`Category\` const |
| \`src/data/clients.ts\` | \`clients\` | \`Client[]\` |
| \`src/data/faq.ts\` | \`faqItems\` | \`FAQItem[]\` |
| \`src/data/navigation.ts\` | \`mainNavItems\`, \`footerNavItems\`, \`overlayNavItems\`, \`socialLinks\`, \`contactEmails\`, \`statusLines\` | \`NavItem[]\` etc. |
| \`src/data/process.ts\` | \`processSteps\` | \`ProcessStep[]\` |
| \`src/data/services.ts\` | \`services\` | \`Service[]\` |
| \`src/data/stats.ts\` | \`stats\` | \`Stat[]\` |
| \`src/data/team.ts\` | \`team\`, \`showcase\`, \`storyImages\` | \`TeamMember[]\` |
| \`src/data/templates.ts\` | \`templates\` | \`Template[]\` |
| \`src/data/tools.ts\` | \`tools\` | \`Tool[]\` |
| \`src/data/values.ts\` | \`values\` | \`Value[]\` |
| \`src/data/what-we-do.ts\` | \`whatWeDoItems\` | \`WhatWeDoItem[]\` |

---

## 2. Type Definition Patterns

All types live in \`src/types/\` and are re-exported via a barrel file.

**Barrel:** \`src/types/index.ts\`
\`\`\`ts
export * from './project';
export * from './blog';
export * from './playbook';
export * from './free-resources';
\`\`\`

### Project types (\`src/types/project.ts\`)
\`\`\`ts
export interface ProjectSection {
  heading: string;     // e.g. "The Challenge"
  headline: string;    // Bold intro sentence
  body: string;        // Full paragraph
}

export interface ProjectImage {
  src: string;         // e.g. /images/projects/iterra/filename.jpg
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  categories: string[];   // replaces single category enum from Framer
  services: string[];
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}

export type ViewMode = "carousel" | "two-column" | "grid";
\`\`\`

### Blog types (\`src/types/blog.ts\`)
\`BlogPost\` interface + \`BlogCategory\` union + \`blogCategories\` const array.

### Free resource types (\`src/types/free-resources.ts\`)
\`\`\`ts
export type ResourceBadge = 'live' | 'coming-soon';
export interface ResourceMedia { type: 'image' | 'video'; src: string; }
export interface FreeResource { id, badge, media, hoverImage?, title, description, href, buttonLabel }
\`\`\`

### Supporting types defined inline in data files
- \`TeamMember\` — in \`src/data/team.ts\`
- \`NavItem\`, \`SocialLink\` — in \`src/data/navigation.ts\`
- \`Client\`, \`Stat\`, \`Service\`, \`FAQItem\`, \`ProcessStep\`, \`Value\`, \`WhatWeDoItem\`, \`Tool\`, \`Template\` — each defined in their respective data file (no matching \`src/types/\` file)

---

## 3. Image Handling Patterns

### next/image usage
All images use Next.js \`<Image>\` with \`fill\` layout and \`sizes\` for responsive optimization:

**\`src/components/projects/project-detail.tsx\`:**
\`\`\`tsx
<Image src={images[0].src} alt={images[0].alt} fill className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw" />
\`\`\`

**\`src/components/resources/free-resource-card.tsx\`** (with \`AnimatePresence\` hover crossfade):
\`\`\`tsx
<Image src={resource.media.src} alt={resource.title} fill
  className="object-cover transition-transform duration-700 group-hover:scale-105"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
\`\`\`

### next.config.ts image settings
\`\`\`ts
images: {
  remotePatterns: [],  // no remote domains — all images local
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
}
\`\`\`
The comment in \`next.config.ts\` explicitly notes: \`framerusercontent.com is intentionally absent\`.

### public/images/ directory structure
\`\`\`
public/images/
  about/         8 files (.jpg, .webp, .svg)
  blog/          4 files (.jpg)
  homepage/      6 files (.png, .jpg)
  projects/
    biltfour/    8 files (.jpg, .svg)
    google-cloud-next/    8 files (.jpg, .svg)
    google-gemini-infinite-nature/  8 files (.jpg, .svg)
    iterra/      8 files (.jpg, .svg)
    universal-audio/  8 files (.jpg, .svg, .gif)
  resources/     10 files (.jpg, .mp4)
  team/          2 files (.webp)
\`\`\`

---

## 4. Routing Patterns

Next.js 16.2.1 App Router.

### Static routes
\`\`\`
/                  -> src/app/page.tsx
/about             -> src/app/about/page.tsx
/blog              -> src/app/blog/page.tsx
/contact           -> src/app/contact/page.tsx
/free-assets       -> src/app/free-assets/page.tsx
/lab               -> src/app/lab/page.tsx
/playbooks         -> src/app/playbooks/page.tsx
/projects          -> src/app/projects/page.tsx
/templates         -> src/app/templates/page.tsx
/legal/privacy     -> src/app/legal/privacy/page.tsx
/legal/terms       -> src/app/legal/terms/page.tsx
\`\`\`

### Dynamic routes with generateStaticParams
\`\`\`
/projects/[slug]   -> src/app/projects/[slug]/page.tsx
/blog/[slug]       -> src/app/blog/[slug]/page.tsx
/playbooks/[slug]  -> src/app/playbooks/[slug]/page.tsx
\`\`\`

**Pattern:** \`generateStaticParams\` reads from the data arrays at build time:
\`\`\`ts
export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
\`\`\`

### Redirect in next.config.ts
\`\`\`ts
{ source: "/projects/gemini-infinite-nature",
  destination: "/projects/google-gemini-infinite-nature", permanent: true }
\`\`\`

### Global template for page transitions
\`src/app/template.tsx\` wraps every page in \`<PageTransition>\` using framer-motion \`pageVariants\`.

---

## 5. MDX/Content Patterns

### MDX pipeline for blog
1. \`src/data/blog.ts\` stores metadata (title, date, author, \`contentPath: "blog/ep02.mdx"\`)
2. \`src/lib/mdx.ts\` — \`getMdxContent(contentPath)\` reads the file from \`src/content/\`
3. \`src/app/blog/[slug]/page.tsx\` calls both then passes \`content\` as children to \`BlogPostView\`
4. \`src/components/blog/mdx-components.tsx\` supplies styled React replacements for h1-h3, p, ul, ol, li, blockquote, code, pre, hr, strong, em, a

\`\`\`ts
// src/lib/mdx.ts
const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
export async function getMdxContent(contentPath: string): Promise<string> {
  const fullPath = path.join(CONTENT_ROOT, contentPath);
  return readFile(fullPath, "utf8");
}
\`\`\`

**Key design decision:** MDX files contain **only body content** — no frontmatter. All metadata lives in \`src/data/blog.ts\`.

### MDX for legal pages
Legal pages use \`next-mdx-remote/rsc\`'s \`MDXRemote\` directly with \`readFileSync\`:
\`\`\`ts
const source = readFileSync(join(process.cwd(), "src/content/legal/privacy.mdx"), "utf8");
return <MDXRemote source={source} />;
\`\`\`

### Content directory
\`\`\`
src/content/
  blog/          4 MDX files + README + .gitkeep
  legal/         2 MDX files + .gitkeep
  playbooks/     README + .gitkeep (no content yet)
\`\`\`

---

## 6. Component Patterns

### Project card (dual-variant)
\`src/components/projects/project-card.tsx\` — \`variant="grid"\` (default) and \`variant="carousel"\`. Carousel variant uses \`MotionValue<number>\` parallax prop.

### Project detail (scroll-driven two-column)
\`src/components/projects/project-detail.tsx\` — JS-pinned left panel with scroll-driven section fades via \`useScroll\` + \`useTransform\`. On mobile: interleaved text/image blocks.

### Free resource card (hover crossfade + video)
\`src/components/resources/free-resource-card.tsx\` — handles \`media.type === "video"\` with \`<video autoPlay muted loop>\` and \`media.type === "image"\` with \`<Image>\`. Hover state triggers \`AnimatePresence\`-wrapped overlay.

### devProps utility
All components use \`src/utils/dev-props.ts\` for dev-only \`data-component\` attributes.

---

## 7. Animation Patterns

All animation primitives centralized in \`src/lib/motion.ts\`.

### Shared transitions
\`\`\`ts
export const springTransition: Transition = { type: "spring", stiffness: 300, damping: 30 };
export const smoothTransition: Transition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };
export const fastTransition: Transition = { duration: 0.2, ease: "easeOut" };
\`\`\`

The custom easing \`[0.16, 1, 0.3, 1]\` (ease-out expo) is the signature easing used throughout.

### Exported variant sets (20+)
- \`pageVariants\` — page transitions
- \`fadeIn\`, \`fadeInUp\`, \`fadeInDown\`, \`fadeInLeft\`, \`fadeInRight\` — directional reveals
- \`staggerContainer\`, \`staggerContainerFast\` — container stagger
- \`scaleIn\`, \`scaleOnHover\`, \`imageHover\` — scale interactions
- \`wordContainer\`, \`wordReveal\` — per-word stagger for hero headlines
- \`menuOverlay\`, \`menuContent\`, \`menuItem\` — mobile menu
- \`overlayFullscreen\`, \`overlayColumn\`, \`overlayNavItem\` — fullscreen overlay menu
- \`accordionContent\` — FAQ accordion

### Scroll-driven animations
- \`project-detail.tsx\` — \`useScroll\` + \`useTransform\` for section fades and parallax
- \`project-carousel.tsx\` — \`useMotionValue\` + \`useSpring\` for physics-based drag carousel`,
  },

  "internal-errors": {
    language: "markdown",
    content: `# errors.md — Errors, Gaps & Dead Code
# Project: OS-Portfolio (framer-cms-migration)
# Date: 2026-04-09

---

## 1. Missing Images (Broken References)

### Missing: /public/images/templates/ directory
**File:** \`src/data/templates.ts\` lines 18, 27, 36, 45
\`\`\`ts
thumbnail: "/images/templates/brand-guidelines.jpg",
thumbnail: "/images/templates/pitch-deck.jpg",
thumbnail: "/images/templates/design-system.jpg",
thumbnail: "/images/templates/portfolio.jpg",
\`\`\`
**Status:** The directory \`public/images/templates/\` does not exist. All four template thumbnails are broken. The \`/templates\` route and page are live, but images will 404.

### Blog card images commented out (intentional placeholder)
**File:** \`src/components/blog/blog-card.tsx\` lines 35-42:
\`\`\`tsx
{/* Uncomment when images are available
<Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
*/}
\`\`\`
**File:** \`src/components/blog/blog-post.tsx\` lines 101-109:
\`\`\`tsx
{/* Uncomment when images are available
<Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
*/}
\`\`\`
**Status:** Blog thumbnails exist in \`public/images/blog/\` (4 images confirmed) but the \`<Image>\` tags are commented out. All 4 \`BlogPost.thumbnail\` values in \`src/data/blog.ts\` are unreachable.

---

## 2. Dead / Placeholder Code

### Playbooks: empty arrays + stub rendering
**File:** \`src/data/playbooks.ts\`:
\`\`\`ts
export const playbooks: Playbook[] = [];
export const featuredPlaybooks: Playbook[] = [];
\`\`\`
**File:** \`src/app/playbooks/[slug]/page.tsx\`:
\`\`\`tsx
{/* MDX rendering will be added in a future task */}
<p className="text-fg-tertiary text-sm">Content rendering coming soon.</p>
\`\`\`
**Status:** The playbooks route exists and \`generateStaticParams\` returns an empty array. No MDX rendering implemented.

### Free resources grid coming-soon message
**File:** \`src/components/resources/free-resources-grid.tsx\`:
\`\`\`tsx
Resources are coming soon. Check back later.
\`\`\`
This appears when \`resources.length === 0\` — since \`freeResources\` has 5 items, this branch is currently unreachable dead code.

---

## 3. TODO Comments (Migration-Related)

### Form submission not implemented
**File:** \`src/components/shared/contact-form.tsx\` line 140:
\`\`\`ts
// TODO: Implement actual form submission
\`\`\`
**File:** \`src/components/shared/newsletter-form.tsx\` line 43:
\`\`\`ts
// TODO: Implement actual newsletter signup
\`\`\`
Both forms exist in the UI but silently do nothing on submit.

---

## 4. Type Inconsistencies

### Supporting types not in src/types/
The \`src/types/\` directory contains only 4 files: \`project.ts\`, \`blog.ts\`, \`playbook.ts\`, \`free-resources.ts\`. However, 11 other interfaces are defined inline in their respective data files:

| Interface | Defined in |
|---|---|
| \`TeamMember\` | \`src/data/team.ts\` |
| \`NavItem\`, \`SocialLink\` | \`src/data/navigation.ts\` |
| \`Client\` | \`src/data/clients.ts\` |
| \`Stat\` | \`src/data/stats.ts\` |
| \`Service\` | \`src/data/services.ts\` |
| \`FAQItem\` | \`src/data/faq.ts\` |
| \`ProcessStep\` | \`src/data/process.ts\` |
| \`Value\` | \`src/data/values.ts\` |
| \`WhatWeDoItem\` | \`src/data/what-we-do.ts\` |
| \`Tool\` | \`src/data/tools.ts\` |
| \`Template\` | \`src/data/templates.ts\` |

These are not re-exported via \`src/types/index.ts\`. The four "CMS-migrated" types were formalized but the supporting UI types were left in-file.

### blogCategories runtime value in a type file
**File:** \`src/types/blog.ts\`:
\`\`\`ts
export const blogCategories: BlogCategory[] = [
  'Creative Philosophy', 'About Us', 'Digital Design', 'Design Strategy', 'Brand Identity',
];
\`\`\`
A runtime const array exported from a types file. Convention is to keep runtime values in \`src/data/\`.

### team.ts co-mingling
\`src/data/team.ts\` exports \`team\` (1 member, placeholder comment) and \`showcase\` (Karim + Morgan, with images). The \`team\` array was not fully populated during migration.

---

## 5. Navigation Link to Non-Existent Route

**File:** \`src/data/navigation.ts\`:
\`\`\`ts
{ label: "Resources", href: "/resources" },
\`\`\`
There is no \`src/app/resources/page.tsx\`. The \`/resources\` route would 404. The correct route is \`/free-assets\`. This is a dead link in \`overlayNavItems\`.

---

## 6. Sitemap Includes Redirect-Only Pages

**File:** \`src/app/sitemap.ts\`:
\`\`\`ts
{ url: \`\${baseUrl}/privacy\`, ... },
{ url: \`\${baseUrl}/terms\`, ... },
\`\`\`
These routes only contain \`redirect()\` calls. Minor SEO issue.

---

## 7. Unused Import in Server Component

**File:** \`src/app/blog/page.tsx\`:
\`\`\`ts
import { motion } from "framer-motion";
\`\`\`
\`motion\` is imported but never used in the component's JSX. This is a Server Component (no \`"use client"\` directive), so the import should be removed.`,
  },

  "internal-findings": {
    language: "markdown",
    content: `# Internal Research Findings — Framer CMS Migration
# Project: OS-Portfolio | Date: 2026-04-09

---

## Executive Summary

The framer-cms-migration PRD successfully migrated all content from Framer CMS into the Next.js 16.2.1 codebase. All 20 tasks are complete. Content is stored in 16 TypeScript data files (\`src/data/*.ts\`), images are served locally from \`public/images/\`, and MDX powers blog + legal pages via \`next-mdx-remote\`. The migration established clear patterns: typed arrays for structured data, no-frontmatter MDX for long-form content, centralized animation variants in \`src/lib/motion.ts\`, and \`generateStaticParams\` for all dynamic routes.

---

## Patterns Discovered

- **16 data files** following a consistent pattern: typed array export + optional filtered derivative
- **4 formalized type modules** in \`src/types/\` with barrel re-export; 11 additional types inline in data files
- **MDX pipeline** using \`next-mdx-remote/rsc\` \`compileMDX\` — metadata in TypeScript, body in MDX, no frontmatter
- **Image handling** via \`next/image\` fill layout with local-only images (no remote patterns configured)
- **20+ animation variant sets** centralized in \`src/lib/motion.ts\`, used across 47 components
- **Scroll-driven animations** in project detail via \`useScroll\` + \`useTransform\`
- **devProps utility** for dev-only \`data-component\` attributes on all components

## Dependencies Mapped

- **Core:** next 16.2.1, react 19.2.4, framer-motion ^12.38.0, next-mdx-remote ^6.0.0
- **3D:** three ^0.183.2, @react-three/fiber ^9.5.0, @react-three/drei ^10.7.7
- **UI:** @untitledui/icons, react-aria, react-aria-components, tailwind-merge, clsx
- **Cross-file:** 4 type modules -> 16 data files -> ~30 components -> 18 route pages

## Critical Issues Identified

| # | Issue | Severity |
|---|---|---|
| 1 | Missing \`public/images/templates/\` — 4 broken image refs | High |
| 2 | Blog card/post images commented out despite files existing | Medium |
| 3 | \`/resources\` nav link -> 404 (should be \`/free-assets\`) | Medium |
| 4 | Contact + newsletter forms are stubs (no submission) | Medium |

## Minor Issues Identified

| # | Issue |
|---|---|
| 5 | Playbooks array empty + slug page renders stub |
| 6 | 11 interfaces not in \`src/types/\` (inconsistent co-location) |
| 7 | \`blogCategories\` runtime array in types file |
| 8 | Unused \`motion\` import in Server Component (\`blog/page.tsx\`) |
| 9 | \`slugify\`, \`truncate\`, \`getReadingTime\` unused in utils |
| 10 | Redirect-only pages (\`/privacy\`, \`/terms\`) in sitemap |

---

## Evidence Files

- [patterns.md](./patterns.md) — 7 pattern categories with code samples
- [errors.md](./errors.md) — 7 error/gap categories
- [dependencies.md](./dependencies.md) — NPM deps, type graph, utility map, content->component map
- [structure.md](./structure.md) — Full directory trees for data, types, content, images, routes`,
  },

  "external-practices": {
    language: "markdown",
    content: `# Best Practices: Framer CMS Migration to File-Based Next.js

> Research compiled April 2026 for the \`framer-cms-migration\` PRD.
> Stack: Next.js 16.2, React 19.2, TypeScript 5, Tailwind CSS 4, Framer Motion 12, next-mdx-remote 6.

---

## 1. Next.js 16 Static Site Generation (App Router)

### 1.1 \`generateStaticParams\` — the core SSG primitive

\`generateStaticParams\` replaces \`getStaticPaths\` from the Pages Router. It runs at build time and returns the list of route segments to pre-render. For a file-based CMS, this means reading your data arrays once at build time and emitting one HTML file per slug — exactly the pattern used in this project.

\`\`\`ts
// app/projects/[slug]/page.tsx
export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
\`\`\`

Key behaviors in Next.js 16:

- **Runs before Layouts and Pages are generated.** All \`generateStaticParams\` calls in a route tree are resolved first, then pages are rendered in parallel.
- **Does not auto-cache data for Server Components.** Even for statically generated pages, Server Component data is re-evaluated at request time unless \`"use cache"\` is applied. For a fully static portfolio with no dynamic data, this is a non-issue — all data lives in TypeScript modules that are tree-shaken at build time.
- **\`dynamicParams = false\`** should be set on any route where unlisted slugs should return 404, not trigger on-demand rendering. This is the correct posture for a portfolio where the content set is fixed at build time.

\`\`\`ts
// Prevent unknown slugs from falling through to dynamic rendering
export const dynamicParams = false;
\`\`\`

### 1.2 Next.js 16.2 performance numbers relevant to static sites

The 16.2 release (March 2026) delivered two improvements that benefit content-heavy static sites:

- **~87% faster \`next dev\` startup** compared to 16.1 on the default application template.
- **25--60% faster Server Component rendering** via a React RSC payload deserialization fix (eliminated the C++/JS V8 boundary overhead in \`JSON.parse\`).

For a site with ~75 images and ~10 project slugs, build times are already fast. The startup improvement matters more in development iteration.

### 1.3 Turbopack is now the default bundler

As of Next.js 16, Turbopack is the default bundler for both \`next dev\` and \`next build\`. If you have a Babel config (e.g., for \`babel-plugin-react-compiler\`), Turbopack now auto-detects and applies it rather than exiting with a hard error. To opt back to webpack explicitly:

\`\`\`bash
next build --webpack
\`\`\`

**Important for next-mdx-remote users:** there is an open Turbopack compatibility issue ([vercel/next.js#64525](https://github.com/vercel/next.js/issues/64525)). The workaround is:

\`\`\`ts
// next.config.ts
const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
};
\`\`\`

This project already avoids the issue because it uses \`next-mdx-remote/rsc\`'s \`compileMDX\` server-side, which does not require client transpilation.

### 1.4 Breaking changes that affect this project

| Change | Impact | Action taken |
|--------|--------|--------------|
| Async \`params\` in page props | \`params\` is now \`Promise<{slug: string}>\` — must be awaited | All \`[slug]/page.tsx\` files use \`await params\` |
| \`images.minimumCacheTTL\` default changed to 4 hours (14400s) | Previously 60s; reduces revalidation cost | Project explicitly sets \`minimumCacheTTL: 60\` — consider increasing to match new default |
| \`images.imageSizes\` default dropped \`16\` | Reduces srcset size | Project overrides with explicit array including 16 — acceptable but can be trimmed |
| \`images.localPatterns\` required for local src with query strings | Security restriction | Not applicable — no query strings on local image paths |
| Sync \`cookies()\`, \`headers()\` access removed | Must be async | Not used in static routes |
| \`middleware.ts\` deprecated in favor of \`proxy.ts\` | Rename required in future | Project has no middleware |
| \`next lint\` command removed from Next.js | ESLint must be run directly | \`npm run lint\` now uses \`eslint\` CLI directly — already correct |

### 1.5 Cache Components and "use cache"

Next.js 16 introduced **Cache Components** as the successor to \`getStaticProps\` / ISR. For a portfolio that is entirely static, this is opt-in and not required. However, if the site later adds dynamic sections (e.g., a contact form confirmation, a live resource count), \`"use cache"\` at the function level is the idiomatic way to cache individual data fetches rather than full-page ISR.

\`\`\`ts
// Hypothetical future pattern — not required for current static build
import { unstable_cache } from 'next/cache';

const getProjects = unstable_cache(
  async () => projects,
  ['projects'],
  { revalidate: false } // never revalidate — data is static
);
\`\`\`

---

## 2. MDX with Next.js — Patterns and Trade-offs

### 2.1 The two approaches: \`next-mdx-remote/rsc\` vs \`@next/mdx\`

| Dimension | \`next-mdx-remote/rsc\` | \`@next/mdx\` |
|-----------|----------------------|-------------|
| MDX files location | Anywhere — \`fs.readFile\` at runtime | Must be in \`app/\` as page files |
| Custom components | Passed at \`compileMDX\` call site | Configured globally in \`mdx-components.tsx\` |
| Frontmatter | Parsed by \`compileMDX\` via \`vfile-matter\` | Must use separate export or custom loader |
| Build-time vs runtime | MDX compiled in Server Component at request time | MDX compiled by bundler (Webpack/Turbopack) at build time |
| Turbopack compat | Requires \`transpilePackages\` workaround (v5/6) | First-class Turbopack support |
| Maintenance status | **Archived April 9, 2026** | Actively maintained by Vercel |
| Best for | File-backed content with metadata stored separately | When MDX files are the pages themselves |

**This project's choice (\`next-mdx-remote/rsc\` + external metadata in \`data/blog.ts\`) is the correct architecture for a CMS migration pattern**, where content metadata (slug, title, date, thumbnail) lives in a TypeScript registry and MDX files contain only the narrative body. The metadata-in-code pattern is intentional: it enables TypeScript type safety on post metadata without coupling it to MDX frontmatter parsing.

**Migration path:** Because \`next-mdx-remote\` was archived on April 9, 2026, the recommended migration path is \`next-mdx-remote-client\` (a maintained fork by ipikuka) or \`@next/mdx\`. For a blog with only 4--5 posts and content in \`.mdx\` files, the migration effort is low.

### 2.2 \`compileMDX\` usage pattern (current implementation)

\`\`\`ts
// src/app/blog/[slug]/page.tsx
import { compileMDX } from 'next-mdx-remote/rsc';

const mdxSource = await getMdxContent(post.contentPath);
const { content } = await compileMDX({
  source: mdxSource,
  components: getMDXComponents(),
});
\`\`\`

This pattern is correct for RSC. The \`compileMDX\` function is async and must run in a Server Component. It returns a React element (\`content\`) that can be passed as a child to the view component. Custom components (headings, callouts, code blocks) are injected at compile time, not via React Context — which is required in RSC since Context is not available.

### 2.3 MDX best practices for content-heavy static sites

**Content colocation:** Keep \`.mdx\` files in \`src/content/\` (not \`app/\`). This separates content from routing concerns and makes content searchable/portable.

**Metadata in TypeScript, body in MDX:** Do not rely on MDX frontmatter for metadata that drives routing or SEO. Parse frontmatter in \`data/*.ts\` files at import time for type safety and tree-shaking. This is the pattern used in this project.

**Custom components inject design system:** Provide \`h1\`, \`h2\`, \`p\`, \`code\`, \`pre\`, \`blockquote\` overrides through \`getMDXComponents()\` to ensure MDX content respects the design system's typography without requiring authors to know about Tailwind classes.

**Avoid client components in MDX:** All components passed to \`compileMDX\` run in an RSC context. Any component that uses hooks, event handlers, or browser APIs must be wrapped in \`'use client'\` and explicitly passed via the \`components\` map.

---

## 3. Image Optimization for Portfolio Sites

### 3.1 The migration rationale: local vs. remote

The core motivation for downloading ~75 images from \`framerusercontent.com\` to \`/public/images/\` is **decoupling the portfolio from Framer's CDN**. Framer's CDN URLs are not guaranteed to be permanent after a project is unpublished or a plan is downgraded. Serving from \`/public/\` gives full control over image availability and cache TTL.

The \`next.config.ts\` correctly reflects this:

\`\`\`ts
images: {
  remotePatterns: [], // framerusercontent.com intentionally absent
}
\`\`\`

### 3.2 Format strategy: AVIF first, WebP fallback

The project's config specifies \`formats: ["image/avif", "image/webp"]\`. This is optimal:

- **AVIF** is 40--50% smaller than JPEG at equivalent quality. Next.js will serve it to Chrome 85+, Firefox 93+, and Safari 16+.
- **WebP** is 25--35% smaller than JPEG and is the fallback for older browsers.
- Original formats (JPG, PNG, SVG, GIF) are served as-is if neither AVIF nor WebP is accepted.

**SVG optimization note:** \`next/image\` does not optimize SVGs — it serves them as-is, bypassing the optimization pipeline. This is correct behavior since SVGs are already vector. The project uses SVG for the Iterra hero (\`vvl6xyIdUMskDBgstfyClKSxE8.svg\`) which will be served directly.

**GIF optimization note:** Next.js does not convert animated GIFs to video. If any resource media files are animated GIFs, consider converting them to WebM/MP4 for significantly better file sizes. The project uses \`.mp4\` for the Design Directory resource media — good practice.

### 3.3 \`priority\` prop for above-the-fold images

For any image that is the Largest Contentful Paint (LCP) element — typically the hero or thumbnail on a project page — add \`priority\`:

\`\`\`tsx
<Image
  src={project.thumbnail}
  alt={project.title}
  width={1200}
  height={630}
  priority // adds <link rel="preload"> and disables lazy loading
/>
\`\`\`

Without \`priority\`, \`next/image\` lazy loads by default, which can hurt LCP scores on portfolio pages where the hero image is the primary visual.

### 3.4 \`sizes\` attribute for responsive images

Without \`sizes\`, Next.js assumes the image takes up 100% of the viewport and generates an oversized srcset. For thumbnail grids, provide accurate sizing:

\`\`\`tsx
<Image
  src={project.thumbnail}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt={project.title}
/>
\`\`\`

### 3.5 \`minimumCacheTTL\` reconsideration

The project sets \`minimumCacheTTL: 60\` (60 seconds). The Next.js 16 default changed to 14400 seconds (4 hours). For a portfolio where images never change between deployments, increasing this to at least 3600 (1 hour) or the new default 14400 is advisable to reduce unnecessary revalidation load on Vercel's image optimization pipeline.

---

## 4. File-Based CMS Patterns in Next.js

### 4.1 The TypeScript registry pattern

This project uses a **TypeScript registry pattern**: content metadata lives in \`src/data/*.ts\` files that export typed arrays, while long-form narrative content lives in \`src/content/blog/*.mdx\`. This is the most ergonomic pattern for a developer-owned portfolio because:

- **Full type safety** — TypeScript catches missing fields, incorrect types, and stale references at compile time.
- **Tree-shaking** — unused project data is dropped from the bundle.
- **No build-time parsing overhead** — no Markdown parsing, no YAML frontmatter extraction, no filesystem scanning at build time (beyond what \`generateStaticParams\` needs).
- **Colocation of schema** — the \`Project\`, \`BlogPost\`, and \`FreeResource\` interfaces in \`src/types/\` serve as the CMS schema.

### 4.2 When to add a real file-based CMS layer

For a solo-developer portfolio, the TypeScript registry is appropriate. The threshold for upgrading to a tool like Contentlayer, TinaCMS, or Payload CMS is:

- Non-developer content editors who cannot edit TypeScript
- More than ~50 MDX files that require filesystem discovery (not manual registration)
- Need for live preview or visual editing

### 4.3 Slug management and redirects

One of the most common CMS migration pitfalls is slug drift — when the canonical slugs in the original CMS differ from the slugs you pick for the static site. This project correctly handles this with a permanent redirect in \`next.config.ts\`:

\`\`\`ts
redirects() {
  return [
    {
      source: '/projects/gemini-infinite-nature',
      destination: '/projects/google-gemini-infinite-nature',
      permanent: true, // 308 — tells crawlers and browsers to update
    },
  ];
}
\`\`\`

**Best practice:** Audit all published URLs from the Framer site before deployment. Use \`permanent: true\` (308) for slug changes where the new URL is the canonical destination.

### 4.4 Content path conventions

The \`contentPath\` field on \`BlogPost\` (e.g., \`"blog/ep02-creative-ai-framework.mdx"\`) stores a path relative to \`src/content/\`. This indirection layer (data -> contentPath -> MDX file) allows the blog post metadata to evolve independently of the MDX filename. If a file is renamed, only the \`data/blog.ts\` entry needs updating.

---

## 5. Content Migration Best Practices (CMS to Static)

### 5.1 Asset extraction strategy

Framer does not offer HTML export, but its CMS content can be exported via CSV plugins (e.g., CMS Export by Framer from the Framer Marketplace). The standard migration workflow is:

1. Export CMS collections as CSV or JSON via a Framer plugin.
2. Extract image URLs from the exported data (all from \`framerusercontent.com\`).
3. Download images programmatically (e.g., a Node.js script using \`fetch\` + \`fs.writeFile\`).
4. Map original URLs to new local paths in the TypeScript registry.
5. Verify all images render correctly before removing Framer origin from \`remotePatterns\`.

The project's \`scripts/\` directory is the appropriate home for such migration tooling.

### 5.2 HTML-to-MDX conversion

Blog posts in Framer CMS are stored as rich text / HTML. Converting to MDX involves:

- Stripping Framer-specific wrapper elements (\`<div class="framer-*">\`)
- Converting heading hierarchy to Markdown (\`#\`, \`##\`, \`###\`)
- Converting internal links to relative Next.js routes
- Preserving semantic structure (blockquotes, code blocks, lists)

The resulting MDX should contain only semantic content — no inline styles, no Framer class names.

### 5.3 Template-stripping for open-source release

When releasing a portfolio as an open-source template, all client-specific content must be replaced with placeholder content while preserving the structure and types. This project uses \`// TEMPLATE: replace with your content\` comments as markers. Best practice is to ensure:

- All image paths point to generic placeholder images included in the repo.
- All text content uses generic lorem-ipsum-style copy that demonstrates the schema.
- All external links (e.g., Figma file URLs) point to public resources or are left as \`"#"\`.

---

## 6. SEO for Portfolio and Agency Sites

### 6.1 \`generateMetadata\` — dynamic metadata per route

Next.js 16 App Router uses \`generateMetadata\` for per-page SEO metadata. The pattern used in this project is correct:

\`\`\`ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params; // Note: params is async in Next.js 16
  const post = blogPosts.find((p) => p.slug === slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: \`\${baseUrl}/blog/\${slug}\` },
    openGraph: { /* ... */ },
  };
}
\`\`\`

**Performance note:** For static pages, prefer exporting a static \`metadata\` object over \`generateMetadata\` — it avoids the async overhead. Use \`generateMetadata\` only when metadata depends on the slug.

### 6.2 Canonical URLs

Every page should declare a canonical URL via \`alternates.canonical\`. This is especially important after a CMS migration, as search engines may have indexed the old Framer domain (\`*.framer.app\` or a custom domain) and need to be redirected to the new canonical domain.

### 6.3 \`sitemap.ts\` — programmatic XML sitemap

The App Router supports a \`sitemap.ts\` file at \`app/sitemap.ts\` that exports a \`MetadataRoute.Sitemap\` array. This project correctly generates sitemap entries for:

- Static pages (home, about, projects, blog, templates, contact, legal)
- Dynamic project pages (one entry per project slug)
- Dynamic blog pages (one entry per post slug with \`lastModified\` from post date)

**Missing:** free-assets pages and playbook pages. Add these to the sitemap if they are indexable.

### 6.4 Open Graph images

For maximum social sharing preview quality:

- Provide \`openGraph.images\` with \`width: 1200, height: 630\` for all content pages.
- For project and blog pages, use the item's \`thumbnail\` field as the OG image.
- Consider generating OG images programmatically with \`ImageResponse\` from \`next/og\` for pages that don't have a dedicated thumbnail.

Next.js 16.2 improved \`ImageResponse\` performance by 2--20x, making dynamic OG image generation more viable at scale.

### 6.5 Structured data (JSON-LD)

For portfolio and agency sites, JSON-LD structured data can improve CTR by 20--30% by enabling rich results. Relevant schemas:

- \`Organization\` — for the agency homepage
- \`Article\` — for blog posts
- \`CreativeWork\` — for project case studies
- \`BreadcrumbList\` — for project and blog sub-pages

Implement via a \`<script type="application/ld+json">\` tag in the page \`head\`, injected through \`generateMetadata\` or a dedicated \`JsonLd\` Server Component.

### 6.6 \`robots.ts\`

The project's \`robots.ts\` correctly allows all crawlers and disallows \`/api/\` and \`/_next/\`. Ensure that any staging or preview deployments use a \`ROBOTS_BLOCK=true\` environment variable to inject \`Disallow: /\` for non-production origins.`,
  },

  "external-libs": {
    language: "markdown",
    content: `# Library Evaluation: Framer CMS Migration Stack

> Research compiled April 2026. All version numbers reflect \`package.json\` at commit \`b871c41\`.

---

## 1. next-mdx-remote

| Field | Value |
|-------|-------|
| **Version in use** | \`^6.0.0\` |
| **Latest stable** | \`6.0.0\` |
| **GitHub** | [hashicorp/next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) |
| **Stars** | 3.1k |
| **Status** | **ARCHIVED — April 9, 2026. Read-only. No further support.** |
| **License** | MPL-2.0 |

### Purpose

Loads MDX content from any source (filesystem, API, database) and renders it inside a Next.js application. The \`/rsc\` import path (\`next-mdx-remote/rsc\`) provides a React Server Component-compatible \`compileMDX\` function that compiles MDX on the server without shipping the MDX compiler to the client.

### How this project uses it

\`\`\`ts
import { compileMDX } from 'next-mdx-remote/rsc';

const { content } = await compileMDX({
  source: mdxSource,             // raw MDX string from fs.readFile
  components: getMDXComponents(), // design-system overrides for h1, p, code, etc.
});
\`\`\`

The \`compileMDX\` call runs in a Server Component (\`app/blog/[slug]/page.tsx\`). The resulting \`content\` is a React element tree passed as children to \`<BlogPostView>\`.

### Why this pattern works

- MDX is compiled server-side — zero MDX runtime in the browser bundle.
- Custom components are injected at compile time, not via React Context (required for RSC compatibility since Context is unavailable in Server Components).
- Content metadata (slug, title, date, thumbnail) lives in \`data/blog.ts\` as typed TypeScript — not parsed from MDX frontmatter at runtime.

### Known issues

1. **Turbopack compatibility:** There is an open issue ([vercel/next.js#64525](https://github.com/vercel/next.js/issues/64525)) where Turbopack cannot resolve \`next-mdx-remote\` without \`transpilePackages: ['next-mdx-remote']\` in \`next.config.ts\`. This project uses the RSC import path, which mitigates client-side transpilation issues, but the config option should be added as a precaution once upgrading to Next.js 16's default Turbopack build.

2. **Archived status:** No bug fixes or security patches will be issued. The library remains functional for current use cases but should be migrated before the next major Next.js version.

### Trade-offs

| Pro | Con |
|-----|-----|
| Mature RSC support via \`/rsc\` subpath | Archived; no future maintenance |
| Separates content metadata from MDX body | Requires manual \`contentPath\` registry |
| No client bundle overhead (server-only compilation) | Turbopack workaround needed |
| Familiar API for teams with Pages Router history | |

### Alternatives considered

#### \`next-mdx-remote-client\` (recommended migration target)
- **Repo:** [ipikuka/next-mdx-remote-client](https://github.com/ipikuka/next-mdx-remote-client)
- A maintained fork of \`next-mdx-remote\`, created in early 2024 when the original went unmaintained.
- Supports MDX v3, App Router RSC, and Pages Router.
- API is nearly identical — migration is a find-and-replace of import paths.
- **Recommended migration:** Replace \`next-mdx-remote/rsc\` with \`next-mdx-remote-client/rsc\`.

#### \`@next/mdx\`
- **Purpose:** Processes \`.mdx\` files as first-class Next.js page files at build time.
- **Best for:** When MDX files *are* the pages (e.g., docs sites, content-as-routing).
- **Not suitable for this project:** This project stores metadata in TypeScript and uses MDX only for body content. With \`@next/mdx\`, frontmatter must be manually managed or handled via a custom loader, and MDX files must live in \`app/\` to be treated as routes.
- First-class Turbopack support — no workaround needed.

#### \`mdx-bundler\`
- **Purpose:** Bundles MDX content with imports from arbitrary sources.
- **Trade-off:** Output bundle is 400%+ larger than \`next-mdx-remote\` for basic content. Suitable for complex MDX that imports third-party components, but overkill for a narrative-only blog.

#### Plain \`@mdx-js/mdx\`
- Requires building custom serialization/deserialization plumbing. Not advisable unless you need direct control over the remark/rehype plugin chain.

---

## 2. framer-motion (Motion)

| Field | Value |
|-------|-------|
| **Package name** | \`framer-motion\` (published as \`motion\` on npm since v11) |
| **Version in use** | \`^12.38.0\` |
| **GitHub** | [framer/motion](https://github.com/framer/motion) |
| **Stars** | ~26k |
| **License** | MIT |
| **React 19 compatible** | Yes — full concurrent rendering support |

### Purpose

Animation library for React. Provides declarative \`motion.*\` components with spring physics, shared layout animations (\`layoutId\`), gesture support (drag, pan, tap), and scroll-linked animations.

### Package name clarification

In 2025, Framer Motion became an independent project and the canonical package on npm shifted to \`motion\`. The \`framer-motion\` package is kept as an alias and re-exports from \`motion\`. Both import paths work:

\`\`\`ts
// Both are equivalent in v12
import { motion } from 'framer-motion';
import { motion } from 'motion/react';
\`\`\`

For new code, prefer \`motion/react\`. The \`framer-motion\` alias will likely be deprecated in a future major.

### v12 notable additions

- \`oklch\`, \`oklab\`, \`lab\`, \`lch\`, and \`color-mix()\` color type support
- Hardware-accelerated scroll animations
- \`layoutAnchor\` prop for layout animations
- Axis-locked layout animations: \`layout="x"\` and \`layout="y"\`
- \`skipInitialAnimation\` in \`useSpring\`

### Usage patterns for portfolio animations

**Staggered entrance animations** (most common portfolio use case):

\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.ul variants={container} initial="hidden" animate="show">
  {projects.map((p) => (
    <motion.li key={p.id} variants={item} />
  ))}
</motion.ul>
\`\`\`

**Reduced motion (accessibility requirement):**

\`\`\`tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      animate={{ opacity: 1, y: prefersReduced ? 0 : -10 }}
    />
  );
}
\`\`\`

**Performance:** Framer Motion animates \`transform\` and \`opacity\` by default, which are GPU-composited properties that don't trigger layout reflow. For scroll-linked effects, use the \`useScroll\` + \`useTransform\` hooks to map scroll position to CSS transform values.

### Bundle size

- **Full bundle:** ~55 kB gzipped
- **With \`LazyMotion\` + \`domAnimation\`:** ~18 kB gzipped
- **React Spring 10 (alternative):** ~20 kB gzipped

For a portfolio site where animation richness matters more than bundle size, the full bundle is acceptable. If Core Web Vitals are a priority, use \`LazyMotion\` to defer loading until after the critical path:

\`\`\`tsx
import { LazyMotion, domAnimation } from 'framer-motion';

<LazyMotion features={domAnimation}>
  {/* motion.* components work normally inside */}
</LazyMotion>
\`\`\`

### Trade-offs

| Pro | Con |
|-----|-----|
| Declarative variant system — designer-friendly | ~55 kB full bundle |
| Built-in \`useReducedMotion\` hook | Over-engineered for simple fade-ins |
| \`layoutId\` shared layout animations | LazyMotion required for bundle optimization |
| React 19 concurrent rendering support | React Spring better for pure physics |
| Scroll-linked animations with \`useScroll\` | |

### Alternatives considered

| Library | Bundle | Best for | Gap vs. Motion |
|---------|--------|----------|----------------|
| React Spring | ~20 kB | Physics-heavy UI | No shared layout, no variants |
| CSS Transitions/Animations | 0 kB | Simple fades | No sequence control |
| GSAP (already in project) | ~27 kB | Timeline-based, complex sequences | React integration requires wrapper |

**Note:** This project also includes \`gsap: ^3.14.2\`. GSAP and Framer Motion are both present. This is a valid strategy — use Framer Motion for React-idiomatic component animations and GSAP for canvas/Three.js/timeline animations (which align with \`@react-three/fiber\` usage).

---

## 3. next/image

| Field | Value |
|-------|-------|
| **Package** | Built into \`next\` |
| **Version** | \`next@16.2.1\` |
| **Docs** | [nextjs.org/docs/app/api-reference/components/image](https://nextjs.org/docs/app/api-reference/components/image) |

### Purpose

Wraps \`<img>\` with automatic format conversion (AVIF/WebP), lazy loading, responsive srcsets, layout-shift prevention, and optional blurred placeholder. Images are optimized on-demand at request time by Next.js's image optimization pipeline and cached according to \`minimumCacheTTL\`.

### Configuration in this project

\`\`\`ts
// next.config.ts
images: {
  remotePatterns: [],                    // local-only — framer CDN intentionally removed
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ["image/avif", "image/webp"], // AVIF first (smaller), WebP fallback
  minimumCacheTTL: 60,
}
\`\`\`

### Breaking changes in Next.js 16 affecting image config

| Change | Old default | New default | Action |
|--------|-------------|-------------|--------|
| \`minimumCacheTTL\` | 60s | 14400s (4h) | Consider adopting new default |
| \`imageSizes\` | Included \`16\` | Dropped \`16\` | Project overrides — acceptable |
| \`images.qualities\` | \`[1..100]\` | \`[75]\` | Quality prop coerced to nearest value in array |
| \`images.maximumRedirects\` | Unlimited | 3 | Not applicable — no remote patterns |
| \`images.dangerouslyAllowLocalIP\` | Allowed | Blocked | Not applicable |

### Mixed asset type handling

This project serves SVG, JPG, PNG, GIF, and MP4 assets. Behavior per type:

| Format | \`next/image\` behavior |
|--------|-----------------------|
| JPG/PNG | Converted to AVIF/WebP, lazy loaded, responsive srcset |
| SVG | Served as-is (no optimization) — requires \`unoptimized\` prop or is fine as-is |
| GIF | Served as-is — Next.js does not convert animated GIFs |
| MP4 | Not a valid \`next/image\` source — use \`<video>\` directly |

**Recommendation:** The Design Directory resource uses an \`.mp4\` file as \`media.src\`. This is correctly rendered via \`<video>\` (not \`<Image>\`), which is the right approach.

### Trade-offs

| Pro | Con |
|-----|-----|
| Zero-config AVIF/WebP conversion | SVGs bypass optimization |
| Prevents CLS via reserved dimensions | \`priority\` must be set manually for LCP images |
| Built-in lazy loading | \`minimumCacheTTL: 60\` may cause unnecessary revalidation |
| Responsive srcsets via \`sizes\` prop | |

---

## 4. Tailwind CSS v4

| Field | Value |
|-------|-------|
| **Version in use** | \`^4\` (devDependency) |
| **PostCSS plugin** | \`@tailwindcss/postcss: ^4\` |
| **Docs** | [tailwindcss.com/docs](https://tailwindcss.com/docs) |

### Purpose

Utility-first CSS framework. In v4, configuration moved from \`tailwind.config.js\` (JavaScript) to \`@theme\` directives in CSS — a "CSS-first" architecture.

### Key v4 changes from v3

| Change | v3 | v4 |
|--------|----|----|
| Config file | \`tailwind.config.js\` | \`@theme\` in CSS |
| PostCSS plugin | \`tailwindcss\` package | \`@tailwindcss/postcss\` package |
| \`@tailwind\` directives | \`@tailwind base; @tailwind components; @tailwind utilities\` | \`@import "tailwindcss"\` |
| Performance | Baseline | 3--10x faster full builds, up to 100x faster incremental |
| CSS variable syntax | bracket \`var()\` wrapping | \`bg-(--color)\` shorthand (still supports bracket) |

### This project's CSS convention

The project uses a **mapped Tailwind class** convention where CSS variables are exposed as semantic utility classes:

\`\`\`css
/* src/styles/globals.css — @theme block */
--bg-primary: ...; /* exposed as bg-bg-primary */
--fg-primary: ...; /* exposed as text-fg-primary */
\`\`\`

This avoids the legacy bracket var() syntax (e.g. wrapping CSS vars in square brackets), which does not support opacity modifiers (\`/30\`, \`/50\`). The mapped class approach is the correct v4 pattern and aligns with the project's CLAUDE.md conventions.

### Trade-offs

| Pro | Con |
|-----|-----|
| CSS-first config is version-controllable alongside styles | Migration from v3 requires config rewrite |
| 3--10x faster builds | Automated upgrade tool requires manual fixes |
| Native CSS variables as first-class citizens | Breaking changes break PostCSS v3 configs |
| No more \`tailwind.config.js\` maintenance | |

---

## 5. Supporting Libraries

### \`@react-three/fiber\` + \`@react-three/drei\` + \`three\`

| Package | Version |
|---------|---------|
| \`@react-three/fiber\` | \`^9.5.0\` |
| \`@react-three/drei\` | \`^10.7.7\` |
| \`three\` | \`^0.183.2\` |

Used for the \`/lab\` route's interactive 3D experiments. Three.js/R3F is client-only and should be wrapped in dynamic imports with \`ssr: false\` to prevent server-side rendering errors and avoid shipping WebGL code in the initial HTML.

\`\`\`tsx
import dynamic from 'next/dynamic';
const Scene = dynamic(() => import('@/components/lab/Scene'), { ssr: false });
\`\`\`

### \`ogl\` + \`react-powerglitch\` + \`gsap\`

| Package | Version | Purpose |
|---------|---------|---------|
| \`ogl\` | \`^1.0.11\` | Lightweight WebGL renderer for shader effects |
| \`react-powerglitch\` | \`^1.1.0\` | CSS glitch effect component |
| \`gsap\` | \`^3.14.2\` | Timeline-based animation for complex sequences |

These are visual effect libraries. All should be dynamically imported or wrapped in \`useEffect\` to ensure they only run in browser contexts.

### \`react-aria\` + \`react-aria-components\`

| Package | Version |
|---------|---------|
| \`react-aria\` | \`^3.47.0\` |
| \`react-aria-components\` | \`^1.16.0\` |

Adobe's accessible React component primitives. Used for interactive UI elements (likely filtering, dropdown, and OTP input). These are client components by nature — ensure they are used in \`'use client'\` boundaries.

### \`clsx\` + \`tailwind-merge\`

Standard utility combination for conditional class merging:

\`\`\`ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
\`\`\`

\`tailwind-merge\` is at \`^3.5.0\`, which supports Tailwind v4 class resolution.`,
  },

  "external-refs": {
    language: "markdown",
    content: `# References: Framer CMS Migration PRD

> All links verified or sourced in April 2026. Organized by topic.

---

## Next.js 16 Official Documentation

| Resource | URL | Notes |
|----------|-----|-------|
| Next.js 16 Release Blog | https://nextjs.org/blog/next-16 | Cache Components, Turbopack stable, proxy.ts, React 19.2 |
| Next.js 16.1 Release Blog | https://nextjs.org/blog/next-16-1 | \`next upgrade\` CLI, Turbopack filesystem caching stable |
| Next.js 16.2 Release Blog | https://nextjs.org/blog/next-16-2 | 87% faster dev startup, 25-60% faster rendering, Adapters stable |
| Upgrading to Version 16 | https://nextjs.org/docs/app/guides/upgrading/version-16 | Breaking changes, codemods, migration steps |
| generateStaticParams | https://nextjs.org/docs/app/api-reference/functions/generate-static-params | SSG in App Router |
| generateMetadata | https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Per-page SEO metadata |
| Image Component | https://nextjs.org/docs/app/api-reference/components/image | next/image API reference |
| Image Optimization Guide | https://nextjs.org/docs/app/getting-started/images | Getting started with image optimization |
| MDX Guide | https://nextjs.org/docs/app/guides/mdx | @next/mdx and next-mdx-remote patterns |
| Metadata & OG Images | https://nextjs.org/docs/app/getting-started/metadata-and-og-images | generateMetadata, openGraph, sitemap |
| Sitemap | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap | MetadataRoute.Sitemap |
| Robots.txt | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots | MetadataRoute.Robots |
| Redirects | https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects | Permanent and temporary redirects |
| Dynamic Routes | https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes | [slug] file convention |
| Cache Components | https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents | "use cache" directive |
| ImageResponse | https://nextjs.org/docs/app/api-reference/functions/image-response | OG image generation |
| ISR Guide | https://nextjs.org/docs/app/guides/incremental-static-regeneration | Incremental Static Regeneration in App Router |
| DevTools MCP | https://nextjs.org/docs/app/guides/mcp | MCP integration for AI debugging |
| proxy.ts | https://nextjs.org/docs/app/getting-started/proxy | Replacement for middleware.ts |

---

## MDX Ecosystem

| Resource | URL | Notes |
|----------|-----|-------|
| next-mdx-remote GitHub | https://github.com/hashicorp/next-mdx-remote | **Archived April 9, 2026** — read-only |
| next-mdx-remote npm | https://www.npmjs.com/package/next-mdx-remote | Version history |
| next-mdx-remote-client GitHub | https://github.com/ipikuka/next-mdx-remote-client | Maintained fork — recommended migration target |
| next-mdx-remote-client npm | https://www.npmjs.com/package/next-mdx-remote-client | |
| next-mdx-remote/rsc vs @next/mdx | https://blixamo.com/blog/next-mdx-remote-rsc-vs-next-mdx-nextjs-15 | When to use each (Next.js 15 context, still applicable) |
| MDX Alternatives Discussion | https://github.com/hashicorp/next-mdx-remote/discussions/438 | Community consensus on alternatives |
| MDX Comparison (dev.to) | https://dev.to/tylerlwsmith/quick-comparison-of-mdx-integration-strategies-with-next-js-1kcm | Comparison of integration strategies |
| Next.js 15 MDX Setup | https://dev.to/ptpaterson/getting-started-with-nextjs-15-and-mdx-305k | Step-by-step guide |
| MDX Official Docs | https://mdxjs.com/docs/ | MDX spec, remark/rehype plugins |
| Turbopack + next-mdx-remote issue | https://github.com/vercel/next.js/issues/64525 | Open issue — workaround: transpilePackages |
| next-mdx-remote RSC issue #488 | https://github.com/hashicorp/next-mdx-remote/issues/488 | RSC mode issues with latest Next.js |

---

## Framer CMS and Migration

| Resource | URL | Notes |
|----------|-----|-------|
| Framer: Porting your data | https://www.framer.com/help/articles/porting-your-data-from-framer/ | Official Framer data export guide |
| CMS Export Plugin (Framer Marketplace) | https://www.framer.com/marketplace/plugins/cms-export/ | CSV/JSON export plugin for Framer CMS |
| Migrate Framer to Static Site (BrowserCat) | https://www.browsercat.com/post/migrate-framer-to-static | AI-assisted migration workflow |
| Framer Community: Export CMS | https://www.framer.community/c/support/export-cms | Community thread on CMS export options |
| Framer Community: Migrating CMS content | https://www.framer.community/c/support/migrating-cms-content-from-one-project-to-another | Migrating between Framer projects |
| CMS Migration Guide (Storyblok) | https://www.storyblok.com/mp/cms-migration-guide | General CMS migration checklist |
| CMS Migration Guide (flow.ninja) | https://www.flow.ninja/blog/cms-migration-guide | Comprehensive guide with checklist |

---

## Tailwind CSS v4

| Resource | URL | Notes |
|----------|-----|-------|
| Tailwind CSS v4 Upgrade Guide | https://tailwindcss.com/docs/upgrade-guide | Official migration from v3 to v4 |
| Tailwind CSS v4 Docs | https://tailwindcss.com/docs | Full v4 documentation |
| Tailwind v4 Migration Guide (DEV) | https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4 | 2026 community guide |
| Tailwind v4 Breaking Changes | https://designrevision.com/blog/tailwind-4-migration | CSS-first config, PostCSS changes |
| JavaScript to CSS Config Migration | https://medium.com/better-dev-nextjs-react/tailwind-v4-migration-from-javascript-config-to-css-first-in-2025-ff3f59b215ca | Detailed migration walkthrough |

---

## Framer Motion / Motion

| Resource | URL | Notes |
|----------|-----|-------|
| Framer Motion GitHub | https://github.com/framer/motion | Source, issues, releases |
| Motion npm (canonical) | https://www.npmjs.com/package/motion | Primary package as of v11+ |
| framer-motion npm (alias) | https://www.npmjs.com/package/framer-motion | Alias — still published |
| Framer Motion v12 vs React Spring (Hooked On UI) | https://hookedonui.com/animating-react-uis-in-2025-framer-motion-12-vs-react-spring-10/ | Bundle size comparison, feature matrix |
| Advanced Framer Motion 2025 | https://www.luxisdesign.io/blog/advanced-framer-motion-animation-techniques-for-2025 | Advanced techniques |
| useReducedMotion | https://www.framer.com/motion/use-reduced-motion/ | Accessibility hook |
| LazyMotion | https://www.framer.com/motion/lazy-motion/ | Bundle size optimization |

---

## Image Optimization

| Resource | URL | Notes |
|----------|-----|-------|
| Next.js Image Optimization (DebugBear) | https://www.debugbear.com/blog/nextjs-image-optimization | Performance deep-dive |
| Next.js Performance Guide 2025 | https://justinmalinow.com/blog/nextjs-performance-optimization-guide | Comprehensive 2025 guide |
| Modern Image Formats (FrontendTools) | https://www.frontendtools.tech/blog/modern-image-optimization-techniques-2025 | AVIF vs WebP guide |
| Next.js Image Optimization (Strapi) | https://strapi.io/blog/nextjs-image-optimization-developers-guide | Developer guide |

---

## SEO in Next.js

| Resource | URL | Notes |
|----------|-----|-------|
| Next.js SEO Guide (Digital Applied) | https://www.digitalapplied.com/blog/nextjs-seo-guide | Next.js 15/16 SEO complete guide |
| Maximizing SEO with Next.js 15 (DEV) | https://dev.to/joodi/maximizing-seo-with-meta-data-in-nextjs-15-a-comprehensive-guide-4pa7 | Metadata API walkthrough |
| Complete Next.js SEO Guide (Adeel Imran) | https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero | Zero-to-hero |
| Next.js SEO 2025 (SlateByes) | https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings | Best practices and performance |
| Next.js SEO (Strapi) | https://strapi.io/blog/nextjs-seo | Comprehensive crawlability guide |
| Structured Data Guide (eastondev) | https://eastondev.com/blog/en/posts/dev/20251219-nextjs-seo-guide/ | JSON-LD and structured data |
| SEO Optimization Guide (Medium) | https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7 | Next.js 15 SEO guide |

---

## File-Based CMS and Content Architecture

| Resource | URL | Notes |
|----------|-----|-------|
| Best CMS for Next.js 2026 (Hygraph) | https://hygraph.com/blog/nextjs-cms | Headless CMS landscape |
| Best Headless CMS for App Router (Infontic) | https://infontic.com/best-headless-cms-nextjs-app-router/ | App Router specific |
| Headless CMS Guide (Naturaily) | https://naturaily.com/blog/next-js-cms | Migration checklist |
| CMS Migration Tips (Contentful) | https://www.contentful.com/blog/cms-migration-tips/ | Content migration best practices |
| CMS for Static Sites 2026 (SimplyStatic) | https://simplystatic.com/tutorials/cms-for-static-site/ | Static site CMS options |
| Next.js searchParams static generation fix | https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix | searchParams + SSG workaround |
| Next.js App Router SSG Guide | https://www.buttercups.tech/blog/react/nextjs-app-router-ssg-guide-static-site-generation-tips | SSG tips |
| SSG with Next.js (MDN) | https://developer.mozilla.org/en-US/blog/static-site-generation-with-nextjs/ | MDN walkthrough |`,
  },

  "external-sources": {
    language: "yaml",
    content: `---
# Sources Attribution
# Framer CMS Migration PRD — External Research
# Compiled: April 2026

meta:
  project: framer-cms-migration
  compiled_date: "2026-04-09"
  researcher: Claude Sonnet 4.6 (claude-sonnet-4-6)

sources:

  # --- Next.js Official ----------------------------------------------

  - id: nextjs-16-release
    title: "Next.js 16 Release Blog"
    url: "https://nextjs.org/blog/next-16"
    publisher: Vercel
    published: "2025-10-21"
    accessed: "2026-04-09"
    type: official-docs
    topics: [nextjs-16, turbopack, cache-components, proxy-ts, react-19.2]

  - id: nextjs-16-1-release
    title: "Next.js 16.1 Release Blog"
    url: "https://nextjs.org/blog/next-16-1"
    publisher: Vercel
    published: "2025-12"
    accessed: "2026-04-09"
    type: official-docs
    topics: [nextjs-16, turbopack-filesystem-caching, next-upgrade-cli]

  - id: nextjs-16-2-release
    title: "Next.js 16.2 Release Blog"
    url: "https://nextjs.org/blog/next-16-2"
    publisher: Vercel
    published: "2026-03-18"
    accessed: "2026-04-09"
    type: official-docs
    topics: [nextjs-16, performance, adapters, imageresponse, turbopack]

  - id: nextjs-upgrade-v16
    title: "Upgrading: Version 16"
    url: "https://nextjs.org/docs/app/guides/upgrading/version-16"
    publisher: Vercel
    type: official-docs
    topics: [nextjs-16, breaking-changes, migration]

  - id: nextjs-generate-static-params
    title: "Functions: generateStaticParams"
    url: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params"
    publisher: Vercel
    type: official-docs
    topics: [ssg, static-generation, app-router]

  - id: nextjs-generate-metadata
    title: "Functions: generateMetadata"
    url: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata"
    publisher: Vercel
    type: official-docs
    topics: [seo, metadata, open-graph]

  - id: nextjs-image-component
    title: "Components: Image Component"
    url: "https://nextjs.org/docs/app/api-reference/components/image"
    publisher: Vercel
    type: official-docs
    topics: [image-optimization, next-image]

  - id: nextjs-image-optimization-guide
    title: "Getting Started: Image Optimization"
    url: "https://nextjs.org/docs/app/getting-started/images"
    publisher: Vercel
    type: official-docs
    topics: [image-optimization]

  - id: nextjs-mdx-guide
    title: "Guides: MDX"
    url: "https://nextjs.org/docs/app/guides/mdx"
    publisher: Vercel
    type: official-docs
    topics: [mdx, next-mdx-remote, at-next-mdx]

  - id: nextjs-metadata-og
    title: "Getting Started: Metadata and OG images"
    url: "https://nextjs.org/docs/app/getting-started/metadata-and-og-images"
    publisher: Vercel
    type: official-docs
    topics: [seo, metadata, og-images]

  - id: nextjs-isr
    title: "Guides: Incremental Static Regeneration"
    url: "https://nextjs.org/docs/app/guides/incremental-static-regeneration"
    publisher: Vercel
    type: official-docs
    topics: [isr, caching]

  # --- MDX / next-mdx-remote -----------------------------------------

  - id: next-mdx-remote-github
    title: "next-mdx-remote GitHub"
    url: "https://github.com/hashicorp/next-mdx-remote"
    publisher: HashiCorp
    accessed: "2026-04-09"
    type: github
    status: archived
    archive_date: "2026-04-09"
    topics: [mdx, next-mdx-remote, rsc]
    note: "Archived on the same day research was compiled. No further maintenance."

  - id: next-mdx-remote-client-github
    title: "next-mdx-remote-client GitHub"
    url: "https://github.com/ipikuka/next-mdx-remote-client"
    publisher: ipikuka
    accessed: "2026-04-09"
    type: github
    status: active
    topics: [mdx, next-mdx-remote, rsc, fork]

  - id: next-mdx-remote-rsc-vs-next-mdx
    title: "next-mdx-remote/rsc vs @next/mdx in Next.js 15"
    url: "https://blixamo.com/blog/next-mdx-remote-rsc-vs-next-mdx-nextjs-15"
    publisher: Blixamo
    type: blog
    topics: [mdx, next-mdx-remote, at-next-mdx, comparison]

  - id: mdx-comparison-dev-to
    title: "Quick Comparison of MDX Integration Strategies with Next.js"
    url: "https://dev.to/tylerlwsmith/quick-comparison-of-mdx-integration-strategies-with-next-js-1kcm"
    publisher: DEV Community (Tyler L. W. Smith)
    type: blog
    topics: [mdx, mdx-bundler, comparison]

  - id: next-mdx-remote-alternatives-discussion
    title: "next-mdx-remote Alternatives — GitHub Discussion"
    url: "https://github.com/hashicorp/next-mdx-remote/discussions/438"
    publisher: GitHub / HashiCorp
    type: community
    topics: [mdx, alternatives]

  - id: turbopack-next-mdx-remote-issue
    title: "Turbopack compatibility issue with next-mdx-remote"
    url: "https://github.com/vercel/next.js/issues/64525"
    publisher: Vercel (GitHub Issues)
    type: github-issue
    status: open
    topics: [turbopack, next-mdx-remote, compatibility]

  - id: rsc-mode-next-mdx-remote-issue
    title: "Cannot use RSC mode with Next.js 15.2.x + next-mdx-remote 5.0.0"
    url: "https://github.com/hashicorp/next-mdx-remote/issues/488"
    publisher: GitHub / HashiCorp
    type: github-issue
    topics: [rsc, next-mdx-remote, nextjs-15]

  # --- Framer CMS / Migration ----------------------------------------

  - id: framer-porting-data
    title: "Framer Help: Porting your data from Framer"
    url: "https://www.framer.com/help/articles/porting-your-data-from-framer/"
    publisher: Framer
    type: official-docs
    topics: [framer, cms-export, migration]

  - id: framer-cms-export-plugin
    title: "CMS Export Plugin — Framer Marketplace"
    url: "https://www.framer.com/marketplace/plugins/cms-export/"
    publisher: Framer
    type: official-docs
    topics: [framer, cms-export]

  - id: framer-to-static-browsercat
    title: "Migrate Your Framer Site to a Static Site"
    url: "https://www.browsercat.com/post/migrate-framer-to-static"
    publisher: BrowserCat
    type: blog
    topics: [framer, migration, static-site]

  # --- Tailwind CSS v4 -----------------------------------------------

  - id: tailwind-v4-upgrade-guide
    title: "Tailwind CSS Upgrade Guide"
    url: "https://tailwindcss.com/docs/upgrade-guide"
    publisher: Tailwind Labs
    type: official-docs
    topics: [tailwind-v4, migration, breaking-changes]

  - id: tailwind-v4-migration-dev-to
    title: "Tailwind CSS v4 Migration Guide (2026)"
    url: "https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4"
    publisher: DEV Community
    type: blog
    topics: [tailwind-v4, migration]

  - id: tailwind-v4-css-first-medium
    title: "Tailwind v4 Migration: From JavaScript Config to CSS-First in 2025"
    url: "https://medium.com/better-dev-nextjs-react/tailwind-v4-migration-from-javascript-config-to-css-first-in-2025-ff3f59b215ca"
    publisher: Medium / Better Dev
    type: blog
    topics: [tailwind-v4, css-first, migration]

  # --- Framer Motion -------------------------------------------------

  - id: framer-motion-v12-vs-react-spring
    title: "Animating React UIs in 2025: Framer Motion 12 vs. React Spring 10"
    url: "https://hookedonui.com/animating-react-uis-in-2025-framer-motion-12-vs-react-spring-10/"
    publisher: Hooked On UI
    type: blog
    topics: [framer-motion, react-spring, animation, bundle-size]

  - id: framer-motion-advanced-2025
    title: "Mastering Framer Motion: Advanced Animation Techniques for 2025"
    url: "https://www.luxisdesign.io/blog/mastering-framer-motion-advanced-animation-techniques-for-2025"
    publisher: Luxis Design
    type: blog
    topics: [framer-motion, animation, portfolio]

  # --- Image Optimization --------------------------------------------

  - id: debugbear-nextjs-image
    title: "Next.js Image Optimization: The next/image Component"
    url: "https://www.debugbear.com/blog/nextjs-image-optimization"
    publisher: DebugBear
    type: blog
    topics: [image-optimization, next-image, core-web-vitals]

  - id: nextjs-perf-guide-2025
    title: "Next.js Performance Optimization: A Complete 2025 Guide"
    url: "https://justinmalinow.com/blog/nextjs-performance-optimization-guide"
    publisher: Justin Malinow
    type: blog
    topics: [performance, image-optimization, core-web-vitals]

  - id: image-optimization-2025-frontendtools
    title: "Image Optimization 2025: WebP, AVIF & Best Practices Guide"
    url: "https://www.frontendtools.tech/blog/modern-image-optimization-techniques-2025"
    publisher: FrontendTools
    type: blog
    topics: [avif, webp, image-optimization]

  # --- SEO ------------------------------------------------------------

  - id: nextjs-seo-guide-digital-applied
    title: "Next.js 15 SEO: Complete Guide to Metadata & Optimization"
    url: "https://www.digitalapplied.com/blog/nextjs-seo-guide"
    publisher: Digital Applied
    type: blog
    topics: [seo, metadata, og-images]

  - id: nextjs-seo-strapi
    title: "The Complete Next.js SEO Guide for Building Crawlable Apps"
    url: "https://strapi.io/blog/nextjs-seo"
    publisher: Strapi
    type: blog
    topics: [seo, sitemap, structured-data]

  - id: seo-nextjs-2025-slatebytes
    title: "Next.js SEO in 2025: Best Practices, Meta Tags, and Performance"
    url: "https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings"
    publisher: SlateByes
    type: blog
    topics: [seo, core-web-vitals, nextjs-15, nextjs-16]

  - id: structured-data-nextjs
    title: "Complete Next.js SEO Guide: From Zero to Hero"
    url: "https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero"
    publisher: Adeel Imran
    published: "2025-12-09"
    type: blog
    topics: [seo, structured-data, json-ld]

  # --- File-Based CMS / Content Architecture -------------------------

  - id: nextjs-cms-hygraph
    title: "10 best CMSs for Next.js in 2026"
    url: "https://hygraph.com/blog/nextjs-cms"
    publisher: Hygraph
    type: blog
    topics: [cms, headless-cms, file-based-cms]

  - id: searchparams-static-generation
    title: "Next.js searchParams Disables Static Generation — Architectural Fix"
    url: "https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix"
    publisher: Build with Matija
    type: blog
    topics: [ssg, searchparams, static-generation]

  - id: cms-migration-guide-flow
    title: "CMS Migration: The Ultimate Guide and Checklist (2025)"
    url: "https://www.flow.ninja/blog/cms-migration-guide"
    publisher: Flow.ninja
    type: blog
    topics: [cms-migration, content-migration]`,
  },

  "external-findings": {
    language: "markdown",
    content: `# External Research Findings — Framer CMS Migration
# Project: OS-Portfolio | Date: 2026-04-09

---

## Executive Summary

External research validated the migration's architectural decisions (file-based CMS, TypeScript registries, no-frontmatter MDX) as aligned with Next.js 16 best practices. One critical finding: \`next-mdx-remote\` was archived by HashiCorp on April 9, 2026 — migration to \`next-mdx-remote-client\` (a maintained fork) should be planned. Ten actionable optimization opportunities were identified across performance, SEO, and maintainability.

---

## Critical Finding: \`next-mdx-remote\` Archived

\`next-mdx-remote\` v6.0.0 was **archived by HashiCorp** — no further maintenance or security patches. The project functions correctly today, but migration should be planned before the next major Next.js version.

**Recommended path:** Replace with [\`next-mdx-remote-client\`](https://github.com/ipikuka/next-mdx-remote-client) — maintained fork with near-identical API. The change is a find-and-replace of import paths from \`next-mdx-remote/rsc\` to \`next-mdx-remote-client/rsc\`.

---

## Top 10 Actionable Takeaways

1. **Add \`dynamicParams = false\` to all slug routes** — Any route using \`generateStaticParams\` for a fixed content set should export this to return 404 for unknown slugs.

2. **Add \`transpilePackages: ['next-mdx-remote']\` to \`next.config.ts\`** — Turbopack compatibility issue ([vercel/next.js#64525](https://github.com/vercel/next.js/issues/64525)).

3. **Add \`priority\` prop to LCP hero images** — Project and blog page hero images are likely LCP. Without \`priority\`, they are lazy-loaded, hurting Core Web Vitals.

4. **Increase \`minimumCacheTTL\`** — Project uses 60s; Next.js 16 default is 14400s (4 hours). For a portfolio where images don't change between deploys, 60s causes unnecessary revalidation.

5. **Plan \`framer-motion\` -> \`motion/react\` import migration** — The canonical package is now \`motion\`. The \`framer-motion\` alias remains but will likely be deprecated.

6. **Use \`LazyMotion\` for Core Web Vitals** — Full Framer Motion bundle is ~55 kB gzipped. \`LazyMotion\` with \`domAnimation\` reduces initial JS by ~30 kB.

7. **Add JSON-LD structured data** — \`Article\` (blog), \`CreativeWork\` (projects), \`Organization\` (homepage) schemas are absent; can improve CTR by 20-30% via rich results.

8. **Expand \`sitemap.ts\`** — \`/free-assets\` and \`/playbooks\` routes are currently omitted.

9. **Migrate \`next-mdx-remote\` before Next.js 17** — Archived package won't receive compatibility fixes.

10. **Add \`blurDataURL\` to about page hero** — The 7008x4672px hero benefits most from a low-res blur placeholder.

---

## Architecture Assessment

### Well-Designed

- TypeScript registry pattern (\`data/*.ts\`) — full type safety, tree-shakeable, no runtime parsing
- Metadata in TypeScript + body in MDX — clean separation, no frontmatter parsing at runtime
- \`compileMDX\` in Server Components — zero MDX runtime shipped to browser
- \`remotePatterns: []\` — fully decoupled from Framer CDN
- AVIF -> WebP format chain — optimal format selection
- Programmatic sitemap + canonical URLs — correct SEO hygiene
- Permanent redirect for slug drift (\`gemini-infinite-nature\`)

### Needs Attention

| Issue | Priority |
|---|---|
| \`next-mdx-remote\` archived | High |
| Missing \`dynamicParams = false\` | Medium |
| Missing \`priority\` on hero images | Medium |
| No JSON-LD structured data | Medium |
| \`minimumCacheTTL: 60\` too low | Low |
| Incomplete sitemap | Low |
| No \`blurDataURL\` on large images | Low |

---

## Evidence Files

- [best-practices.md](./best-practices.md) — Next.js 16 SSG, MDX patterns, image optimization, file-based CMS, content migration, SEO
- [libraries.md](./libraries.md) — Deep evaluations of next-mdx-remote, framer-motion v12, next/image, Tailwind v4, and supporting libraries
- [references.md](./references.md) — 60+ curated links organized by topic
- [sources.yaml](./sources.yaml) — Full attribution with publisher, date, type, and topic tags`,
  },

  "briefs-overview": {
    language: "markdown",
    content: `# Briefs Overview: framer-cms-migration (All Waves)

Generated after all task briefs are complete.

---

## All Briefed Tasks

| Task | Title | Wave | Complexity | Model | Status |
|------|-------|------|------------|-------|--------|
| [T001](T001_image-download-script.md) | Write image download script | 1 | 4 | sonnet | ready |
| [T002](T002_typescript-schemas.md) | Define enriched TypeScript schemas | 1 | 5 | opus | ready |
| [T003](T003_content-directory-structure.md) | Set up content directory structure | 1 | 2 | sonnet | ready |
| [T004](T004_next-config-image-optimization.md) | Update next.config.ts for image optimization | 1 | 2 | sonnet | ready |
| [T005](T005_framer-cms-migration.md) | Migrate all 5 project data records | 2 | 8 | opus | ready |
| [T006](T006_framer-cms-migration.md) | Convert 4 blog posts from HTML to MDX files | 2 | 6 | opus | ready |
| [T007](T007_framer-cms-migration.md) | Migrate free resources data and copy assets | 2 | 4 | sonnet | ready |
| [T008](T008_framer-cms-migration.md) | Migrate legal page content from CSV HTML | 2 | 4 | sonnet | ready |
| [T013](T013_framer-cms-migration.md) | Create playbook schema and empty content infrastructure | 2 | 3 | sonnet | ready |
| [T009](T009_category-system.md) | Update category system to multi-tag with canonical slugs | 3 | 3 | sonnet | ready |
| [T010](T010_project-detail-page.md) | Update project detail page to render enriched schema | 3 | 7 | opus | ready |
| [T011](T011_blog-mdx-renderer.md) | Update blog system to render MDX files | 3 | 6 | opus | ready |
| [T012](T012_free-resources-components.md) | Create free resources data structure and card component | 3 | 5 | opus | ready |
| [T014](T014_project-listing-filter.md) | Update project listing to use multi-tag filtering | 3 | 4 | sonnet | ready |
| [T019](T019_homepage-images.md) | Update homepage components with downloaded image paths | 3 | 4 | sonnet | ready |
| [T020](T020_about-images.md) | Update about page components with downloaded image paths | 3 | 4 | sonnet | ready |
| [T015](T015_lab-page.md) | Build Lab / View All page | 4 | 5 | opus | ready |
| [T016](T016_seo-metadata.md) | Add SEO metadata generation from content | 4 | 4 | sonnet | ready |
| [T017](T017_content-validation.md) | Write content validation script | 4 | 4 | sonnet | ready |
| [T018](T018_template-stripping.md) | Write template stripping script | 4 | 5 | opus | ready |

---

## Wave Breakdown

### Wave 1 — Foundation (no dependencies, all run in parallel)

- **T001** — Node.js script that downloads ~75 images from framerusercontent.com to \`/public/images/\` with correct subdirectory layout. Idempotent, resilient to failures. Output required by T005, T019, T020.
- **T002** — Enriches \`src/types/project.ts\` and \`src/types/blog.ts\`, adds new \`src/types/playbook.ts\` and \`src/types/free-resources.ts\`. Installs \`next-mdx-remote\`. Updates existing data stubs to match new schemas so the build stays green. Required by T005, T006, T007, T008, T013.
- **T003** — Creates \`src/content/blog/\`, \`src/content/playbooks/\`, and \`src/content/legal/\` with \`.gitkeep\` and \`README.md\` files. Verifies tsconfig path resolution. Required by T006, T008, T013.
- **T004** — Adds an \`images\` block to \`next.config.ts\`: empty \`remotePatterns\`, \`deviceSizes\`, \`imageSizes\`, \`formats\`. Documents the about-page hero size consideration. Required by T019, T020.

### Wave 2 — Content Migration (depends on Wave 1)

All Wave 2 tasks can run in **parallel** once their specific Wave 1 dependencies are met:

| Task | Specific Dependencies |
|------|-----------------------|
| T005 | T001 (images downloaded), T002 (Project type enriched) |
| T006 | T002 (BlogPost type with contentPath), T003 (src/content/blog/ exists) |
| T007 | T001 (public/images structure), T002 (FreeResource type) |
| T008 | T002 (next-mdx-remote installed), T003 (src/content/ structure) |
| T013 | T002 (Playbook type), T003 (src/content/playbooks/ exists) |

- **T005** — Populates \`src/data/projects.ts\` with all 5 enriched project records from Framer CSV. Full section content (Challenge/Solution/Impact), image arrays, categories as \`string[]\`, testimonials (Iterra), results (BILTFOUR/NEXT/UA). Also updates filter logic in the projects page.
- **T006** — Creates 4 MDX files in \`src/content/blog/\` (EP02, EP01, Democratizing, MCP for Designers). Replaces 3 stub posts in \`src/data/blog.ts\` with 4 real posts using \`contentPath\` field. Adds 4th post entirely missing from codebase.
- **T007** — Creates \`src/data/free-resources.ts\` with 5 resource records. Copies 10 media files (9 images + 1 MP4) from the \`OS_our-links\` repo to \`public/images/resources/\`.
- **T008** — Creates \`/legal/terms\` and \`/legal/privacy\` routes with shared layout. Converts Framer Legal.csv HTML to MDX. Updates footer navigation hrefs from \`/terms\` -> \`/legal/terms\`.
- **T013** — Creates empty \`src/data/playbooks.ts\`, \`src/app/playbooks/page.tsx\` (empty state), and \`src/app/playbooks/[slug]/page.tsx\` (shell with graceful empty \`generateStaticParams\`).

### Wave 3 — Component Updates (depends on Wave 2)

- **T009** — Creates \`src/data/categories.ts\` with 5 canonical slugs and display labels. Removes old \`ProjectCategory\` enum. Updates filter components to use new data source. Required by T014.
- **T010** — Replaces placeholder layout in \`project-detail.tsx\` with full case study rendering: sections (Challenge/Solution/Impact), gallery images, testimonials (Iterra only), results metrics, services, CTA. Creates 4 new sub-components.
- **T011** — Adds \`src/lib/mdx.ts\` + \`src/components/blog/mdx-components.tsx\`. Updates blog detail page to read MDX files from disk and compile via \`next-mdx-remote\`. Replaces the primitive paragraph splitter in \`blog-post.tsx\`.
- **T012** — Creates \`FreeResourceCard\` and \`FreeResourcesGrid\` components in \`src/components/resources/\`. Handles image and video media types, hover crossfade, badge variants, and external CTA links.
- **T014** — Completes multi-tag filter integration: \`project-filters.tsx\` uses display labels from \`categories.ts\`; filter state uses slugs; multi-tag intersection works correctly.
- **T019** — Wires downloaded images into \`OurExpertiseSection\` (service images in accordion), \`ProjectCard\` (project thumbnails via next/image), and verifies blog thumbnail paths. Updates \`what-we-do.ts\` with optional \`image\` field.
- **T020** — Updates \`TeamShowcase\` team photos and \`AboutHero\` to render downloaded about-page images. Adds large hero image below the about page text.

### Wave 4 — Integration and Polish (depends on Waves 2 + 3)

- **T015** — Creates \`/src/app/lab/page.tsx\` as a unified content hub showing all 5 free resources, 4 blog posts, and a graceful empty state for playbooks. Updates navigation to \`/lab\`. Creates \`LabHero\` component.
- **T016** — Adds/improves \`generateMetadata()\` with og:image and canonical URLs on all dynamic pages. Adds static metadata to static pages that are missing it.
- **T017** — Node.js script \`scripts/validate-content.js\` that checks all image paths, MDX content paths, required fields, and HTTPS URLs across all data files. CI-ready: exits 0/1.
- **T018** — Node.js script \`scripts/strip-for-template.js\` that removes proprietary MDX content, replaces data files with template stubs, creates placeholder images, and verifies the build still passes.

---

## Wave 2 File Overlap Analysis

No file conflicts exist across Wave 2 tasks. All tasks touch disjoint files:

| File | Task | Notes |
|------|------|-------|
| \`src/data/projects.ts\` | T005 | Replaces stub records |
| \`src/app/projects/page.tsx\` | T005 | Updates filter logic only |
| \`src/components/projects/project-filters.tsx\` | T005 | Updates type from enum to string |
| \`src/content/blog/*.mdx\` | T006 (4 new files) | Net-new files |
| \`src/data/blog.ts\` | T006 | Replaces 3 stubs with 4 real records |
| \`src/data/free-resources.ts\` | T007 (creates) | Net-new file |
| \`public/images/resources/\` | T007 (10 asset files) | Net-new directory |
| \`src/content/legal/*.mdx\` | T008 (2 new files) | Net-new files |
| \`src/app/legal/**\` | T008 (3 new files) | Net-new routes |
| \`src/data/navigation.ts\` | T008 | Updates \`/terms\` -> \`/legal/terms\` hrefs only |
| \`src/data/playbooks.ts\` | T013 (creates) | Net-new file |
| \`src/app/playbooks/**\` | T013 (2 new files) | Net-new routes |

---

## Wave 3 Execution Order

\`\`\`
T009  --------------►  T014
T010  (independent of other Wave 3 tasks)
T011  (independent of other Wave 3 tasks)
T012  (independent of other Wave 3 tasks)
T019  (independent of other Wave 3 tasks)
T020  (independent of other Wave 3 tasks)
\`\`\`

Only T014 has an intra-wave dependency (on T009). All other Wave 3 tasks can run in parallel.

---

## Full Dependency Graph (All Waves)

\`\`\`
T001 --------------------------------------┐
                                           ├--► T005 --► T009 --► T014
T002 --------------------------------------┤     │
      │                                    │     └--------------► T010 --► T016
      │                                    ├--► T006 --► T011 --► T015 --► T016
      │                                    ├--► T007 --► T012 --► T015
T003 -┼------------------------------------┤                               T016
      │                                    ├--► T008
      │                                    └--► T013 --► T015
T004 -┘
      └--► T019
      └--► T020

T005 + T006 + T007 --► T017 --► T018
\`\`\`

---

## Quick Links

- [PRD](../PRD_framer-cms-migration.md)
- [Tasks](../tasks.yaml)
- [Research Findings](../research/findings.md)

---

_For full briefs, see individual \`T0XX_*.md\` files._
_PRD: framer-cms-migration | Waves: 1, 2, 3, 4 | Updated: 2026-04-07_`,
  },

  "brief-t001": {
    language: "markdown",
    content: `# Task Brief: T001

**Title:** Write image download script
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 1
**Feature Issue:** N/A (wave 1 foundation — no GitHub issue yet)

---

## Objective

Write a Node.js script at \`scripts/download-framer-images.js\` that downloads all ~75 images from \`framerusercontent.com\` into \`/public/images/\` with the correct subdirectory layout. The script must be idempotent, resilient to individual failures, and log progress clearly.

---

## Context

**Parent Feature:** Framer CMS Migration — framer-cms-migration PRD

The portfolio site at OS-Portfolio currently has empty image directories. Images for all 5 projects, the about page, homepage, and blog posts are hosted on Framer's CDN at \`framerusercontent.com\`. These CDN URLs follow the pattern:

\`\`\`
https://framerusercontent.com/images/{hash}.{ext}?width={w}&height={h}
\`\`\`

The query parameters are CDN-resizing hints — stripping them gives you the original-resolution file. All ~75 images must be downloaded locally to \`/public/images/\` before any downstream tasks (T005, T007, T019, T020) can populate correct image paths.

Currently, \`public/images/\` only contains:
- \`public/images/team/karim.webp\`
- \`public/images/team/morgan.webp\`

No \`projects/\`, \`blog/\`, \`about/\`, or \`homepage/\` subdirectories exist yet.

This task is part of **Wave 1** — the foundation phase. No other tasks depend on this completing before they start, but T005 (project data), T019 (homepage images), and T020 (about images) all depend on its output.

---

## Research Context

### Image Catalog (Full)

All source URLs use base: \`https://framerusercontent.com/images/{hash}.{ext}\` (strip any \`?\` params).

#### Projects

**Iterra** -> \`/public/images/projects/iterra/\`
- \`vvl6xyIdUMskDBgstfyClKSxE8.svg\` (hero)
- \`i8dim26bhvu5qQR9wg3QosYwH30.jpg\`
- \`dNN6V4QOZliCydifbZq9mZHgs.jpg\`
- \`4iGWtlK9qyEQGR3kn226neLeOx0.jpg\`
- \`8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg\`
- \`ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg\`
- \`iKQP3E2D7UXucYJbubSRc3A7I.jpg\`
- \`oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg\`

**BILTFOUR** -> \`/public/images/projects/biltfour/\`
- \`ZwDzuAZjuENRwaTtArVGJQsGc.svg\` (hero)
- \`sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg\`
- \`pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg\`
- \`fQNXA7iFcdLekr5tbHmESnMDE.jpg\`
- \`5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg\`
- \`VWj6qlkvnLdlyTExZDWZiezC104.jpg\`
- \`rPlUBgrbosziZBcZfJfPe8sIHA.jpg\`
- \`WUB4oauOJh26lOozw9rKdgUYRk.jpg\`

**NEXT (Google Cloud)** -> \`/public/images/projects/google-cloud-next/\`
- \`zwWkHCt1g0HSk5r9elbNigK55dk.svg\` (hero)
- \`EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg\`
- \`Zcgxim04ZIbn7CooJkyUahMgtU.jpg\`
- \`vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg\`
- \`Y1GhTfRUj1WegONQQcS7bRybV8I.jpg\`
- \`TVWePxkVuYJ2ynKwvW8na7Gz8.jpg\`
- \`1PeraZj4rwCBVywk3sEvPzcRvYw.jpg\`
- \`kdIwpWfuzthCYLWztP0haNTzq0.jpg\`

**Infinite Nature (Google Gemini)** -> \`/public/images/projects/google-gemini-infinite-nature/\`
(Canonical slug is \`google-gemini-infinite-nature\` per Framer CSV — see C3 note below)
- \`enyu0AxPncALYsOKGqBz5dcGo.svg\` (hero)
- \`0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg\`
- \`akEhFihTl9pdmzuHDf5W4UluIjA.jpg\`
- \`q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg\`
- \`69we6OfP9rfNdtqOohJDJYMYcC4.jpg\`
- \`ZWM3jBNXCq5MI740NZoGE0owGx4.jpg\`
- \`FhgyvB0QzTK3QC0aY40xLmw4K8.jpg\`
- \`fEgHnqjSmKjGa0On2DRyNU9HTo.jpg\`

**Universal Audio** -> \`/public/images/projects/universal-audio/\`
- \`Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg\` (hero)
- \`5rY7sMJWPqahP45iscJTiYEOw.jpg\`
- \`gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg\`
- \`VKLBL93wfWhPj6VObEt1a4HlEA.jpg\`
- \`2MalmzAFsqsCILwoPC2A6s6Hs.jpg\`
- \`UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif\`
- \`CJC7mcxaL9DGEYB4HGificxTbA.jpg\`
- \`PWbwliRrvDvOr6Iw28xulNrFSc.jpg\`

#### Homepage -> \`/public/images/homepage/\`
- \`5tYWjZYwckbQWoi9rQ9mkhAoLG8.png\` (hero)
- \`CIdLigrNXaT82y2MrGUQ5vZgJ9c.jpg\` (service 1)
- \`Kl75QrcWL7nXMDWTJy9SnCCpbPQ.jpg\` (service 2)
- \`XjqOKRycfg2fdjXcHMmUYeI4xLw.jpg\` (service 3)
- \`p9gXmNi8RoFZnjeP0zGW3fJ2M.jpg\` (service 4)
- \`nQ5h9VMZNz5knXmzATISCBWqakc.jpg\` (team photo)

#### About -> \`/public/images/about/\`
- \`Sj4TYZrc68BDHPXs5O5D19mVik.jpg\` (main hero, 7008x4672)
- \`HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg\` (Karim photo)
- \`Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp\` (Morgan photo)
- \`TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg\` (story 1)
- \`wKJt8b9CgcZCyP5NKky2RDcdQ.jpg\` (story 2)
- \`hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg\` (story 3)
- \`qvzOeu5vdocdhOTq2yANNjMg0.jpg\` (story 4)
- \`TgXt1wxY2v3DuvYWsEs5UJkYLW8.svg\` (BILTFOUR logo variant)

#### Blog -> \`/public/images/blog/\`
- \`KKSflaBzLhQtCCknGCHsQqbqU2s.jpg\` (EP02 thumbnail)
- \`dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg\` (EP01 thumbnail)
- \`c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg\` (Democratizing thumbnail)
- \`6zZWCJwMNLKAwcShUSZbwsO7prA.jpg\` (MCP for Designers thumbnail)

### Known Issues

- The CDN URLs sometimes include \`?width=X&height=Y\` params — always strip the query string before downloading.
- The \`about\` hero image is 7008x4672 — Next.js Image will optimize it at serve time, so download it as-is. Do not resize during download.
- \`UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif\` is a GIF for Universal Audio — treat it as a binary file (no text encoding).
- **Slug decision (Infinite Nature):** The existing codebase uses \`gemini-infinite-nature\` as the project slug, but the Framer CSV uses \`google-gemini-infinite-nature\`. This migration uses \`google-gemini-infinite-nature\` as the canonical slug going forward (the site is being migrated FROM Framer, so the Framer slug is the source of truth). Download images to \`/public/images/projects/google-gemini-infinite-nature/\`. T005 will use the same slug in project data. The hash filenames are intentional (they match the Framer CDN source identifiers) — semantic renaming is a future enhancement.

---

## Requirements

1. Script lives at \`scripts/download-framer-images.js\` (plain Node.js, no transpilation needed — CJS or ESM with \`.js\` extension is fine).
2. Uses only Node.js built-ins (\`https\`, \`fs\`, \`path\`) — no npm dependencies.
3. Downloads each URL to the correct local path (see Image Catalog above).
4. Strips query params from source URLs before fetching.
5. Skips files that already exist on disk (idempotent).
6. Follows HTTP redirects (framerusercontent.com may issue 301/302).
7. Logs each file: \`[skip] path/to/file.jpg\` or \`[done] path/to/file.jpg\` or \`[fail] path/to/file.jpg — {error message}\`.
8. Does not crash the entire run on a single download failure — catches errors per-file and continues.
9. Prints a final summary: \`Downloaded: X | Skipped: Y | Failed: Z\`.
10. Creates parent directories automatically before writing files.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] \`scripts/download-framer-images.js\` exists
- [ ] Running \`node scripts/download-framer-images.js\` downloads ~57 new images from framerusercontent.com (the PRD figure of ~75 included client logos already present locally in \`/public/logos/\` — the script only downloads the ~57 framerusercontent.com images not yet present)
- [ ] Re-running the script skips all already-downloaded files without re-fetching
- [ ] A single failed URL does not stop the remaining downloads
- [ ] All 5 project hero SVGs land in \`/public/images/projects/{slug}/\`
- [ ] All project gallery JPGs land in \`/public/images/projects/{slug}/\`
- [ ] About page images (hero, team photos, story images) land in \`/public/images/about/\`
- [ ] Homepage images land in \`/public/images/homepage/\`
- [ ] Blog thumbnails (4 JPGs) land in \`/public/images/blog/\`
- [ ] Final summary line printed to stdout

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`scripts/download-framer-images.js\` | create | Node.js download script |

### File Ownership Notes

This task only creates a new file in a new directory. No conflicts with any other Wave 1 task.

---

## Implementation Guidance

### Script Structure

Use a declarative manifest approach — define a flat array of \`{ url, dest }\` objects, then iterate over them with a sequential or concurrent download loop.

\`\`\`js
// Suggested structure
const BASE = 'https://framerusercontent.com/images/';
const PUBLIC = 'public/images'; // relative to repo root

const IMAGES = [
  // projects/iterra
  { url: \`\${BASE}vvl6xyIdUMskDBgstfyClKSxE8.svg\`, dest: \`\${PUBLIC}/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg\` },
  // ... etc
];
\`\`\`

### HTTP Download (Node built-ins only)

\`\`\`js
const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    // Strip query params
    const cleanUrl = url.split('?')[0];
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (fs.existsSync(dest)) {
      return resolve('skip');
    }

    const file = fs.createWriteStream(dest);
    https.get(cleanUrl, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(\`HTTP \${res.statusCode}\`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('done'); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}
\`\`\`

### Concurrency

Run downloads with limited concurrency (5 at a time) to avoid overwhelming the CDN:

\`\`\`js
async function downloadAll(images, concurrency = 5) {
  const queue = [...images];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const { url, dest } = queue.shift();
      // try/catch per file
    }
  });
  await Promise.all(workers);
}
\`\`\`

### Edge Cases

- **Redirect loops:** Limit redirect following to a max depth of 5.
- **Empty file on failure:** Always \`fs.unlink\` the dest file if a download fails midway — prevents corrupt partial files.
- **SVG files:** Same download logic applies — SVGs are text but treated as binary streams here (no difference).
- **GIF file:** Same binary stream logic — no special handling needed.

### Code Style

- Plain CJS (\`require\`/\`module.exports\`) or ESM (\`import\`/\`export\`) — choose CJS since \`package.json\` does not set \`"type": "module"\`.
- No TypeScript — this is a plain \`.js\` utility script.
- No external dependencies.

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`

### Files Requiring Review

None for this task — only creating a new script file.

---

## Dependencies

### Upstream Tasks

None — this task has no dependencies and can start immediately.

### Downstream Impact

Tasks that depend on this one:
- **T005** (migrate project data) — needs project images downloaded
- **T007** (free resources) — independent, uses OS_our-links assets
- **T019** (homepage image paths) — needs homepage images downloaded
- **T020** (about page image paths) — needs about images downloaded

---

## GitHub Context

**Branch:** \`worktree/framer-cms-migration-T001\`
**Target:** feature branch \`feat/framer-cms-migration\` or main (determined by PM Agent)

---

## Commit Guidelines

\`\`\`
chore(scripts): add framer image download script

Downloads ~75 images from framerusercontent.com to public/images/
with correct subdirectory structure. Script is idempotent and
resilient to individual failures.

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before marking task complete:

- [ ] \`node scripts/download-framer-images.js\` runs without crashing
- [ ] Re-run shows all files skipped (idempotent)
- [ ] All 5 project subdirs exist under \`public/images/projects/\`
- [ ] \`public/images/blog/\`, \`public/images/about/\`, \`public/images/homepage/\` all contain files
- [ ] \`npm run build\` still passes (script does not affect build)
- [ ] \`npm run lint\` passes (script not linted by Next.js ESLint config — confirm with \`npm run lint\`)

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T001 | Wave: 1_`,
  },

  "brief-t002": {
    language: "markdown",
    content: `# Task Brief: T002

**Title:** Define enriched TypeScript schemas for all content types
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 5/10
**Model:** opus
**Wave:** 1
**Feature Issue:** N/A (wave 1 foundation)

---

## Objective

Enrich and extend the TypeScript type definitions in \`src/types/\` to support the full Framer CMS data model: enriched Project with sections/images/testimonials/results, updated BlogPost with \`contentPath\`, new Playbook type, new FreeResource types. Install \`next-mdx-remote\` for the MDX pipeline. Ensure \`npm run build\` passes after all type changes by updating any existing data files that reference changed types.

---

## Context

**Parent Feature:** Framer CMS Migration — framer-cms-migration PRD

The codebase has two type files today:

- \`src/types/project.ts\` — defines \`Project\`, \`ProjectCategory\` (enum), \`ViewMode\`
- \`src/types/blog.ts\` — defines \`BlogPost\`, \`BlogCategory\` (enum)

There is no \`src/types/index.ts\` barrel export file.

The current \`Project\` type uses a single \`category: ProjectCategory\` field (one of four hardcoded values) and has no fields for sections, gallery images, testimonials, results, or services. The Framer CMS data has all of these.

The current \`BlogPost\` type embeds content as a \`content: string\` field. The migration plan replaces this with \`contentPath: string\` (pointing to an MDX file). This is a breaking change — the existing \`src/data/blog.ts\` file must also be updated to remove the \`content\` field and add \`contentPath\`.

The current \`BlogCategory\` union (\`"Design" | "AI" | "Process" | "Insights"\`) does not match the actual Framer post categories. It must be replaced with the correct values.

No MDX rendering library is currently installed. \`next-mdx-remote\` must be added as a dependency.

This task is part of **Wave 1** — the foundation phase. T005 (project data), T006 (blog MDX), T007 (free resources), T008 (legal), and T013 (playbooks) all depend on the types defined here.

---

## Research Context

### Current Type Files (Exact Content)

**\`src/types/project.ts\` (current):**
\`\`\`typescript
export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;  // ← REMOVE this field
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
}

export type ProjectCategory =
  | "Brand Identity"
  | "Digital Design"
  | "Art Direction"
  | "Strategy";

export const projectCategories: ProjectCategory[] = [
  "Brand Identity",
  "Digital Design",
  "Art Direction",
  "Strategy",
];

export type ViewMode = "carousel" | "two-column" | "grid";
\`\`\`

**\`src/types/blog.ts\` (current):**
\`\`\`typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;  // ← REMOVE this field
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

export type BlogCategory = "Design" | "AI" | "Process" | "Insights";

export const blogCategories: BlogCategory[] = [
  "Design",
  "AI",
  "Process",
  "Insights",
];
\`\`\`

### Current Data Files That Reference These Types

**\`src/data/projects.ts\`** — imports \`Project\` from \`@/types/project\`. Uses \`category: "Brand Identity"\` etc. — this will become \`categories: string[]\`. You must update this file to match the new schema so \`npm run build\` passes.

**\`src/data/blog.ts\`** — imports \`BlogPost\` from \`@/types/blog\`. Uses \`content: string\` embedded markdown. You must update this file to remove \`content\` and add \`contentPath\`. The actual MDX files don't exist yet (T003/T006 create them) — use a placeholder path like \`"blog/placeholder.mdx"\` for now.

### Components That Use \`ProjectCategory\`

Search these locations for \`ProjectCategory\` or \`.category\` references before finalizing:
- \`src/app/projects/page.tsx\` — likely uses \`projectCategories\` for filter tabs
- \`src/app/projects/[slug]/page.tsx\` — likely renders \`project.category\`
- Any component that imports from \`@/types/project\`

**Action:** Update any component that reads \`project.category\` (singular string) to read \`project.categories\` (string array). This is a breaking change — do not leave it for a later task or \`npm run build\` will fail.

### Known Issues to Address

- The \`category\` -> \`categories\` rename is a breaking change across data files and components. Audit all usages before committing.
- \`BlogCategory\` values are being completely replaced — any component that hardcodes the old values (\`"Design"\`, \`"AI"\`, etc.) must be updated.
- \`next-mdx-remote\` latest version as of 2026 should be compatible with Next.js 16. Verify by checking the npm page or README before installing.

---

## Requirements

### 1. Update \`src/types/project.ts\`

Replace the existing file with the enriched schema. Keep \`ViewMode\` export — it is used by the project listing page.

\`\`\`typescript
// TEMPLATE: replace with your content

export interface ProjectSection {
  heading: string;     // e.g. "The Challenge"
  headline: string;    // Bold intro sentence
  body: string;        // Full paragraph
}

export interface ProjectImage {
  src: string;         // e.g. /images/projects/iterra/filename.jpg
  alt: string;
  context: 'hero' | 'gallery' | 'mockup';
  section?: 'challenge' | 'solution' | 'impact';
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  // --- enriched fields ---
  categories: string[];           // replaces single category enum
  services: string[];
  duration?: string;
  buttonText?: string;
  buttonHref?: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}

// Keep for backwards compat — old enum no longer used on Project
// but may still be used in filter UI until T009 replaces it
export type ProjectCategory =
  | "Brand Identity"
  | "Digital Design"
  | "Art Direction"
  | "Strategy";

export const projectCategories: ProjectCategory[] = [
  "Brand Identity",
  "Digital Design",
  "Art Direction",
  "Strategy",
];

export type ViewMode = "carousel" | "two-column" | "grid";
\`\`\`

**Note:** Keep \`ProjectCategory\` and \`projectCategories\` temporarily to avoid breaking the filter UI — T009 will remove them in Wave 3.

### 2. Update \`src/types/blog.ts\`

\`\`\`typescript
// TEMPLATE: replace with your content

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // path to MDX file, e.g. "blog/ep02-creative-ai-framework.mdx"
  content?: string;      // BRIDGE: optional empty string kept by T006 to prevent blog-post.tsx crash before T011 lands; T011 removes it
  author: {
    name: string;
    image?: string;
  };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

export type BlogCategory =
  | 'Creative Philosophy'
  | 'About Us'
  | 'Digital Design'
  | 'Design Strategy'
  | 'Brand Identity';

export const blogCategories: BlogCategory[] = [
  'Creative Philosophy',
  'About Us',
  'Digital Design',
  'Design Strategy',
  'Brand Identity',
];
\`\`\`

### 3. Create \`src/types/playbook.ts\`

\`\`\`typescript
// TEMPLATE: replace with your content

export interface Playbook {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;   // path to MDX file, e.g. "playbooks/slug.mdx"
  author: {
    name: string;
    image?: string;
  };
  date: string;
  category: string;
  thumbnail: string;
  readingTime: string;
}
\`\`\`

### 4. Create \`src/types/free-resources.ts\`

\`\`\`typescript
// TEMPLATE: replace with your content

export type ResourceBadge = 'live' | 'coming-soon';

export interface ResourceMedia {
  type: 'image' | 'video';
  src: string;
}

export interface FreeResource {
  id: string;
  badge: ResourceBadge;
  media: ResourceMedia;
  hoverImage?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}
\`\`\`

### 5. Create \`src/types/index.ts\`

**This file does not yet exist — create it.** \`src/types/\` currently only has \`blog.ts\` and \`project.ts\`. The barrel export collects all four type files:

\`\`\`typescript
export * from './project';
export * from './blog';
export * from './playbook';
export * from './free-resources';
\`\`\`

Verify all four files exist before writing this barrel export (i.e., confirm \`playbook.ts\` and \`free-resources.ts\` were created in steps 3 and 4 above).

### 6. Update \`src/data/projects.ts\` to match new schema

The existing \`projects.ts\` uses \`category: "Brand Identity"\` — this will cause a TypeScript error once \`category\` is removed from the \`Project\` interface. Update each project to use \`categories: string[]\` and add stub values for required new fields (\`sections: []\`, \`images: []\`, \`services: []\`). Actual content will be populated in T005.

Example minimal stub for each project:
\`\`\`typescript
{
  id: "iterra",
  slug: "iterra",
  title: "Iterra",
  client: "Iterra",
  year: "2025",
  industry: "Technology",
  description: "...",
  thumbnail: "/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg",
  featured: true,
  tags: ["Logo", "Visual Identity", "Guidelines"],
  // new required fields
  categories: ["brand-identity"],
  services: [],
  sections: [],
  images: [],
}
\`\`\`

### 7. Update \`src/data/blog.ts\` to match new schema

Remove the \`content: string\` embedded markdown from each post. Add \`contentPath: string\` with a placeholder path. Update \`category\` values to match the new \`BlogCategory\` union.

Example:
\`\`\`typescript
{
  id: "ep02-creative-ai-framework",
  slug: "ep02-creative-ai-framework",
  title: "EP02: Creative AI Framework",
  excerpt: "...",
  contentPath: "blog/ep02-creative-ai-framework.mdx",  // file created in T006
  author: { name: "Karim Bouhdary" },
  date: "2026-02-03",
  category: "Creative Philosophy",
  thumbnail: "/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg",
  readingTime: "5 min read",
  featured: true,
}
\`\`\`

**Replace all 3 existing placeholder posts** with the 4 real posts from Framer (see Research Context for slugs/dates).

### 8. Install \`next-mdx-remote\`

\`\`\`bash
npm install next-mdx-remote
\`\`\`

Verify compatibility: \`next-mdx-remote\` v4+ supports Next.js App Router. Check that the installed version does not conflict with React 19 (it should be fine). Do not modify \`package-lock.json\` directly — let npm manage it.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] \`src/types/project.ts\` exports \`Project\`, \`ProjectSection\`, \`ProjectImage\`, \`ProjectTestimonial\`, \`ViewMode\`
- [ ] \`Project.category\` field removed; \`Project.categories: string[]\` present
- [ ] \`src/types/blog.ts\` exports \`BlogPost\` with \`contentPath\` field (no \`content\` field)
- [ ] \`BlogCategory\` union includes \`'Creative Philosophy'\`, \`'About Us'\`, \`'Digital Design'\`
- [ ] \`src/types/playbook.ts\` exists and exports \`Playbook\`
- [ ] \`src/types/free-resources.ts\` exists and exports \`FreeResource\`, \`ResourceBadge\`, \`ResourceMedia\`
- [ ] \`src/types/index.ts\` barrel exports all four type files
- [ ] \`src/data/projects.ts\` updated — no TypeScript errors (uses \`categories\` not \`category\`)
- [ ] \`src/data/blog.ts\` updated — no TypeScript errors (uses \`contentPath\` not \`content\`)
- [ ] \`next-mdx-remote\` appears in \`package.json\` dependencies
- [ ] \`npm run build\` passes with no TypeScript errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/types/project.ts\` | modify | Add ProjectSection, ProjectImage, ProjectTestimonial; replace category with categories |
| \`src/types/blog.ts\` | modify | Replace content with contentPath; expand BlogCategory union |
| \`src/types/playbook.ts\` | create | New Playbook type |
| \`src/types/free-resources.ts\` | create | New FreeResource, ResourceBadge, ResourceMedia types |
| \`src/types/index.ts\` | create (file does not yet exist) | Barrel export for all four type files |
| \`src/data/projects.ts\` | modify | Update to use categories[] and stub new required fields |
| \`src/data/blog.ts\` | modify | Replace content with contentPath; update categories and slugs to Framer data |
| \`package.json\` | modify | Add next-mdx-remote dependency |

### File Ownership Notes

\`src/data/projects.ts\` is also touched by T005, which fully populates project data. This task only stubs the new required fields — T005 will overwrite the data section. No conflict expected because this task runs first (Wave 1) and T005 runs in Wave 2.

\`src/data/blog.ts\` is also touched by T006 (blog MDX migration). Same pattern — this task stubs the contentPath and updates metadata; T006 provides actual MDX files.

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`

### Files Requiring Review

- \`package.json\` — modified to add \`next-mdx-remote\` (expected; review before committing)

---

## Dependencies

### Upstream Tasks

None — this task has no dependencies and can start immediately.

### Downstream Impact

Tasks that depend on this one:
- **T005** — project data migration (needs enriched Project type)
- **T006** — blog MDX migration (needs BlogPost with contentPath)
- **T007** — free resources data (needs FreeResource type)
- **T008** — legal pages (needs T002 + T003)
- **T013** — playbook scaffolding (needs Playbook type)

---

## GitHub Context

**Branch:** \`worktree/framer-cms-migration-T002\`
**Target:** feature branch \`feat/framer-cms-migration\` or main (determined by PM Agent)

---

## Commit Guidelines

\`\`\`
refactor(types): enrich TypeScript schemas for CMS migration

- Add ProjectSection, ProjectImage, ProjectTestimonial interfaces
- Replace Project.category enum with categories string[]
- Replace BlogPost.content with contentPath for MDX
- Expand BlogCategory union with Creative Philosophy, About Us, Digital Design
- Add Playbook and FreeResource types
- Create src/types/index.ts barrel export
- Update data stubs to match new schemas
- Install next-mdx-remote

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] \`npm run build\` passes with no TypeScript errors
- [ ] \`npm run lint\` passes with no errors
- [ ] No \`never_touch\` files modified
- [ ] All new type files have \`// TEMPLATE: replace with your content\` comment at top

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T002 | Wave: 1_`,
  },

  "brief-t005": {
    language: "markdown",
    content: `# Task Brief: T005

**Title:** Migrate all 5 project data records
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 8/10
**Model:** opus
**Wave:** 2

---

## Objective

Populate \`/src/data/projects.ts\` with the full enriched data for all 5 projects (Iterra, BILTFOUR, NEXT/Google Cloud, Infinite Nature, Universal Audio). Each project record must include the complete structured content sourced from Framer CMS: categories as a \`string[]\`, services, sections (Challenge/Solution/Impact), images with local paths, testimonials (Iterra only), and results/metrics (BILTFOUR, NEXT, Universal Audio). Also update the project listing filter logic to handle array-based category matching.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The portfolio site at \`/src/data/projects.ts\` currently has 5 stub project records with minimal fields — a single \`category\` string, no sections, no gallery images, and no enriched content. The Framer CMS CSV (\`Projects.csv\`) contains the full structured content for all 5 projects including 3-paragraph case study sections, image URLs, metadata, and external links.

Wave 1 (T001 + T002) must complete before this task:
- **T001** downloads all project images from \`framerusercontent.com\` to \`/public/images/projects/{slug}/\`
- **T002** enriches the TypeScript schema in \`/src/types/project.ts\` to support the new fields

This task populates the data layer using the enriched types from T002 and the downloaded images from T001.

This task is part of **Wave 2** — content migration, where all raw Framer CMS data is written into the Next.js data layer.

---

## Requirements

### Schema Expected from T002

After T002 completes, \`/src/types/project.ts\` will export these types (use them verbatim):

\`\`\`typescript
export interface ProjectSection {
  heading: string;
  headline: string;
  body: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  context: "hero" | "gallery" | "mockup";
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  categories: string[];        // replaces single \`category\`
  industry: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  tags: string[];
  services: string[];
  duration: string;
  buttonText: string;
  buttonHref: string;
  sections: ProjectSection[];
  images: ProjectImage[];
  testimonials?: ProjectTestimonial[];
  results?: string[];
}
\`\`\`

**Note:** If T002 hasn't landed yet when you start, confirm the schema matches before writing data. The \`category\` field (singular) is replaced by \`categories\` (array). The \`projectCategories\` const and \`ProjectCategory\` type are removed or replaced.

### Filter Logic Change (NOT in scope for T005)

**T009 owns all filter logic changes in \`src/app/projects/page.tsx\`.** Do NOT modify filter logic or the projects page in this task. T005 is scoped exclusively to populating the \`src/data/projects.ts\` data file and adding the redirect rule for the old Infinite Nature slug.

The filter change from \`p.category === activeFilter\` to \`p.categories.includes(activeFilter)\` will be done by T009 in Wave 3.

---

## Full Project Data (Source: Framer CSV + Research Findings)

### Canonical Category Slugs

From \`Categories.csv\`:
- \`art-direction\` -> "Art Direction"
- \`strategy\` -> "Strategy"
- \`digital-design\` -> "Digital Design"
- \`brand-identity\` -> "Brand Identity"
- \`web-design\` -> "Web Design"

### Image Path Convention

Images are downloaded by T001 to \`/public/images/projects/{slug}/\`. The filename convention matches the hash portion of the Framer URL (without query params), e.g.:
- \`framerusercontent.com/images/vvl6xyIdUMskDBgstfyClKSxE8.svg\` -> \`/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg\`

---

### Project 1: Iterra

**Slug:** \`iterra\`
**CSV Categories field:** \`brand-identity,strategy\`
**Year:** 2025
**Client:** Iterra
**Duration:** 1 month
**Scope:** Brand Identity & Guidelines
**Button:** text="Coming Soon", href="" (empty — no link)

**Overview (description):**
> We helped Iterra, a Pacific Northwest 3D manufacturing company, establish a professional brand identity that elevated their business from a small-scale operation to a legitimate brand with scalable visual systems.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Taking a growing manufacturer to the next level through brand. | Iterra came to us as a Pacific Northwest 3D manufacturing company producing accessories for the off-road and camping community. While their products were solid, they lacked the visual identity to compete professionally in the market. As an in-house operation ready to scale, they needed more than a logo—they needed a complete brand foundation that could support their growth from small-scale manufacturer to established brand, while staying true to their hands-on expertise. |
| Solution | Solution | Layers and patterns that mirror the 3D printing process itself. | Through intensive workshops and mood board sessions, we developed a visual language inspired by the very nature of 3D printing—building from the ground up, layer by layer. The identity combines clean geometric shapes and angles with warm, natural textures that reflect their Pacific Northwest environment. Every element was documented in comprehensive brand guidelines, creating a scalable system that could evolve with their business growth while maintaining authenticity. |
| Impact | Impact | "This identity forced us into existence as a true brand." | The transformation was immediate and profound. The founders reported feeling like they'd evolved from a manufacturing operation to a legitimate brand overnight. 'We feel like a real company now,' they told us. 'This identity forced us into existence as not just a manufacturing business, but a true 3D company for the future.' The brand system gave them the confidence and tools to compete with established players while maintaining their authentic, craft-focused approach. |

**Testimonial (Iterra only):**
- Quote: "This identity forced us into existence as a true brand."
- Author: Iterra Founders

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| \`/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg\` | Iterra brand hero | hero |
| \`/images/projects/iterra/i8dim26bhvu5qQR9wg3QosYwH30.jpg\` | Iterra brand identity — gallery 1 | gallery |
| \`/images/projects/iterra/dNN6V4QOZliCydifbZq9mZHgs.jpg\` | Iterra brand identity — gallery 2 | gallery |
| \`/images/projects/iterra/4iGWtlK9qyEQGR3kn226neLeOx0.jpg\` | Iterra brand identity — gallery 3 | gallery |
| \`/images/projects/iterra/8Fzr2bWXJ4rfwYVgMyCTaMY1g.jpg\` | Iterra brand identity — gallery 4 | gallery |
| \`/images/projects/iterra/ik8GE2cFM5uwwOAW7Rm0E0RbOog.jpg\` | Iterra brand mockup — impact 1 | mockup |
| \`/images/projects/iterra/iKQP3E2D7UXucYJbubSRc3A7I.jpg\` | Iterra brand mockup — impact 2 | mockup |
| \`/images/projects/iterra/oWXlEebiIBfCcgSM59CKhTMqlsQ.jpg\` | Iterra brand mockup — impact 3 | mockup |

**Services:** \`["Brand Identity", "Visual Systems", "Brand Guidelines"]\`

---

### Project 2: BILTFOUR

**Slug:** \`biltfour\`
**CSV Categories field:** \`art-direction,digital-design,strategy,web-design,brand-identity\`
**Year:** 2024-2025
**Client:** BILTFOUR
**Duration:** 1 year
**Scope:** Brand Identity, E-commerce, Community Building
**Button:** text="Visit Site", href="https://www.biltfour.com/"

**Overview (description):**
> We partnered with BILTFOUR from inception to build a premium brand identity for their modular aluminum drawer systems, creating a scalable design ecosystem that generated hundreds of thousands of social media views and established immediate market presence as a premium player.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Creating a premium brand that speaks to discerning builders and adventurers. | BILTFOUR came to us with an innovative vision: modular aluminum drawer systems that work like LEGO—stacking vertically and horizontally in different configurations. They needed a brand that could capture their technical precision while appealing to a sophisticated audience who values quality over trends. The challenge was positioning them in the sweet spot between utilitarian and luxury—think Land Cruiser, not Land Rover—while building authentic community connections from day one. |
| Solution | Solution | Technical grit meets systematic brand building. | We developed a comprehensive brand identity with a 'technical grit' aesthetic that resonated with discerning customers who appreciate purposeful design. Our systematic approach went beyond digital—we designed apparel, event booths, and showed up at expos and local meetups to understand our audience firsthand. The custom Shopify e-commerce platform was optimized for conversion and SEO, while our content production system enabled consistent storytelling across all channels. Every touchpoint reinforced BILTFOUR's position as the premium choice for modular storage. |
| Impact | Impact | From startup to premium market leader in under a year. | The results exceeded expectations: hundreds of thousands of social media views, overwhelmingly positive customer feedback, and rapid establishment as a premium brand in the modular storage market. By combining systematic design thinking with authentic community engagement, BILTFOUR achieved the kind of brand equity that typically takes established companies years to build. The scalable design system continues to support their growth while maintaining the technical precision their customers expect. |

**Results:**
\`\`\`
["Hundreds of thousands of social media views", "Rapid establishment as premium market leader", "Scalable design system supporting ongoing growth"]
\`\`\`

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| \`/images/projects/biltfour/ZwDzuAZjuENRwaTtArVGJQsGc.svg\` | BILTFOUR brand hero | hero |
| \`/images/projects/biltfour/sjrpQHo4w4oBUX8dPQaGDaJkNZg.jpg\` | BILTFOUR brand identity — gallery 1 | gallery |
| \`/images/projects/biltfour/pYAJf9ADtTSPByh3d3XPiPaIdBw.jpg\` | BILTFOUR brand identity — gallery 2 | gallery |
| \`/images/projects/biltfour/fQNXA7iFcdLekr5tbHmESnMDE.jpg\` | BILTFOUR brand identity — gallery 3 | gallery |
| \`/images/projects/biltfour/5TsBjj8W6O6DUV5qMByIYXPrnBs.jpg\` | BILTFOUR brand identity — gallery 4 | gallery |
| \`/images/projects/biltfour/VWj6qlkvnLdlyTExZDWZiezC104.jpg\` | BILTFOUR brand mockup — impact 1 | mockup |
| \`/images/projects/biltfour/rPlUBgrbosziZBcZfJfPe8sIHA.jpg\` | BILTFOUR brand mockup — impact 2 | mockup |
| \`/images/projects/biltfour/WUB4oauOJh26lOozw9rKdgUYRk.jpg\` | BILTFOUR brand mockup — impact 3 | mockup |

**Services:** \`["Brand Identity", "E-commerce Design", "Community Strategy", "Art Direction", "Web Design"]\`

---

### Project 3: NEXT (Google Cloud)

**Slug:** \`google-cloud-next\`
**CSV Categories field:** \`art-direction,digital-design,strategy,web-design,brand-identity\`
**Year:** 2023-2024
**Client:** Google Cloud
**Duration:** 2 years
**Scope:** Demo Design System, UX Strategy, Experience Design
**Button:** text="View Event Recap", href="https://cloud.google.com/blog/topics/google-cloud-next/next-2023-wrap-up"

**Overview (description):**
> Our founder, Karim, partnered with Google Cloud for two consecutive years of NEXT to architect a scalable demo design system and deliver 50+ showcase experiences—from solar analytics to F1 machine learning—that set the standard for how Google presents products at scale.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Orchestrating 50+ demos across multiple product teams for 60,000+ attendees. | Google Cloud NEXT needed more than event design—they needed a systematic approach to demo creation that could scale across dozens of teams while maintaining Google's standards. The challenge was immense: coordinate with solution architects, product managers, and PMMs across all Cloud go-to-market neighborhoods to create cohesive yet unique demo experiences. Each year brought a new sub-brand identity that needed seamless integration, while demos ranged from technical deep-dives in solar analytics to interactive experiences like AI game shows and penalty kick challenges. We needed to enable experts to tell their stories while ensuring every demo met strict go-to-market criteria. |
| Solution | Solution | A demo design system that adapts to any output—web, apps, Figma, even Slides. | We architected a sophisticated demo design system that became the backbone of Google Cloud NEXT. What made it unique was its adaptability—working seamlessly across web platforms, low-code apps, Figma, and Google Slides—while maintaining narrative structure and visual consistency. We established a governance model to review and track progress across all demos, working closely with each expert to ensure experiences were both immersive for audiences and accurately represented product capabilities. Our team supported flagship interactive experiences including Infinite Nature, AI Game Show, and the Penalty Kick Challenge, while helping dozens of teams bring complex technologies to life through compelling storytelling. |
| Impact | Impact | Setting the standard for Google's future event demonstrations. | The impact extended far beyond the 120,000+ combined attendees across both years. Our demo design system and governance model became the template for future Google events, with many experiences being redeployed globally throughout the year. Google leadership praised how effectively the demos represented their products' capabilities while maintaining engagement. Most importantly, the systematic approach we pioneered continues to influence how Google designs and scales demo experiences, leaving a lasting mark on their event strategy. The framework proved that with the right systems, you can maintain quality and consistency across 50+ experiences while empowering individual teams to shine. |

**Results:**
\`\`\`
["120,000+ combined attendees across 2 years", "50+ demo experiences delivered", "Design system became template for future Google events", "Demos redeployed globally throughout the year"]
\`\`\`

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| \`/images/projects/google-cloud-next/zwWkHCt1g0HSk5r9elbNigK55dk.svg\` | Google Cloud NEXT hero | hero |
| \`/images/projects/google-cloud-next/EQmwXTadQPFruJbbhIOlHp8JcbQ.jpg\` | NEXT demo experience — gallery 1 | gallery |
| \`/images/projects/google-cloud-next/Zcgxim04ZIbn7CooJkyUahMgtU.jpg\` | NEXT demo experience — gallery 2 | gallery |
| \`/images/projects/google-cloud-next/vN8eB0jmnZQZzLCzcNTS9wDnCc.jpg\` | NEXT demo experience — gallery 3 | gallery |
| \`/images/projects/google-cloud-next/Y1GhTfRUj1WegONQQcS7bRybV8I.jpg\` | NEXT demo experience — gallery 4 | gallery |
| \`/images/projects/google-cloud-next/TVWePxkVuYJ2ynKwvW8na7Gz8.jpg\` | NEXT design system — mockup 1 | mockup |
| \`/images/projects/google-cloud-next/1PeraZj4rwCBVywk3sEvPzcRvYw.jpg\` | NEXT design system — mockup 2 | mockup |
| \`/images/projects/google-cloud-next/kdIwpWfuzthCYLWztP0haNTzq0.jpg\` | NEXT design system — mockup 3 | mockup |

**Services:** \`["Demo Design System", "UX Strategy", "Experience Design", "Governance & Coordination"]\`

---

### Project 4: Infinite Nature (Google Gemini)

**Slug:** \`google-gemini-infinite-nature\`
**CSV Categories field:** \`strategy,digital-design\`
**Year:** 2023-2024
**Client:** Google Cloud
**Duration:** 6 months
**Scope:** UX/UI, Art Direction, Design System
**Button:** text="View Case Study", href="https://cloud.google.com/transform/infinite-nature-gen-ai-biodiversity-demo-industry-applications"

**Overview (description):**
> Our founder, Karim, partnered with Google Cloud's AI Experiments team and Deep Local to create Infinite Nature—Gemini's first public demo experience, pioneering generative UI where users and AI co-create the interface in real-time while exploring 8TB of global fauna data.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Introducing the world to multimodal AI through wonder, not widgets. | Google Cloud needed to demonstrate Gemini's revolutionary multimodal capabilities—where text, image, video, and generation converge for the first time. The challenge was massive: transform 8TB of animal data into an experience that would make CEOs, politicians, and press instantly understand this momentous shift in AI technology. We needed to move beyond traditional chat interfaces to create something that felt like magic—an infinite exploration triggered by voice, text, or simply dropping a pin on a map, asking questions like 'show me all the furry green animals' and watching AI orchestrate the response. |
| Solution | Solution | Generative UI: where users and AI build the experience together. | We pioneered a new paradigm—generative UI—where the interface itself is created collaboratively between user and AI in real-time. Working with Deep Local, we designed an immersive 3D experience that felt like navigating through a constellation of data, with AI-clustered responses floating in space—proximity indicating relevance. The visual language merged dark mode aesthetics with Interstellar-like data navigation. Crucially, we implemented live architecture visualization, showing exactly which Google Cloud products were being used and how data flowed through the system, making the AI's decision-making transparent and educational. Users could infinitely explore, with each interaction generating new interface states. |
| Impact | Impact | From first demo to global deployment—redefining AI interaction. | Infinite Nature became the definitive showcase for Gemini's capabilities, deployed globally and adapted with different datasets for various audiences. Watching world leaders, CEOs, and press experience that 'aha' moment in person validated our approach—we'd successfully translated complex AI capabilities into pure wonder. The project set a new standard for AI demos, proving that the future of AI interaction isn't just conversation—it's generative interfaces where human curiosity and machine intelligence collaborate to create the experience itself. |

**No testimonials. No results metrics.**

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| \`/images/projects/google-gemini-infinite-nature/enyu0AxPncALYsOKGqBz5dcGo.svg\` | Infinite Nature hero | hero |
| \`/images/projects/google-gemini-infinite-nature/0u9mpn2lZqvhWVHgtmYJo9S2ns.jpg\` | Infinite Nature UI — gallery 1 | gallery |
| \`/images/projects/google-gemini-infinite-nature/akEhFihTl9pdmzuHDf5W4UluIjA.jpg\` | Infinite Nature UI — gallery 2 | gallery |
| \`/images/projects/google-gemini-infinite-nature/q2vEiw0M4EtJVP7ncaRiBcgzHc4.jpg\` | Infinite Nature UI — gallery 3 | gallery |
| \`/images/projects/google-gemini-infinite-nature/69we6OfP9rfNdtqOohJDJYMYcC4.jpg\` | Infinite Nature UI — gallery 4 | gallery |
| \`/images/projects/google-gemini-infinite-nature/ZWM3jBNXCq5MI740NZoGE0owGx4.jpg\` | Infinite Nature generative UI — mockup 1 | mockup |
| \`/images/projects/google-gemini-infinite-nature/FhgyvB0QzTK3QC0aY40xLmw4K8.jpg\` | Infinite Nature generative UI — mockup 2 | mockup |
| \`/images/projects/google-gemini-infinite-nature/fEgHnqjSmKjGa0On2DRyNU9HTo.jpg\` | Infinite Nature generative UI — mockup 3 | mockup |

**Services:** \`["UX/UI Design", "Art Direction", "Generative UI", "Design System"]\`

---

### Project 5: Universal Audio

**Slug:** \`universal-audio\`
**CSV Categories field:** \`digital-design,art-direction,brand-identity\`
**Year:** 2022-present
**Client:** Universal Audio
**Duration:** 3+ years
**Scope:** Visual Design, Campaign Creative, Product Launches
**Button:** text="Visit Site", href="https://www.uaudio.com/"

**Overview (description):**
> Our founder, Morgan, spent 3+ years helping Universal Audio evolve from a pro-only brand to welcoming a new generation of home producers, developing creative campaigns and visual systems that bridge heritage with accessibility while driving significant new customer acquisition.

**Sections:**

| Section | Heading | Headline | Body |
|---------|---------|----------|------|
| Challenge | Challenge | Making pro audio accessible without losing its soul. | Universal Audio, the industry leader in audio interfaces, plugins, and hardware, faced a pivotal moment. Their products were legendary among professional studios, but their messaging and visuals spoke only to seasoned engineers. With products like Volt targeting home producers and podcasters, they needed to welcome newcomers without alienating their pro base. The challenge: translate complex audio engineering concepts into accessible language and visuals that resonate with someone recording in their bedroom instead of a pro level studio. |
| Solution | Solution | Nostalgic, immersive campaigns that balance heritage with fresh energy. | Each campaign became an immersive experience—the Blockbuster Top 50 sale channeled 90s video store nostalgia, while the 12 Days campaign evoked classic game shows. By listening closely to design, product, and marketing teams, Morgan helped create a visual language that speaks to both the bedroom producer and the studio professional, using outcome-based messaging that shows what's possible rather than just listing specs. |
| Impact | Impact | Expanding the family while keeping the legacy intact. | The creative evolution delivered impressive results: hundreds of thousands of views across campaigns, above-average conversion rates, and significant new customer acquisition from the home producer segment. More importantly, Morgan helped Universal Audio maintain positive brand equity with their professional customers while successfully welcoming a new generation into the ecosystem. The work proves that premium audio brands can democratize their offerings without diluting their essence—it's about meeting people where they are in their creative journey. |

**Results:**
\`\`\`
["Hundreds of thousands of campaign views", "Above-average conversion rates", "Significant new customer acquisition from home producer segment", "Maintained pro brand equity while expanding audience"]
\`\`\`

**Images:**
| Path | Alt | Context |
|------|-----|---------|
| \`/images/projects/universal-audio/Cy7GHb48xSXmwdDJCZ48qHDRFF0.svg\` | Universal Audio hero | hero |
| \`/images/projects/universal-audio/5rY7sMJWPqahP45iscJTiYEOw.jpg\` | Universal Audio campaign — gallery 1 | gallery |
| \`/images/projects/universal-audio/gTZibYtZgjfGpZ3U3WDAunDmOn4.jpg\` | Universal Audio campaign — gallery 2 | gallery |
| \`/images/projects/universal-audio/VKLBL93wfWhPj6VObEt1a4HlEA.jpg\` | Universal Audio campaign — gallery 3 | gallery |
| \`/images/projects/universal-audio/2MalmzAFsqsCILwoPC2A6s6Hs.jpg\` | Universal Audio campaign — gallery 4 | gallery |
| \`/images/projects/universal-audio/UGUpj8bdCLO6Q9L1oTIFNm1BtI.gif\` | Universal Audio animated mockup | mockup |
| \`/images/projects/universal-audio/CJC7mcxaL9DGEYB4HGificxTbA.jpg\` | Universal Audio product mockup 2 | mockup |
| \`/images/projects/universal-audio/PWbwliRrvDvOr6Iw28xulNrFSc.jpg\` | Universal Audio product mockup 3 | mockup |

**Services:** \`["Visual Design", "Campaign Creative", "Art Direction", "Product Launch Design"]\`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] All 5 projects have non-empty \`sections[]\` with Challenge, Solution, and Impact entries (each with \`heading\`, \`headline\`, and \`body\`)
- [ ] All 5 projects have \`images[]\` including hero SVG and 7-8 gallery/mockup images
- [ ] All 5 projects have \`categories\` as \`string[]\` using canonical slugs (\`brand-identity\`, \`strategy\`, \`digital-design\`, etc.)
- [ ] All 5 projects have \`services[]\`, \`duration\`, \`buttonText\`, \`buttonHref\`
- [ ] Iterra project has \`testimonials[]\` with at least 1 entry (the "This identity forced us into existence" quote)
- [ ] BILTFOUR, NEXT, and Universal Audio projects have \`results[]\` with metrics
- [ ] Infinite Nature project has no \`testimonials\` and no \`results\` fields (omit or set to undefined)
- [ ] All image paths reference \`/images/projects/{slug}/\` (not \`framerusercontent.com\`)
- [ ] A redirect rule from \`/projects/gemini-infinite-nature\` -> \`/projects/google-gemini-infinite-nature\` is present in \`next.config.ts\`
- [ ] \`npm run build\` passes with TypeScript strict mode (no \`any\`, no type errors)
- [ ] \`npm run lint\` passes with no errors

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/data/projects.ts\` | modify | Replace 5 stub records with full enriched data |
| \`next.config.ts\` | modify | Add redirect from \`/projects/gemini-infinite-nature\` to \`/projects/google-gemini-infinite-nature\` |

### File Ownership Notes

- \`src/types/project.ts\` is owned by T002. Do NOT modify it in this task — only read from it.
- \`src/app/projects/[slug]/page.tsx\` is owned by T010 (Wave 3). The project detail page rendering is out of scope here.
- \`src/app/projects/page.tsx\` and \`src/components/projects/project-filters.tsx\` are owned by T009 (Wave 3) for filter logic. Do NOT modify these files in T005.
- \`next.config.ts\` — add only the redirect rule for \`gemini-infinite-nature\`. Do not modify any other configuration.

---

## Implementation Guidance

### Patterns to Follow

The current \`src/data/projects.ts\` exports:
\`\`\`typescript
export const projects: Project[] = [...];
export const featuredProjects = projects.filter((p) => p.featured);
\`\`\`
Preserve both exports. Keep \`featuredProjects\` — mark \`iterra\` and \`biltfour\` as \`featured: true\`, others as \`featured: false\` (matching current codebase).

### Thumbnail vs Hero Image

The \`thumbnail\` field on \`Project\` is used for listing cards and should be the hero SVG path:
\`\`\`typescript
thumbnail: "/images/projects/iterra/vvl6xyIdUMskDBgstfyClKSxE8.svg",
\`\`\`
The \`images[0]\` entry (context: "hero") duplicates this same path. This redundancy is intentional — \`thumbnail\` is for lightweight listing usage, \`images[]\` is for the detail page gallery.

### Edge Cases

- \`buttonHref\` for Iterra is an empty string \`""\`. Either omit the button in the detail view (T010 handles rendering) or keep it as empty string — the data file should store it faithfully.
- \`year\` for projects with ranges (e.g., "2023-2024", "2022-present") must be stored as a string, not a number.
- For \`google-gemini-infinite-nature\`, the slug in the current codebase is \`gemini-infinite-nature\` but the Framer CSV slug is \`google-gemini-infinite-nature\`. Use the Framer CSV slug \`google-gemini-infinite-nature\` as the canonical slug — it matches the image download paths from T001. The existing \`/projects/gemini-infinite-nature\` URL will 404 after this change. Add a redirect rule in \`next.config.ts\` for the old URL: \`{ source: '/projects/gemini-infinite-nature', destination: '/projects/google-gemini-infinite-nature', permanent: true }\`. This prevents broken links from any indexed or shared URLs.

### TypeScript

- Use strict typing — no \`as any\` or type assertions
- All required fields must be present on every project
- Optional fields (\`testimonials\`, \`results\`) should be omitted entirely when not applicable (not set to \`undefined\` explicitly)

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`
- \`src/types/project.ts\` (owned by T002)
- \`src/app/projects/[slug]/page.tsx\` (owned by T010)

### Files Requiring Review

- \`package.json\` — do not modify for this task
- \`next.config.ts\` — do not modify for this task

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T001 | Downloads all project images to \`/public/images/projects/{slug}/\` | Check that \`/public/images/projects/iterra/\` directory exists with downloaded SVG and JPG files |
| T002 | Enriched TypeScript schema in \`src/types/project.ts\` with \`ProjectSection\`, \`ProjectImage\`, \`ProjectTestimonial\`, \`categories: string[]\` | Verify \`src/types/project.ts\` exports \`ProjectSection\`, \`ProjectImage\`, \`ProjectTestimonial\` interfaces and that \`Project\` has \`categories: string[]\` not \`category: ProjectCategory\` |

### Downstream Impact

Tasks that depend on this one:
- **T009** — Derives canonical categories from the projects data
- **T010** — Renders the enriched project fields on detail pages
- **T017** — Validates image paths in the data file
- **T019** — Uses project thumbnails for homepage featured work section

**Before starting:** Check T001 and T002 are marked complete in GitHub issues. Confirm image files exist in \`/public/images/projects/\` and the schema matches what is documented above.

---

## GitHub Context

**Issue:** T005 (to be created)
**Branch:** \`worktree/framer-cms-migration-T005\`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

\`\`\`
feat(projects): populate enriched project data from Framer CMS

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

Use separate commits if the filter logic change is significant:
\`\`\`
refactor(projects): update category filter to array intersection

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: \`npm run build\`
- [ ] No \`never_touch\` files modified
- [ ] \`npm run lint\` passes with no errors
- [ ] All 5 projects visible on \`/projects\` listing page
- [ ] Category filter shows correct projects for each category
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T005 | Wave: 2_`,
  },

  "brief-t006": {
    language: "markdown",
    content: `# Task Brief: T006

**Title:** Convert 4 blog posts from HTML to MDX files
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 6/10
**Model:** opus
**Wave:** 2

---

## Objective

Create 4 MDX files in \`/src/content/blog/\` containing the full blog post content sourced from the Framer CMS \`Blog.csv\` export. Update \`/src/data/blog.ts\` to replace the 3 existing stub posts with the 4 real posts from Framer, using a \`contentPath\` field instead of inline content strings. Add the 4th post (MCP for Designers) which is currently missing from the codebase entirely.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The blog system currently has 3 placeholder posts in \`/src/data/blog.ts\` with embedded \`content\` strings (markdown). The Framer CMS has 4 real posts with full HTML content. This task:

1. Creates the MDX content files (T003 creates the empty directory structure)
2. Converts Framer's HTML to clean MDX markdown
3. Replaces the stub \`blog.ts\` with real post metadata using \`contentPath\`
4. Adds the missing 4th post (MCP for Designers)
5. Adds the 3 new \`BlogCategory\` values (\`"Creative Philosophy"\`, \`"About Us"\`, \`"Digital Design"\`)

Wave 1 dependencies:
- **T002** enriches \`BlogPost\` type to have \`contentPath: string\` instead of \`content: string\`, and expands \`BlogCategory\`
- **T003** creates \`/src/content/blog/\` directory

This task is part of **Wave 2** — content migration.

---

## The 4 Blog Posts (Source: Framer CMS Blog.csv)

### Blog CSV Column Structure

\`\`\`
Slug | Article title | Image | Image:alt | Tag (Category) | Author | Reading Time | Date | Description | Content
\`\`\`

---

### Post 1: EP02 — Creative AI Framework

**Slug:** \`ep02-creative-ai-framework\`
**MDX file:** \`src/content/blog/ep02-creative-ai-framework.mdx\`
**Title:** EP02: Creative AI Framework
**Category:** \`Creative Philosophy\` (new — must be added to \`BlogCategory\` union)
**Author:** Karim Bouhdary
**Date:** \`2026-02-03\`
**Reading Time:** \`5 min read\`
**Thumbnail:** \`/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg\`
**Featured:** \`true\`

**Excerpt / Description:**
> A practical framework for integrating AI into creative work without losing the human judgment that makes design meaningful.

**MDX Content to Write:**

The Framer HTML content uses \`<h2>\`, \`<p>\`, \`<strong>\`, \`<ul>\`, \`<li>\` tags. Convert to clean MDX markdown. The content structure from the Framer post is:

\`\`\`mdx
## The Framework

Creativity isn't something AI can replace—it's the judgment behind the work. Over the past year, we've developed a framework for integrating AI into our creative process in a way that amplifies our output without outsourcing the thinking.

## Three Layers of Creative Work

Creative work operates on three levels: **vision** (what we're trying to achieve), **execution** (how we get there), and **refinement** (making it better). AI is most powerful at the execution layer—generating variations, accelerating research, handling repetitive tasks—while vision and refinement remain deeply human.

## The Framework in Practice

**Research acceleration:** Use AI to gather competitive intelligence, identify visual references, and synthesize market patterns. What took days now takes hours.

**Exploration breadth:** Generate 20 directions instead of 5. AI gives us more surface area to explore, which means better final choices.

**Execution speed:** Automate the mechanical parts of production—resizing, variations, format conversion—so we can focus on the decisions that matter.

**Refinement judgment:** The selection, combination, and polishing of work remains human. This is where craft lives.

## What AI Can't Do

AI doesn't have taste. It doesn't know what's appropriate for a specific client's culture, what will resonate with a particular audience, or when a design direction will age poorly. These are human judgments built from years of experience and deep contextual understanding.

## The Takeaway

The designers who will thrive aren't those who use AI the most—they're those who know when to use it and when to trust their own judgment. AI is a powerful tool in the right hands. The goal is to keep the right hands on it.
\`\`\`

---

### Post 2: EP01 — Creativity over Compute

**Slug:** \`ep01-creativity-over-compute\`
**MDX file:** \`src/content/blog/ep01-creativity-over-compute.mdx\`
**Title:** EP01: Creativity over Compute
**Category:** \`Creative Philosophy\`
**Author:** Karim Bouhdary
**Date:** \`2026-01-20\`
**Reading Time:** \`6 min read\`
**Thumbnail:** \`/images/blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg\`
**Featured:** \`true\`

**Excerpt / Description:**
> Why the AI race to scale compute is missing the point—and why creative judgment will always be the differentiator.

**MDX Content to Write:**

\`\`\`mdx
## The Compute Arms Race

Everyone is racing to build bigger models, more compute, faster inference. The underlying assumption is that intelligence scales linearly with resources. But in creative work, we've found something different.

## What Scale Gets You

More compute gets you more options. More variations, more outputs, more combinations to choose from. At a certain threshold, you have more than you can evaluate. The bottleneck isn't generation—it's judgment.

## The Judgment Gap

Here's what we've observed working with AI across brand identity, campaign design, and product work: the quality ceiling isn't set by the model. It's set by the person directing it.

A mediocre creative director with GPT-4 gets mediocre results. A sharp creative director with the same tools gets exceptional results. The variable is judgment, not compute.

## Creativity as a Competitive Moat

As AI tools commoditize, the ability to generate outputs becomes table stakes. The differentiation shifts entirely to the quality of creative judgment—knowing what's worth making, what resonates, what endures.

This is actually good news for designers who've invested in developing their taste. Your years of looking at good and bad work, understanding cultural context, knowing what clients and audiences respond to—that's the moat. AI can't replicate it.

## Practical Implications

- **Don't optimize for output volume.** More AI-generated options doesn't mean better decisions.
- **Invest in developing taste.** Study more work, develop stronger opinions, build sharper instincts.
- **Use AI to get to your best idea faster,** not to generate ideas you don't know how to evaluate.
- **The work that matters is the selection and direction,** not the generation.

## The Takeaway

Creativity over compute isn't a philosophical position—it's a practical strategy. In a world where generation becomes cheap, curation and direction become the scarce resources. Build those skills.
\`\`\`

---

### Post 3: Democratizing Fortune 500 Design

**Slug:** \`democratizing-fortune-500-design\`
**MDX file:** \`src/content/blog/democratizing-fortune-500-design.mdx\`
**Title:** Democratizing Fortune 500 Design
**Category:** \`About Us\` (new — must be added to \`BlogCategory\` union)
**Author:** Karim Bouhdary
**Date:** \`2025-09-13\`
**Reading Time:** \`7 min read\`
**Thumbnail:** \`/images/blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg\`
**Featured:** \`false\`

**Excerpt / Description:**
> How we're bringing the design quality of Google, Salesforce, and Fortune 500 companies to founders and growing businesses.

**MDX Content to Write:**

\`\`\`mdx
## The Quality Gap

There's a significant gap between the design quality that Fortune 500 companies take for granted and what most founders and growing businesses can access. We've spent our careers on the inside—at Google, Salesforce, and other large organizations—and we've seen firsthand what it looks like when design is resourced properly.

## What Enterprise Design Actually Is

At large companies, design isn't just aesthetics. It's a systematic approach to solving problems: rigorous research processes, design systems that scale, brand governance, cross-functional alignment, and the judgment to know when to break the rules.

Most of these companies have entire teams dedicated to what a founder might think of as "making things look good." The difference in outcomes is stark.

## Why This Matters for Founders

When you're building a company, design is often deprioritized—it feels like a nice-to-have when resources are constrained. But design quality signals credibility, builds trust, and accelerates growth. The brands that get it right early move faster.

The challenge has always been access. Enterprise-quality design work has been locked behind either large agency fees or in-house teams that startups can't afford.

## What We're Building

Open Session exists to close this gap. We bring the systematic thinking, the design maturity, and the quality standards of large organizations to founders and growing businesses—without the overhead.

This isn't about making things look "professional." It's about building design as infrastructure: systems that scale, assets that compound, and a brand that can grow with your business.

## The Free Resources

Part of how we're democratizing access is through free resources. Our portfolio template helped our co-founder land offers at Google and Salesforce. Our design directory aggregates the best tools in the field. Our brand design system gives any team a foundation to build from.

These are real tools we use in our own work, released because we believe the ecosystem is better when quality is accessible.

## The Bigger Picture

Design quality shouldn't be a privilege. The founders building the next generation of important companies deserve access to the same systems and standards that large organizations have developed over decades.

That's what we're working on.
\`\`\`

---

### Post 4: MCP for Designers

**Slug:** \`mcp-for-designers\`
**MDX file:** \`src/content/blog/mcp-for-designers.mdx\`
**Title:** MCP for Designers
**Category:** \`Digital Design\` (new — must be added to \`BlogCategory\` union)
**Author:** Karim Bouhdary
**Date:** \`2025-09-12\`
**Reading Time:** \`5 min read\`
**Thumbnail:** \`/images/blog/6zZWCJwMNLKAwcShUSZbwsO7prA.jpg\`
**Featured:** \`false\`

**Excerpt / Description:**
> What Anthropic's Model Context Protocol means for designers and why it's about to change how we work with AI tools.

**MDX Content to Write:**

\`\`\`mdx
## What Is MCP?

Anthropic's Model Context Protocol (MCP) is an open standard that allows AI assistants to connect to external data sources and tools. In plain terms: it lets AI like Claude reach out to your design files, your project management tools, your analytics—and work with real context instead of generic responses.

## Why This Matters for Designers

Most designers' experience with AI today is copy-paste. You screenshot something, paste it into ChatGPT, ask a question, copy the answer back into your workflow. It works, but it's friction.

MCP changes the architecture. Instead of you bridging the gap between your tools and the AI, the AI can connect directly to your tools. Your Figma files, your Notion docs, your GitHub repos, your analytics dashboards—all of it becomes accessible to an AI assistant that can actually help.

## Practical Use Cases

**Design system governance:** An AI connected to your Figma library can audit usage, flag inconsistencies, and suggest consolidations without you exporting anything.

**Client research synthesis:** Connect your AI to your research notes, interview transcripts, and competitive analysis. Ask it to synthesize themes and patterns across all of it—not just what you paste in.

**Brief generation:** An AI with access to your project history, brand guidelines, and client communications can generate briefs that are actually grounded in context.

**Asset management:** AI connected to your asset library can help you find things, identify duplicates, and suggest what's missing.

## The Design Tool Landscape Is About to Shift

The tools that build MCP integrations first will have a significant advantage. We're already seeing this with Figma's AI features, but MCP opens it up further—any tool can be a data source for AI assistance.

For designers, the question is: which tools in your stack are going to get there first, and are you ready to work with AI in this new way?

## What to Watch

- Figma MCP integration (in development)
- Notion MCP connector (already available)
- Linear and project management tools adding MCP support
- Design token platforms becoming AI-queryable

## The Bottom Line

MCP isn't hype. It's infrastructure. The designers who understand it early will be positioned to work in fundamentally different ways—less copy-paste, more connected, more leveraged. Start paying attention now.
\`\`\`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] 4 MDX files exist in \`/src/content/blog/\` with correct slugs: \`ep02-creative-ai-framework.mdx\`, \`ep01-creativity-over-compute.mdx\`, \`democratizing-fortune-500-design.mdx\`, \`mcp-for-designers.mdx\`
- [ ] Each MDX file contains clean markdown with no raw HTML, no inline styles, no \`data-preset-tag\` attributes
- [ ] \`/src/data/blog.ts\` exports 4 posts with \`contentPath\` field AND a temporary \`content: ""\` bridge field (the empty string prevents blog-post.tsx from crashing before T011 replaces the renderer)
- [ ] The 3 old stub posts (\`design-systems-2025\`, \`ai-brand-identity\`, \`collaboration-remote\`) are replaced by the 4 real posts
- [ ] MCP for Designers post is present with correct metadata (slug: \`mcp-for-designers\`, date: \`2025-09-12\`)
- [ ] \`BlogCategory\` union in \`src/types/blog.ts\` includes \`"Creative Philosophy"\`, \`"About Us"\`, \`"Digital Design"\` (T002 handles this — verify before starting)
- [ ] All 4 posts have correct \`date\` (ISO format YYYY-MM-DD), \`readingTime\`, \`author.name\`, \`thumbnail\`
- [ ] All thumbnail paths reference \`/images/blog/\` (local, not CDN)
- [ ] Blog listing page at \`/blog\` renders all 4 posts with metadata visible
- [ ] \`npm run build\` passes (MDX files are valid)

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/content/blog/ep02-creative-ai-framework.mdx\` | create | Full MDX content for EP02 post |
| \`src/content/blog/ep01-creativity-over-compute.mdx\` | create | Full MDX content for EP01 post |
| \`src/content/blog/democratizing-fortune-500-design.mdx\` | create | Full MDX content for democratizing post |
| \`src/content/blog/mcp-for-designers.mdx\` | create | Full MDX content for MCP post |
| \`src/data/blog.ts\` | modify | Replace 3 stub posts with 4 real posts using \`contentPath\` |

### File Ownership Notes

- \`src/types/blog.ts\` is owned by T002. Verify T002 has completed before writing \`blog.ts\`.
- \`src/app/blog/[slug]/page.tsx\` is owned by T011 (Wave 3). The rendering of MDX content is out of scope here — the blog detail page will still work from \`content\` field until T011 updates it. Your \`contentPath\` change in \`blog.ts\` must not break the existing detail page.
- The \`/src/content/blog/\` directory is created by T003. Verify it exists before writing MDX files.

---

## Implementation Guidance

### Expected BlogPost Type After T002

\`\`\`typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath: string;         // replaces \`content: string\`
  content: string;             // BRIDGE: temporary empty string until T011 — T002 must keep this field or declare it optional
  author: { name: string; image?: string };
  date: string;
  category: BlogCategory;
  thumbnail: string;
  readingTime: string;
  featured?: boolean;
}

// T002 defines ONLY these values — the old "Design", "AI", "Process", "Insights" values are REMOVED:
type BlogCategory =
  | 'Creative Philosophy'
  | 'About Us'
  | 'Digital Design'
  | 'Design Strategy'
  | 'Brand Identity';
\`\`\`

**Note:** T002 removes the old \`BlogCategory\` values entirely. This brief shows the correct post-T002 state — do NOT use \`"Design"\`, \`"AI"\`, \`"Process"\`, or \`"Insights"\` as category values in the blog.ts records you write.

### blog.ts Data Structure

Replace the entire \`blogPosts\` array. The \`contentPath\` field should be a relative path from the project root (or from \`src/\`). Use:

\`\`\`typescript
contentPath: "src/content/blog/ep02-creative-ai-framework.mdx"
\`\`\`

The blog detail page (T011) will read this path. Keep the path format consistent across all 4 posts.

### Thumbnail Image Filenames

Thumbnails are downloaded by T001. Local paths (using the Framer hash filenames):

| Post | Thumbnail Path |
|------|---------------|
| EP02 | \`/images/blog/KKSflaBzLhQtCCknGCHsQqbqU2s.jpg\` |
| EP01 | \`/images/blog/dAlZcH0hvoB0zkWQSH2BA5MJRY.jpg\` |
| Democratizing | \`/images/blog/c1JC3v6vQ3z0r5tG78dzNkn9iTI.jpg\` |
| MCP for Designers | \`/images/blog/6zZWCJwMNLKAwcShUSZbwsO7prA.jpg\` |

### Handling Existing Blog Detail Page

\`/src/app/blog/[slug]/page.tsx\` currently looks up posts by slug from \`blogPosts\` and renders \`post.content\` (the inline string). After this task, \`post.content\` will no longer exist (replaced by \`contentPath\`). \`src/components/blog/blog-post.tsx\` line 117 calls \`post.content.split("\\n\\n")\` — removing the field without a bridge will crash all 4 blog detail pages at runtime, breaking the Wave 2 build before T011 arrives in Wave 3.

**Required bridge strategy:** Keep a temporary \`content: ""\` (empty string) alongside \`contentPath\` in each blog.ts record until T011 replaces the renderer. This prevents the build break while still adding the \`contentPath\` field T011 needs.

\`\`\`typescript
{
  id: "ep02-creative-ai-framework",
  slug: "ep02-creative-ai-framework",
  // ... other fields ...
  contentPath: "blog/ep02-creative-ai-framework.mdx",
  content: "",   // BRIDGE: temporary empty string; T011 removes this once MDX renderer is in place
}
\`\`\`

Apply this pattern to all 4 blog post records in \`blog.ts\`. The empty \`content\` field means existing blog detail pages render no visible body — that is acceptable during the Wave 2 -> Wave 3 transition.

**Note on BlogCategory values:** \`src/app/blog/[slug]/page.tsx\` line 53 uses \`p.category === post.category\` to find related posts. After T002 replaces the old \`BlogCategory\` values (\`"Design"\`, \`"AI"\`, \`"Process"\`, \`"Insights"\`) with new ones, this filter will produce empty related-posts arrays for posts that still use old category strings. Ensure all 4 blog.ts records use the new T002 \`BlogCategory\` values (\`"Creative Philosophy"\`, \`"About Us"\`, \`"Digital Design"\`) — which this brief already does. This is not a crash but a note for awareness.

### MDX Quality Review

After writing MDX files, manually review the output for formatting issues — especially:
- Nested lists (ensure no extra blank lines break list continuity)
- Code blocks (verify backtick fences are balanced)
- Special characters from HTML conversion (\`&amp;\`, \`&lt;\`, \`&gt;\` should be decoded to \`&\`, \`<\`, \`>\`)
- Bold text using \`**\` syntax (not \`<strong>\` tags)
- No residual \`data-preset-tag\` attributes or inline \`style=""\` props

The MDX content in this brief has already been pre-converted. Do a spot-check after writing to ensure no HTML artifacts were carried over.

### MDX Format

MDX files do not need frontmatter for this task. The metadata lives in \`blog.ts\`. Keep the MDX files as pure markdown content only:

\`\`\`mdx
## Section Heading

Paragraph text here.

## Another Section

More content.
\`\`\`

No frontmatter (\`---\`) required unless the MDX renderer in T011 expects it. Keep it simple.

### HTML to Markdown Conversion Rules

The Framer Blog.csv HTML content uses:
- \`<p>\` -> plain paragraph (remove tags)
- \`<h2>\`, \`<h4>\`, \`<h5>\` -> \`##\`, \`####\`, \`#####\`
- \`<strong>\` -> \`**text**\`
- \`<ul>\` / \`<li>\` -> \`- item\`
- \`<a href="...">text</a>\` -> \`[text](url)\`
- Strip \`data-preset-tag=""\` attributes
- Strip \`&amp;\` -> \`&\`, \`&lt;\` -> \`<\`, \`&gt;\` -> \`>\`

The MDX content provided in this brief has already been converted. Use it as-is — do not re-parse the CSV HTML.

### Edge Cases

- The MCP for Designers post (\`mcp-for-designers\`) does NOT currently exist in the codebase at all. It is a net-new addition.
- \`featured\` field: EP02 and EP01 are \`true\`, the others are \`false\`.
- Author field: all 4 posts use \`{ name: "Karim Bouhdary" }\`.

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`
- \`src/types/blog.ts\` (owned by T002)
- \`src/app/blog/[slug]/page.tsx\` (owned by T011)
- \`src/app/blog/page.tsx\` (can read for context but should not need changes)

### Files Requiring Review

- \`package.json\` — do not modify
- \`tsconfig.json\` — do not modify (T003 handles any path alias changes)

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | Updated \`BlogPost\` type with \`contentPath\` field; expanded \`BlogCategory\` union | Check \`src/types/blog.ts\` exports \`contentPath\` on \`BlogPost\` and includes \`"Creative Philosophy"\`, \`"About Us"\`, \`"Digital Design"\` in \`BlogCategory\` |
| T003 | \`/src/content/blog/\` directory exists and is tracked in git | Check \`ls src/content/blog/\` — should exist (may only have \`.gitkeep\`) |

### Downstream Impact

Tasks that depend on this one:
- **T011** — Updates blog detail page to render MDX content from \`contentPath\`
- **T017** — Validates that all \`contentPath\` values in \`blog.ts\` point to existing MDX files

**Before starting:** Verify T002 and T003 are complete. If \`src/types/blog.ts\` still has \`content: string\` and not \`contentPath: string\`, T002 has not landed yet.

---

## GitHub Context

**Issue:** T006 (to be created)
**Branch:** \`worktree/framer-cms-migration-T006\`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

\`\`\`
feat(blog): add 4 MDX content files from Framer CMS

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

\`\`\`
feat(blog): replace stub posts with real blog data in blog.ts

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: \`npm run build\`
- [ ] \`npm run lint\` passes
- [ ] 4 MDX files exist in \`src/content/blog/\`
- [ ] \`src/data/blog.ts\` has 4 posts with both \`contentPath\` and \`content: ""\` bridge fields
- [ ] No \`framerusercontent.com\` URLs in any file you created/modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T006 | Wave: 2_`,
  },

  "brief-t010": {
    language: "markdown",
    content: `# Task Brief: T010

**Title:** Update project detail page to render enriched schema
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 7/10
**Model:** opus
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Replace the current placeholder-only project detail view with a fully rendered case study layout. The enriched project schema (added by Wave 2 task T005) includes structured sections, gallery images, testimonials, and results — this task wires those fields into the \`ProjectDetail\` component and its sub-components.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

The current \`src/components/projects/project-detail.tsx\` renders mostly placeholder content:
- Hero image is commented out behind a placeholder div
- Gallery images are placeholder divs
- Challenge/Solution sections use lorem ipsum text
- No testimonials block, no results block, no services list, no CTA button, no duration

Wave 2 task T005 has enriched the \`Project\` type and populated all 5 project data records with:
- \`sections: ProjectSection[]\` — Challenge, Solution, Impact (each with \`heading\`, \`headline\`, \`body\`)
- \`images: ProjectImage[]\` — hero + gallery images in \`/public/images/projects/{slug}/\`
- \`testimonials?: ProjectTestimonial[]\` — optional, only Iterra has one
- \`results?: string[]\` — optional, BILTFOUR, NEXT, Universal Audio have them
- \`services: string[]\`
- \`duration?: string\`
- \`buttonText?: string\`
- \`buttonHref?: string\`
- \`categories: string[]\` (replaces \`category\`)

This task builds the rendering components to display all of that data. All 5 project detail pages must render correctly: \`/projects/iterra\`, \`/projects/biltfour\`, \`/projects/google-cloud-next\`, \`/projects/google-gemini-infinite-nature\`, \`/projects/universal-audio\`.

This task is part of **Wave 3** — Component Updates.

---

## Requirements

### 1. Update \`ProjectDetail\` component (\`src/components/projects/project-detail.tsx\`)

The component receives \`{ project, prevProject, nextProject }\`. Update it to:

- **Hero image:** Uncomment and use \`next/image\` with \`fill\` on the hero image. Find the hero image from \`project.images.find(img => img.context === 'hero')\`. Use \`priority\` since it's above the fold.
- **Categories in meta:** Replace \`project.category\` with \`project.categories.map(c => categoryLabel(c)).join(" / ")\`. Import \`categoryLabel\` from \`@/data/categories\`.
- **Services sidebar:** Replace \`project.tags.map(tag => tag)\` with \`project.services.map(service => service)\`.
- **Duration in sidebar:** Add a Duration row if \`project.duration\` is present.
- **Sections:** Replace lorem ipsum placeholder blocks with a loop over \`project.sections\`. Each section renders: heading (h2), headline (bold intro), body text, then the section's gallery images.
- **Gallery images:** Images are grouped by \`section\` context. For the Challenge section, render images where \`image.section === 'challenge'\`; Solution where \`image.section === 'solution'\`; Impact where \`image.section === 'impact'\`. Gallery images use \`next/image\` with explicit \`width\`/\`height\` or \`fill\` inside a sized container.
- **Testimonial block:** If \`project.testimonials && project.testimonials.length > 0\`, render a blockquote-style testimonial section.
- **Results block:** If \`project.results && project.results.length > 0\`, render a results/metrics list.
- **CTA button:** If \`project.buttonText && project.buttonHref\`, render a button linking to the external URL (\`target="_blank"\`, \`rel="noopener noreferrer"\`). Use the existing \`Button\` component from \`@/components/shared/button\`.

### 2. Create sub-components

Create these new files. Keep them focused — each renders one concern:

**\`src/components/projects/project-section.tsx\`**
\`\`\`typescript
interface ProjectSectionProps {
  section: ProjectSection;  // from @/types/project
  images: ProjectImage[];   // images for this section
}
\`\`\`
Renders: section heading, headline, body text, then images below.

**\`src/components/projects/project-gallery.tsx\`**
\`\`\`typescript
interface ProjectGalleryProps {
  images: ProjectImage[];
  layout?: "single" | "grid-2";  // default "single" if 1 image, "grid-2" if 2+
}
\`\`\`
Renders a responsive image layout using \`next/image\`. Use \`aspect-[16/9]\` containers for landscape images, \`aspect-[4/3]\` for general gallery.

**\`src/components/projects/project-testimonial.tsx\`**
\`\`\`typescript
interface ProjectTestimonialProps {
  testimonials: ProjectTestimonial[];  // from @/types/project
}
\`\`\`
Renders a blockquote with quote, author name, and role.

**\`src/components/projects/project-results.tsx\`**
\`\`\`typescript
interface ProjectResultsProps {
  results: string[];
}
\`\`\`
Renders a metrics list — each result as a callout item.

### 3. Update \`src/app/projects/[slug]/page.tsx\`

No structural changes needed. Verify the page still calls \`<ProjectDetail project={project} prevProject={prevProject} nextProject={nextProject} />\` correctly.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] All 5 project detail pages render without errors (\`/projects/iterra\`, \`/projects/biltfour\`, \`/projects/google-cloud-next\`, \`/projects/google-gemini-infinite-nature\`, \`/projects/universal-audio\`)
- [ ] Hero image renders using \`next/image\` (not a placeholder div)
- [ ] Challenge, Solution, and Impact sections display with correct heading text and body copy from \`project.sections\`
- [ ] Gallery images render using \`next/image\` with proper aspect ratio containers (no layout shift)
- [ ] Testimonial block renders on Iterra project page; absent (no empty block) on the other 4
- [ ] Results block renders on BILTFOUR, NEXT, and Universal Audio pages; absent on Iterra and Infinite Nature
- [ ] Services list in sidebar uses \`project.services\`, not \`project.tags\`
- [ ] CTA button renders with \`project.buttonText\` and links to \`project.buttonHref\` in a new tab
- [ ] Categories displayed in meta use display labels (from \`categoryLabel()\`), not raw slugs
- [ ] \`npm run build\` passes with no TypeScript errors
- [ ] \`npm run lint\` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/components/projects/project-detail.tsx\` | modify | Wire up enriched data, enable images, add sections/testimonial/results/CTA |
| \`src/components/projects/project-section.tsx\` | create | Renders one structured section (heading + headline + body + images) |
| \`src/components/projects/project-gallery.tsx\` | create | Responsive image grid using next/image |
| \`src/components/projects/project-testimonial.tsx\` | create | Blockquote testimonial block |
| \`src/components/projects/project-results.tsx\` | create | Metrics/results list |

### File Ownership Notes

\`project-detail.tsx\` is the only existing component touched here. The new sub-components are net-new files. T009 also touches \`project-detail.tsx\` to change \`{project.category}\` -> joined category labels. **T010 should run after T009 completes** to avoid merge conflicts on this file. T009 owns the category rendering change; T010 owns the full layout enhancement. If T009 has already made the category change, T010 should incorporate it (not overwrite it).

---

## Implementation Guidance

### Patterns to Follow

- **Existing component structure:** \`project-detail.tsx\` uses \`motion\` from framer-motion with \`staggerContainer\`/\`fadeInUp\` variants from \`@/lib/motion\`. Follow the same pattern for any new animated sections.
- **next/image fill pattern:** The codebase uses \`fill\` with a sized parent container:
  \`\`\`tsx
  <div className="relative aspect-[16/9] bg-bg-tertiary overflow-hidden">
    <Image src={img.src} alt={img.alt} fill className="object-cover" />
  </div>
  \`\`\`
- **Badge component:** Use \`<Badge type="color" color="gray" size="md">\` from \`@/components/uui/base/badges/badges\` for service tags (same as current \`project.tags\` rendering).
- **Button component:** Use \`<Button href={project.buttonHref} variant="brand" target="_blank" rel="noopener noreferrer">\` from \`@/components/shared/button\`.
- **ArrowLeft/ArrowRight:** Import from \`@untitledui-pro/icons/line\` (already imported in project-detail.tsx).

### Code Style

- Kebab-case filenames: \`project-section.tsx\`, \`project-gallery.tsx\`, etc.
- Use semantic Tailwind classes: \`bg-bg-secondary\`, \`text-fg-primary\`, \`border-border-secondary\`
- No raw bracket var() syntax or opacity modifiers like \`/30\` on CSS vars
- Component props interfaces are co-located in the same file

### Graceful Fallback Pattern

All optional fields must be guarded:
\`\`\`tsx
{project.testimonials && project.testimonials.length > 0 && (
  <ProjectTestimonial testimonials={project.testimonials} />
)}

{project.results && project.results.length > 0 && (
  <ProjectResults results={project.results} />
)}

{project.buttonText && project.buttonHref && (
  <Button href={project.buttonHref} target="_blank" rel="noopener noreferrer">
    {project.buttonText}
  </Button>
)}
\`\`\`

### Section/Image Relationship

Images in \`project.images\` have an optional \`section\` field:
- \`context: 'hero'\` — the cover/thumbnail image (1 per project)
- \`context: 'gallery'\`, \`section: 'challenge'\` — images that accompany the Challenge section
- \`context: 'gallery'\`, \`section: 'solution'\` — images that accompany the Solution section
- \`context: 'gallery'\`, \`section: 'impact'\` — images for the Impact section
- \`context: 'mockup'\` — may or may not have a section

When rendering \`ProjectSection\`, filter images: \`images.filter(img => img.section === sectionKey)\` where \`sectionKey\` is derived from the section heading (e.g., "The Challenge" -> "challenge").

### Hero Image

The hero image is: \`project.images.find(img => img.context === 'hero')\`.
If no hero image is found (shouldn't happen after T005, but guard anyway), fall back to \`project.thumbnail\`.

### Testimonial Layout

Render as a full-width pullquote section with a left border accent:
\`\`\`
| "Quote text here in large italic type."
|
| — Author Name, Role
\`\`\`
Use \`border-l-4 border-bg-brand-solid pl-8\` for the visual treatment.

### Results Layout

Each result string in \`project.results\` is a metric like "40% increase in brand recognition". Render them as a row of stat cards or a simple bulleted list with large bold numbers when a numeric value is present.

### Edge Cases

- A project may have no images for a particular section — \`ProjectGallery\` should render nothing if \`images.length === 0\`
- \`project.duration\` is optional — only render the Duration sidebar row if it exists
- \`project.tags\` still exists on the type (T005 adds new fields, may not remove old ones) — use \`project.services\` for the sidebar, not \`project.tags\`

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`

### Files Requiring Review

- \`package.json\` — no new packages needed; \`next/image\` is part of Next.js
- \`next.config.ts\` — do not touch; images are local (no remote domain config needed)
- \`tsconfig.json\` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T005 | Enriched \`Project\` type + populated project data in \`src/data/projects.ts\` with \`sections[]\`, \`images[]\`, \`testimonials?\`, \`results?\`, \`services[]\`, \`duration\`, \`buttonText\`, \`buttonHref\` | Check \`src/types/project.ts\` exports \`ProjectSection\`, \`ProjectImage\`, \`ProjectTestimonial\` interfaces and \`Project.sections\` field |
| T009 | \`categoryLabel()\` helper in \`src/data/categories.ts\` | Check that \`src/data/categories.ts\` exists and exports \`categoryLabel\` |

### Downstream Impact

Tasks that depend on this one:
- **T016** (Wave 4) — SEO metadata generation — depends on project detail pages rendering correctly

**Before starting:** Verify T005 and T009 are complete:
\`\`\`
grep "sections:" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/types/project.ts
grep "categoryLabel" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/categories.ts
\`\`\`

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** \`worktree/framer-cms-migration-T010\`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

\`\`\`
feat(projects): render enriched case study layout with sections, gallery, and testimonials

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: \`npm run build\`
- [ ] Type check: no TypeScript errors in build output
- [ ] Lint passes: \`npm run lint\`
- [ ] No \`never_touch\` files modified
- [ ] No \`project.category\` (singular) references remain in project-detail.tsx
- [ ] All 5 project detail routes tested (mentally traced or build verified)
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T010 | Wave: 3_`,
  },

  "brief-t011": {
    language: "markdown",
    content: `# Task Brief: T011

**Title:** Update blog system to render MDX files
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 6/10
**Model:** opus
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Replace the current inline markdown renderer in the blog detail page with a proper MDX pipeline using \`next-mdx-remote\`. Wave 2 task T006 has converted all 4 blog posts into MDX files and updated \`BlogPost.contentPath\` — this task wires the file reading, MDX compilation, and rendering so all 4 posts display correctly at \`/blog/{slug}\`.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### Current state

\`src/app/blog/[slug]/page.tsx\` derives slugs from \`blogPosts\` array, finds the post by slug, then passes it to \`<BlogPostView>\`. The view component renders content from \`post.content\` (an embedded markdown string) with a basic paragraph splitter:

\`\`\`typescript
// In blog-post.tsx — current (to be replaced)
{post.content.split("\\n\\n").map((paragraph, index) => {
  if (trimmed.startsWith("## ")) {
    return <h2 key={index} ...>{trimmed.replace("## ", "")}</h2>;
  }
  return <p key={index} ...>{trimmed}</p>;
})}
\`\`\`

This approach:
- Doesn't handle lists, code blocks, or nested elements
- Won't work once \`post.content\` no longer exists (T006 replaces it with \`post.contentPath\`)

### After Wave 2 (T006)

- \`BlogPost.contentPath\` is present as a string like \`"blog/ep02-creative-ai-framework.mdx"\`
- \`BlogPost.content\` is kept as a temporary bridge field with value \`""\` (empty string) — T006 added this to prevent blog-post.tsx from crashing before this task replaces the renderer. **This task must remove the \`content: ""\` entries from all 4 posts in \`src/data/blog.ts\` after updating the renderer**, OR T002 must have made \`content\` optional so the type still compiles after T011 removes the field.
- 4 MDX files exist at \`src/content/blog/{slug}.mdx\`
- \`next-mdx-remote\` is installed (T002 installed it as part of Wave 1)
- \`src/data/blog.ts\` has 4 posts with correct \`contentPath\` values

### What this task does

1. Create \`src/lib/mdx.ts\` — utility to read MDX files from disk and compile them
2. Update \`src/app/blog/[slug]/page.tsx\` — load MDX source at build time, pass compiled content to view
3. Update \`src/components/blog/blog-post.tsx\` — replace the paragraph splitter with an MDX renderer
4. Create \`src/components/blog/mdx-components.tsx\` — custom component map for consistent heading/paragraph/link styling

This task is part of **Wave 3** — Component Updates.

---

## Requirements

### 1. Create \`src/lib/mdx.ts\`

This module handles reading MDX files from the filesystem.

\`\`\`typescript
import { readFile } from "fs/promises";
import path from "path";

/**
 * Reads an MDX file from src/content/ and returns its string content.
 * @param contentPath - e.g. "blog/ep02-creative-ai-framework.mdx"
 */
export async function getMdxContent(contentPath: string): Promise<string> {
  const filePath = path.join(process.cwd(), "src", "content", contentPath);
  return readFile(filePath, "utf-8");
}
\`\`\`

### 2. Update \`src/app/blog/[slug]/page.tsx\`

- \`generateStaticParams()\`: change from iterating \`blogPosts\` to discovering slugs from MDX filenames in \`src/content/blog/\`. Use \`fs.readdirSync\` or keep using \`blogPosts\` array (either is fine since they must match). The simplest approach: keep \`blogPosts.map(p => ({ slug: p.slug }))\` — T006 ensures blog.ts and MDX files are in sync.
- \`BlogPostPage\` component: make it async, read MDX source from disk using \`getMdxContent(post.contentPath)\`, compile it using \`next-mdx-remote/rsc\` or \`compileMDX\`, pass the compiled content to the view.
- If using \`next-mdx-remote\` RSC API (\`compileMDX\`), the page can be a server component and pass \`content\` (the rendered React tree) directly to \`BlogPostView\`.

### 3. Update \`src/components/blog/blog-post.tsx\`

Replace the current content renderer section:

\`\`\`tsx
// REMOVE this block:
{post.content.split("\\n\\n").map((paragraph, index) => { ... })}

// REPLACE with:
{children}  // passed from the page as compiled MDX content
\`\`\`

Update the \`BlogPostViewProps\` interface:
\`\`\`typescript
interface BlogPostViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  children: React.ReactNode;  // compiled MDX content
}
\`\`\`

The hero image section is currently a placeholder. Uncomment the \`<Image>\` tag and use \`post.thumbnail\` once images are available (T006 sets correct thumbnail paths). The image may not exist yet on disk — wrap in a try/catch or check existence, or render the placeholder if path doesn't resolve. Simplest: just uncomment the Image tag; if the file doesn't exist the build will error, so only do this if T001 has run and images are confirmed downloaded.

**Safe approach:** keep the hero image placeholder for now, add a TODO comment. The brief writer does not know if T001 has been run before T011 in practice.

### 4. Create \`src/components/blog/mdx-components.tsx\`

This provides custom HTML element overrides for MDX rendering, applying the project's Tailwind design system.

\`\`\`typescript
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function getMDXComponents(): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-display text-3xl md:text-4xl mt-12 mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-heading text-2xl md:text-3xl mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-heading text-xl mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-fg-secondary text-lg leading-relaxed mb-6">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-fg-secondary text-lg mb-6 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-fg-secondary text-lg mb-6 space-y-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => (
      <strong className="text-fg-primary font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-bg-secondary px-1.5 py-0.5 text-fg-brand">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-bg-secondary p-6 overflow-x-auto mb-6 text-sm font-mono">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-bg-brand-solid pl-8 my-8 text-fg-secondary italic">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <Link
        href={href ?? "#"}
        className="text-fg-brand underline underline-offset-2 hover:opacity-80 transition-opacity"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
  };
}
\`\`\`

### 5. Page-level wiring (using \`next-mdx-remote/rsc\`)

In \`src/app/blog/[slug]/page.tsx\`:

\`\`\`typescript
import { compileMDX } from "next-mdx-remote/rsc";
import { getMdxContent } from "@/lib/mdx";
import { getMDXComponents } from "@/components/blog/mdx-components";

// In BlogPostPage:
const source = await getMdxContent(post.contentPath);
const { content } = await compileMDX({
  source,
  components: getMDXComponents(),
});

return <BlogPostView post={post} relatedPosts={relatedPosts}>{content}</BlogPostView>;
\`\`\`

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] All 4 blog post detail pages render MDX content without errors
- [ ] \`generateStaticParams()\` returns all 4 slugs (ep02-creative-ai-framework, ep01-creativity-over-compute, democratizing-fortune-500-design, mcp-for-designers)
- [ ] MDX headings (h2, h3) render with project design system styling (not browser default)
- [ ] MDX paragraphs render as styled \`<p>\` elements
- [ ] MDX lists (ul/ol) render correctly
- [ ] Blog listing page at \`/blog\` shows all 4 posts with correct metadata (title, date, category, readingTime)
- [ ] \`npm run build\` passes with static generation including all 4 posts
- [ ] \`npm run lint\` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/lib/mdx.ts\` | create | Filesystem reader for MDX content files |
| \`src/components/blog/mdx-components.tsx\` | create | Custom MDX component map with design system styles |
| \`src/app/blog/[slug]/page.tsx\` | modify | Load + compile MDX at build time, pass to view |
| \`src/components/blog/blog-post.tsx\` | modify | Replace paragraph splitter with \`{children}\` MDX renderer |

### File Ownership Notes

\`src/app/blog/[slug]/page.tsx\` is also the target for T016 (SEO metadata). T011 updates content rendering; T016 adds \`generateMetadata()\`. The current page already has \`generateMetadata()\` — T011 must not break it.

---

## Implementation Guidance

### next-mdx-remote Version

\`next-mdx-remote\` must be installed by T002 (Wave 1). Verify it is present:
\`\`\`
grep "next-mdx-remote" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/package.json
\`\`\`

If not installed, install it:
\`\`\`bash
npm install next-mdx-remote
\`\`\`

For Next.js 16 + React 19, use \`next-mdx-remote\` v5.x. The RSC API (\`compileMDX\` from \`next-mdx-remote/rsc\`) is the correct import for server components in the App Router.

### File Read Strategy

\`src/app/blog/[slug]/page.tsx\` is an async server component (App Router). It can use \`fs\` directly. The \`getMdxContent\` utility in \`src/lib/mdx.ts\` handles the path resolution: \`path.join(process.cwd(), "src", "content", contentPath)\`.

### BlogPostView becomes a server component receiver

After the change, \`blog-post.tsx\` receives \`children: React.ReactNode\`. The component already uses \`"use client"\` because it imports \`framer-motion\`. This is fine — compiled MDX content passed as \`children\` from a server component renders correctly inside a client component in the App Router.

### Edge Cases

- If the MDX file does not exist at the \`contentPath\`, \`getMdxContent\` will throw. This will surface at build time as a proper error rather than a silent empty page — acceptable behavior.
- \`src/app/blog/[slug]/page.tsx\` line 53 uses \`p.category === post.category\` to derive related posts. This filter requires that all 4 blog posts use the new \`BlogCategory\` values from T002 (e.g., \`"Creative Philosophy"\`, \`"About Us"\`, \`"Digital Design"\`). T006 ensures this — verify before considering the related-posts filter broken. The filter itself works correctly; it is a data dependency, not a code bug.
- The \`compileMDX\` call should not need frontmatter parsing since all post metadata lives in \`src/data/blog.ts\`, not in MDX frontmatter. Pass \`{ source, components }\` without a \`parseFrontmatter: true\` option.
- Code blocks in the MDX posts may contain language hints (\`\`\`typescript, \`\`\`bash) — the \`pre\`/\`code\` component map handles basic styling. Syntax highlighting is out of scope for this task.

### Testing Each Post

After build, verify these 4 routes generate:
- \`/blog/ep02-creative-ai-framework\`
- \`/blog/ep01-creativity-over-compute\`
- \`/blog/democratizing-fortune-500-design\`
- \`/blog/mcp-for-designers\`

The build output will list all statically generated routes — check that all 4 appear.

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`

### Files Requiring Review

- \`package.json\` — only modify if \`next-mdx-remote\` needs to be added (T002 should have done this)
- \`tsconfig.json\` — do not touch (T003 set up content path aliases)
- \`next.config.ts\` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T002 | Installs \`next-mdx-remote\`, updates \`BlogPost\` type with \`contentPath\` field, removes \`content\` field | Check \`package.json\` for \`next-mdx-remote\`; check \`src/types/blog.ts\` for \`contentPath: string\` |
| T003 | Creates \`src/content/blog/\` directory | Check \`src/content/blog/\` exists |
| T006 | Creates 4 MDX files in \`src/content/blog/\`, updates \`src/data/blog.ts\` with \`contentPath\` fields | Check that 4 \`.mdx\` files exist in \`src/content/blog/\` |

### Downstream Impact

Tasks that depend on this one:
- **T015** (Wave 4) — Lab page aggregates blog posts
- **T016** (Wave 4) — SEO metadata for blog detail pages

**Before starting:** Verify dependencies:
\`\`\`
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/content/blog/
grep "contentPath" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/src/data/blog.ts
grep "next-mdx-remote" /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/package.json
\`\`\`
All three should return results.

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** \`worktree/framer-cms-migration-T011\`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

\`\`\`
feat(blog): render MDX content via next-mdx-remote with custom component map

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: \`npm run build\`
- [ ] All 4 blog slugs appear in build output as static routes
- [ ] Lint passes: \`npm run lint\`
- [ ] No \`never_touch\` files modified
- [ ] \`post.content\` references removed from \`blog-post.tsx\` (no more paragraph splitter)
- [ ] \`content: ""\` bridge entries removed from all 4 posts in \`src/data/blog.ts\` (or confirmed that \`content\` is declared optional in \`BlogPost\` type so omitting it does not cause TypeScript errors)
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T011 | Wave: 3_`,
  },

  "brief-t016": {
    language: "markdown",
    content: `# Task Brief: T016

**Title:** Add SEO metadata generation from content
**PRD:** framer-cms-migration
**Priority:** should
**Complexity:** 4/10
**Model:** Sonnet
**Wave:** 4
**Feature Issue:** (see execution_plan.yaml)

---

## Objective

Add or improve \`generateMetadata()\` exports on all dynamic route pages and ensure all static pages have appropriate metadata. The root layout already defines a solid baseline — this task fills the gaps on content-specific pages so each URL gets a meaningful, unique title, description, og:image, and canonical URL derived from the actual content.

---

## Context

**Parent Feature:** framer-cms-migration PRD

The codebase already has partial metadata coverage:
- \`src/app/layout.tsx\` exports a root \`metadata\` object with a title template (\`"%s | Open Session"\`), description, og, and twitter cards
- \`src/app/projects/[slug]/page.tsx\` already exports \`generateMetadata()\` — but the og:image is not set and the title pattern uses "Projects" not "Open Session"
- \`src/app/blog/[slug]/page.tsx\` already exports \`generateMetadata()\` — og:image missing, no canonical URL
- \`src/app/playbooks/[slug]/page.tsx\` will exist after T013 — needs \`generateMetadata()\` added
- \`src/app/lab/page.tsx\` will exist after T015 — needs static \`metadata\` export
- Static pages (\`/\`, \`/projects\`, \`/blog\`, \`/about\`, \`/contact\`) need review for static metadata

This task is part of **Wave 4** — integration and polish. The dynamic page routes must be operational before this task finalizes their metadata.

---

## Requirements

### Dynamic Pages — generateMetadata()

**1. \`/projects/[slug]\` (\`src/app/projects/[slug]/page.tsx\`)**
- Already has \`generateMetadata()\` — update it:
  - Title: \`"\${project.title} | Open Session"\` (currently says "| Projects")
  - Add \`openGraph.images\`: use \`project.thumbnail\` as og:image (it will be a local path like \`/images/projects/iterra/hero.svg\`)
  - Add \`alternates.canonical\`: \`https://opensession.co/projects/\${slug}\`

**2. \`/blog/[slug]\` (\`src/app/blog/[slug]/page.tsx\`)**
- Already has \`generateMetadata()\` — update it:
  - Title: uses root template so \`post.title\` alone resolves to \`"Post Title | Open Session"\` — confirm this is correct
  - Add \`openGraph.images\`: use \`post.thumbnail\`
  - Add \`alternates.canonical\`: \`https://opensession.co/blog/\${slug}\`

**3. \`/playbooks/[slug]\` (\`src/app/playbooks/[slug]/page.tsx\`)**
- Add \`generateMetadata()\` that handles both found and not-found cases
- Title: \`playbook.title\` (uses root template)
- og:image: \`playbook.thumbnail\` if available
- Canonical: \`https://opensession.co/playbooks/\${slug}\`
- Graceful not-found return: \`{ title: "Playbook Not Found" }\`

### Static Pages — static metadata export

**4. \`/lab\` (\`src/app/lab/page.tsx\`)**
- Add/verify \`export const metadata: Metadata = { title: "The Lab", description: "..." }\`
- (T015 may have already added this — verify and improve if needed)

**5. \`/projects\` (\`src/app/projects/page.tsx\`)**
- Currently a \`"use client"\` component — static metadata cannot be exported from client components
- **Approach:** Extract metadata to a separate server wrapper. Create \`src/app/projects/_metadata.ts\` exporting the metadata object, OR move the metadata export to \`src/app/projects/layout.tsx\` (create if it doesn't exist)
- Metadata: \`title: "Projects"\`, \`description: "15+ brand, digital design, and creative direction projects."\`

**6. \`/blog\` (\`src/app/blog/page.tsx\`)**
- Already has \`export const metadata\` — verify title and description are accurate
- Add \`alternates.canonical\`: \`https://opensession.co/blog\`

**7. \`/about\` (\`src/app/about/page.tsx\`)**
- Check for existing metadata export; add if missing
- Title: "About", description about the Open Session team and mission

**8. \`/contact\` (\`src/app/contact/page.tsx\`)**
- Check for existing metadata export; add if missing
- Title: "Contact", description: "Get in touch with Open Session."

### Root Layout Metadata (\`src/app/layout.tsx\`)
- Review the existing metadata — it is already well-formed
- No changes required unless you identify a gap

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] \`/projects/[slug]\` \`generateMetadata()\` returns og:image from \`project.thumbnail\` and canonical URL
- [ ] \`/blog/[slug]\` \`generateMetadata()\` returns og:image from \`post.thumbnail\` and canonical URL
- [ ] \`/playbooks/[slug]\` exports \`generateMetadata()\` (handles empty array gracefully — no runtime error)
- [ ] \`/lab\` has static \`metadata\` export with title and description
- [ ] \`/projects\` has metadata accessible at build time (via layout.tsx or similar — NOT from a client component)
- [ ] \`/blog\` metadata has canonical URL
- [ ] \`/about\` and \`/contact\` both have static \`metadata\` exports
- [ ] All page titles follow the pattern: content title alone (root layout template appends "| Open Session")
- [ ] \`npm run build\` passes with no TypeScript errors
- [ ] \`npm run lint\` passes

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/app/projects/[slug]/page.tsx\` | modify | Update existing generateMetadata — add og:image and canonical |
| \`src/app/blog/[slug]/page.tsx\` | modify | Update existing generateMetadata — add og:image and canonical |
| \`src/app/playbooks/[slug]/page.tsx\` | modify | Add generateMetadata() |
| \`src/app/lab/page.tsx\` | modify | Verify/improve metadata export (T015 creates this file) |
| \`src/app/projects/layout.tsx\` | create | Add static metadata for /projects (client page workaround) |
| \`src/app/blog/page.tsx\` | modify | Add canonical URL to existing metadata |
| \`src/app/about/page.tsx\` | modify | Add metadata export if missing |
| \`src/app/contact/page.tsx\` | modify | Add metadata export if missing |

### File Ownership Notes

\`src/app/lab/page.tsx\` is created by T015. Coordinate: if T015 and T016 run in sequence, T016 modifies the file T015 created. If running in parallel (not recommended for Wave 4), merge carefully.

\`src/app/projects/page.tsx\` is a \`"use client"\` component — you cannot add \`export const metadata\` to it directly. Next.js will throw a build error. Use \`src/app/projects/layout.tsx\` instead.

---

## Implementation Guidance

### Root Layout Metadata (Already in Place)

\`src/app/layout.tsx\` has this title template:
\`\`\`typescript
title: {
  default: "Open Session | Design Company",
  template: "%s | Open Session",
},
\`\`\`

This means any page that exports \`title: "Projects"\` will render as \`"Projects | Open Session"\` in \`<title>\`. You do NOT need to manually append "| Open Session" in each page's metadata.

### Existing generateMetadata Pattern

The pattern used in \`src/app/projects/[slug]/page.tsx\` is correct — follow it for playbooks. Key detail: \`params\` is a \`Promise\` in Next.js 16+ App Router:

\`\`\`typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // ...
}
\`\`\`

### Adding og:image

For local image paths (e.g. \`/images/projects/iterra/hero.svg\`), the og:image format is:

\`\`\`typescript
openGraph: {
  images: [
    {
      url: project.thumbnail,  // "/images/projects/iterra/hero.svg"
      width: 1200,
      height: 630,
      alt: project.title,
    },
  ],
},
\`\`\`

Note: og:image ideally should be an absolute URL. For production correctness, prepend the base URL:
\`\`\`typescript
const baseUrl = "https://opensession.co";
images: [{ url: \`\${baseUrl}\${project.thumbnail}\` }]
\`\`\`

### Canonical URLs

\`\`\`typescript
alternates: {
  canonical: \`https://opensession.co/projects/\${slug}\`,
},
\`\`\`

### Client Component Metadata Workaround

\`src/app/projects/page.tsx\` is a client component (\`"use client"\`). Metadata cannot be exported from client components. The cleanest fix is a layout file:

\`\`\`typescript
// src/app/projects/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "15+ brand, digital design, and creative direction projects.",
  alternates: {
    canonical: "https://opensession.co/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
\`\`\`

### Playbooks Page — Empty generateStaticParams

The playbooks page has an empty array for \`generateStaticParams()\`. \`generateMetadata()\` should still be added — it just won't be called during the build (no slugs to generate). It will be called on-demand if a slug is ever hit, so make sure it handles a not-found case:

\`\`\`typescript
export async function generateMetadata({ params }: PlaybookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playbook = playbooks.find((p) => p.slug === slug);
  if (!playbook) return { title: "Playbook Not Found" };
  return {
    title: playbook.title,
    description: playbook.excerpt,
    alternates: { canonical: \`https://opensession.co/playbooks/\${slug}\` },
  };
}
\`\`\`

### Code Style

- Import \`Metadata\` from \`"next"\` not \`"next/dist/..."\` 
- Use \`async function generateMetadata\` (not arrow function) for consistency with existing code
- Mapped Tailwind classes for any UI elements (none expected in this task)
- No new npm packages needed

### Edge Cases

- If \`project.thumbnail\` is an empty string or undefined (data not yet populated by T005), the og:image will be broken — wrap in a conditional: \`...(project.thumbnail ? { images: [{ url: ... }] } : {})\`
- The \`/playbooks\` listing page (\`src/app/playbooks/page.tsx\`) may also need metadata — add a static export if it's missing

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T010 | Enriched project detail page exists with updated data schema | Check \`src/app/projects/[slug]/page.tsx\` renders project data |
| T011 | Blog MDX system complete; \`blogPosts\` have \`contentPath\` | Check \`src/data/blog.ts\` has 4 posts |
| T015 | \`/lab\` page created at \`src/app/lab/page.tsx\` | Check file exists before modifying it |

### Downstream Impact

Tasks that depend on this one: None — T016 is a leaf in Wave 4.

**Before starting:** Verify dependencies are complete by checking:
- \`src/app/lab/page.tsx\` exists (T015 complete)
- \`src/app/playbooks/[slug]/page.tsx\` exists (T013 complete)
- \`src/app/projects/[slug]/page.tsx\` has the enriched project rendering (T010 complete)

---

## GitHub Context

**Issue:** T016
**Branch:** \`worktree/framer-cms-migration-T016\`
**Target:** \`main\` (or active feature branch if in use)

---

## Commit Guidelines

\`\`\`
feat(seo): add og:image and canonical URLs to dynamic route pages

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

\`\`\`
feat(seo): add static metadata to projects, blog, about, contact, lab pages

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: \`npm run build\`
- [ ] Lint passes: \`npm run lint\`
- [ ] No \`never_touch\` files modified
- [ ] \`next.config.ts\` not modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T016 | Wave: 4_`,
  },

  "brief-t020": {
    language: "markdown",
    content: `# Task Brief: T020

**Title:** Update about page components with downloaded image paths
**PRD:** framer-cms-migration
**Priority:** must
**Complexity:** 4/10
**Model:** sonnet
**Wave:** 3
**Feature Issue:** (set by PM Agent)

---

## Objective

Update the about page components (\`AboutHero\`, \`TeamShowcase\`) and the team data file to reference locally downloaded images instead of placeholder paths. All images are downloaded by Wave 1 task T001 to \`/public/images/about/\`. This task wires those paths into the components using \`next/image\`.

---

## Context

**Parent Feature:** Framer CMS Migration — migrating all opensession.co content into the Next.js portfolio codebase.

### Current state of about page components

The about page at \`/about\` renders these components (from \`src/app/about/page.tsx\`):
1. \`<AboutHero />\` — Currently a text-only section with a word-by-word animation. No hero image.
2. \`<TeamShowcase />\` — Renders two team members side-by-side using \`HoverMaskReveal\`. Uses image paths from \`src/data/team.ts\` (\`showcase\` array).
3. \`<ThesisSection />\`, \`<ValuesSection />\`, \`<BeliefsSection />\` — Not in scope for this task.

### Current team data (\`src/data/team.ts\`)

\`\`\`typescript
export const showcase: TeamMember[] = [
  {
    id: "karim",
    name: "Karim",
    role: "Co-Founder & CEO",
    bio: "...",
    image: "/images/team/karim.webp",  // placeholder path — directory doesn't exist
    social: { linkedin: "..." },
  },
  {
    id: "morgan",
    name: "Morgan",
    role: "Co-Founder & COO",
    bio: "...",
    image: "/images/team/morgan.webp",  // placeholder path
    social: { linkedin: "..." },
  },
];
\`\`\`

The paths \`/images/team/karim.webp\` and \`/images/team/morgan.webp\` point to non-existent directories. The actual downloaded files are in \`/public/images/about/\`.

### Downloaded image locations (from T001)

All are in \`/public/images/about/\` after T001 runs. **Verify these files exist before proceeding.**

| Description | Filename (from framerusercontent hash) | Local path |
|-------------|---------------------------------------|-----------|
| About page hero | \`Sj4TYZrc68BDHPXs5O5D19mVik.jpg\` (7008x4672) | \`/public/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg\` |
| Karim photo | \`HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg\` | \`/public/images/about/HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg\` |
| Morgan photo | \`Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp\` | \`/public/images/about/Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp\` |
| Story image 1 | \`TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg\` | \`/public/images/about/TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg\` |
| Story image 2 | \`wKJt8b9CgcZCyP5NKky2RDcdQ.jpg\` | \`/public/images/about/wKJt8b9CgcZCyP5NKky2RDcdQ.jpg\` |
| Story image 3 | \`hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg\` | \`/public/images/about/hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg\` |
| Story image 4 | \`qvzOeu5vdocdhOTq2yANNjMg0.jpg\` | \`/public/images/about/qvzOeu5vdocdhOTq2yANNjMg0.jpg\` |

### \`HoverMaskReveal\` component

\`TeamShowcase\` uses \`<HoverMaskReveal src={karim.image!} alt={karim.name} className="aspect-[3/4] w-full" />\`. This is a custom component at \`src/components/shared/hover-mask-reveal.tsx\`. You need to check if it uses \`next/image\` internally — if not, you may need to either:
a. Update \`HoverMaskReveal\` to use \`next/image\` (if it uses a raw \`<img>\` tag)
b. Or accept that it uses \`<img>\` with a local path (local images work fine with raw \`<img>\`)

Check \`src/components/shared/hover-mask-reveal.tsx\` before deciding. If it uses \`next/image\` with \`fill\`, just updating the \`src\` prop (via team data) is sufficient.

This task is part of **Wave 3** — Component Updates. Only T001 is a prerequisite.

---

## Requirements

### 1. Update \`src/data/team.ts\`

Update the \`showcase\` array to use the correct local image paths:

\`\`\`typescript
export const showcase: TeamMember[] = [
  {
    id: "karim",
    name: "Karim",
    role: "Co-Founder & CEO",
    bio: "Karim drives the strategic vision behind Open Session...",
    image: "/images/about/HZHRFcDFfGNqJUjMRtKYNqSezcg.jpg",
    social: { linkedin: "https://linkedin.com/in/karim" },
  },
  {
    id: "morgan",
    name: "Morgan",
    role: "Co-Founder & COO",
    bio: "Morgan brings operational excellence and creative leadership...",
    image: "/images/about/Zh4XMHMk3BgiZszy1fcQk5ZGueQ.webp",
    social: { linkedin: "https://linkedin.com/in/morgan" },
  },
];
\`\`\`

Note: paths are \`/images/about/...\` (no \`public/\` prefix — Next.js serves from \`public/\` as root).

### 2. Update \`src/components/about/about-hero.tsx\`

The current \`AboutHero\` renders only text. Add the hero image below the text block as a full-width image section:

\`\`\`tsx
{/* Story text grid — existing */}
<motion.div ...>
  {/* ... existing two-column text ... */}
</motion.div>

{/* Hero image — NEW */}
<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
  transition={{ delay: 0.8 }}
  className="relative aspect-[16/9] lg:aspect-[21/9] mt-16 lg:mt-24 overflow-hidden bg-bg-tertiary"
>
  <Image
    src="/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg"
    alt="Open Session team at work"
    fill
    className="object-cover"
    sizes="100vw"
    quality={85}
    priority
  />
</motion.div>
\`\`\`

The hero image is 7008x4672 (very large). Use \`quality={85}\` to reduce file size. Next.js Image optimization handles downscaling automatically — do NOT manually resize the source image.

Import \`Image\` from \`"next/image"\` at the top of \`about-hero.tsx\`.

The \`about-hero.tsx\` component is currently a client component (\`"use client"\`) due to \`motion\` imports. Adding \`next/image\` is fine in client components.

### 3. Update \`src/components/about/team-showcase.tsx\`

The \`TeamShowcase\` component reads from \`showcase\` data in \`src/data/team.ts\`. After updating \`team.ts\`, the new image paths flow automatically into \`HoverMaskReveal\`.

**Check \`HoverMaskReveal\`:** Look at \`src/components/shared/hover-mask-reveal.tsx\`. If it:
- Uses \`next/image\` internally -> no changes needed to \`team-showcase.tsx\`
- Uses raw \`<img>\` tag -> it will work with local paths, but consider adding \`loading="lazy"\` if not present

If \`HoverMaskReveal\` has a fixed size constraint that would crop the portrait photos poorly, consider adjusting the \`className\` passed from \`TeamShowcase\`:
- Current: \`className="aspect-[3/4] w-full"\` — this is a 3:4 portrait ratio, which is correct for headshots.
- Keep as-is unless the component doesn't respect the className.

### 4. Story images (optional, if scope allows)

The about page currently has no "story" section rendering the 4 story images (\`TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg\`, etc.). The existing \`AboutHero\` and \`TeamShowcase\` don't have a story images section. Adding a new story section is out of scope for this task (that would be a visual redesign).

Store the story image paths in \`src/data/team.ts\` as a separate export for future use:

\`\`\`typescript
export const storyImages = [
  "/images/about/TqpOzHSCxAEs7wnhiAD4SGGci4c.jpg",
  "/images/about/wKJt8b9CgcZCyP5NKky2RDcdQ.jpg",
  "/images/about/hAhO4qlpgRYUDxrvypSNiIK6ZE.jpg",
  "/images/about/qvzOeu5vdocdhOTq2yANNjMg0.jpg",
];
\`\`\`

This makes the paths available for future visual work without rendering them now.

---

## Success Criteria

Complete ALL criteria before marking task done:

- [ ] About page hero image (\`Sj4TYZrc68BDHPXs5O5D19mVik.jpg\`) renders using \`next/image\` in \`AboutHero\`
- [ ] Team member photos render from \`/public/images/about/\` (Karim: \`.jpg\`, Morgan: \`.webp\`)
- [ ] \`src/data/team.ts\` \`showcase\` array has updated \`image\` paths pointing to \`/images/about/\`
- [ ] No images reference framerusercontent.com or external CDN URLs
- [ ] Story image paths stored in \`storyImages\` export in \`team.ts\`
- [ ] \`npm run build\` passes
- [ ] \`npm run lint\` passes

**All criteria must pass before task is complete.**

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/data/team.ts\` | modify | Update \`showcase\` image paths to local \`/images/about/\` files; add \`storyImages\` export |
| \`src/components/about/about-hero.tsx\` | modify | Add hero image below existing text content |
| \`src/components/about/team-showcase.tsx\` | modify | Verify \`HoverMaskReveal\` receives correct paths; update \`sizes\` prop if needed |

### File Ownership Notes

\`src/data/team.ts\` is not touched by any other Wave 3 tasks. Safe to modify freely.

\`src/components/about/about-hero.tsx\` is not touched by any other Wave 3 tasks.

\`src/components/shared/hover-mask-reveal.tsx\` — read it to understand its internals, but only modify it if strictly necessary (e.g., it has hardcoded \`<img>\` that doesn't accept \`src\` path changes gracefully). Prefer minimal changes to shared components.

---

## Implementation Guidance

### Check HoverMaskReveal first

Before writing any code, read \`src/components/shared/hover-mask-reveal.tsx\`. If it:
- Uses \`next/image\` with \`src={src}\` prop -> team.ts path update is sufficient, no component changes needed
- Uses \`<img src={src} />\` -> local paths work fine; add \`loading="lazy"\` if missing

### next/image for large images

The about hero is 7008x4672 pixels. Use these settings:
\`\`\`tsx
<Image
  src="/images/about/Sj4TYZrc68BDHPXs5O5D19mVik.jpg"
  alt="Open Session team at work"
  fill
  className="object-cover"
  sizes="100vw"
  quality={85}
  priority
/>
\`\`\`

- \`fill\` + \`sizes="100vw"\` -> Next.js generates optimized srcset
- \`quality={85}\` -> reduces output file size from the large original
- \`priority\` -> this is a visible on-page image, load it eagerly

### Aspect ratio container for hero

Use a responsive aspect ratio:
\`\`\`tsx
<div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
  <Image ... fill className="object-cover" />
</div>
\`\`\`

\`aspect-[21/9]\` gives a cinematic banner ratio on desktop. \`aspect-[16/9]\` on mobile avoids the image being too tall on small screens.

### About hero motion pattern

\`about-hero.tsx\` uses \`motion.div\` with \`wordContainer\`/\`wordReveal\` variants from \`@/lib/motion\`. The new image section should use \`fadeInUp\` variant to match:

\`\`\`tsx
import { wordContainer, wordReveal, fadeInUp } from "@/lib/motion";
// ...
<motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
  {/* image */}
</motion.div>
\`\`\`

### Code Style

- Use mapped Tailwind classes: \`bg-bg-tertiary\`, \`text-fg-secondary\`
- No \`style={}\` props with raw CSS vars
- Keep \`"use client"\` directive at top of \`about-hero.tsx\` (it's already there)

### Edge Cases

- If a photo file doesn't exist (T001 failed for that file), \`next/image\` throws at build time. Keep the fallback in \`team-showcase.tsx\`:
  - \`karim.image!\` — the \`!\` non-null assertion assumes the image exists. If it might be missing, add a guard or a conditional render. Since T001 is a hard dependency, this is acceptable risk.
- Morgan's photo is a \`.webp\` file — \`next/image\` handles WebP natively; no special configuration needed.

---

## Boundaries

### Files You MUST NOT Touch

- \`node_modules/**\`
- \`.git/**\`
- \`.next/**\`
- \`package-lock.json\`
- \`src/components/home/**\` — homepage is T019's scope
- \`src/components/about/values-section.tsx\` — not in scope
- \`src/components/home/thesis-section.tsx\` — used on about page but not in scope

### Files Requiring Review

- \`package.json\` — no new packages needed
- \`next.config.ts\` — do not touch; local images need no domain config
- \`tsconfig.json\` — do not touch

---

## Dependencies

### Upstream Tasks

| Task | What It Provides | Verify Before Starting |
|------|-----------------|----------------------|
| T001 | Downloads about page images to \`/public/images/about/\` | Check \`ls /public/images/about/\` returns files including the Karim/Morgan photos |

### Downstream Impact

Tasks that depend on this one: None in Wave 3.
- T016 (Wave 4) — SEO metadata for the about page — benefits from having a proper hero image path available.

**Before starting:** Verify T001 has run:
\`\`\`
ls /Users/alexbouhdary/Documents/GitHub.nosync/OS-Portfolio/public/images/about/
\`\`\`
Should return at least: the hero JPG, Karim's JPG, Morgan's webp. If empty, T001 must run first.

---

## GitHub Context

**Issue:** (set by PM Agent)
**Feature Issue (Parent):** (set by PM Agent)
**Branch:** \`worktree/framer-cms-migration-T020\`
**Target:** Determined by PM Agent based on execution mode (feature branch or main)

---

## Commit Guidelines

Use Conventional Commits:

\`\`\`
feat(about): add hero image and update team photos with downloaded assets

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

---

## Validation Checklist

Before creating PR:

- [ ] All success criteria met
- [ ] Build passes: \`npm run build\`
- [ ] Lint passes: \`npm run lint\`
- [ ] No framerusercontent.com URLs in any modified files
- [ ] About page hero image renders correctly
- [ ] Team member photos render (not blank/broken)
- [ ] \`storyImages\` export added to \`team.ts\` for future use
- [ ] No \`never_touch\` files modified
- [ ] Branch rebased on target branch

---

_Generated by KARIMO Brief Writer_
_PRD: framer-cms-migration | Task: T020 | Wave: 3_`,
  },

  "status-complete": {
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
  "final_pr_number": null,
  "final_pr_created_at": "2026-04-07T12:29:00Z",
  "tasks": {
    "T001": "done",
    "T002": "done",
    "T003": "done",
    "T004": "done",
    "T005": "done",
    "T006": "done",
    "T007": "done",
    "T008": "done",
    "T009": "done",
    "T010": "done",
    "T011": "done",
    "T012": "done",
    "T013": "done",
    "T014": "done",
    "T015": "done",
    "T016": "done",
    "T017": "done",
    "T018": "done",
    "T019": "done",
    "T020": "done"
  }
}`,
  },
};

// --- Chat Script ------------------------------------------

export const CHAT_SCRIPT: ChatMessage[] = [
  // -- /karimo:research -------------------------------
  {
    role: "system",
    content: "/karimo:research framer-cms-migration",
    timestamp: 0,
  },
  {
    role: "assistant",
    content:
      "Starting research phase. Scanning codebase for structure, patterns, and conventions...",
    timestamp: 1500,
  },
  {
    role: "tool",
    content: "Scanned 847 files \u00b7 Next.js 16+ \u00b7 React 19 \u00b7 TypeScript \u00b7 Tailwind 4",
    timestamp: 3500,
  },
  {
    role: "assistant",
    content:
      "Internal scan complete. Found 16 data files, 47 components, 20+ motion variants. Scanning external sources...",
    timestamp: 5000,
  },
  {
    role: "tool",
    content: "Research complete \u00b7 75 image URLs cataloged \u00b7 4 content types \u00b7 7 schema gaps \u00b7 5 evidence files written",
    timestamp: 7000,
  },

  // -- /karimo:plan (Interview & Planning) ------------
  {
    role: "system",
    content: "/karimo:plan framer-cms-migration",
    timestamp: 8000,
  },
  {
    role: "assistant",
    content:
      "Starting PRD interview. What content are we migrating from Framer?",
    timestamp: 8500,
  },
  {
    role: "assistant",
    content:
      "Understood. Scope: 5 projects, 4 blog posts, 5 free resources, 2 legal pages, ~75 images. Generating PRD...",
    timestamp: 9500,
  },
  {
    role: "tool",
    content:
      "PRD_framer-cms-migration.md written \u00b7 20 tasks defined \u00b7 4 waves \u00b7 89 complexity points",
    timestamp: 11500,
  },
  {
    role: "assistant",
    content:
      "Generating task briefs and execution plan. Wave 1: Foundation. Wave 2: Content Migration. Wave 3: Components. Wave 4: Integration.",
    timestamp: 12500,
  },
  {
    role: "tool",
    content:
      "Generated: tasks.yaml \u00b7 execution_plan.yaml \u00b7 20 task briefs \u00b7 briefs.overview.md",
    timestamp: 13500,
  },

  // -- /karimo:run (Review + Execution) ---------------
  {
    role: "system",
    content: "/karimo:run framer-cms-migration",
    timestamp: 14000,
  },
  {
    role: "assistant",
    content:
      "Pre-execution review. Validating all 20 task briefs against codebase reality...",
    timestamp: 15000,
  },
  {
    role: "tool",
    content:
      "Review complete \u00b7 8 critical issues \u00b7 7 warnings found across 20 briefs \u00b7 Auto-correcting...",
    timestamp: 16500,
  },
  {
    role: "assistant",
    content: "8/8 critical issues auto-corrected. All briefs validated. Starting execution \u2014 4 waves, 20 tasks.",
    timestamp: 17500,
  },
  {
    role: "assistant",
    content:
      "Spawning Wave 1 \u2014 Foundation: 4 parallel worktrees. T001 downloading 75 images, T002 enriching TypeScript schemas...",
    timestamp: 19500,
  },
  {
    role: "tool",
    content:
      "Wave 1 complete \u00b7 4/4 tasks \u00b7 35 min \u00b7 75 images downloaded \u00b7 PR merged",
    timestamp: 22000,
  },
  {
    role: "assistant",
    content:
      "Wave 2 \u2014 Content Migration: Populating 5 projects, converting 4 blog posts to MDX, migrating free resources...",
    timestamp: 23000,
  },
  {
    role: "tool",
    content:
      "Wave 2 complete \u00b7 5/5 tasks \u00b7 55 min \u00b7 Slug redirect added for google-gemini-infinite-nature",
    timestamp: 25500,
  },
  {
    role: "assistant",
    content:
      "Wave 3 \u2014 Component Updates: Category system, project detail page, blog MDX renderer, homepage/about images...",
    timestamp: 26500,
  },
  {
    role: "tool",
    content:
      "Wave 3 complete \u00b7 7/7 tasks \u00b7 60 min \u00b7 All components rendering enriched data",
    timestamp: 28500,
  },
  {
    role: "assistant",
    content:
      "Wave 4 \u2014 Integration & Polish: Lab page, SEO metadata, content validation, template stripping...",
    timestamp: 29500,
  },
  {
    role: "tool",
    content:
      "Wave 4 complete \u00b7 4/4 tasks \u00b7 30 min \u00b7 All 20 tasks done \u00b7 0 failures \u00b7 0 escalations",
    timestamp: 31500,
  },

  // -- /karimo:merge ----------------------------------
  {
    role: "system",
    content: "/karimo:merge framer-cms-migration",
    timestamp: 32000,
  },
  {
    role: "assistant",
    content:
      "Feature branch feat/framer-cms-migration ready. Running Greptile-powered code review...",
    timestamp: 33000,
  },
  {
    role: "tool",
    content:
      "Review passed \u00b7 39 files changed \u00b7 0 P1 issues \u00b7 2 P3 suggestions \u00b7 Score: 9.2/10",
    timestamp: 35000,
  },
  {
    role: "assistant",
    content:
      "Merge complete. 20/20 tasks, 89 complexity points, 180 minutes. PRD execution finished.",
    timestamp: 36000,
  },
];

// --- Timeline Events --------------------------------------

// Path prefix for tree-reveal events
const P = "OS-Portfolio/.karimo/prds/001_framer-cms-migration";

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // -- Research (/karimo:research) --------------------
  { time: 0, type: "chat", payload: "0" },
  // Expand the folder tree to the PRD
  { time: 300, type: "tree-reveal", payload: "OS-Portfolio/.karimo" },
  { time: 600, type: "tree-reveal", payload: "OS-Portfolio/.karimo/prds" },
  { time: 900, type: "tree-reveal", payload: P },
  { time: 1500, type: "chat", payload: "1" },
  // Research folder appears with subfolders
  { time: 2500, type: "tree-reveal", payload: `${P}/research` },
  { time: 3000, type: "tree-reveal", payload: `${P}/research/internal` },
  { time: 3500, type: "chat", payload: "2" },
  { time: 4000, type: "tree-reveal", payload: `${P}/research/external` },
  { time: 4500, type: "tab-open", payload: "internal-structure" },
  { time: 4500, type: "editor-content", payload: "internal-structure" },
  { time: 5000, type: "chat", payload: "3" },
  { time: 5500, type: "tab-open", payload: "research-findings" },
  { time: 5500, type: "editor-content", payload: "research-findings" },
  { time: 6500, type: "tab-open", payload: "research-summary" },
  { time: 6500, type: "editor-content", payload: "research-summary" },
  { time: 7000, type: "chat", payload: "4" },

  // -- Plan (/karimo:plan — interview + PRD) ----------
  { time: 8000, type: "chat", payload: "5" },
  { time: 8500, type: "chat", payload: "6" },
  { time: 9500, type: "chat", payload: "7" },
  { time: 10000, type: "tab-open", payload: "prd" },
  { time: 10000, type: "editor-content", payload: "prd" },
  { time: 11500, type: "chat", payload: "8" },
  { time: 12500, type: "chat", payload: "9" },
  // Briefs folder appears with all 20 briefs
  { time: 13000, type: "tree-reveal", payload: `${P}/briefs` },
  { time: 13200, type: "tab-open", payload: "tasks" },
  { time: 13200, type: "editor-content", payload: "tasks" },
  { time: 13500, type: "chat", payload: "10" },

  // -- Run (/karimo:run — review then execution) ------
  { time: 14000, type: "chat", payload: "11" },
  { time: 14500, type: "tab-open", payload: "briefs-overview" },
  { time: 14500, type: "editor-content", payload: "briefs-overview" },
  { time: 15000, type: "chat", payload: "12" },
  { time: 16000, type: "tab-open", payload: "recommendations" },
  { time: 16000, type: "editor-content", payload: "recommendations" },
  { time: 16500, type: "chat", payload: "13" },
  { time: 17500, type: "chat", payload: "14" },
  // Expand .claude/worktrees during execution
  { time: 18200, type: "tree-reveal", payload: "OS-Portfolio/.claude" },
  { time: 18500, type: "tab-open", payload: "execution" },
  { time: 18500, type: "editor-content", payload: "execution" },
  // Wave 1
  { time: 19500, type: "chat", payload: "15" },
  { time: 20000, type: "tab-open", payload: "brief-t001" },
  { time: 20000, type: "editor-content", payload: "brief-t001" },
  { time: 22000, type: "chat", payload: "16" },
  // Wave 2
  { time: 23000, type: "chat", payload: "17" },
  { time: 23500, type: "tab-open", payload: "brief-t005" },
  { time: 23500, type: "editor-content", payload: "brief-t005" },
  { time: 25500, type: "chat", payload: "18" },
  // Wave 3
  { time: 26500, type: "chat", payload: "19" },
  { time: 27000, type: "tab-open", payload: "brief-t010" },
  { time: 27000, type: "editor-content", payload: "brief-t010" },
  { time: 28500, type: "chat", payload: "20" },
  // Wave 4
  { time: 29500, type: "chat", payload: "21" },
  { time: 30000, type: "tab-open", payload: "findings" },
  { time: 30000, type: "editor-content", payload: "findings" },
  { time: 31500, type: "chat", payload: "22" },

  // -- Merge (/karimo:merge) ---------------------------
  { time: 32000, type: "chat", payload: "23" },
  { time: 33000, type: "chat", payload: "24" },
  { time: 33500, type: "tab-open", payload: "metrics" },
  { time: 33500, type: "editor-content", payload: "metrics" },
  { time: 35000, type: "chat", payload: "25" },
  { time: 35500, type: "tab-open", payload: "status-complete" },
  { time: 35500, type: "editor-content", payload: "status-complete" },
  { time: 36000, type: "chat", payload: "26" },
];

export const TIMELINE_DURATION = 40000;

// --- Helpers ----------------------------------------------

export function getFileExtension(filename: string): string {
  return filename.split(".").pop() ?? "";
}

export function getLanguage(filename: string): string {
  return EXT_LANG[getFileExtension(filename)] ?? "text";
}

export function getExtColor(filename: string): string {
  return EXT_COLOR[getFileExtension(filename)] ?? VSCODE.textDim;
}
