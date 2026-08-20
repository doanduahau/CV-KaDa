import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireActiveRole } from "@/features/auth/services/session-authorization";
import { JobMatchProviderError, JobMatchResumeNotFoundError, JobMatchValidationError, jobMatchAnalysisService } from "@/features/job-match/services/job-match-analysis.service";

async function requireCandidate() {
  const session = await auth();
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 }) };
  const principal = await requireActiveRole(session.user, "CANDIDATE");
  if (!principal) return { error: NextResponse.json({ error: "Bạn không có quyền thực hiện thao tác này." }, { status: 403 }) };
  return { principal };
}

export async function GET() {
  const access = await requireCandidate();
  if ("error" in access) return access.error;
  const analyses = await jobMatchAnalysisService.listRecent(access.principal.id);
  return NextResponse.json(analyses.map((item) => ({ id: item.id, overallScore: item.overallScore, keywordMatch: item.keywordMatch, experienceMatch: item.experienceMatch, skillsMatch: item.skillsMatch, createdAt: item.createdAt.toISOString(), resumeTitle: item.resumeVersion.resume.title })));
}

export async function POST(req: NextRequest) {
  const access = await requireCandidate();
  if ("error" in access) return access.error;
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Nội dung yêu cầu không phải JSON hợp lệ." }, { status: 400 }); }

  try {
    return NextResponse.json(await jobMatchAnalysisService.analyzeManual(access.principal.id, body));
  } catch (error) {
    if (error instanceof JobMatchValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof JobMatchResumeNotFoundError) return NextResponse.json({ error: error.message }, { status: 404 });
    if (error instanceof JobMatchProviderError) return NextResponse.json({ error: error.message }, { status: 502 });
    console.error("Match analysis failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "Không thể phân tích mức độ phù hợp." }, { status: 500 });
  }
}
