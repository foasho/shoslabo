'use client'
import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'

export default function Scene({ ...props }) {
  const [aspect, setAspect] = useState(1);
  useEffect(() => {
    setAspect(window.innerWidth / window.innerHeight);
  }, []);
  return (
    <Canvas 
      {...props} 
      eventPrefix="client" 
      shadows 
      camera={{ 
        position: [
          0, 
          0, 
          aspect >= 1 ? 5 : 10
        ], 
        fov: 52,
        aspect,
      }}
    >
      {/* @ts-ignore */}
      <r3f.Out />
      <Preload all />
    </Canvas>
  )
}
