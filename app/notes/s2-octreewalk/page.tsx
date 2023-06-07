'use client'
import dynamic from 'next/dynamic'

const R3FNote = dynamic(() => import('@/components/canvas/Note').then((mod) => mod.R3FNote), { ssr: false });
const PlayerController = dynamic(() => import('@/components/canvas/notes/S1-BVHWalk').then((mod) => mod.MyScene), { ssr: false });
// import SourceCode from '@/components/canvas/notes/S1-BVHWalk.tsx';

export default function Page() {
  return (
    // @ts-ignore
    <R3FNote sourceCode={SourceCode} debug>
      {/** @ts-ignore */}
      <PlayerController />
    </R3FNote>
  )
}

const SourceCode = `
`;