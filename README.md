# KARIMO Unpacked

Interactive visual explainer of how [KARIMO](https://github.com/opensesh/KARIMO) transforms product requirements into shipped code.

## What is KARIMO?

KARIMO is an autonomous development methodology delivered via Claude Code configuration. It orchestrates AI agents, GitHub automation, and structured human oversight to ship features from PRD to production.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Fonts:** Geist Sans & Mono
- **Deployment:** Vercel

## Structure

```
karimo-overview/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page with all sections
│   └── globals.css     # Brand tokens and animations
├── components/
│   ├── Hero.tsx        # Hero section with stats
│   ├── PipelineAnimation.tsx
│   ├── ProcessTimeline.tsx
│   ├── OrchestrationViz.tsx
│   ├── AdoptionPhases.tsx
│   └── ui/             # Reusable UI components
└── lib/
    └── constants.ts    # Brand tokens and data
```

## License

MIT
