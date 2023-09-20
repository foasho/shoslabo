import { atom } from "recoil";

export const modeStateAtom = atom<"normal"|"walk">({
  key: "modeState",
  default: "normal",
});