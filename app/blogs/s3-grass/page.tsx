'use client'
import { OrthographicCamera } from '@react-three/drei';
import dynamic from 'next/dynamic'
const R3FNote = dynamic(() => import('@/components/canvas/Note').then((mod) => mod.R3FNote), { ssr: false });
const Grass = dynamic(() => import('@/components/canvas/notes/S3-Grass').then((mod) => mod.MyScene), { ssr: false });

export default function Page() {
  return (
    // @ts-ignore
    <R3FNote sourceCode={SourceCode} debug orbit={false} position={[10, 10, 10]}>
      {/** @ts-ignore */}
      <Grass />
    </R3FNote>
  )
}

const SourceCode = `
import { useRef, useState } from 'react';
`;