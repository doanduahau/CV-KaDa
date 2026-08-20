import { describe, expect, it } from "vitest";

import { CvJdMatchService } from "./cv-jd-match.service";
import type { JobMatchProvider } from "../providers/job-match.provider";

describe("CvJdMatchService", () => {
  it("scores a CV higher when its evidence overlaps the JD skills and keywords", async () => {
    const service = new CvJdMatchService();
    const job = {
      title: "Frontend Engineer",
      description: "Build accessible React applications with tests.",
      requirements: "React, TypeScript, accessibility, automated testing.",
      skills: ["React", "TypeScript", "Testing"],
      experienceLevel: "MID",
    };

    const strong = await service.analyze(
      { summary: "Frontend engineer using React, TypeScript and automated testing for 3 nam." },
      job
    );
    const weak = await service.analyze({ summary: "Sales operations and account management." }, job);

    expect(strong.overallScore).toBeGreaterThan(weak.overallScore);
    expect(strong.skillsMatch).toBeGreaterThanOrEqual(weak.skillsMatch);
    expect(strong.details).toMatchObject({
      algorithm: "deterministic-cv-jd-v1",
      matchedSkills: expect.arrayContaining(["react", "typescript"]),
    });
  });

  it("uses the provider result and returns audit metadata when AI is configured", async () => {
    const provider = { analyze: async () => ({ result: { overallScore: 88, keywordMatch: 80, experienceMatch: 84, skillsMatch: 95, matchedKeywords: ["React"], missingKeywords: [], recommendations: [] }, model: "gemini-test", promptTokens: 12, completionTokens: 8, durationMs: 25 }) };
    const service = new CvJdMatchService(provider as JobMatchProvider);
    const result = await service.analyze({ skills: ["React"] }, { title: "Frontend Engineer", skills: ["React"] });
    expect(result).toMatchObject({ overallScore: 88, audit: { model: "gemini-test", status: "SUCCESS", promptTokens: 12 } });
  });
});
