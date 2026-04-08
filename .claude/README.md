# Claude Code Configuration

Welcome to the BOS Claude configuration for KARIMO Overview.

## Quick Links

| Task               | Go To                        |
| ------------------ | ---------------------------- |
| Design system      | `reference/design-system.md` |
| Brand questions    | `brand/identity/`            |
| Writing content    | `brand/writing/`             |

## Structure

```
.claude/
├── claude.md              # Main development guide
├── README.md              # This file
├── settings.json          # Permissions
├── brand/                 # Brand content (identity, writing)
│   ├── identity/          # Brand identity, art direction, messaging
│   └── writing/           # Writing style guides
└── reference/             # Design system reference
```

## Key Rules

1. **CSS Syntax**: Use mapped Tailwind classes
   - `bg-bg-primary` (correct)
   - `bg-[var(--bg-primary)]` (wrong)

2. **Opacity**: Never use `/30` on bracket notation
   - `bg-bg-secondary/30` (correct)
   - `bg-[var(--bg-secondary)]/30` (broken -- silently fails)

3. **Icons**: Never use `Sparkles` icon (hard ban)

4. **Borders**: Use `border-border-secondary` for containers

## Instruction Precedence

1. `.claude/claude.md` (project)
2. Global `~/.claude/CLAUDE.md`
3. Skills (auto-activated, supplement above)

## Validation

Run these before completing work:

```bash
npm run build    # Production build
npm run lint     # ESLint
```
