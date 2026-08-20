import type { CvData } from "../features/cv/schemas/cv.schema";

export const demoCandidateCv: CvData = {
  personalInfo: {
    fullName: "Vũ Minh Khang",
    title: "Kỹ sư Frontend cao cấp",
    email: "demo@lumina.ai",
    phone: "090 123 4567",
    location: "TP. Hồ Chí Minh",
    linkedin: "linkedin.com/in/vu-minh-khang-demo",
    github: "github.com/vuminhkhang-demo",
    website: "vuminhkhang.example.com",
    summary: "Kỹ sư Frontend với hơn 5 năm kinh nghiệm phát triển sản phẩm web cho lĩnh vực tuyển dụng và thương mại điện tử. Chuyên sâu React, Next.js và TypeScript; chú trọng accessibility, hiệu năng và khả năng kiểm thử. Có kinh nghiệm dẫn dắt kỹ thuật, xây dựng design system và phối hợp cùng sản phẩm để chuyển yêu cầu kinh doanh thành trải nghiệm có thể đo lường.",
  },
  experiences: [
    {
      id: "demo-exp-kada",
      company: "KaDa Technology",
      role: "Kỹ sư Frontend cao cấp",
      location: "TP. Hồ Chí Minh",
      startDate: "01/2023",
      endDate: "",
      isCurrent: true,
      description: "Dẫn dắt phát triển giao diện nền tảng tuyển dụng bằng Next.js và TypeScript cho hơn 20.000 người dùng hằng tháng.\nXây dựng design system gồm hơn 40 component, giảm khoảng 35% thời gian triển khai giao diện mới.\nTối ưu tải trang và chia nhỏ bundle, cải thiện Largest Contentful Paint từ 3,8 giây xuống 1,9 giây.\nThiết lập quy trình review và kiểm thử giúp giảm 28% lỗi giao diện sau phát hành.",
    },
    {
      id: "demo-exp-market",
      company: "Chợ Số Việt",
      role: "Lập trình viên Frontend",
      location: "Hà Nội · Làm việc từ xa",
      startDate: "06/2020",
      endDate: "12/2022",
      isCurrent: false,
      description: "Phát triển trang quản trị gian hàng bằng React, Redux và REST API.\nTái cấu trúc luồng quản lý sản phẩm, giảm 22% thời gian hoàn thành tác vụ của nhà bán hàng.\nPhối hợp với QA bổ sung kiểm thử tự động cho các hành trình thanh toán và quản lý đơn hàng quan trọng.",
    },
  ],
  projects: [
    {
      id: "demo-project-cv-kada",
      name: "CV_KADA",
      role: "Frontend Lead",
      url: "github.com/vuminhkhang-demo/cv-kada",
      technologies: "Next.js, React, TypeScript, Prisma, PostgreSQL",
      description: "Thiết kế trình tạo CV có versioning, đối sánh CV/JD và luồng đánh giá kỹ thuật dựa trên bằng chứng. Xây dựng kiến trúc component và schema giúp dữ liệu CV dùng nhất quán ở màn hình ứng viên và báo cáo nhà tuyển dụng.",
    },
    {
      id: "demo-project-design-system",
      name: "KaDa Design System",
      role: "Người khởi tạo",
      url: "design-system.example.com",
      technologies: "React, Storybook, Tailwind CSS, Vitest",
      description: "Chuẩn hóa token, component và hướng dẫn accessibility cho ba nhóm sản phẩm; bổ sung visual regression và kiểm thử tương tác cho các thành phần quan trọng.",
    },
  ],
  educations: [
    {
      id: "demo-education-hcmut",
      institution: "Đại học Bách khoa – ĐHQG TP.HCM",
      degree: "Kỹ sư",
      field: "Khoa học máy tính",
      startDate: "2016",
      endDate: "2020",
      description: "GPA 3.45/4.0 · Đồ án: Nền tảng phân tích hiệu năng ứng dụng web.",
    },
  ],
  skills: [
    { id: "demo-skill-react", category: "Frontend", name: "React / Next.js", level: 5 },
    { id: "demo-skill-typescript", category: "Ngôn ngữ", name: "TypeScript / JavaScript", level: 5 },
    { id: "demo-skill-css", category: "Giao diện", name: "Tailwind CSS / Responsive UI", level: 5 },
    { id: "demo-skill-testing", category: "Kiểm thử", name: "Vitest / Playwright", level: 4 },
    { id: "demo-skill-a11y", category: "Chất lượng", name: "Web Accessibility / Performance", level: 4 },
    { id: "demo-skill-backend", category: "Backend", name: "Node.js / REST API", level: 3 },
  ],
  certifications: [
    { id: "demo-cert-aws", name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", issueDate: "2024", url: "credentials.example.com/aws-demo" },
    { id: "demo-cert-english", name: "IELTS Academic 7.0", issuer: "British Council", issueDate: "2023", url: "credentials.example.com/ielts-demo" },
  ],
  languages: [
    { id: "demo-language-vietnamese", name: "Tiếng Việt", proficiency: "Bản ngữ" },
    { id: "demo-language-english", name: "Tiếng Anh", proficiency: "Giao tiếp chuyên nghiệp · IELTS 7.0" },
  ],
};
