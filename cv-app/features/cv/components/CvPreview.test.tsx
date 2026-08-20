import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CvPreview } from "./CvPreview";
import { defaultCvData, useCvStore } from "../store/useCvStore";

describe("CvPreview", () => {
  beforeEach(() => {
    useCvStore.setState({ cvData: defaultCvData, isDirty: false });
  });

  it("renders the richer A4 resume sections from candidate-owned data", () => {
    useCvStore.setState({
      cvData: {
        ...defaultCvData,
        personalInfo: { ...defaultCvData.personalInfo, fullName: "Nguyễn Văn An", title: "Kỹ sư Frontend", email: "an@example.com", summary: "Xây dựng sản phẩm web dễ tiếp cận." },
        experiences: [{ id: "exp-1", company: "KaDa", role: "Frontend Engineer", isCurrent: true, startDate: "2024", description: "Tối ưu thời gian tải 30%.\nXây dựng design system." }],
        projects: [{ id: "project-1", name: "CV_KADA", role: "Người phát triển", technologies: "Next.js, PostgreSQL", description: "Xây dựng luồng CV và đánh giá." }],
        educations: [], skills: [{ id: "skill-1", category: "Frontend", name: "React", level: 5 }], certifications: [], languages: [],
      },
      isDirty: false,
    });

    render(<CvPreview />);

    expect(screen.getByRole("complementary", { name: "Thông tin bổ trợ trong CV" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nguyễn Văn An" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Kinh nghiệm làm việc" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dự án nổi bật" })).toBeInTheDocument();
    expect(screen.getByText("Tối ưu thời gian tải 30%.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByLabelText("Mức kỹ năng 5 trên 5")).toBeInTheDocument();
  });
});
