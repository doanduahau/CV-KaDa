import { describe, expect, it } from "vitest";
import { CvSchema, evaluateCvCompletion } from "../features/cv/schemas/cv.schema";
import { demoCandidateCv } from "./demo-cv-data";

describe("demo candidate CV", () => {
  it("is complete, valid and suitable for an immediate product demo", () => {
    const parsed = CvSchema.parse(demoCandidateCv);

    expect(evaluateCvCompletion(parsed)).toEqual({ percentage: 100, missing: [] });
    expect(parsed.experiences.length).toBeGreaterThanOrEqual(2);
    expect(parsed.projects.length).toBeGreaterThanOrEqual(2);
    expect(parsed.skills.length).toBeGreaterThanOrEqual(6);
    expect(parsed.educations.length).toBeGreaterThanOrEqual(1);
    expect(parsed.certifications.length).toBeGreaterThanOrEqual(2);
    expect(parsed.languages.length).toBeGreaterThanOrEqual(2);
  });
});
