import { analyzeResumeMatchWithMetadata } from "@/lib/ai/gemini";
import type { JobMatchProvider } from "./job-match.provider";

export class GeminiJobMatchProvider implements JobMatchProvider {
  analyze(resumeText: string, jobDescription: string) {
    return analyzeResumeMatchWithMetadata(resumeText, jobDescription);
  }
}
