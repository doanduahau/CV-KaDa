"use server";

import { auth } from "@/auth";
import type { CvData } from "../schemas/cv.schema";
import { requireActiveRole } from "@/features/auth/services/session-authorization";
import { resumeService, ResumeValidationError } from "../services/resume.service";

export async function saveCvAction(resumeId: string, data: CvData) {
  try {
    const session = await auth();
    const principal = await requireActiveRole(session?.user, "CANDIDATE");
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    if (!principal) {
      return { success: false, error: "Forbidden" };
    }

    const saved = await resumeService.saveVersion(principal.id, resumeId, data);

    if (!saved) return { success: false, error: "Không tìm thấy CV hoặc bạn không có quyền chỉnh sửa." };

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof ResumeValidationError) {
      return { success: false, error: error.issues[0]?.message ?? "Dữ liệu CV không hợp lệ." };
    }
    console.error("Không thể lưu phiên bản CV.");
    return { success: false, error: "Không thể lưu CV lúc này." };
  }
}
