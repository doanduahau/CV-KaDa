import { z } from "zod";

export const jobMatchRequestSchema = z.object({
  jobDescription: z.string().trim().min(40, "JD phải có ít nhất 40 ký tự.").max(20_000, "JD không được vượt quá 20.000 ký tự."),
  resumeId: z.string().cuid().optional(),
});

const scoreSchema = z.number().int().min(0).max(100);

export const matchAnalysisResultSchema = z.object({
  overallScore: scoreSchema,
  keywordMatch: scoreSchema,
  experienceMatch: scoreSchema,
  skillsMatch: scoreSchema,
  matchedKeywords: z.array(z.string().trim().min(1)).max(50),
  missingKeywords: z.array(z.string().trim().min(1)).max(50),
  recommendations: z.array(z.string().trim().min(1)).max(20),
});

export type MatchAnalysisResult = z.infer<typeof matchAnalysisResultSchema>;
