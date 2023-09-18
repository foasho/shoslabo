import { atom } from "recoil";

type Season = "spring" | "summer" | "autumn" | "winter";

export const seasonStateAtom = atom({
  key: "seasonState",
  default: "spring" as Season,
});