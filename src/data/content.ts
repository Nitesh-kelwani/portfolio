// All site copy lives here. Edit text without touching components.
// Privacy rule for this file: no employer name, no job title for the current role,
// and no architecture details of private/production work.

export const links = {
  email: "niteshrecr@gmail.com",
  github: "https://github.com/Nitesh-kelwani",
  linkedin: "https://linkedin.com/in/nitesh-kelwani",
  kaggle: "https://www.kaggle.com/niteshkelwani",
  // Set to your Cal.com / Calendly URL. While null, "Let's talk" opens an email instead.
  booking: null as string | null,
};

export const bookingHref = links.booking ?? `mailto:${links.email}?subject=Hello%20Nitesh`;

export const profile = {
  name: "Nitesh Kelwani",
  role: "AI Engineer",
  city: "Jaipur",
  country: "India",
  timeZone: "Asia/Kolkata",
};

// The robot mascot that stands in for a photo across the site.
export const mascot = {
  name: "Bit",
  greeting: "meet Bit.",
  body: "Bit runs “Ask my portfolio” next door. It only answers from this page, never guesses, and blinks a lot. Go on, click it.",
};

export type SectionId = "top" | "work" | "lab" | "path" | "toolbox" | "contact";

export const sections: { id: SectionId; label: string }[] = [
  { id: "top", label: "Home" },
  { id: "work", label: "Selected work" },
  { id: "lab", label: "Lab" },
  { id: "path", label: "Path" },
  { id: "toolbox", label: "Toolbox" },
  { id: "contact", label: "Contact" },
];

export const hero = {
  eyebrow: "AI Engineer — Jaipur, India",
  lead: "I build AI that",
  accent: "shows its work.",
  body:
    "Agents, retrieval and evaluation, engineered end to end: from the first prompt to software people actually rely on. I care about answers you can trace, behaviour you can measure and costs you can predict.",
  now: "Shipping LLM assistants and AI automations in production.",
  badges: [
    { label: "Azure Data Scientist · DP-100", href: "https://learn.microsoft.com/credentials/certifications/azure-data-scientist/" },
    { label: "Open source on GitHub", href: "https://github.com/Nitesh-kelwani?tab=repositories" },
  ],
};

export const dailyDrivers = ["Python", "LangChain", "FastAPI", "PostgreSQL", "Docker", "React", "PyTorch", "Hugging Face"];

export type MockKind = "medirag" | "sql" | "docqa" | "audit" | "voice" | "pipeline";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  flow: string[];
  stack: string[];
  repo: string;
  mock: MockKind;
};

