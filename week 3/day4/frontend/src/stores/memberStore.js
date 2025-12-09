import { create } from 'zustand';

export const useMemberStore = create((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  updateMember: (id, updated) => set((state) => ({
    members: state.members.map((m) => (m._id === id ? { ...m, ...updated } : m)),
  })),
  deleteMember: (id) => set((state) => ({
    members: state.members.filter((m) => m._id !== id),
  })),
}));
