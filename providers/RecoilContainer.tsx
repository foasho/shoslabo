import React from "react";
import { RecoilRoot } from "recoil";

export const RecoilContainer = ({ children }: { children: React.ReactNode }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
}