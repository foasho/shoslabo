import React from "react";
import dynamic from "next/dynamic";
import { Loading2D } from "@/components/commons/Loading2D";


const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
  loading: () => <Loading2D />,
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