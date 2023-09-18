import { atom } from "recoil";

export const hoveredStateAtom = atom({
  key: "hoveredState",
  default: null as string | null,
});