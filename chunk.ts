import type { Chunk } from "./types";
/** pages: extractor output, one entry per page/slide with its label (e.g. "Page 14"). */
export function chunkPages(pages: { location: string; text: string }[], max = 1800): Chunk[] {
  const out: Chunk[] = [];
  for (const p of pages) {
    const clean = p.text.replace(/\u0000/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    if (clean.length < 80) continue;
    let buf = "";
    for (const para of clean.split(/\n\n/)) {
      if ((buf + para).length > max && buf) { out.push({ id: `c${out.length}`, text: buf.trim(), location: p.location }); buf = ""; }
      buf += para + "\n\n";
    }
    if (buf.trim().length >= 80) out.push({ id: `c${out.length}`, text: buf.trim(), location: p.location });
  }
  return out;
}
