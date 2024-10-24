'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { Perf } from 'r3f-perf'

export const Common = (
  { 
    color = "white"
  }
) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={0.75} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color='blue' />
  </Suspense>
)

export const DebugComponent = () => {
  return (
    <>
      <Perf
        position='top-left'
        minimal
      />
    </>
  )
}

export interface IViewProps {
  children?: React.ReactNode;
  orbit?: boolean;
  orbitEnabledZoom?: boolean;
  position ?: [number, number, number];
  debug?: boolean;
  className?: string;
}
const View = forwardRef(
(
  { 
    children, 
    orbit, 
    orbitEnabledZoom = true,
    position,
    debug, 
    ...props
  }: IViewProps
  , 
  ref
) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)
  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        {/** @ts-ignore */}
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls enableZoom={orbitEnabledZoom? true: false} position={position} />}
          {debug && <DebugComponent />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
