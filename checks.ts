/** Pure, dependency-free validators (unit-tested in tests/checks.test.mjs). */
export const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").replace(/[^\p{L}\p{N} ]/gu, "").trim();

export function jaccard(a: string, b: string): number {
  const A = new Set(norm(a).split(" ")), B = new Set(norm(b).split(" "));
  let inter = 0; A.forEach((w) => B.has(w) && inter++);
  return inter / (A.size + B.size - inter || 1);
}

const canon = (s: string) => s.replace(/(\d)[\s\u00a0\u202f](?=\d{3}(?!\d))/g, "$1").replace(/(\d),(\d)/g, "$1.$2");

/** Every number written in `text` must also appear (as a whole number) in `source`. Blocks invented/computed figures. */
export function numbersSupported(text: string, source: string): boolean {
  const nums = canon(text).match(/\d+(?:\.\d+)?/g) ?? [];
  const src = canon(source);
  return nums.every((n) => new RegExp(`(?<![\\d.])${n.replace(".", "\\.")}(?![\\d]|\\.\\d)`).test(src));
}

/** Script-level language sanity check: Kazakh/Russian => Cyrillic, English => Latin. */
export function languageOk(text: string, language: string): boolean {
  const cyr = (text.match(/[\u0400-\u04FF]/g) ?? []).length, lat = (text.match(/[A-Za-z]/g) ?? []).length;
  return language === "English" ? lat > cyr : cyr > 0 && cyr >= lat;
}
