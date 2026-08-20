import { z } from "zod";
import { GeminiJobMatchProvider } from "../providers/gemini-job-match.provider";
import type { JobMatchProvider } from "../providers/job-match.provider";
import { jobMatchRepository, type JobMatchRepository } from "../repositories/job-match.repository";
import { jobMatchRequestSchema } from "../schemas/job-match.schema";

export class JobMatchValidationError extends Error {}
export class JobMatchResumeNotFoundError extends Error {}
export class JobMatchProviderError extends Error {}

export class JobMatchAnalysisService {
  constructor(
    private readonly repository: JobMatchRepository = jobMatchRepository,
    private readonly provider: JobMatchProvider = new GeminiJobMatchProvider(),
  ) {}

  async analyzeManual(userId: string, untrustedInput: unknown) {
    const parsed = jobMatchRequestSchema.safeParse(untrustedInput);
    if (!parsed.success) throw new JobMatchValidationError(parsed.error.issues[0]?.message ?? "Dữ liệu phân tích không hợp lệ.");

    const resume = await this.repository.findResume(userId, parsed.data.resumeId);
    const version = resume?.versions[0];
    if (!resume || !version) throw new JobMatchResumeNotFoundError("Không tìm thấy CV để phân tích.");

    let providerResult;
    try {
      providerResult = await this.provider.analyze(JSON.stringify(version.content), parsed.data.jobDescription);
    } catch (error) {
      if (error instanceof z.ZodError || error instanceof SyntaxError) {
        await this.repository.createAiRun({ userId, model: "gemini-2.5-flash", promptTokens: 0, completionTokens: 0, durationMs: 0, status: "INVALID_OUTPUT", errorCode: "INVALID_OUTPUT" });
        throw new JobMatchProviderError("AI trả về kết quả không hợp lệ. Vui lòng thử lại.");
      }
      await this.repository.createAiRun({ userId, model: "gemini-2.5-flash", promptTokens: 0, completionTokens: 0, durationMs: 0, status: "FAILED", errorCode: "PROVIDER_ERROR" });
      throw new JobMatchProviderError("Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.");
    }

    await this.repository.createAiRun({ userId, model: providerResult.model, promptTokens: providerResult.promptTokens, completionTokens: providerResult.completionTokens, durationMs: providerResult.durationMs, status: "SUCCESS" });
    const saved = await this.repository.createManualAnalysis({
      resumeVersionId: version.id,
      jobDescription: parsed.data.jobDescription,
      scores: providerResult.result,
      details: {
        algorithm: "gemini-cv-jd-v2",
        matchedKeywords: providerResult.result.matchedKeywords,
        missingKeywords: providerResult.result.missingKeywords,
        recommendations: providerResult.result.recommendations,
      },
    });
    return { ...providerResult.result, analysisId: saved.id, createdAt: saved.createdAt.toISOString() };
  }

  listRecent(userId: string) {
    return this.repository.listManualAnalyses(userId);
  }
}

export const jobMatchAnalysisService = new JobMatchAnalysisService();
