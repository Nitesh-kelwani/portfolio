// Pure logic behind the lab demos, kept apart from the widgets that draw them.

export type Range = [number, number];

export function fixedChunks(text: string, size: number, overlap: number): Range[] {
  const out: Range[] = [];
  let s = 0;
  while (s < text.length) {
    const e = Math.min(text.length, s + size);
    out.push([s, e]);
    if (e === text.length) break;
    s = Math.max(e - overlap, s + 1);
  }
  return out;
}

export function sentenceRanges(text: string): Range[] {
  const out: Range[] = [];
  const re = /[^.!?]+[.!?]+["”’)]*\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push([m.index, m.index + m[0].length]);
  if (!out.length) out.push([0, text.length]);
  return out;
}

export function sentenceChunks(text: string, size: number, overlapOne: boolean): Range[] {
  const sents = sentenceRanges(text);
  const out: Range[] = [];
  let i = 0;
  while (i < sents.length) {
    let j = i;
    while (j + 1 < sents.length && sents[j + 1][1] - sents[i][0] <= size) j++;
    out.push([sents[i][0], sents[j][1]]);
    if (j + 1 >= sents.length) break;
    i = overlapOne && j > i ? j : j + 1;
  }
  return out;
}

/** Split text into segments between every chunk boundary, noting which chunks cover each. */
export function segmentsOf(text: string, chunks: Range[]) {
  const cuts = new Set<number>([0, text.length]);
  chunks.forEach(([a, b]) => {
    cuts.add(a);
    cuts.add(b);
  });
  const pts = [...cuts].sort((a, b) => a - b);
  return pts.slice(0, -1).map((a, k) => {
    const b = pts[k + 1];
    const covering = chunks.map((c, idx) => (c[0] <= a && c[1] >= b ? idx : -1)).filter((x) => x >= 0);
    return { a, b, covering };
  });
}

export function midSentenceCuts(text: string, chunks: Range[]) {
  const ends = new Set(sentenceRanges(text).map((r) => r[1]));
  return chunks.filter(([, e]) => e !== text.length && !ends.has(e) && !/[.!?]\s*$/.test(text.slice(0, e))).length;
}

export function checkSql(sql: string) {
  const hasComment = /--|\/\*/.test(sql);
  const stripped = sql
    .replace(/'(?:[^']|'')*'/g, "''")
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ");
  const statements = stripped.split(";").map((s) => s.trim()).filter(Boolean);
  const first = statements[0]?.match(/^\(*\s*(\w+)/)?.[1]?.toUpperCase();
  const forbidden = stripped.match(/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|MERGE|REPLACE|ATTACH|PRAGMA|EXEC)\b/i);
  const rules = [
    { label: "Exactly one statement", ok: statements.length === 1 },
    { label: "Starts with SELECT or WITH", ok: first === "SELECT" || first === "WITH" },
    { label: forbidden ? `No write keywords (found ${forbidden[1].toUpperCase()})` : "No write or schema keywords", ok: !forbidden },
    { label: "No comments that could hide code", ok: !hasComment },
  ];
  return { rules, allowed: rules.every((r) => r.ok) && statements.length > 0 };
}
