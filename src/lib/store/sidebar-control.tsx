import { create } from "zustand";

type State = {
  isSideBarOpen: boolean;
};

type Action = {
  openSideBar: () => void;
  closeSideBar: () => void;
};

export const useSideBarStore = create<State & Action>((set) => ({
  isSideBarOpen: true,
  openSideBar: () => set({ isSideBarOpen: true }),
  closeSideBar: () => set({ isSideBarOpen: false }),
}));
