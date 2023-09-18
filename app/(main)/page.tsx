"use client";
import { Home } from "./_components/Home";
import { Typography } from "@/components/commons/Typography";
import { SeasonSelect } from "./_components/SeasonSelect";
import { SkillText } from "./_components/dom/SkillText";
import { Suspense } from "react";
import { LoadingJP } from "./_components/dom/LoadingJP";

export default function Page() {

  return (
    <Suspense fallback={<LoadingJP/>}>
      <div
        className="absolute top-0 w-full"
        style={
          {
            height: '100%',
          }
        }
      >
        <div className="flex h-screen w-full md:w-1/2 lg:w-2/3">
          <SeasonSelect />
          <Suspense fallback={<LoadingJP />}>
            <Home />
          </Suspense>
        </div>
        <div className={"absolute right-0 top-0 z-10 hidden h-screen bg-red-500 md:block md:w-1/2 lg:w-1/3"}>
          <div className="h-full w-full divide-dotted">
            <div className="flex h-2/3 items-center justify-center">
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
          </div>
        </div>
      </div>
    </Suspense>
  )
}
