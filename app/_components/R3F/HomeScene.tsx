"use client"
import { Center, useAnimations, useFBX } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { Group } from 'three';


const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
});

const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), {
  ssr: false,
});

export const HomeScene = () => {
  return (
    <View className={"h-full w-full"} orbit>
      <Common color='#6592C6' />
      <Center>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" color="hotpink" />
        </mesh>
        <Avatar />
      </Center>
    </View>
  )
};

const Avatar = () => {
  const grp = useRef<Group>(null);

  const fbx = useFBX('/models/avatar/TPose.fbx');
  const { animations: typingAnimation } = useFBX('/models/avatar/Typing.fbx');
  typingAnimation[0].name = 'Typing';
  const { actions } = useAnimations(typingAnimation, fbx);

  useEffect(() => {
    if (actions["Typing"]) {
      actions["Typing"].play();
    }
  }, []);


  return (
    <group scale={0.01} rotation={[0, -Math.PI / 4, 0]}>
      <primitive object={fbx} />
    </group>
  )
}
