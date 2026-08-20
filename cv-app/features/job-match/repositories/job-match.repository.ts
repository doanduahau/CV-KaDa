import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export class JobMatchRepository {
  findResume(userId: string, resumeId?: string) {
    return prisma.resume.findFirst({
      where: resumeId ? { id: resumeId, userId, deletedAt: null } : { userId, isPrimary: true, deletedAt: null },
      include: { versions: { orderBy: { version: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    });
  }

  createManualAnalysis(input: { resumeVersionId: string; jobDescription: string; scores: { overallScore: number; keywordMatch: number; experienceMatch: number; skillsMatch: number }; details: Prisma.InputJsonValue }) {
    return prisma.matchAnalysis.create({
      data: { resumeVersionId: input.resumeVersionId, jobDescription: input.jobDescription, source: "MANUAL_JD", ...input.scores, details: input.details },
    });
  }

  listManualAnalyses(userId: string, limit = 5) {
    return prisma.matchAnalysis.findMany({
      where: { source: "MANUAL_JD", resumeVersion: { resume: { userId, deletedAt: null } } },
      include: { resumeVersion: { include: { resume: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  createAiRun(input: { userId: string; model: string; promptTokens: number; completionTokens: number; durationMs: number; status: string; errorCode?: string }) {
    return prisma.aiRun.create({ data: { ...input, feature: "MATCH_ANALYSIS", promptVersion: "cv-jd-v2" } });
  }
}

export const jobMatchRepository = new JobMatchRepository();
