import React from 'react';
import { useFrame } from "@react-three/fiber";
import { Group } from 'three';

type BVHPhysicsProps = {
  grgRef: React.MutableRefObject<Group>;
}
export const BVHPhysics = (
  { grgRef }: BVHPhysicsProps
) => {

  useFrame(() => {
    
  });

  return (
    <>
    </>
  )
}