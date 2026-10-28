import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { extractPages, ExtractError, MAX_BYTES } from "@/lib/extract";
export const runtime = "nodejs";
const STATUS: Record<string, number> = { UNSUPPORTED_TYPE: 415, TOO_LARGE: 413, EMPTY_FILE: 400, EMPTY_TEXT: 422 };

export async function POST(req: Request) {
  if (!(await requireUserId())) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "TOO_LARGE" }, { status: 413 });
  try {
    const pages = await extractPages(Buffer.from(await file.arrayBuffer()), file.name);
    return NextResponse.json({ pages, charCount: pages.reduce((a, p) => a + p.text.length, 0) });
  } catch (e) {
    const code = e instanceof ExtractError ? e.code : "EXTRACTION_FAILED";
    return NextResponse.json({ error: code }, { status: STATUS[code] ?? 500 });
  }
}
