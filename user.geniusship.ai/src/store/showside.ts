import { create } from 'zustand';

interface SidebarStore {
  isVisible: boolean;
  showSidebar: () => void;
  hideSidebar: () => void;
  toggleSidebar: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  isVisible: true,
  showSidebar: () => set({ isVisible: true }),
  hideSidebar: () => set({ isVisible: false }),
  toggleSidebar: () => set((state) => ({ isVisible: !state.isVisible })),
}));

export default useSidebarStore;