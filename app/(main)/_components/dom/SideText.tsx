"use client";
import { Typography } from "@/components/commons/Typography";
import { SkillText } from "./SkillText";

export const SideText = () => {

  return (
    <>
      <div className="flex h-3/5 items-center justify-center">
        <div className="vertical-rl">
          <Typography variant="h1" className={"pt-8"}>
            <span className={"horizontal-tb"}>
              IT
            </span>
            エンジニア
          </Typography>
          <Typography variant="h1">
            かなざわ在み
          </Typography>
        </div>
      </div>
      <SkillText />
    </>
  )
}