"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Typography } from "@/components/commons/Typography";
import { useTimeManager } from '@/(main)/_providers/TimeManeger';
import Link from 'next/link';
import {
  BsArrowLeft
} from "react-icons/bs";

export const SkillText = () => {

  const { start } = useTimeManager();
  const [view, setView] = useState<"skill" | "design" | "sns" | null>(null);

  return (
    <>
      <div className="relative h-2/5 select-none space-y-3 p-8 lg:px-16">
        {start && view === null &&
          <motion.div
            key={'skill-text'}
            initial={{ opacity: 0 }} // 初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
            transition={{ duration: 3 }} // アニメーションの仕方
          >
            <motion.div
              key={'product-works'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h4" className="block cursor-pointer">
                <Link href="/works">
                  - 制作 / 仕事実績
                </Link>
              </Typography>
            </motion.div>
            <motion.div
              key={'skillset'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h4" className="block cursor-pointer">
                <span onClick={() => setView("skill")}>
                  - プログラミング
                </span>
              </Typography>
            </motion.div>
            <motion.div
              key={'skilldesign'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h4" className="block cursor-pointer">
                <span onClick={() => setView("design")}>
                  - デザイン
                </span>
              </Typography>
            </motion.div>
            <motion.div
              key={'skill-sns'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h4" className="block cursor-pointer">
                <span onClick={() => setView("sns")}>
                  -
                  <span className="pl-5">
                    SNS
                  </span>
                </span>
              </Typography>
            </motion.div>
            <motion.div
              key={'skill-contact'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography variant="h4" className="block cursor-pointer">
                <Link href="/contact">
                  - お問い合わせ
                </Link>
              </Typography>
            </motion.div>
          </motion.div>
        }
        {view !== null &&
          <div>
            <Typography variant="h4" className="block cursor-pointer">
              <span onClick={() => setView(null)}>
                <BsArrowLeft className="inline-block" />
                戻る
              </span>
            </Typography>
          </div>
        }
        {view === "sns" &&
          <>
            <motion.ul
              key={'skill-list'}
              initial={{ opacity: 0 }} //　初期状態
              animate={{ opacity: 1 }} // マウント時
              exit={{ opacity: 0 }} // アンマウント時
              transition={{ duration: 3 }} // アニメーションの仕方
              className={"grid grid-cols-2 gap-2"}
            >
              <motion.li
                key={'lang-github'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  <Link href="https://github.com/foasho" target="_blank">
                    Github
                  </Link>
                </Typography>
              </motion.li>
              <motion.li
                key={'lang-twitter'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  <Link href="https://twitter.com/sakanosho" target="_blank">
                    Twitter
                  </Link>
                </Typography>
              </motion.li>
              <motion.li
                key={'lang-qiita'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  <Link href="https://qiita.com/osakasho" target="_blank">
                    Qiita
                  </Link>
                </Typography>
              </motion.li>
              <motion.li
                key={'lang-zenn'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  <Link href="https://zenn.dev/solb" target="_blank">
                    Zenn
                  </Link>
                </Typography>
              </motion.li>
            </motion.ul>
          </>
        }
        {view === "design" &&
          <>
            <motion.ul
              key={'design-list'}
              initial={{ opacity: 0 }} //　初期状態
              animate={{ opacity: 1 }} // マウント時
              exit={{ opacity: 0 }} // アンマウント時
              transition={{ duration: 3 }} // アニメーションの仕方
            >
              <motion.li
                key={'design-figma'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  - Figma
                </Typography>
              </motion.li>
              <motion.li
                key={'design-blender'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  - Blender
                </Typography>
              </motion.li>
              <motion.li
                key={'design-painter'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  - Painter
                </Typography>
              </motion.li>
            </motion.ul>
          </>
        }
        {view === "skill" &&
          <>
            <Typography variant="h4" className="block cursor-pointer">
              プログラミング言語
            </Typography>
            <motion.ul
              key={'skill-list'}
              initial={{ opacity: 0 }} //　初期状態
              animate={{ opacity: 1 }} // マウント時
              exit={{ opacity: 0 }} // アンマウント時
              transition={{ duration: 3 }} // アニメーションの仕方
              className={"grid grid-cols-2 gap-2"}
            >
              <motion.li
                key={'skill-list-js'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  JavaScript
                </Typography>
              </motion.li>
              <motion.li
                key={'skill-list-ts'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  TypeScript
                </Typography>
              </motion.li>
              <motion.li
                key={'skill-list-python'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  Python
                </Typography>
              </motion.li>
              <motion.li
                key={'skill-list-php'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  PHP
                </Typography>
              </motion.li>
              <motion.li
                key={'skill-list-c'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  C++
                </Typography>
              </motion.li>
              <motion.li
                key={'skill-list-cs'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Typography variant="h4" className="block cursor-pointer">
                  Golang
                </Typography>
              </motion.li>

            </motion.ul>
          </>
        }
        <div className="absolute">
          <Image
            src="/img/yagasuri.png"
            alt="Yagasuri"
            fill
          />
        </div>
      </div>
    </>
  )
}