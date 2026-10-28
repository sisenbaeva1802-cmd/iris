import { z } from "zod";
export const QuestionIn = z.object({
  question: z.string().trim().min(5).max(1000),
  options: z.array(z.string().trim().min(1).max(500)).length(4)
    .refine((o) => new Set(o.map((s) => s.toLowerCase())).size === 4, "duplicate options"),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().max(2000).default(""),
  sourceExcerpt: z.string().max(4000).default(""),
  sourceLocation: z.string().max(100).default(""),
  difficulty: z.string().max(20).default("mixed"),
  confidence: z.number().min(0).max(1).default(1),
});
export const QuizIn = z.object({
  title: z.string().trim().min(1).max(200),
  difficulty: z.string().max(20).default("mixed"),
  requestedCount: z.number().int().min(1).max(100).default(10),
  questions: z.array(QuestionIn).min(1).max(100),
  language: z.enum(["Kazakh", "Russian", "English"]).default("Kazakh"),
  pages: z.array(z.object({ location: z.string().max(100), text: z.string() })).max(3000).optional()
    .refine((p) => !p || p.reduce((a, x) => a + x.text.length, 0) <= 2_000_000, "too large"),
  source: z.object({ fileName: z.string().max(200), fileType: z.string().max(10), sizeBytes: z.number().int().min(0), charCount: z.number().int().min(0) })
    .default({ fileName: "Қойылған мәтін", fileType: "TXT", sizeBytes: 0, charCount: 0 }),
});
export type QuestionInput = z.infer<typeof QuestionIn>;
export const questionData = (q: QuestionInput, i: number) => ({
  position: i, text: q.question, explanation: q.explanation, sourceExcerpt: q.sourceExcerpt, sourceLocation: q.sourceLocation,
  difficulty: q.difficulty, confidence: q.confidence,
  options: { create: q.options.map((text, j) => ({ position: j, text, isCorrect: j === q.correctIndex })) },
});
