# nitesh-kelwani · portfolio

Personal site of **Nitesh Kelwani**, AI engineer. *I build AI that shows its work.*

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Lenis · WebGL · simple-icons. Deployed on Vercel.

## What's interesting in here

- **Ask my portfolio** (`src/components/sections/AskTile.tsx`, `src/lib/retrieval.ts`): a tiny in-browser search engine over
  the page's own content, using BM25 keyword scoring plus character-trigram fuzzy matching, fused by rank. It streams back
  the best passage with citations and a retrieval trace, and says so when nothing matches. No LLM, so no made-up facts.
- **Bit, the mascot** (`src/components/ui/Mascot.tsx`): a hand-drawn SVG robot whose eyes follow the cursor anywhere on
  the page. It blinks on its own and beams when clicked.
- **Aurora** (`src/components/ui/Aurora.tsx`): a small fragment shader rendered at a third of display resolution, paused
  when off-screen, disabled for reduced motion.
- **Selected work**: a sticky-scroll showcase with hand-built, animated product mocks for each project
  (`src/components/sections/mocks.tsx`).
- **The lab**: a chunking visualiser, a read-only SQL guard and a streaming-vs-blocking demo, all client-side.
- **Toolbox**: hover a tool to light up the projects that actually use it.
- Floating dock navigation, ⌘K command menu, scroll-driven horizontal timeline, word-by-word manifesto reveal.

## Editing content

All copy lives in [`src/data/content.ts`](src/data/content.ts): hero text, projects, lab samples, timeline, toolbox and
contact. Set `links.booking` to a Cal.com/Calendly URL to turn "Let's talk" into a scheduler link.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Deploy

Import the repo in Vercel. It detects Vite automatically (build `npm run build`, output `dist`). Every push to `main`
redeploys.
