# KARIMO Overview - Claude Development Guide

## Project Overview

Interactive visual explainer for KARIMO -- built with Next.js 16+, React 19, TypeScript, Tailwind CSS, and Framer Motion. Dark-themed product page showcasing the KARIMO agent orchestration system.

## Essential Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Tech Stack

- **Framework**: Next.js 16+ App Router
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion + CSS keyframes
- **Language**: TypeScript

## Key Directories

```
karimo-overview/
├── app/              # Next.js pages and layout
├── components/       # React components
│   └── ui/           # Shared UI primitives
├── lib/              # Motion variants, constants, utilities
├── styles/           # Theme CSS variables
├── public/fonts/     # Neue Haas Display, Neue Haas Text, OffBit
└── .claude/          # Claude configuration
```

## Claude Configuration Structure

| Folder       | Purpose                              |
| ------------ | ------------------------------------ |
| `brand/`     | Brand identity docs, writing guides  |
| `reference/` | Design system reference              |

---

## Code Conventions

### TypeScript

- Strict mode enabled
- Prefer `interface` for component props
- Co-locate component-specific types in the same file

### Components

- Prefer composition over prop drilling
- Use Framer Motion for viewport-triggered animations

### Styling: Use Mapped Tailwind Classes

```css
/* CORRECT - Semantic classes */
bg-bg-primary          /* Main background */
bg-bg-secondary        /* Elevated surfaces */
text-fg-primary        /* Primary text */
text-fg-secondary      /* Secondary text */
border-border-primary  /* Interactive element borders */
border-border-secondary /* Container borders */

/* WRONG - Raw CSS variables */
bg-[var(--bg-primary)]

/* WRONG - Opacity modifiers don't work with CSS vars */
bg-[var(--bg-secondary)]/30
```

> **Opacity Warning**: Tailwind's opacity modifier (`/30`, `/50`) does NOT work with CSS variables in bracket notation. `bg-[var(--bg-secondary)]/30` silently fails. Use mapped classes instead: `bg-bg-secondary/30`.

---

## Typography

| Category    | Font               | Usage                                  |
| ----------- | ------------------ | -------------------------------------- |
| **Display** | Neue Haas Display  | Headlines, titles                      |
| **Body**    | Neue Haas Text     | Body text, paragraphs                  |
| **Accent**  | OffBit             | Labels, section markers (max 2/viewport) |
| **Mono**    | SF Mono, Fira Code | Code blocks                            |

All fonts are hosted locally in `public/fonts/`.

---

## Animation Patterns

### KarimoPipeline (Section 01)

Uses `requestAnimationFrame` with a custom timeline clock (~4.8s cycle). Inline styles with hardcoded hex colors in a `C` constants object. This is a self-contained legacy animation component.

### Other Sections (Framer Motion)

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

### CSS Animation Utilities

Available classes: `.animate-fade-in`, `.animate-fade-in-up`, `.animate-slide-up`, `.animate-marquee`
Stagger delays: `.stagger-1` through `.stagger-6`

---

## Design System

For complete design system documentation, see `reference/design-system.md`.

### Key Rules

- **CSS Syntax**: Use mapped Tailwind classes (`bg-bg-primary`), not bracket notation
- **Opacity**: Never use `/30` or `/50` on bracket notation with CSS vars
- **Borders**: Use `border-border-secondary` for containers, never brand colors for borders
- **Colors**: Use warm neutrals (Charcoal/Vanilla), this site is dark-only (`--bg-primary: #000000`)
- **Icons**: Never use the `Sparkles` icon (hard ban)
- **Borders**: Never use `border-2` or thick borders

---

## Validation Requirements

Before completing any feature:

1. `npm run build` -- Clean build
2. Visual check -- Animation timing and styling correct
3. Mobile responsive -- Works on all screen sizes

---

## Instruction Precedence

When instructions conflict, follow this priority order (highest to lowest):

1. **This file** (.claude/claude.md)
2. **Global ~/.claude/CLAUDE.md**
3. Skills (auto-activated, supplement above)
