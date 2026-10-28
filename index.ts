import JSZip from "jszip";
import mammoth from "mammoth";
export type Page = { location: string; text: string };
export class ExtractError extends Error { constructor(public code: string) { super(code); } }
export const MAX_BYTES = 15 * 1024 * 1024;
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

function sections(text: string, max = 3000): Page[] {
  const out: string[] = []; let buf = "";
  for (const p of clean(text).split(/\n\s*\n|\n/)) { if ((buf + p).length > max && buf) { out.push(buf); buf = ""; } buf += p + "\n\n"; }
  if (buf.trim()) out.push(buf);
  return out.map((t, i) => ({ location: out.length > 1 ? `Бөлім ${i + 1}` : "Мәтін", text: t.trim() }));
}

export async function extractPages(buf: Buffer, fileName: string): Promise<Page[]> {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!buf.length) throw new ExtractError("EMPTY_FILE");
  if (buf.length > MAX_BYTES) throw new ExtractError("TOO_LARGE");
  let pages: Page[];
  try {
    if (ext === "txt") pages = sections(buf.toString("utf8"));
    else if (ext === "docx") pages = sections((await mammoth.extractRawText({ buffer: buf })).value);
    else if (ext === "pdf") {
      const pdf = (await import("pdf-parse/lib/pdf-parse.js")).default;
      const got: Page[] = [];
      await pdf(buf, { pagerender: async (p: any) => {
        const tc = await p.getTextContent(); const t = tc.items.map((i: any) => i.str).join(" ");
        got.push({ location: `Бет ${p.pageIndex + 1}`, text: clean(t) }); return t; } });
      pages = got;
    } else if (ext === "pptx") {
      const zip = await JSZip.loadAsync(buf);
      const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
        .sort((a, b) => +a.match(/\d+/)![0] - +b.match(/\d+/)![0]);
      if (names.length > 500) throw new ExtractError("TOO_LARGE");
      pages = [];
      for (const [i, n] of names.entries()) {
        const xml = await zip.files[n].async("string");
        const t = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join(" ")
          .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
        pages.push({ location: `Слайд ${i + 1}`, text: clean(t) });
      }
    } else throw new ExtractError("UNSUPPORTED_TYPE");
  } catch (e) { if (e instanceof ExtractError) throw e; throw new ExtractError("EXTRACTION_FAILED"); }
  pages = pages.filter((p) => p.text.length > 0);
  if (!pages.length) throw new ExtractError("EMPTY_TEXT"); // e.g. scanned PDF without a text layer
  return pages;
}
