import { describe, expect, it } from "vitest";
import { jobMatchRequestSchema } from "./schemas/job-match.schema";
import { sampleJobDescriptions } from "./sample-job-descriptions";

describe("sampleJobDescriptions", () => {
  it("provides unique samples accepted by the server request schema", () => {
    expect(new Set(sampleJobDescriptions.map((sample) => sample.id)).size).toBe(sampleJobDescriptions.length);
    for (const sample of sampleJobDescriptions) {
      expect(jobMatchRequestSchema.safeParse({ jobDescription: sample.description }).success).toBe(true);
    }
  });
});
