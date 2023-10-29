"use client";
import { motion } from "framer-motion";
import { Typography } from "@/components/commons/Typography";

export const MobileText = () => {
  return (
    <>
      <Typography variant='h1' className='fixed left-0 top-24 z-20 block w-full select-none pl-24 sm:pl-48 md:hidden'>
        <span className='text-[#E6B422]'>金沢に住む</span>
      </Typography>
      <Typography
        variant='h1'
        className='fixed left-0 top-36 z-20 block w-full select-none pl-32 sm:text-center md:hidden'
      >
        <motion.span key={"it-text"} whileHover={{ scale: 1.4 }} whileTap={{ scale: 0.9 }}>
          <span className='text-[#E6B422]'>ITエンジニア</span>
          <span className='text-[16px] text-[#E6B422]'>です。</span>
        </motion.span>
      </Typography>
    </>
  );
};
