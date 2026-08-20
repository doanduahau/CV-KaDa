import JobMatchClient from "@/features/job-match/job-matchClient";
import { auth } from "@/auth";
import { getRequiredRoleRedirect } from "@/features/auth/services/role-redirects";
import { redirect } from "next/navigation";
import { jobMatchAnalysisService } from "@/features/job-match/services/job-match-analysis.service";

export default async function JobMatchPage() {
  const session = await auth();
  
  const roleRedirect = getRequiredRoleRedirect({ user: session?.user, requiredRole: "CANDIDATE" });
  if (roleRedirect) redirect(roleRedirect);

  const recent = await jobMatchAnalysisService.listRecent(session!.user.id);
  return <JobMatchClient initialHistory={recent.map((item) => ({ id: item.id, overallScore: item.overallScore, createdAt: item.createdAt.toISOString(), resumeTitle: item.resumeVersion.resume.title }))} />;
}
