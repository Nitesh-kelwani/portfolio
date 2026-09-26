import { certifications, contact, hero, links, manifesto, mascot, offDuty, path, profile, projects, toolbox } from "@/data/content";

// A tiny, honest hybrid retriever over this page's own content: BM25 keyword
// scoring and character-trigram similarity, fused with Reciprocal Rank Fusion.
// Retrieval only, no LLM: the "answer" is the best-matching passage, cited.

export type Doc = {
  id: string;
  section: string;
  anchor: string;
  title: string;
  /** what gets shown as the answer */
  answer: string;
  /** extra index-only terms (synonyms, stack) that shouldn't be displayed */
  keywords?: string;
};

export type Hit = Doc & { bm25Rank: number | null; fuzzyRank: number | null; rrf: number };

const STOP = new Set(
  "a an and are as at be by can do does done for from have how i in is it its me my of on or so tell that the this to was what when where which who why with you your about".split(" "),
);

// Crude plural folding so "providers" matches "provider" and "certifications" matches "certification".
const stem = (t: string) => (t.length > 4 && t.endsWith("s") && !t.endsWith("ss") ? t.slice(0, -1) : t);

function tokenize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

function trigrams(s: string) {
  const clean = ` ${s.toLowerCase().replace(/[^a-z0-9 ]/g, "")} `;
  const set = new Set<string>();
  for (let i = 0; i < clean.length - 2; i++) set.add(clean.slice(i, i + 3));
  return set;
}

export function buildCorpus(): Doc[] {
  const docs: Doc[] = [];
  docs.push({
    id: "about",
    section: "About",
    anchor: "top",
    title: "Who is Nitesh?",
    answer: `${profile.name} is an ${profile.role.toLowerCase()} in ${profile.city}, ${profile.country}. ${hero.body}`,
    keywords: "who are you about background introduction bio engineer",
  });
  docs.push({ id: "now", section: "About", anchor: "top", title: "What he's doing now", answer: `Right now: ${hero.now}`, keywords: "current currently now job work role doing" });
  docs.push({
    id: "bit",
    section: "About",
    anchor: "top",
    title: `Who is ${mascot.name}?`,
    answer: `I'm ${mascot.name}, the little robot on this page. I answer questions from this page only, show my sources, and say so when I don't know. I also blink a lot.`,
    keywords: "bit robot mascot bot you yourself chatbot assistant logo",
  });
  projects.forEach((p) =>
    docs.push({
      id: `project-${p.slug}`,
      section: "Selected work",
      anchor: "work",
      title: p.name,
      answer: `${p.name}: ${p.description}`,
      keywords: `${p.tagline} ${p.stack.join(" ")} ${p.flow.join(" ")} project built`,
    }),
  );
  docs.push({ id: "offduty", section: "Selected work", anchor: "work", title: offDuty.name, answer: `${offDuty.name}: ${offDuty.blurb}`, keywords: "fun side project computer vision webcam hand gesture" });
  docs.push({
    id: "lab",
    section: "Lab",
    anchor: "lab",
    title: "The lab",
    answer: "The lab has three in-browser demos: a chunking visualiser that shows how chunk size and overlap change what a retriever sees, a read-only SQL guard like the one in my SQL Chatbot, and a streaming-versus-blocking comparison.",
    keywords: "demo demos lab chunk chunking overlap sql guard streaming latency interactive",
  });
  path.forEach((m, i) =>
    docs.push({ id: `path-${i}`, section: "Path", anchor: "path", title: `${m.when} · ${m.title}`, answer: `${m.when}: ${m.title}. ${m.body}`, keywords: "experience career education timeline history journey internship degree" }),
  );
  toolbox.forEach((g) =>
    docs.push({
      id: `tools-${g.group}`,
      section: "Toolbox",
      anchor: "toolbox",
      title: g.group,
      answer: `${g.group}: ${g.tools.map((t) => t.name).join(", ")}.`,
      keywords: "skill skills tool tools technology stack language framework",
    }),
  );
  docs.push({
    id: "providers",
    section: "Toolbox",
    anchor: "toolbox",
    title: "LLM providers",
    answer: "LLM providers across my public projects: Azure OpenAI (GPT-4o and ada-002 embeddings), Google Gemini, and Groq running Llama 3.3. I also use LiteLLM to keep code provider-agnostic.",
    keywords: "model models provider vendor openai gpt gemini groq llama litellm llm",
  });
  docs.push({ id: "certs", section: "Toolbox", anchor: "toolbox", title: "Certifications", answer: `Certifications: ${certifications.join(", ")}.`, keywords: "certificate certified dp-100 microsoft azure red hat cisco linux" });
  docs.push({ id: "manifesto", section: "Approach", anchor: "approach", title: "How he works", answer: manifesto.replace(/\*/g, ""), keywords: "approach philosophy belief values principle evals honest work" });
  docs.push({
    id: "contact",
    section: "Contact",
    anchor: "contact",
    title: "How to reach him",
    answer: `${contact.body} Email ${links.email}, or find him on LinkedIn and GitHub.`,
    keywords: "contact email hire hiring reach call book linkedin github talk",
  });
  return docs;
}

export function createRetriever(docs: Doc[]) {
  const toks = docs.map((d) => tokenize(`${d.title} ${d.title} ${d.answer} ${d.keywords ?? ""}`));
  const grams = docs.map((d) => trigrams(`${d.title} ${d.answer}`));
  const avgLen = toks.reduce((s, t) => s + t.length, 0) / toks.length;
  const df = new Map<string, number>();
  toks.forEach((t) => new Set(t).forEach((w) => df.set(w, (df.get(w) ?? 0) + 1)));
  const N = docs.length;
  const k1 = 1.4;
  const b = 0.75;

  function bm25(q: string[]) {
    return toks.map((t) => {
      let score = 0;
      for (const term of q) {
        const f = t.filter((w) => w === term || (term.length > 3 && w.startsWith(term))).length;
        if (!f) continue;
        const n = df.get(term) ?? 1;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * t.length) / avgLen)));
      }
      return score;
    });
  }

  function fuzzy(q: string) {
    const qg = trigrams(q);
    return grams.map((g) => {
      let inter = 0;
      qg.forEach((x) => g.has(x) && inter++);
      return inter / Math.max(qg.size, 1);
    });
  }

  function rank(scores: number[], min: number) {
    return scores
      .map((s, i) => ({ i, s }))
      .filter((x) => x.s > min)
      .sort((a, b) => b.s - a.s)
      .map((x, r) => ({ ...x, r: r + 1 }));
  }

  return function search(query: string, k = 3): { hits: Hit[]; confident: boolean } {
    const q = tokenize(query);
    if (!q.length) return { hits: [], confident: false };
    const lex = rank(bm25(q), 0);
    const fz = rank(fuzzy(query), 0.18);
    const K = 60;
    const fused = new Map<number, Hit>();

    const add = (list: { i: number; r: number }[], kind: "bm25Rank" | "fuzzyRank") => {
      list.forEach(({ i, r }) => {
        const hit = fused.get(i) ?? { ...docs[i], bm25Rank: null, fuzzyRank: null, rrf: 0 };
        hit[kind] = r;
        hit.rrf += 1 / (K + r);
        fused.set(i, hit);
      });
    };
    add(lex, "bm25Rank");
    add(fz, "fuzzyRank");

    const hits = [...fused.values()].sort((a, b) => b.rrf - a.rrf).slice(0, k);
    // Only claim an answer when the keyword retriever agrees; otherwise say so.
    const confident = hits.length > 0 && hits[0].bm25Rank !== null;
    return { hits, confident };
  };
}
