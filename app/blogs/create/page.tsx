import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ClientOnly from "@/client-only";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

const Page = () => {
  return (
    <div className="w-full h-full bg-slate-200">
      {/** @ts-ignore */}
      <Editor />
    </div>
  )
}

export default Page;