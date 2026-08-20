import { describe, expect, it, vi } from "vitest";
import type { JobMatchProvider } from "../providers/job-match.provider";
import type { JobMatchRepository } from "../repositories/job-match.repository";
import { JobMatchAnalysisService, JobMatchProviderError, JobMatchValidationError } from "./job-match-analysis.service";

function setup() {
  const repository = {
    findResume: vi.fn().mockResolvedValue({ id: "resume-1", versions: [{ id: "version-1", content: { skills: ["React"] } }] }),
    createAiRun: vi.fn().mockResolvedValue({ id: "run-1" }),
    createManualAnalysis: vi.fn().mockResolvedValue({ id: "analysis-1", createdAt: new Date("2026-08-20T00:00:00Z") }),
    listManualAnalyses: vi.fn(),
  };
  const provider = { analyze: vi.fn().mockResolvedValue({ result: { overallScore: 80, keywordMatch: 75, experienceMatch: 70, skillsMatch: 90, matchedKeywords: ["React"], missingKeywords: ["Vitest"], recommendations: ["Bổ sung bằng chứng kiểm thử."] }, model: "gemini-2.5-flash", promptTokens: 10, completionTokens: 20, durationMs: 30 }) };
  return { repository, provider, service: new JobMatchAnalysisService(repository as unknown as JobMatchRepository, provider as unknown as JobMatchProvider) };
}

describe("JobMatchAnalysisService", () => {
  it("validates, audits and persists an owned manual analysis", async () => {
    const { service, repository } = setup();
    await expect(service.analyzeManual("user-1", { jobDescription: "React TypeScript testing requirements for a frontend engineering position." })).resolves.toMatchObject({ analysisId: "analysis-1", overallScore: 80 });
    expect(repository.createAiRun).toHaveBeenCalledWith(expect.objectContaining({ userId: "user-1", status: "SUCCESS" }));
    expect(repository.createManualAnalysis).toHaveBeenCalledWith(expect.objectContaining({ resumeVersionId: "version-1" }));
  });

  it("rejects short untrusted job descriptions before reading a resume", async () => {
    const { service, repository } = setup();
    await expect(service.analyzeManual("user-1", { jobDescription: "React" })).rejects.toBeInstanceOf(JobMatchValidationError);
    expect(repository.findResume).not.toHaveBeenCalled();
  });

  it("records provider failures without exposing their raw message", async () => {
    const { service, provider, repository } = setup();
    provider.analyze.mockRejectedValue(new Error("secret provider response"));
    await expect(service.analyzeManual("user-1", { jobDescription: "React TypeScript testing requirements for a frontend engineering position." })).rejects.toBeInstanceOf(JobMatchProviderError);
    expect(repository.createAiRun).toHaveBeenCalledWith(expect.objectContaining({ status: "FAILED", errorCode: "PROVIDER_ERROR" }));
  });
});
