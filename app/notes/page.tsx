'use client'
import dynamic from 'next/dynamic'

const R3FNote = dynamic(() => import('@/components/canvas/Note').then((mod) => mod.R3FNote), { ssr: false });

export default function Page() {
  const sourceCode = `
  import { Canvas } from '@react-three/fiber'
  import { OrbitControls } from '@react-three/drei'

  export default function Page() {
    return (
      <Canvas>
        <OrbitControls />
        <mesh>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color='hotpink' />
        </mesh>
      </Canvas>
    )
  }
  `
  return (
    // @ts-ignore
    <R3FNote sourceCode={sourceCode} orbit>
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='hotpink' />
      </mesh>
    </R3FNote>
  )
}