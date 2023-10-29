"use client";
import { Loading2D } from "@/components/commons/Loading2D";
import dynamic from "next/dynamic";

const HomeScene = dynamic(() => import("./canvas/HomeScene").then((mod) => mod.HomeScene), {
  ssr: false,
  loading: () => (
    <div className='h-full w-full bg-[#BA2636]'>
      <Loading2D />
    </div>
  ),
}) as any;

export const Home = () => {
  return (
    <>
      <HomeScene />
    </>
  );
};
