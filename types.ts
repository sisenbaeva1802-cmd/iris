import { z } from "zod";
export type Chunk = { id: string; text: string; location: string };
export const RawQuestion = z.object({
  question: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(5),
  sourceExcerpt: z.string().min(15),
  chunkId: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});
export const GenerationOutput = z.object({ questions: z.array(RawQuestion) });
export const VerdictOutput = z.object({
  verdicts: z.array(z.object({
    i: z.number().int(), supported: z.boolean(), singleCorrect: z.boolean(),
    distractorsWrong: z.boolean(), standalone: z.boolean(), languageOk: z.boolean().default(true), confidence: z.number().min(0).max(1),
  })),
});
export type Question = z.infer<typeof RawQuestion> & { sourceLocation: string; confidence: number };
