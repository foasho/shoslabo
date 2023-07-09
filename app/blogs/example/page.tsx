'use client'
import dynamic from 'next/dynamic'

const R3FNote = dynamic(() => import('@/components/canvas/Note').then((mod) => mod.R3FNote), { ssr: false });

export default function Page() {
  const sourceCode = `
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const MyCanvas = () => {
  return (
    <Canvas>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='hotpink' />
      </mesh>
    </Canvas>
  )
}

const MyDom = () => {
  return (
    <div className='text-xl flex justify-center items-center mt-24'>
      <div
        className='text-xl font-bold bg-gray-500 py-2 px-4 rounded-3xl text-white'
      >
        This is Dom Render
      </div>
    </div>
  )
}

export default function MyComponent() {
  return (
    <>
      <MyCanvas />
      <MyDom />
    </>
  )
}
  `
  return (
    // @ts-ignore
    <R3FNote sourceCode={sourceCode} orbit debug>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='hotpink' />
      </mesh>
      <div className='text-xl flex justify-center items-center mt-24'>
        <div
          className='text-xl font-bold bg-gray-500 py-2 px-4 rounded-3xl text-white'
        >
          This is Dom Render
        </div>
      </div>
    </R3FNote>
  )
}