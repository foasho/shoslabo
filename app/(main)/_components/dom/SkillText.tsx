"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from "@/components/commons/Typography";
import { useTimeManager } from '@/(main)/_providers/TimeManeger';
import Link from 'next/link';

export const SkillText = () => {

  const { start } = useTimeManager();
  const [view, setView] = React.useState<"skill" | "sns" | null>(null);

  return (
    <>
      <div className="h-1/3 select-none space-y-2 p-8">
        {start &&
          <motion.div
            key={'skill-text'}
            initial={{ opacity: 0 }} //　初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
            transition={{ duration: 3 }} // アニメーションの仕方
          >
            <motion.div
              key={'product-works'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h2" className="block cursor-pointer">
                <Link href="/works">
                  - 制作 / 仕事
                </Link>
              </Typography>
            </motion.div>
            <motion.div
              key={'skillset'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h2" className="block cursor-pointer">
                <span onClick={() => setView("sns")}>
                  - スキルセット
                </span>
              </Typography>
            </motion.div>
            <motion.div
              key={'skill-sns'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h2" className="block cursor-pointer">
                <span onClick={() => setView("sns")}>
                  - SNS
                </span>
              </Typography>
            </motion.div>
            <motion.div
              key={'skill-contact'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h2" className="block cursor-pointer">
                <Link href="/contact">
                  - お問い合わせ
                </Link>
              </Typography>
            </motion.div>
          </motion.div>
        }
        {view === "skill" &&
        <>
          <Typography variant="h2" className="block cursor-pointer">
            プログラミング言語
          </Typography>
          <motion.ul
            key={'skill-list'}
            initial={{ opacity: 0 }} //　初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
            transition={{ duration: 3 }} // アニメーションの仕方
          >
            <motion.li
              key={'skill-list-js'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h3" className="block cursor-pointer">
                JavaScript
              </Typography>
            </motion.li>
            <motion.li
              key={'skill-list-ts'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h3" className="block cursor-pointer">
                TypeScript
              </Typography>
            </motion.li>
            <motion.li
              key={'skill-list-python'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h3" className="block cursor-pointer">
                Python
              </Typography>
            </motion.li>
            <motion.li
              key={'skill-list-php'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h3" className="block cursor-pointer">
                PHP
              </Typography>
            </motion.li>
            <motion.li
              key={'skill-list-c'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h3" className="block cursor-pointer">
                C++
              </Typography>
            </motion.li>
            <motion.li
              key={'skill-list-cs'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h3" className="block cursor-pointer">
                Golang
              </Typography>
            </motion.li>
        
          </motion.ul>
        </>
        }
      </div>
    </>
  )
}