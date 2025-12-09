import { create } from 'zustand';

export const useProjectStore = create((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updated) => set((state) => ({
    projects: state.projects.map((p) => (p._id === id ? { ...p, ...updated } : p)),
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p._id !== id),
  })),
}));
