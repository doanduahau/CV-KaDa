import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";
import { DEMO_RECRUITER_PASSWORD, demoCompanies, demoJobs, demoRecruiters } from "./demo-data";
import { demoCandidateCv } from "./demo-cv-data";

const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.SEED_DEMO_DATA !== "true") {
    console.log("Bỏ qua dữ liệu mẫu. Đặt SEED_DEMO_DATA=true trong môi trường phi sản xuất để bật.");
    return;
  }

  console.log("Đang tạo dữ liệu mẫu cục bộ...");

  const user = await prisma.user.upsert({
    where: { email: "demo@lumina.ai" },
    update: { name: "Vũ Nguyễn", role: "CANDIDATE" },
    create: { email: "demo@lumina.ai", name: "Vũ Nguyễn", role: "CANDIDATE" },
  });

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: { headline: "Lập trình viên Frontend cao cấp", location: "TP. Hồ Chí Minh" },
    create: {
      userId: user.id,
      headline: "Lập trình viên Frontend cao cấp",
      summary: "Xây dựng ứng dụng web có khả năng mở rộng với React và Next.js.",
      phone: "+84 123 456 789",
      location: "TP. Hồ Chí Minh",
    },
  });

  await prisma.resume.upsert({
    where: { id: "demo-resume-frontend" },
    update: { title: "CV Lập trình viên Frontend", isPrimary: true },
    create: {
      id: "demo-resume-frontend",
      userId: user.id,
      title: "CV Lập trình viên Frontend",
      isPrimary: true,
    },
  });
  await prisma.resumeVersion.upsert({
    where: { resumeId_version: { resumeId: "demo-resume-frontend", version: 1 } },
    update: { content: demoCandidateCv },
    create: { resumeId: "demo-resume-frontend", version: 1, content: demoCandidateCv },
  });

  const companies = new Map<string, string>();
  for (const company of demoCompanies) {
    const saved = await prisma.company.upsert({
      where: { slug: company.slug },
      update: company,
      create: company,
    });
    companies.set(company.slug, saved.id);
  }

  const passwordHash = await hashPassword(DEMO_RECRUITER_PASSWORD);
  for (const recruiter of demoRecruiters) {
    const companyId = companies.get(recruiter.companySlug);
    if (!companyId) throw new Error(`Không tìm thấy công ty mẫu: ${recruiter.companySlug}`);

    const saved = await prisma.user.upsert({
      where: { email: recruiter.email },
      update: { name: recruiter.name, role: "RECRUITER", passwordHash },
      create: { email: recruiter.email, name: recruiter.name, role: "RECRUITER", passwordHash },
    });
    await prisma.companyMembership.upsert({
      where: { userId: saved.id },
      update: { companyId, role: "OWNER" },
      create: { userId: saved.id, companyId, role: "OWNER" },
    });
  }

  for (const { companySlug, ...job } of demoJobs) {
    const companyId = companies.get(companySlug);
    if (!companyId) throw new Error(`Không tìm thấy công ty cho JD mẫu: ${companySlug}`);
    await prisma.job.upsert({
      where: { id: job.id },
      update: { ...job, companyId },
      create: { ...job, companyId },
    });
  }

  console.log(`Hoàn tất: ${demoCompanies.length} công ty, ${demoRecruiters.length} nhà tuyển dụng và ${demoJobs.length} JD mẫu.`);
  console.log(`Mật khẩu chung của tài khoản nhà tuyển dụng mẫu: ${DEMO_RECRUITER_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
