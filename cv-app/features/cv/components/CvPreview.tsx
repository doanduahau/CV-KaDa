"use client";

import { AtSign, Globe, Link as LinkIcon, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { useCvStore } from "../store/useCvStore";

function MainSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="mb-3 border-b-2 border-primary pb-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">{title}</h2>{children}</section>;
}

function SideSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="mb-3 border-b border-white/40 pb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white">{title}</h2>{children}</section>;
}

function period(start?: string, end?: string, current?: boolean) {
  return [start, current ? "Hiện tại" : end].filter(Boolean).join(" – ");
}

function Description({ value }: { value?: string }) {
  if (!value) return null;
  const lines = value.split("\n").map((line) => line.trim().replace(/^[-•]\s*/, "")).filter(Boolean);
  if (lines.length <= 1) return <p className="mt-2 whitespace-pre-line text-[10.5px] leading-[1.65] text-slate-600">{value}</p>;
  return <ul className="mt-2 space-y-1">{lines.map((line, index) => <li key={index} className="flex gap-2 text-[10.5px] leading-[1.55] text-slate-600"><span className="mt-px shrink-0 font-bold text-primary">•</span><span>{line}</span></li>)}</ul>;
}

export function CvPreview() {
  const { cvData } = useCvStore();
  const { personalInfo: personal, experiences, educations, skills, projects, certifications, languages } = cvData;
  const contacts = [
    [personal.email, AtSign, "Email"], [personal.phone, Phone, "Điện thoại"], [personal.location, MapPin, "Địa điểm"],
    [personal.linkedin, LinkIcon, "LinkedIn"], [personal.github, LinkIcon, "GitHub"], [personal.website, Globe, "Website"],
  ] as const;

  return <div className="flex h-full justify-center overflow-auto bg-surface-container p-3 md:p-6 print:bg-white print:p-0">
    <article id="cv-print-preview" className="grid min-h-[297mm] w-[210mm] max-w-full grid-cols-[32%_68%] overflow-hidden bg-white text-slate-950 shadow-xl print:min-h-[297mm] print:w-full print:max-w-none print:shadow-none">
      <aside aria-label="Thông tin bổ trợ trong CV" className="bg-primary px-5 py-8 text-blue-50 md:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-2xl font-black text-white">
          {(personal.fullName || "CV").split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase()}
        </div>

        <div className="mt-7 space-y-6">
          <SideSection title="Liên hệ"><address className="space-y-2.5 not-italic">{contacts.filter(([value]) => value).map(([value, Icon, label]) => <p key={label} className="flex min-w-0 items-start gap-2 text-[9px] leading-4 text-blue-100"><Icon className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" /><span className="break-all">{value}</span></p>)}</address></SideSection>

          {skills.length ? <SideSection title="Kỹ năng"><div className="space-y-2.5">{skills.map((item) => <div key={item.id}><p className="text-[9px] font-bold uppercase tracking-wide text-blue-200">{item.category || "Chuyên môn"}</p><p className="mt-0.5 text-[10px] leading-4 text-white">{item.name}</p>{item.level ? <div className="mt-1 flex gap-1" aria-label={`Mức kỹ năng ${item.level} trên 5`}>{Array.from({ length: 5 }, (_, index) => <span key={index} className={`h-1 flex-1 rounded-full ${index < item.level! ? "bg-white" : "bg-white/25"}`} />)}</div> : null}</div>)}</div></SideSection> : null}

          {educations.length ? <SideSection title="Học vấn"><div className="space-y-3">{educations.map((item) => <div key={item.id} className="break-inside-avoid"><p className="text-[10px] font-bold leading-4 text-white">{item.institution}</p><p className="mt-0.5 text-[9px] leading-4 text-blue-100">{[item.degree, item.field].filter(Boolean).join(" · ")}</p><p className="mt-0.5 text-[8.5px] text-blue-200">{period(item.startDate, item.endDate)}</p></div>)}</div></SideSection> : null}

          {languages.length ? <SideSection title="Ngoại ngữ"><div className="space-y-2">{languages.map((item) => <p key={item.id} className="text-[9px] leading-4"><strong className="text-white">{item.name}</strong>{item.proficiency ? <span className="block text-blue-200">{item.proficiency}</span> : null}</p>)}</div></SideSection> : null}

          {certifications.length ? <SideSection title="Chứng chỉ"><div className="space-y-2.5">{certifications.map((item) => <div key={item.id} className="break-inside-avoid"><p className="text-[9px] font-bold leading-4 text-white">{item.name}</p><p className="text-[8.5px] leading-4 text-blue-200">{[item.issuer, item.issueDate].filter(Boolean).join(" · ")}</p></div>)}</div></SideSection> : null}
        </div>
      </aside>

      <div className="px-7 py-9 md:px-9">
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-[28px] font-black uppercase leading-tight tracking-tight text-slate-950">{personal.fullName || "Họ và tên"}</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-primary">{personal.title || "Chức danh chuyên môn"}</p>
        </header>

        <div className="mt-6 space-y-6">
          {personal.summary ? <MainSection title="Giới thiệu bản thân"><p className="whitespace-pre-line text-[10.5px] leading-[1.7] text-slate-600">{personal.summary}</p></MainSection> : null}

          {experiences.length ? <MainSection title="Kinh nghiệm làm việc"><div className="space-y-5">{experiences.map((item) => <div key={item.id} className="break-inside-avoid"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-[12px] font-extrabold">{item.role || "Chức vụ"}</h3><p className="mt-0.5 text-[10.5px] font-bold text-primary">{item.company || "Công ty"}</p></div><div className="shrink-0 text-right text-[8.5px] leading-4 text-slate-400"><p>{period(item.startDate, item.endDate, item.isCurrent)}</p>{item.location ? <p>{item.location}</p> : null}</div></div><Description value={item.description} /></div>)}</div></MainSection> : null}

          {projects.length ? <MainSection title="Dự án nổi bật"><div className="space-y-4">{projects.map((item) => <div key={item.id} className="break-inside-avoid"><div className="flex items-start justify-between gap-3"><div><h3 className="text-[12px] font-extrabold">{item.name || "Tên dự án"}</h3>{item.role ? <p className="text-[10px] font-bold text-primary">{item.role}</p> : null}</div>{item.url ? <span className="max-w-[42%] break-all text-right text-[8.5px] text-slate-400">{item.url}</span> : null}</div>{item.technologies ? <p className="mt-1 text-[9px] font-semibold text-slate-500">Công nghệ: {item.technologies}</p> : null}<Description value={item.description} /></div>)}</div></MainSection> : null}
        </div>
      </div>
    </article>
  </div>;
}
