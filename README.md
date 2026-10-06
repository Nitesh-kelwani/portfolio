# nitesh-kelwani · portfolio

Personal site of **Nitesh Kelwani**, AI engineer building assistants people can trust.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Lenis · simple-icons. Deployed on Vercel.

The layout and motion follow the structure of the Powder Framer template (dusk landscape, layered parallax hero, app-window
showcases). No template assets are used: the landscape layers are free Unsplash photos, cut and colour-graded for this site,
and the isometric art and logo are drawn in code.

## What's interesting in here

- **Ask my portfolio** (`src/components/sections/AskWindow.tsx`, `src/lib/retrieval.ts`): a tiny in-browser search engine over
  the page's own content, using BM25 keyword scoring plus character-trigram fuzzy matching, fused by rank. It streams back
  the best passage with its sources, and says so when nothing matches. No LLM, so no made-up facts.
- **A layered photo landscape** (`src/components/ui/Landscape.tsx`, `public/scenes/`): far hills and a forest valley, each
  cut from its sky as its own image so the hero can move them at different speeds (0.31 / 0.20 / 0.17 of scroll).
- **Projects** (`src/components/sections/ProjectTabs.tsx`): auto-advancing tabs over an app window, with animated
  product sketches for each project (`src/components/sections/mocks.tsx`).
- **The lab** (`src/components/sections/LabStack.tsx`, `src/lib/lab.ts`): a chunking visualiser, a read-only SQL guard and a
  streaming-vs-blocking demo, in cards that stick and stack as you scroll.
- Isometric line art built from a small projection helper (`src/components/ui/IsoArt.tsx`), an orbiting toolbox,
  count-up numbers and a scroll-lit intro.

## Editing content

All copy lives in [`src/data/content.ts`](src/data/content.ts): hero, intro, projects, lab, toolbox, journey, numbers,
FAQ and contact. Set `links.booking` to a Cal.com/Calendly URL to turn "Get in touch" into a scheduler link.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Public project demos

SQL Chatbot: https://sql-chatbot-agent.streamlit.app/

Document Q&A: https://document-q-a-chatbot-agent.streamlit.app/

Both deployments are public and were verified with sample questions. Each project now has a **Try live demo** button
beside **View source**. Update `demoUrl` in `src/data/content.ts` if the hosting address changes. The app-window
animations remain illustrative; use the button to interact with the actual app.

## Deploy

Import the repo in Vercel. It detects Vite automatically (build `npm run build`, output `dist`). Every push to `main`
redeploys.

## Photo credits

Landscape layers are graded from photos on [Unsplash](https://unsplash.com), used under the Unsplash License:
Spencer DeMera (hills), Khyta (forest), Vazgen (dusk hills), Eva Darron (valley), Shirleen Okt (golden hills),
Noah Ridge (forest at sunset), C Dustin and engin akyurt (clouds).
