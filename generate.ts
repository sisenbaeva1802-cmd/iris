import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { norm, jaccard, numbersSupported, languageOk } from "./checks";
import { Chunk, GenerationOutput, VerdictOutput, Question } from "./types";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

async function callJson<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>, system: string, user: string): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await client.messages.create({ model: MODEL, max_tokens: 8000, system, messages: [{ role: "user", content: user }] });
    const text = r.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    try { return schema.parse(JSON.parse(text.replace(/```json|```/g, "").trim())); } catch {}
  }
  throw new Error("AI_INVALID_OUTPUT");
}

const GEN_SYSTEM = `You write multiple-choice questions in the requested language using ONLY the provided source chunks.
Never use outside knowledge. Copy every number, date, unit and name exactly as written in the source; never compute, convert or invent figures. Every question, correct answer and explanation must be supported by a verbatim sourceExcerpt (copied exactly, 15+ chars, from one chunk).
Exactly 4 options, exactly 1 correct. Distractors: plausible, grammatically parallel, similar length/specificity to the correct answer, built from other terms/concepts in the source, partially-correct or reversed statements, and definitely wrong per the source. No "all of the above", no absurd options.
Questions must be understandable without the source. Cover different chunks; no duplicate facts. Skip chunks with nothing reliable to ask.
Return ONLY JSON: {"questions":[{"question","options":[4],"correctIndex","explanation","sourceExcerpt","chunkId","difficulty":"easy|medium|hard"}]}`;

const VERIFY_SYSTEM = `You are a strict auditor. Judge each question ONLY against the given excerpt and chunk, never general knowledge.
Return ONLY JSON: {"verdicts":[{"i","supported","singleCorrect","distractorsWrong","standalone","languageOk","confidence"}]}.
languageOk = question, options and explanation are written in the language given in the request. Also mark supported=false if any number, date, name or unit in the question/answer/explanation differs from the source.
supported = correct answer follows from the source; singleCorrect = no distractor is also defensible; distractorsWrong = all 3 distractors contradicted or unsupported by the source.`;

export type Progress = (stage: "analyze" | "generate" | "verify" | "dedupe" | "done") => void;

export async function generateQuiz(opts: {
  chunks: Chunk[]; count: number; difficulty: "easy" | "medium" | "hard" | "mixed"; language?: string; avoid?: string[]; onProgress?: Progress;
}): Promise<{ questions: Question[]; requested: number; produced: number }> {
  const { chunks, count, difficulty, language = "Kazakh", avoid = [], onProgress = () => {} } = opts;
  onProgress("analyze");
  const byId = new Map(chunks.map((c) => [c.id, c]));
  const accepted: Question[] = [];

  for (let pass = 0; pass < 2 && accepted.length < count; pass++)
  for (let i = pass * 3; i < chunks.length && accepted.length < count; i += 6) {
    const batch = chunks.slice(i, i + 6);
    const need = Math.min(count - accepted.length, Math.ceil(count / Math.ceil(chunks.length / 6)) + 2);
    onProgress("generate");
    const gen = await callJson(GenerationOutput, GEN_SYSTEM,
      `${avoid.length ? "Do NOT repeat or rephrase these existing questions: " + JSON.stringify(avoid) + "\n" : ""}Write all questions, options and explanations in ${language}. Difficulty: ${difficulty}. Write up to ${Math.ceil(need * 1.5)} questions.\n\n` +
      batch.map((c) => `[chunk ${c.id} | ${c.location}]\n${c.text}`).join("\n\n---\n\n"));

    // Deterministic gate: excerpt must literally occur in its chunk; 4 unique options.
    const cand = gen.questions.filter((q) => {
      const c = byId.get(q.chunkId);
      return !!c && norm(c.text).includes(norm(q.sourceExcerpt)) &&
        new Set(q.options.map(norm)).size === 4 && !q.options.some((o) => /барлығы|all of the above/i.test(o)) &&
        languageOk(q.question, language) &&
        numbersSupported(q.question + " " + q.options[q.correctIndex] + " " + q.explanation, c.text);
    });
    if (!cand.length) continue;

    onProgress("verify"); // independent LLM audit
    const ver = await callJson(VerdictOutput, VERIFY_SYSTEM, JSON.stringify({ language, questions: cand.map((q, k) => ({
      i: k, question: q.question, options: q.options, correctIndex: q.correctIndex,
      explanation: q.explanation, excerpt: q.sourceExcerpt, chunk: byId.get(q.chunkId)!.text })) }));
    const ok = new Map(ver.verdicts.map((v) => [v.i, v]));

    onProgress("dedupe");
    for (const [k, q] of cand.entries()) {
      const v = ok.get(k);
      if (!v || !(v.supported && v.singleCorrect && v.distractorsWrong && v.standalone && v.languageOk) || v.confidence < 0.85) continue;
      if ([...accepted.map((a) => a.question), ...avoid].some((t) => jaccard(t, q.question) > 0.6)) continue;
      accepted.push({ ...q, sourceLocation: byId.get(q.chunkId)!.location, confidence: v.confidence });
    }
  }
  const final = balancePositions(accepted.slice(0, count));
  onProgress("done");
  return { questions: final, requested: count, produced: final.length };
}


/** Spread correct answers evenly over A-D, keeping option content intact. */
function balancePositions(qs: Question[]): Question[] {
  return qs.map((q, n) => {
    const correct = q.options[q.correctIndex];
    const options = q.options.filter((_, i) => i !== q.correctIndex).sort(() => Math.random() - 0.5);
    options.splice(n % 4, 0, correct);
    return { ...q, options, correctIndex: n % 4 };
  });
}
