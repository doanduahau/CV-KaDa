"use server";

import { auth } from "@/auth";
import { requireActiveRole } from "@/features/auth/services/session-authorization";
import type { AssessmentActionState } from "./assessment.action-state";

export async function createAssessmentSessionAction(
  _prevState: AssessmentActionState,
  _formData: FormData
): Promise<AssessmentActionState> {
  void _prevState;
  void _formData;

  const session = await auth();
  const principal = await requireActiveRole(session?.user, "CANDIDATE");
  if (!session?.user?.id) {
    return { status: "error", message: "Bạn cần đăng nhập để tạo bài đánh giá." };
  }
  if (!principal) {
    return { status: "error", message: "Chỉ tài khoản ứng viên đang hoạt động mới có thể tạo bài đánh giá." };
  }

  return { status: "error", message: "Luồng ứng viên tự tạo bài đánh giá đã được tắt. Nhà tuyển dụng sẽ chủ động mời nếu cần." };
}

export async function submitAssessmentAction(
  _prevState: AssessmentActionState,
  _formData: FormData
): Promise<AssessmentActionState> {
  void _prevState;
  void _formData;

  const session = await auth();
  const principal = await requireActiveRole(session?.user, "CANDIDATE");
  if (!session?.user?.id) {
    return { status: "error", message: "Bạn cần đăng nhập để nộp bài đánh giá." };
  }
  if (!principal) {
    return { status: "error", message: "Chỉ tài khoản ứng viên đang hoạt động mới có thể nộp bài đánh giá." };
  }

  return { status: "error", message: "Luồng ứng viên tự nộp bài đánh giá đã được tắt. Nhà tuyển dụng sẽ tổ chức vòng đánh giá riêng nếu cần." };
}

export type SimulationResult = {
  status: "success" | "error";
  message?: string;
  output?: {
    passed: number;
    total: number;
    logs: string[];
    errors: string[];
    executionTimeMs: number;
  };
};

export async function simulateCodeExecutionAction(
  code: string,
  taskId: string
): Promise<SimulationResult> {
  void taskId;

  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Bạn cần đăng nhập để chạy code." };
  }

  // Simulate network delay for compiling and running
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!code || code.trim().length < 20) {
    return {
      status: "success",
      output: {
        passed: 0,
        total: 3,
        logs: ["Đang biên dịch...", "Lỗi: Mã nguồn quá ngắn hoặc đang để trống."],
        errors: ["Lỗi cú pháp: Dữ liệu đầu vào kết thúc đột ngột"],
        executionTimeMs: 120,
      }
    };
  }

  const isJava = code.includes("class") || code.includes("public");
  const hasKeywords = code.toLowerCase().includes("function") || code.toLowerCase().includes("const") || isJava;
  const isGood = code.length > 100 && hasKeywords;

  if (isGood) {
    return {
      status: "success",
      output: {
        passed: 3,
        total: 3,
        logs: [
          "Đang biên dịch...",
          "Biên dịch thành công.",
          "Đang chạy kiểm thử...",
          "✓ Kiểm thử 1: Chức năng cơ bản đạt yêu cầu (12ms)",
          "✓ Kiểm thử 2: Đã xử lý trường hợp biên (45ms)",
          "✓ Kiểm thử 3: Hiệu năng đạt yêu cầu (124ms)"
        ],
        errors: [],
        executionTimeMs: 181,
      }
    };
  } else {
    return {
      status: "success",
      output: {
        passed: 1,
        total: 3,
        logs: [
          "Đang biên dịch...",
          "Biên dịch thành công nhưng có cảnh báo.",
          "Đang chạy kiểm thử...",
          "✓ Kiểm thử 1: Chức năng cơ bản đạt yêu cầu (15ms)",
          "✗ Kiểm thử 2: Chưa xử lý đúng trường hợp biên",
          "✗ Kiểm thử 3: Hiệu năng chưa đạt (quá thời gian)"
        ],
        errors: [
          "Lỗi tham chiếu rỗng tại dòng 4: Không thể đọc thuộc tính của giá trị chưa xác định",
          "TimeoutError: Execution exceeded 2000ms limit"
        ],
        executionTimeMs: 2015,
      }
    };
  }
}
