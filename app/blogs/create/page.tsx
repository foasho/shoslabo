'use client'
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const Page = () => {
  return (
    <div className="container mx-auto">
      {/** @ts-ignore */}
      <Editor />
    </div>
  )
}

export default Page;