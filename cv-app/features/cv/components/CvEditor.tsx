"use client";

import { Award, BriefcaseBusiness, FolderKanban, Globe2, GraduationCap, Plus, Trash2, UserRound, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useCvStore } from "../store/useCvStore";

type CollectionKey = "experiences" | "educations" | "skills" | "projects" | "certifications" | "languages";
type Field = { key: string; label: string; placeholder?: string; wide?: boolean; textarea?: boolean };

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section className="rounded-xl border border-outline-variant bg-surface-white p-4 shadow-sm"><h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">{icon}{title}</h3>{children}</section>;
}

function CollectionSection({ collectionKey, title, icon, fields, emptyItem }: { collectionKey: CollectionKey; title: string; icon: ReactNode; fields: Field[]; emptyItem: Record<string, unknown> }) {
  const { cvData, addItem, updateItem, removeItem } = useCvStore();
  const items = cvData[collectionKey] as unknown as Array<Record<string, unknown> & { id: string }>;
  return (
    <Section title={title} icon={icon}>
      <div className="space-y-3">
        {items.map((item, index) => <div key={item.id} className="relative rounded-lg border border-outline-variant bg-surface-low p-3">
          <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-text-muted">Mục {index + 1}</span><button type="button" onClick={() => removeItem(collectionKey, item.id)} className="rounded-md p-1.5 text-text-muted hover:bg-error-container hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={`Xóa mục ${index + 1} trong ${title}`}><Trash2 className="h-4 w-4" /></button></div>
          <div className="grid gap-3 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className={`space-y-1.5 text-xs font-semibold text-foreground ${field.wide ? "sm:col-span-2" : ""}`}><span>{field.label}</span>{field.textarea ? <Textarea value={String(item[field.key] ?? "")} onChange={(event) => updateItem(collectionKey, item.id, { [field.key]: event.target.value })} placeholder={field.placeholder} rows={3} /> : <Input value={String(item[field.key] ?? "")} onChange={(event) => updateItem(collectionKey, item.id, { [field.key]: event.target.value })} placeholder={field.placeholder} />}</label>)}</div>
        </div>)}
        {items.length === 0 ? <p className="rounded-lg border border-dashed border-outline-variant p-4 text-center text-sm text-text-muted">Chưa có dữ liệu. Hãy thêm mục đầu tiên.</p> : null}
        <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => addItem(collectionKey, { id: crypto.randomUUID(), ...emptyItem })}><Plus className="mr-2 h-4 w-4" />Thêm {title.toLocaleLowerCase("vi")}</Button>
      </div>
    </Section>
  );
}

export function CvEditor() {
  const { cvData, updatePersonalInfo } = useCvStore();
  const personal = cvData.personalInfo;
  const personalFields = [
    ["fullName", "Họ và tên", "Nguyễn Văn An"], ["title", "Chức danh", "Kỹ sư Frontend"],
    ["email", "Email", "email@example.com"], ["phone", "Số điện thoại", "0901 234 567"],
    ["location", "Địa điểm", "TP. Hồ Chí Minh"], ["linkedin", "LinkedIn", "linkedin.com/in/ten-cua-ban"],
    ["github", "GitHub", "github.com/ten-cua-ban"], ["website", "Website/Portfolio", "portfolio.example.com"],
  ] as const;

  return <div className="space-y-3 bg-surface-low p-3 md:p-4">
    <Section title="Thông tin cá nhân" icon={<UserRound className="h-4 w-4 text-primary" />}>
      <div className="grid gap-3 sm:grid-cols-2">{personalFields.map(([key, label, placeholder]) => <label key={key} className="space-y-1.5 text-xs font-semibold text-foreground"><span>{label}</span><Input type={key === "email" ? "email" : "text"} value={personal[key] ?? ""} onChange={(event) => updatePersonalInfo({ [key]: event.target.value })} placeholder={placeholder} /></label>)}</div>
      <label className="mt-3 block space-y-1.5 text-xs font-semibold text-foreground"><span>Giới thiệu bản thân</span><Textarea value={personal.summary ?? ""} onChange={(event) => updatePersonalInfo({ summary: event.target.value })} placeholder="Tóm tắt chuyên môn, số năm kinh nghiệm và giá trị bạn mang lại..." rows={4} /><span className="block text-right font-normal text-text-muted">{personal.summary?.length ?? 0}/1500</span></label>
    </Section>
    <CollectionSection collectionKey="experiences" title="Kinh nghiệm làm việc" icon={<BriefcaseBusiness className="h-4 w-4 text-primary" />} emptyItem={{ company: "", role: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "" }} fields={[{ key: "company", label: "Công ty" }, { key: "role", label: "Chức vụ" }, { key: "startDate", label: "Bắt đầu", placeholder: "01/2022" }, { key: "endDate", label: "Kết thúc", placeholder: "Hiện tại" }, { key: "location", label: "Địa điểm", wide: true }, { key: "description", label: "Thành tựu và trách nhiệm", placeholder: "Mỗi dòng là một kết quả; ưu tiên động từ và số liệu có thể kiểm chứng.", wide: true, textarea: true }]} />
    <CollectionSection collectionKey="projects" title="Dự án nổi bật" icon={<FolderKanban className="h-4 w-4 text-primary" />} emptyItem={{ name: "", role: "", url: "", technologies: "", description: "" }} fields={[{ key: "name", label: "Tên dự án" }, { key: "role", label: "Vai trò" }, { key: "technologies", label: "Công nghệ", placeholder: "Next.js, PostgreSQL, Docker", wide: true }, { key: "url", label: "Liên kết", wide: true }, { key: "description", label: "Bài toán, đóng góp và kết quả", wide: true, textarea: true }]} />
    <CollectionSection collectionKey="educations" title="Học vấn" icon={<GraduationCap className="h-4 w-4 text-primary" />} emptyItem={{ institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" }} fields={[{ key: "institution", label: "Trường", wide: true }, { key: "degree", label: "Bằng cấp" }, { key: "field", label: "Chuyên ngành" }, { key: "startDate", label: "Bắt đầu" }, { key: "endDate", label: "Kết thúc" }, { key: "description", label: "Thông tin bổ sung", wide: true, textarea: true }]} />
    <CollectionSection collectionKey="skills" title="Kỹ năng" icon={<Wrench className="h-4 w-4 text-primary" />} emptyItem={{ name: "", category: "" }} fields={[{ key: "category", label: "Nhóm", placeholder: "Frontend" }, { key: "name", label: "Kỹ năng", placeholder: "React" }]} />
    <CollectionSection collectionKey="certifications" title="Chứng chỉ" icon={<Award className="h-4 w-4 text-primary" />} emptyItem={{ name: "", issuer: "", issueDate: "", url: "" }} fields={[{ key: "name", label: "Tên chứng chỉ" }, { key: "issuer", label: "Đơn vị cấp" }, { key: "issueDate", label: "Thời điểm cấp" }, { key: "url", label: "Liên kết xác minh" }]} />
    <CollectionSection collectionKey="languages" title="Ngoại ngữ" icon={<Globe2 className="h-4 w-4 text-primary" />} emptyItem={{ name: "", proficiency: "" }} fields={[{ key: "name", label: "Ngôn ngữ" }, { key: "proficiency", label: "Trình độ", placeholder: "IELTS 7.0 / Thành thạo" }]} />
  </div>;
}