export const projects: Project[] = [
  {
    slug: "medirag",
    name: "MediRAG",
    tagline: "Clinical documents, answered with receipts.",
    description:
      "Upload discharge summaries or lab reports and ask questions that are answered only from those files. Every sentence carries a numbered citation, every answer carries faithfulness and hallucination-risk scores, and one click opens the exact chunk it came from.",
    flow: ["Extract", "Section-aware chunking", "Hybrid search + rerank", "Cited answer", "Self-evaluation"],
    stack: ["FastAPI", "React + TypeScript", "Azure AI Search", "Azure OpenAI", "Document Intelligence"],
    repo: "https://github.com/Nitesh-kelwani/MediRAG",
    mock: "medirag",
  },
  {
    slug: "sql-chatbot",
    name: "SQL Chatbot",
    tagline: "Ask your database in plain English.",
    description:
      "The model reads the live schema, writes SQL for your question and remembers the conversation for follow-ups. A guard lets only read-only queries run, and a second pass explains the result in words a non-engineer can use.",
    flow: ["Read schema", "Generate SQL", "Read-only guard", "Execute", "Explain"],
    stack: ["Azure OpenAI", "SQLAlchemy", "SQLite", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/SQL-Chatbot",
    mock: "sql",
  },
  {
    slug: "doc-qa",
    name: "Document Q&A Agent",
    tagline: "An agent that decides when to go looking.",
    description:
      "A tool-calling agent over a library of PDFs. It chooses when to search, scopes retrieval to the documents you pick, and answers with the file and page behind every claim.",
    flow: ["Parse PDFs", "Chunk + embed", "Agent picks a tool", "Scoped search", "Answer with pages"],
    stack: ["LangChain", "Azure OpenAI", "FAISS", "FastAPI", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/Document-Q-A-Chatbot",
    mock: "docqa",
  },
  {
    slug: "insta-audit",
    name: "Influencer Audit",
    tagline: "A creator's profile, turned into a strategy.",
    description:
      "Give it an Instagram handle: it scrapes recent posts, finds what performs and when, has an LLM read every caption in batches, and exports the whole audit as a multi-sheet Excel report. Responses are cached, so re-runs cost nothing.",
    flow: ["Scrape", "Engagement analytics", "LLM caption analysis", "Recommendations", "Excel report"],
    stack: ["Apify", "Groq · Llama 3.3", "pandas", "FastAPI", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/Insta-audit",
    mock: "audit",
  },
  {
    slug: "voice-banking",
    name: "Voice Banking Assistant",
    tagline: "Speak a request, get a structured action.",
    description:
      "Speech becomes text, text becomes a typed JSON intent, and a multi-turn flow collects whatever is missing before anything happens. It also checks cheque images with OpenCV and records KYC video, all against a sandboxed dummy bank.",
    flow: ["Listen", "Structured intent", "Slot filling", "Act", "Speak back"],
    stack: ["Gemini", "SpeechRecognition", "OpenCV", "pyttsx3", "Streamlit"],
    repo: "https://github.com/Nitesh-kelwani/ai-voice-banking-assistant",
    mock: "voice",
  },
  {
    slug: "azure-rag",
    name: "Azure RAG Pipeline",
    tagline: "The whole RAG loop, in two readable files.",
    description:
      "A deliberately small reference implementation: parse a PDF, embed it, upsert it into an HNSW vector index, retrieve by nearest neighbours and answer strictly from context. Built to be read in one sitting.",
    flow: ["Parse", "Embed", "Index", "k-NN search", "Grounded answer"],
    stack: ["Azure AI Search", "Azure OpenAI", "Document Intelligence", "sentence-transformers"],
    repo: "https://github.com/Nitesh-kelwani/azure-rag-pipeline",
    mock: "pipeline",
  },
];

export const offDuty = {
  name: "Rasenshuriken CV",
  blurb: "Cup your hand at the webcam and a spinning chakra blade appears in your palm. MediaPipe + OpenCV, just for fun.",
  repo: "https://github.com/Nitesh-kelwani/rasenshuriken-cv",
};

export const lab = {
  chunkSample:
    "Retrieval-augmented generation lives or dies on its chunks. Split a document too finely and each piece loses the context that made it meaningful. Split it too coarsely and the one sentence that answers the question gets buried under paragraphs that don't. Overlap helps a fact that straddles a boundary survive in at least one chunk. Respecting sentence boundaries keeps every chunk readable, both for the retriever and for the model that has to cite it. None of this is glamorous, but it decides what the model is allowed to know.",
  streamAnswer:
    "Streaming doesn't make a model faster. It changes when the reader starts reading: the first words arrive in a fraction of a second, and the rest follows while they are already taking it in. The total time is the same; the wait feels completely different.",
  guardPresets: [
    { label: "Top customers", sql: "SELECT name, SUM(total) AS revenue\nFROM orders\nGROUP BY name\nORDER BY revenue DESC\nLIMIT 5;" },
    { label: "Drop a table", sql: "DROP TABLE customers;" },
    { label: "Sneaky second statement", sql: "SELECT * FROM products; DELETE FROM products;" },
    { label: "Hidden in a comment", sql: "SELECT id FROM users -- harmless?\n; UPDATE users SET role = 'admin';" },
    { label: "CTE (allowed)", sql: "WITH recent AS (\n  SELECT * FROM orders WHERE created_at > '2026-01-01'\n)\nSELECT COUNT(*) FROM recent;" },
  ],
};

export type Milestone = { when: string; title: string; body: string };

export const path: Milestone[] = [
  { when: "2023", title: "Started a BCA", body: "Lal Bahadur Shastri P.G. College, Jaipur. Python first, then data, then models." },
  { when: "Aug 2025", title: "Red Hat AI Foundations", body: "The point where AI stopped being a subject and became the job I wanted." },
  { when: "Oct 2025", title: "AI Intern, CareerComet LLP", body: "Built retrieval and document-extraction pieces of an enterprise help assistant on Azure OpenAI, AI Search and Document Intelligence." },
  { when: "Feb 2026", title: "Microsoft Certified: DP-100", body: "Azure Data Scientist Associate: experiments, tracking and deployment on Azure ML." },
  { when: "May 2026", title: "Full-time AI engineering", body: "Designing and shipping LLM assistants and AI automations for support, HR and marketing teams." },
  { when: "2026", title: "Graduated", body: "Finished the degree while building AI systems full time." },
  { when: "Now", title: "Going deeper", body: "Agent reliability, evaluation and harness engineering: the unglamorous parts that decide whether AI works." },
];

// *asterisks* mark phrases set in the italic serif accent (stripped everywhere else).
export const manifesto =
  "Most of AI engineering happens *after the demo.* It is retrieval that finds the right evidence, prompts that stay honest, evals that catch regressions before users do, and systems simple enough to debug at midnight. I would rather ship an assistant that says *“I don't know”* than one that sounds certain and is wrong.";

export type ToolGroup = { group: string; tools: { name: string; usedIn: string[] }[] };

// usedIn keys: project slugs, plus "private" (production work) and "earlier" (earlier ML repos).
export const toolbox: ToolGroup[] = [
  {
    group: "AI & LLMs",
    tools: [
      { name: "LangChain", usedIn: ["doc-qa"] },
      { name: "LangGraph", usedIn: ["private"] },
      { name: "Azure OpenAI", usedIn: ["medirag", "sql-chatbot", "doc-qa", "azure-rag"] },
      { name: "Gemini", usedIn: ["voice-banking"] },
      { name: "Groq", usedIn: ["insta-audit"] },
      { name: "LiteLLM", usedIn: ["private"] },
      { name: "Hugging Face", usedIn: ["azure-rag", "earlier"] },
    ],
  },
  {
    group: "Retrieval & data",
    tools: [
      { name: "Azure AI Search", usedIn: ["medirag", "azure-rag"] },
      { name: "FAISS", usedIn: ["doc-qa"] },
      { name: "PostgreSQL", usedIn: ["private"] },
      { name: "Redis", usedIn: ["private"] },
      { name: "Document Intelligence", usedIn: ["medirag", "azure-rag"] },
      { name: "SQLAlchemy", usedIn: ["sql-chatbot"] },
      { name: "pandas", usedIn: ["insta-audit", "earlier"] },
    ],
  },
  {
    group: "Build & ship",
    tools: [
      { name: "Python", usedIn: ["medirag", "sql-chatbot", "doc-qa", "insta-audit", "voice-banking", "azure-rag", "private", "earlier"] },
      { name: "FastAPI", usedIn: ["medirag", "doc-qa", "insta-audit", "private"] },
      { name: "React", usedIn: ["medirag"] },
      { name: "TypeScript", usedIn: ["medirag"] },
      { name: "Streamlit", usedIn: ["sql-chatbot", "doc-qa", "insta-audit", "voice-banking"] },
      { name: "Docker", usedIn: ["private", "earlier"] },
      { name: "Git", usedIn: ["medirag", "sql-chatbot", "doc-qa", "insta-audit", "voice-banking", "azure-rag", "private", "earlier"] },
    ],
  },
  {
    group: "ML & vision",
    tools: [
      { name: "PyTorch", usedIn: ["earlier"] },
      { name: "scikit-learn", usedIn: ["earlier"] },
      { name: "OpenCV", usedIn: ["voice-banking"] },
      { name: "MediaPipe", usedIn: ["rasenshuriken"] },
      { name: "MLflow", usedIn: ["earlier"] },
    ],
  },
];

export const toolboxTargets = [
  ...projects.map((p) => ({ key: p.slug, name: p.name, note: p.tagline })),
  { key: "rasenshuriken", name: offDuty.name, note: "Off-duty computer vision." },
  { key: "earlier", name: "Earlier ML projects", note: "BERT spam classifier, car-damage vision model, MLOps pipeline." },
  { key: "private", name: "Production work", note: "Private systems. Details stay private." },
];

export const certifications = [
  "Microsoft Certified: Azure Data Scientist Associate (DP-100)",
  "Red Hat AI Foundations",
  "Cisco Python Essentials",
  "LFS101: Introduction to Linux",
];

export const contact = {
  lead: "Let's build something",
  accent: "that ships.",
  body: "Hiring for an AI engineering role, or building something with LLMs that has to work for real users? Let's talk.",
};
