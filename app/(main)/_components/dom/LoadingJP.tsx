"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/commons/Typography';

export const LoadingJP = () => {

  useEffect(() => { }, [])

  return (
    <div className="z-64 fixed flex h-screen w-full items-center justify-center font-bold">
      <Typography variant="h1">
        ローディング中
      </Typography>
    </div>
  )
}