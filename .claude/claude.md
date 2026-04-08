# KARIMO Overview Site - Claude Development Guide

## Project Overview

Interactive visual explainer for KARIMO - built with Next.js 16+, React 19, TypeScript, Tailwind CSS.

## Essential Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Tech Stack

- **Framework**: Next.js 16+ App Router
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion + CSS animations
- **Language**: TypeScript

## Key Directories

```
karimo-overview/
├── app/              # Next.js pages
├── components/       # React components
├── lib/              # Motion variants, utilities
├── styles/           # Theme CSS variables
└── .claude/          # Claude configuration
```

## Design System

### Color Tokens

Based on Open Session BOS-3.0:

```css
--color-black: #000000      /* Pipeline background */
--color-charcoal: #191919   /* Elevated surfaces */
--color-vanilla: #FFFAEE    /* Primary text */
--color-aperol: #FE5102     /* Brand accent */
--color-black80: #383838    /* Dark surfaces */
--color-black60: #595959    /* Muted elements */
--color-black30: #C7C7C7    /* Secondary text */
```

### Typography

- **Display**: Neue Haas Display (700, 500, 300)
- **Body**: System UI fallback
- **Mono**: SF Mono, Fira Code

### Styling Rules

```tsx
/* ✅ CORRECT - Use CSS variables directly in inline styles */
style={{ color: C.vanilla, background: C.black }}

/* ✅ CORRECT - Use semantic Tailwind classes */
className="bg-bg-primary text-fg-primary"

/* ❌ WRONG - Don't use bracket notation with CSS vars */
className="bg-[var(--bg-primary)]"
```

## Animation Patterns

### Pipeline Animation

The main KarimoPipeline component uses:
- `requestAnimationFrame` for timeline-based animation
- Inline styles for precise control
- SVG `<animateMotion>` for loop indicators

### Framer Motion (for future sections)

```tsx
import { motion } from 'framer-motion';
import { fadeInUp, smoothTransition } from '@/lib/motion';

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
>
```

## Validation Requirements

Before completing any feature:

1. `npm run build` - Clean build
2. Visual check - Animation timing and styling correct
3. Mobile responsive - Works on all screen sizes

## Instruction Precedence

1. **This file** (.claude/claude.md)
2. **Global ~/.claude/CLAUDE.md**
