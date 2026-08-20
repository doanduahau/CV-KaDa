import type { MatchAnalysisResult } from "../schemas/job-match.schema";

export type MatchProviderResult = {
  result: MatchAnalysisResult;
  model: string;
  promptTokens: number;
  completionTokens: number;
  durationMs: number;
};

export interface JobMatchProvider {
  analyze(resumeText: string, jobDescription: string): Promise<MatchProviderResult>;
}
