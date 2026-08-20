import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));
const id = z.string().min(1).max(120);

export const PersonalInfoSchema = z.object({
  fullName: optionalText(120), title: optionalText(160),
  email: z.string().trim().email("Email không hợp lệ").max(254).optional().or(z.literal("")),
  phone: optionalText(30), location: optionalText(160), summary: optionalText(1500),
  linkedin: optionalText(300), github: optionalText(300), website: optionalText(300),
});
export const ExperienceSchema = z.object({
  id, company: z.string().trim().min(1, "Vui lòng nhập tên công ty").max(160), role: z.string().trim().min(1, "Vui lòng nhập chức vụ").max(160), location: optionalText(160),
  startDate: optionalText(40), endDate: optionalText(40), isCurrent: z.boolean().default(false), description: optionalText(3000),
});
export const EducationSchema = z.object({
  id, institution: z.string().trim().min(1, "Vui lòng nhập tên trường").max(200), degree: z.string().trim().min(1, "Vui lòng nhập bằng cấp").max(200), field: optionalText(200),
  startDate: optionalText(40), endDate: optionalText(40), description: optionalText(1000),
});
export const SkillSchema = z.object({ id, name: z.string().trim().min(1, "Vui lòng nhập kỹ năng").max(120), category: optionalText(80), level: z.number().int().min(1).max(5).optional() });
export const ProjectSchema = z.object({ id, name: z.string().trim().max(180), role: optionalText(160), url: optionalText(300), technologies: optionalText(500), description: optionalText(2000) });
export const CertificationSchema = z.object({ id, name: z.string().trim().max(180), issuer: optionalText(180), issueDate: optionalText(40), url: optionalText(300) });
export const LanguageSchema = z.object({ id, name: z.string().trim().max(100), proficiency: optionalText(120) });

const CvPayloadSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experiences: z.array(ExperienceSchema).max(20), educations: z.array(EducationSchema).max(20),
  skills: z.array(SkillSchema).max(60), projects: z.array(ProjectSchema).max(20),
  certifications: z.array(CertificationSchema).max(30), languages: z.array(LanguageSchema).max(20),
});

export const CvSchema = z.preprocess((value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const payload = value as Record<string, unknown>;
  return { ...payload, experiences: payload.experiences ?? [], educations: payload.educations ?? payload.education ?? [], skills: payload.skills ?? [], projects: payload.projects ?? [], certifications: payload.certifications ?? [], languages: payload.languages ?? [] };
}, CvPayloadSchema);

export type CvData = z.infer<typeof CvSchema>;
export type ExperienceData = z.infer<typeof ExperienceSchema>;
export type EducationData = z.infer<typeof EducationSchema>;
export type SkillData = z.infer<typeof SkillSchema>;
export type ProjectData = z.infer<typeof ProjectSchema>;
export type CertificationData = z.infer<typeof CertificationSchema>;
export type LanguageData = z.infer<typeof LanguageSchema>;

export function evaluateCvCompletion(cv: CvData) {
  const checks = [
    [cv.personalInfo.fullName, "Họ và tên"], [cv.personalInfo.title, "Chức danh"], [cv.personalInfo.email, "Email"],
    [cv.personalInfo.phone, "Số điện thoại"], [cv.personalInfo.location, "Địa điểm"], [cv.personalInfo.summary, "Giới thiệu bản thân"],
    [cv.experiences.some((item) => item.company && item.role) || cv.educations.some((item) => item.institution && item.degree), "Kinh nghiệm hoặc học vấn"],
    [cv.skills.some((item) => item.name), "Kỹ năng"],
  ] as const;
  const missing = checks.filter(([value]) => !value).map(([, label]) => label);
  return { percentage: Math.round(((checks.length - missing.length) / checks.length) * 100), missing };
}
