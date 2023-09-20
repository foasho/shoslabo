"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, animate, MotionConfig } from "framer-motion";
import { gsap } from "gsap";
import { useTimeManager } from "../../_providers/TimeManeger";
import { Typography } from "@/components/commons/Typography";

export const MobileText = () => {

  const { start } = useTimeManager();

  return (
    <>
      {start &&
        <>
          <motion.div
            key={'kumo'}
            initial={{ opacity: 0 }} // 初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
            transition={{ duration: 3 }} // アニメーションの仕方
          >
            <div className="fixed -right-24 -top-24 z-10 block md:hidden">
              <Image
                src={"/img/kumo.png"}
                alt="Picture"
                height={320}
                width={320}
              />
            </div>
            <div className="fixed -bottom-96 -left-24 z-10 block md:hidden">
              <Image
                src={"/img/kumo.png"}
                alt="Picture"
                height={480}
                width={640}
              />
            </div>
          </motion.div>
          <Typography variant="h1" className="fixed left-0 top-24 z-20 block w-full select-none pl-24 sm:pl-48 md:hidden">
            <span className="text-[#E6B422]">
              金沢に住む
            </span>
          </Typography>
          <Typography variant="h1" className="fixed left-0 top-36 z-20 block w-full select-none pl-32 sm:text-center md:hidden">
            <motion.span
              key={'it-text'}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-[#E6B422]">
                ITエンジニア
              </span>
              <span className="text-[16px] text-[#E6B422]">
                です。
              </span>
            </motion.span>
          </Typography>
        </>
      }
    </>
  );
};