// All site copy lives here. Edit text without touching components.
// Privacy rule for this file: no employer name, no job title for the current role,
// and no architecture details or metrics from private/production work.

export const links = {
  email: "niteshrecr@gmail.com",
  github: "https://github.com/Nitesh-kelwani",
  repos: "https://github.com/Nitesh-kelwani?tab=repositories",
  linkedin: "https://linkedin.com/in/nitesh-kelwani",
  kaggle: "https://www.kaggle.com/niteshkelwani",
  // Set to your Cal.com / Calendly URL. While null, "Get in touch" opens an email instead.
  booking: null as string | null,
};

export const contactHref = links.booking ?? `mailto:${links.email}?subject=Hello%20Nitesh`;

export const profile = {
  name: "Nitesh Kelwani",
  role: "AI Engineer",
};

export type SectionId = "top" | "work" | "build" | "lab" | "toolbox" | "journey" | "numbers" | "faq" | "more" | "contact";

export const nav: { id: SectionId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "journey", label: "Journey" },
  { id: "faq", label: "FAQ" },
];

export const hero = {
  badge: { label: "New: MediRAG, clinical answers with citations", href: "https://github.com/Nitesh-kelwani/MediRAG" },
  title: ["AI engineer building", "assistants people can trust"],
  sub: ["Retrieval, agents and evaluation, engineered end to end.", "Ask my portfolio anything below."],
  cta: "Get in touch",
};

// "Ask my portfolio": the chat window in the hero and the closing section.
export const ask = {
  title: "Ask me anything",
  sub: "about Nitesh's projects, stack and journey.",
  placeholder: "Ask anything. Try “Which LLM providers?”",
  categories: [
    { label: "Projects", suggestions: ["Tell me about MediRAG", "What have you built with RAG?", "How does the SQL Chatbot stay safe?"] },
    { label: "Stack", suggestions: ["Which LLM providers?", "What's your core stack?", "Do you work with agents?"] },
    { label: "Journey", suggestions: ["Where did you intern?", "Which certifications?", "What did you study?"] },
    { label: "Contact", suggestions: ["How can I reach you?", "Can I see your code?", "How does this chat work?"] },
  ],
  notFound: "I couldn't find that anywhere on this page, and I'd rather say so than guess. Try rephrasing, or email Nitesh directly.",
};

export const intro = [
  "I'm Nitesh, an AI engineer who turns large language models into software people rely on: assistants that answer from real sources and take real actions.",
  "I work across the whole AI product, from retrieval and agent design to evaluation, guardrails and the gateway that keeps cost and latency predictable.",
  "Everything I ship is built to be measured, debugged and trusted, so an assistant says “I don't know” long before it makes something up.",
];

export const introLogos = ["Python", "LangChain", "PostgreSQL", "FastAPI", "Redis", "Docker"];

export type MockKind = "medirag" | "sql" | "docqa" | "audit" | "voice" | "pipeline";

export type Project = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  flow: string[];
  stack: string[];
  repo: string;
  mock: MockKind;
  topic: string;
};

