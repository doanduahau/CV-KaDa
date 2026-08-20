import { create } from "zustand";
import type { CvData } from "../schemas/cv.schema";

type LegacyCvData = Partial<CvData> & { education?: CvData["educations"] };
type CollectionKey = "experiences" | "educations" | "skills" | "projects" | "certifications" | "languages";

interface CvStoreState {
  cvData: CvData;
  isDirty: boolean;
  setCvData: (data: LegacyCvData) => void;
  updatePersonalInfo: (data: Partial<CvData["personalInfo"]>) => void;
  addItem: (key: CollectionKey, item: { id: string }) => void;
  updateItem: (key: CollectionKey, id: string, data: Record<string, unknown>) => void;
  removeItem: (key: CollectionKey, id: string) => void;
  resetDirty: () => void;
}

export const defaultCvData: CvData = {
  personalInfo: { fullName: "", title: "", email: "", phone: "", location: "", summary: "", linkedin: "", github: "", website: "" },
  experiences: [], educations: [], skills: [], projects: [], certifications: [], languages: [],
};

export function normalizeCvData(data: LegacyCvData): CvData {
  return { personalInfo: { ...defaultCvData.personalInfo, ...(data.personalInfo ?? {}) }, experiences: data.experiences ?? [], educations: data.educations ?? data.education ?? [], skills: data.skills ?? [], projects: data.projects ?? [], certifications: data.certifications ?? [], languages: data.languages ?? [] };
}

export const useCvStore = create<CvStoreState>((set) => ({
  cvData: defaultCvData, isDirty: false,
  setCvData: (data) => set({ cvData: normalizeCvData(data), isDirty: false }),
  updatePersonalInfo: (data) => set((state) => ({ cvData: { ...state.cvData, personalInfo: { ...state.cvData.personalInfo, ...data } }, isDirty: true })),
  addItem: (key, item) => set((state) => ({ cvData: { ...state.cvData, [key]: [...state.cvData[key], item] }, isDirty: true } as Partial<CvStoreState>)),
  updateItem: (key, id, data) => set((state) => ({ cvData: { ...state.cvData, [key]: state.cvData[key].map((item) => item.id === id ? { ...item, ...data } : item) }, isDirty: true } as Partial<CvStoreState>)),
  removeItem: (key, id) => set((state) => ({ cvData: { ...state.cvData, [key]: state.cvData[key].filter((item) => item.id !== id) }, isDirty: true } as Partial<CvStoreState>)),
  resetDirty: () => set({ isDirty: false }),
}));
