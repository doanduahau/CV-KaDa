"use client";

import { AlertCircle, Download, Edit3, Eye, FileText, PanelsTopLeft, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { saveCvAction } from "@/features/cv/actions/save-cv";
import { CvEditor } from "@/features/cv/components/CvEditor";
import { CvPreview } from "@/features/cv/components/CvPreview";
import { evaluateCvCompletion, type CvData } from "@/features/cv/schemas/cv.schema";
import { useCvStore } from "@/features/cv/store/useCvStore";

type ViewMode = "edit" | "split" | "preview";
interface MyCvClientProps { initialResumeId?: string; initialTitle: string; initialData?: Partial<CvData> | null }

export default function MyCvClient({ initialResumeId, initialTitle, initialData }: MyCvClientProps) {
  const { setCvData, cvData, isDirty, resetDirty } = useCvStore();
  const [view, setView] = useState<ViewMode>("split");
  const [isSaving, setIsSaving] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const completion = useMemo(() => evaluateCvCompletion(cvData), [cvData]);

  useEffect(() => { setCvData(initialData ?? {}); }, [initialData, initialResumeId, setCvData]);

  const handleSave = async () => {
    if (!initialResumeId) return setStatus({ type: "error", message: "Không tìm thấy CV để lưu. Vui lòng tạo CV mới." });
    setIsSaving(true); setStatus(null);
    try {
      const result = await saveCvAction(initialResumeId, cvData);
      if (result.success) { resetDirty(); setStatus({ type: "success", message: "Đã lưu CV và tạo phiên bản mới." }); }
      else setStatus({ type: "error", message: result.error ?? "Không thể lưu CV lúc này." });
    } catch { setStatus({ type: "error", message: "Không thể kết nối máy chủ. Vui lòng thử lại sau." }); }
    finally { setIsSaving(false); }
  };

  const handlePrint = () => {
    if (completion.missing.length) { setShowMissing(true); return; }
    window.print();
  };

  const modes = [{ key: "edit", label: "Chỉnh sửa", icon: Edit3 }, { key: "split", label: "Chia đôi", icon: PanelsTopLeft }, { key: "preview", label: "Xem trước", icon: Eye }] as const;
  return <div className="cv-builder flex min-h-[calc(100vh-7rem)] w-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-white shadow-sm">
    <header className="shrink-0 border-b border-outline-variant bg-surface-white p-4 print:hidden">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0"><div className="flex items-center gap-2 font-semibold text-foreground"><FileText className="h-4 w-4 text-primary" /><span className="truncate">{initialTitle}</span></div><div className="mt-2 flex items-center gap-2"><div className="h-2 w-32 overflow-hidden rounded-full bg-surface-container" role="progressbar" aria-label="Mức độ hoàn thiện CV" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion.percentage}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion.percentage}%` }} /></div><span className="text-xs font-medium text-text-muted">Hoàn thiện {completion.percentage}%</span></div></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-surface-low p-1">{modes.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => setView(key)} aria-pressed={view === key} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-primary ${view === key ? "bg-surface-white text-primary shadow-sm" : "text-text-muted hover:text-foreground"}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div>
          <Button variant="outline" onClick={handlePrint}><Download className="mr-2 h-4 w-4" />Xuất PDF</Button>
          <Button onClick={handleSave} disabled={!isDirty || isSaving} isLoading={isSaving}><Save className="mr-2 h-4 w-4" />{isSaving ? "Đang lưu..." : "Lưu CV"}</Button>
        </div>
      </div>
      {isDirty ? <p className="mt-2 text-xs font-medium text-text-muted">Có thay đổi chưa lưu</p> : null}
      {status ? <p role={status.type === "error" ? "alert" : "status"} className={`mt-2 text-sm font-medium ${status.type === "error" ? "text-error" : "text-tertiary"}`}>{status.message}</p> : null}
      {showMissing && completion.missing.length ? <div role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-error-container p-3 text-sm text-error"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">Hãy hoàn thiện các mục bắt buộc trước khi xuất PDF:</p><p className="mt-1">{completion.missing.join(", ")}.</p></div></div> : null}
    </header>
    <main className={`grid min-h-0 flex-1 print:block ${view === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
      <div className={`${view === "preview" ? "hidden" : "block"} min-h-[600px] overflow-auto border-outline-variant print:hidden lg:max-h-[calc(100vh-9rem)] ${view === "split" ? "lg:border-r" : "mx-auto w-full max-w-3xl"}`}><CvEditor /></div>
      <div className={`${view === "edit" ? "hidden" : "block"} min-h-[600px] overflow-auto lg:max-h-[calc(100vh-9rem)] print:block print:max-h-none print:overflow-visible`}><CvPreview /></div>
    </main>
  </div>;
}
