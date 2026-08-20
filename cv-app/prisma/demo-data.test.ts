import { describe, expect, it } from "vitest";
import { demoCompanies, demoJobs, demoRecruiters } from "./demo-data";

describe("demo recruitment data", () => {
  it("has unique stable identifiers and valid company references", () => {
    expect(new Set(demoCompanies.map(({ slug }) => slug)).size).toBe(demoCompanies.length);
    expect(new Set(demoRecruiters.map(({ email }) => email)).size).toBe(demoRecruiters.length);
    expect(new Set(demoJobs.map(({ id }) => id)).size).toBe(demoJobs.length);

    const companySlugs = new Set<string>(demoCompanies.map(({ slug }) => slug));
    expect(demoRecruiters.every(({ companySlug }) => companySlugs.has(companySlug))).toBe(true);
    expect(demoJobs.every(({ companySlug }) => companySlugs.has(companySlug))).toBe(true);
  });

  it("provides enough substantive jobs for every fictional employer", () => {
    expect(demoJobs).toHaveLength(15);
    for (const company of demoCompanies) {
      expect(demoJobs.filter(({ companySlug }) => companySlug === company.slug).length).toBeGreaterThanOrEqual(3);
    }
    for (const job of demoJobs) {
      expect(Array.isArray(job.skills) ? job.skills.length : 0).toBeGreaterThanOrEqual(3);
      expect(job.description?.length).toBeGreaterThan(60);
      expect(job.requirements?.length).toBeGreaterThan(80);
      expect(job.salaryMax).toBeGreaterThan(job.salaryMin ?? 0);
    }
  });
});