export const projects: Project[] = [
  {
    slug: "medirag",
    name: "MediRAG",
    short: "MediRAG",
    tagline: "Clinical documents, answered with receipts: every sentence cited, every answer scored.",
    description:
      "Upload discharge summaries or lab reports and ask questions that are answered only from those files. Every sentence carries a numbered citation, every answer carries faithfulness and hallucination-risk scores, and one click opens the exact chunk it came from.",
    flow: ["Extract", "Section-aware chunking", "Hybrid search + rerank", "Cited answer", "Self-evaluation"],
    stack: ["FastAPI", "React + TypeScript", "Azure AI Search", "Azure OpenAI", "Document Intelligence"],
    repo: "https://github.com/Nitesh-kelwani/MediRAG",
    mock: "medirag",
    topic: "Clinical RAG",
  },
  {
    slug: "sql-chatbot",
    name: "SQL Chatbot",
    short: "SQL Chatbot",
    tagline: "Ask a database in plain English, with a guard that lets only read-only SQL run.",
    description:
      "The model reads the live schema, writes SQL for your question and remembers the conversation for follow-ups. A guard lets only read-only queries run, and a second pass explains the result in words a non-engineer can use.",
    flow: ["Read schema", "Generate SQL", "Read-only guard", "Execute", "Explain"],
    stack: ["Azure OpenAI", "SQLAlchemy", "SQLite", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/SQL-Chatbot",
    mock: "sql",
    topic: "NL to SQL",
  },
  {
    slug: "doc-qa",
    name: "Document Q&A Agent",
    short: "Doc Q&A",
    tagline: "A tool-calling agent that decides when to search, and answers with the page behind every claim.",
    description:
      "A tool-calling agent over a library of PDFs. It chooses when to search, scopes retrieval to the documents you pick, and answers with the file and page behind every claim.",
    flow: ["Parse PDFs", "Chunk + embed", "Agent picks a tool", "Scoped search", "Answer with pages"],
    stack: ["LangChain", "Azure OpenAI", "FAISS", "FastAPI", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/Document-Q-A-Chatbot",
    mock: "docqa",
    topic: "Agents",
  },
  {
    slug: "insta-audit",
    name: "Influencer Audit",
    short: "Insta Audit",
    tagline: "A creator's profile turned into a strategy: analytics, LLM caption insights and an Excel report.",
    description:
      "Give it an Instagram handle: it scrapes recent posts, finds what performs and when, has an LLM read every caption in batches, and exports the whole audit as a multi-sheet Excel report. Responses are cached, so re-runs cost nothing.",
    flow: ["Scrape", "Engagement analytics", "LLM caption analysis", "Recommendations", "Excel report"],
    stack: ["Apify", "Groq · Llama 3.3", "pandas", "FastAPI", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/Insta-audit",
    mock: "audit",
    topic: "LLM analytics",
  },
  {
    slug: "voice-banking",
    name: "Voice Banking Assistant",
    short: "Voice Banking",
    tagline: "Speak a request, get a structured action.",
    description:
      "Speech becomes text, text becomes a typed JSON intent, and a multi-turn flow collects whatever is missing before anything happens. It also checks cheque images with OpenCV and records KYC video, all against a sandboxed dummy bank.",
    flow: ["Listen", "Structured intent", "Slot filling", "Act", "Speak back"],
    stack: ["Gemini", "SpeechRecognition", "OpenCV", "pyttsx3", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/ai-voice-banking-assistant",
    mock: "voice",
    topic: "Voice AI",
  },
  {
    slug: "azure-rag",
    name: "Azure RAG Pipeline",
    short: "Azure RAG",
    tagline: "The whole RAG loop, in two readable files.",
    description:
      "A deliberately small reference implementation: parse a PDF, embed it, upsert it into an HNSW vector index, retrieve by nearest neighbours and answer strictly from context. Built to be read in one sitting.",
    flow: ["Parse", "Embed", "Index", "k-NN search", "Grounded answer"],
    stack: ["Azure AI Search", "Azure OpenAI", "Document Intelligence", "sentence-transformers"],
    repo: "https://github.com/Nitesh-kelwani/azure-rag-pipeline",
    mock: "pipeline",
    topic: "Reference RAG",
  },
];

export const workSection = {
  tag: "Selected work",
  title: "Projects that turn questions",
  muted: "into working software",
  side: "Each one is open source. Pick a tab to see how it behaves, or open the code on GitHub.",
  tabs: ["medirag", "sql-chatbot", "doc-qa", "insta-audit"],
};

export const capabilitiesSection = {
  tag: "What I build",
  title: "One engineer for",
  muted: "retrieval, agents and evaluation",
  side: "The parts of an AI product that decide whether it works for real users, not just in a demo.",
};

export type IsoKind = "retrieval" | "agents" | "evals" | "guardrails" | "gateway";

export const capabilities: { title: string; body: string; art: IsoKind }[] = [
  { title: "Retrieval & RAG", body: "Hybrid search, reranking and chunking that keeps the right evidence in reach.", art: "retrieval" },
  { title: "Agents & tool use", body: "Tool-calling agents and LangGraph workflows that know when to act.", art: "agents" },
  { title: "Evaluation", body: "Faithfulness checks and regression evals that catch problems before users do.", art: "evals" },
  { title: "Guardrails", body: "Input and output checks, read-only data access and honest refusals.", art: "guardrails" },
  { title: "Gateways & cost", body: "LLM gateways, caching and routing that keep cost and latency predictable.", art: "gateway" },
];

export const labSection = {
  tag: "Lab",
  title: "Small demos,",
  muted: "real engineering ideas",
  side: "Three problems every LLM engineer wrestles with, turned into toys you can poke. Everything runs in your browser.",
};

export const lab = {
  cards: [
    {
      label: "Chunk it",
      title: "What does your retriever actually see?",
      body: "Change the chunk size and strategy and watch where the cuts land. Bad chunks quietly decide what a model is allowed to know.",
      note: "Sentence-aware splitting is the idea behind MediRAG's chunker.",
    },
    {
      label: "Guard it",
      title: "Would this query be allowed to run?",
      body: "A strict read-only guard, the same idea that protects my SQL Chatbot. Try to sneak a write past it.",
      note: "Deliberately strict: one statement, SELECT only.",
    },
    {
      label: "Stream it",
      title: "Same answer, a very different wait.",
      body: "Streaming doesn't make a model faster. It changes when the reader starts reading.",
      note: "Simulated timings, identical total for both.",
    },
  ],
  chunkSample:
    "Retrieval-augmented generation lives or dies on its chunks. Split a document too finely and each piece loses its context. Split it too coarsely and the one sentence that answers the question gets buried. Overlap helps a fact that straddles a boundary survive. Respecting sentence boundaries keeps every chunk readable for the model that has to cite it.",
  streamAnswer:
    "Streaming doesn't make a model faster. It changes when the reader starts reading: the first words arrive in a fraction of a second, and the rest follows while they are already taking it in.",
  guardPresets: [
    { label: "Top customers", sql: "SELECT name, SUM(total) AS revenue\nFROM orders\nGROUP BY name\nORDER BY revenue DESC\nLIMIT 5;" },
    { label: "Drop a table", sql: "DROP TABLE customers;" },
    { label: "Second statement", sql: "SELECT * FROM products; DELETE FROM products;" },
    { label: "Hidden in a comment", sql: "SELECT id FROM users -- harmless?\n; UPDATE users SET role = 'admin';" },
    { label: "CTE", sql: "WITH recent AS (\n  SELECT * FROM orders WHERE created_at > '2026-01-01'\n)\nSELECT COUNT(*) FROM recent;" },
  ],
};

export const toolboxSection = {
  tag: "Toolbox",
  title: "The tools behind",
  muted: "everything I ship",
  side: "Open models and hosted ones, vector search and plain SQL, glued together with Python and shipped in containers.",
};

export const orbitTools = [
  "Python", "LangChain", "FastAPI", "PostgreSQL", "Redis", "Docker", "React", "TypeScript",
  "PyTorch", "Hugging Face", "Gemini", "Streamlit", "OpenCV", "Git", "MLflow", "pandas",
];

export const toolColumns = [
  { title: "Retrieval", body: "Azure AI Search, PostgreSQL + pgvector, FAISS, Redis caching.", icon: "search" },
  { title: "Agents & LLMs", body: "LangGraph, LangChain, LiteLLM, Azure OpenAI, Gemini, Groq.", icon: "bot" },
  { title: "Evals & guardrails", body: "Faithfulness scoring, regression suites, tracing, read-only guards.", icon: "shield" },
  { title: "Delivery", body: "FastAPI, React + TypeScript, Streamlit, Docker, Git.", icon: "rocket" },
] as const;

export const journeySection = {
  tag: "Journey",
  title: "From a first model",
  muted: "to production AI",
  link: { label: "See LinkedIn", href: "https://linkedin.com/in/nitesh-kelwani" },
};

export type Milestone = { when: string; title: string; body: string };

export const journey: Milestone[] = [
  { when: "2023", title: "Started a BCA", body: "Lal Bahadur Shastri P.G. College, Jaipur." },
  { when: "Aug 2025", title: "Red Hat AI Foundations", body: "Where AI became the job I wanted." },
  { when: "Oct 2025", title: "AI Intern, CareerComet LLP", body: "Retrieval and document extraction on Azure." },
  { when: "Feb 2026", title: "Microsoft Certified: DP-100", body: "Azure Data Scientist Associate." },
  { when: "2026", title: "Graduated, building full time", body: "Shipping LLM assistants and AI automations." },
];

export const numbersSection = {
  tag: "Numbers",
  title: "Every project, prompt and eval adds up to shipped work",
};

// Countable, public facts only. Edit freely.
export const numbers = {
  big: [
    { value: 7, unit: "repos", body: "Open-source AI projects on GitHub, each with a README you can run.", label: "Open source" },
    { value: 3, unit: "LLMs", body: "Model providers used across shipped projects: Azure OpenAI, Gemini and Groq.", label: "Providers" },
  ],
  small: [
    { value: 3, suffix: "", body: "RAG pipelines built, with hybrid search, reranking and citations.", icon: "layers" },
    { value: 4, suffix: "", body: "Certifications, including Microsoft DP-100 and Red Hat AI.", icon: "badge" },
    { value: 3, suffix: "", body: "Live demos on this page that run entirely in your browser.", icon: "sparkles" },
    { value: 0, suffix: "", body: "Guesses from “Ask my portfolio”: it only answers from this page.", icon: "check" },
  ],
} as const;

export const faqSection = {
  tag: "FAQ",
  title: "Answers to the questions",
  muted: "people ask most",
  side: "What I build, how I build it, and how to reach me. Or skip the list and ask my portfolio directly.",
};

export const faq: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "About",
    items: [
      { q: "What kind of work do you do?", a: "I build LLM applications end to end: retrieval and RAG, agents with tool use, evaluation and guardrails, and the APIs and interfaces around them." },
      { q: "What's your background?", a: "A BCA from Lal Bahadur Shastri P.G. College, Jaipur (2023 to 2026), an AI internship at CareerComet LLP, and Microsoft's DP-100 Azure Data Scientist certification." },
      { q: "Where are you based?", a: "Jaipur, India, and comfortable working remotely across time zones." },
      { q: "What are you focused on right now?", a: "Agent reliability, LLM evaluation and harness engineering: the unglamorous parts that decide whether an AI product actually works." },
    ],
  },
  {
    group: "Tech",
    items: [
      { q: "What's your core stack?", a: "Python and FastAPI, LangGraph and LangChain, PostgreSQL with pgvector, Redis, Azure OpenAI, Gemini and Groq behind LiteLLM, React and TypeScript for interfaces, and Docker to ship." },
      { q: "How do you make LLM answers trustworthy?", a: "Retrieval before generation, a citation for every claim, automatic faithfulness checks, and assistants that say “I don't know” instead of guessing." },
      { q: "Do you work with agents?", a: "Yes: tool-calling agents, LangGraph workflows, and the evaluation harnesses that keep them reliable." },
      { q: "How does “Ask my portfolio” work?", a: "It's a small hybrid retriever running in your browser: BM25 keyword scoring plus trigram fuzzy matching, fused with reciprocal rank fusion. There's no LLM behind it, so it can't make things up." },
    ],
  },
  {
    group: "Working together",
    items: [
      { q: "How can I reach you?", a: "Email niteshrecr@gmail.com, or message me on LinkedIn. I reply to every real message." },
      { q: "Can I see your code?", a: "Yes. Every project on this page links to a public GitHub repository with a README you can run." },
      { q: "What makes a good fit?", a: "Problems where an LLM has to work for real users: grounded answers, measurable quality and predictable cost." },
    ],
  },
];

export const moreSection = {
  tag: "More builds",
  title: "Smaller projects,",
  muted: "the same care",
  link: { label: "All repositories", href: "https://github.com/Nitesh-kelwani?tab=repositories" },
};

export const moreBuilds = [
  { name: "A voice banking assistant that turns speech into structured actions", topic: "Voice AI", stack: "Gemini · OpenCV", repo: "https://github.com/Nitesh-kelwani/ai-voice-banking-assistant", scene: 0 },
  { name: "The whole RAG loop, in two readable files on Azure", topic: "Reference RAG", stack: "Azure AI Search", repo: "https://github.com/Nitesh-kelwani/azure-rag-pipeline", scene: 1 },
  { name: "Rasenshuriken CV: a spinning chakra blade in your palm", topic: "Computer vision", stack: "MediaPipe · OpenCV", repo: "https://github.com/Nitesh-kelwani/rasenshuriken-cv", scene: 2 },
];

export const certifications = [
  "Microsoft Certified: Azure Data Scientist Associate (DP-100)",
  "Red Hat AI Foundations",
  "Cisco Python Essentials",
  "LFS101: Introduction to Linux",
];

export const cta = {
  title: "Let's build something",
  muted: "that ships",
  body: "Building something with LLMs that has to work for real users? I'd love to hear about it.",
  button: "Email me",
  badges: [
    { mark: "DP-100", label: "Microsoft Certified" },
    { mark: "RH", label: "Red Hat AI" },
  ],
};

export const footer = {
  columns: [
    { title: "Site", links: [{ label: "Work", href: "#work" }, { label: "Lab", href: "#lab" }, { label: "Journey", href: "#journey" }, { label: "FAQ", href: "#faq" }] },
    {
      title: "Projects",
      links: projects.slice(0, 4).map((p) => ({ label: p.short, href: p.repo })),
    },
    {
      title: "Elsewhere",
      links: [
        { label: "GitHub", href: links.github },
        { label: "LinkedIn", href: links.linkedin },
        { label: "Kaggle", href: links.kaggle },
        { label: "Email", href: `mailto:${links.email}` },
      ],
    },
  ],
};
