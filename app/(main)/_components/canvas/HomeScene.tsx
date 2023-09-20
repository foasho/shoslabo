"use client"
import { Center, useAnimations, useFBX, useGLTF, Outlines, Environment, Lightformer, Cloud, MeshReflectorMaterial, OrbitControls, Sky, PerspectiveCamera, useCursor, Html } from '@react-three/drei';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Bloom, DepthOfField, EffectComposer, N8AO, Noise, TiltShift2 } from '@react-three/postprocessing';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import { DoubleSide, Euler, Group, Vector3 } from 'three';
import { easing, geometry } from "maath"
import { hoveredStateAtom } from '../../_atoms/hovered';
import { modeStateAtom } from '../../_atoms/scene';
import { Kenrokuen } from './Kenrokuen';
import { useRecoilState } from 'recoil';
import { useTimeManager } from '../../_providers/TimeManeger';
extend(geometry);

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


export const HomeScene = () => {

  const [mode, setMode] = useRecoilState(modeStateAtom);

  return (
    // @ts-ignore
    <View className={"h-full w-full"}>
      <Center>
        <group rotation={[0, -Math.PI / 4, 0]}>
          {mode === "walk" &&
            <Avatar />
          }
          <Room />
          <CircleClock />
          <Floor />
        </group>
      </Center>
      {/* <Kenrokuen/> */}
      <group
        position={[0, 5, -10]}
      >
        {/* <Cloud 
          opacity={0.8}
          speed={0.4} // Rotation speed
          width={10} // Width of the full cloud
          depth={1} // Z-dir depth
          segments={5} // Number of particles
        /> */}
      </group>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 3]} intensity={50} color={"#ffffe0"} castShadow />
      <pointLight position={[-3, 5, -3]} intensity={50} color={0xff0054} castShadow />
      <Effects />
      {/* <OrbitControls/> */}
      <color attach="background" args={['#1C1C1A']} />
    </View>
  )
};

const Effects = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const { readyStart } = useTimeManager();

  useEffect(() => {
    // 時間を開始
    if (ready) {
      readyStart();
    }
  }, [ready]);

  return (
    <>
      {ready && (
        <>
          <EffectComposer>
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={1.2} height={480} />
          </EffectComposer>
          {/* <Sky /> */}
          {/* <Environment preset="studio" frames={Infinity} blur={0.8} background >
          </Environment> */}
          {/* <fog attach="fog" args={['#ffffff', 0.1, 100]} /> */}
          <Rig />
        </>
      )}
    </>
  )
}

const Rig = () => {
  const { camera } = useThree();
  const { x, y, z } = camera.position;
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [Math.sin(-state.pointer.x) + x, Math.sin(state.pointer.y) + y, z],
      0.2,
      delta,
    )
    state.camera.lookAt(0, 0, 0)
  });
  return <></>
}

const Avatar = () => {
  const ref = useRef<Group>(null);
  const fbx = useFBX('/models/avatar/TPose.fbx');
  const { animations: typingAnimation } = useFBX('/models/avatar/Typing.fbx');
  const { animations: walkingAnimation } = useFBX('/models/avatar/Walking.fbx');
  const { animations: idleAnimation } = useFBX('/models/avatar/Idle.fbx');
  const { animations: runningAnimation } = useFBX('/models/avatar/Running.fbx');
  const { animations: jumpingAnimation } = useFBX('/models/avatar/Jumping.fbx');
  const { animations: kickAnimation } = useFBX('/models/avatar/Kick.fbx');
  typingAnimation[0].name = 'Typing';
  const { actions } = useAnimations(typingAnimation, fbx);

  useEffect(() => {
    if (actions["Typing"]) {
      actions["Typing"].play();
    }
    if (fbx) {
      // castShadowを有効にする
      fbx.traverse((child) => {
        // @ts-ignore
        child.castShadow = true;
      });
    }
  });

  return (
    <group
      ref={ref}
      position={[0.17, -1.45, 0]}
      scale={0.01}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <primitive object={fbx} castShadow />
    </group>
  )
}

/**
 * Room
 */
const Room = () => {
  const ref = useRef<Group>(null);
  const hoverColor = "#E6B422";
  const [hovered, setHovered] = useRecoilState(hoveredStateAtom);
  // @ts-ignore
  const { nodes, materials } = useGLTF('/shosroom.glb');

  useCursor(hovered ? true : false);

  /**
   * GSAPでTargetまでカメラを移動させる
   */
  const moveToTarget = (targetPos: Vector3, targetRot: Euler) => {
    // TODO: カメラの位置を取得する
  }

  return (
    <group scale={1.5} dispose={null}>
      {/** ロボット */}
      {hovered === "robot" &&
        <Annotation position={[0.717, -0.704, 0.693]} rotation={[0, Math.PI / 4, 0]} scale={0.2}>
          個人開発
        </Annotation>
      }
      <group
        ref={ref}
        position={[0.717, -0.904, 0.693]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={1.701}
        onPointerOver={
          (e) => {
            setHovered("robot");
          }}
        onPointerOut={
          (e) => {
            setHovered(null);
          }}
      >
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group position={[0, 0.81, 0]}>
            <mesh geometry={nodes.pCube1_Corps_0.geometry} material={materials.Corps} >
              <Outlines
                color={hoverColor}
                screenspace={false}
                opacity={hovered === "robot" ? 1 : 0}
                transparent={true}
                thickness={0.3}
                angle={Math.PI}
              />
            </mesh>
            <mesh geometry={nodes.pCube1_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group position={[0, 0.81, 0]} rotation={[-Math.PI, 0, 0]} scale={-1}>
            <mesh geometry={nodes.pCube10_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube10_lambert1_0.geometry} material={materials.lambert1} />
            <mesh geometry={nodes.pCube10_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group position={[0, 0.81, 0]}>
            <mesh geometry={nodes.pCube12_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube12_lambert1_0.geometry} material={materials.lambert1} />
            <mesh geometry={nodes.pCube12_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group position={[0, 0.81, 0]} rotation={[-Math.PI, 0, 0]} scale={-1}>
            <mesh geometry={nodes.pCube13_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube13_lambert1_0.geometry} material={materials.lambert1} />
            <mesh geometry={nodes.pCube13_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group position={[0, 0.81, 0]}>
            <mesh geometry={nodes.pCube5_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube5_lambert1_0.geometry} material={materials.lambert1} />
            <mesh geometry={nodes.pCube5_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group rotation={[-Math.PI, 0, 0]} scale={-1}>
            <mesh geometry={nodes.pCube6_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube6_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group position={[0, 0.81, 0]}>
            <mesh geometry={nodes.pCube8_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube8_lambert1_0.geometry} material={materials.lambert1} />
            <mesh geometry={nodes.pCube8_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <group position={[0, 0.81, 0]} rotation={[-Math.PI, 0, 0]} scale={-1}>
            <mesh geometry={nodes.pCube9_Corps_0.geometry} material={materials.Corps} />
            <mesh geometry={nodes.pCube9_lambert1_0.geometry} material={materials.lambert1} />
            <mesh geometry={nodes.pCube9_lumirere_0.geometry} material={materials.lumirere} />
          </group>
          <mesh geometry={nodes.pCube11_Corps_0.geometry} material={materials.Corps} />
          <mesh geometry={nodes.pCube11_lumirere_0.geometry} material={materials.lumirere} />
          <mesh geometry={nodes.pCube2_Corps_0.geometry} material={materials['Corps.001']} position={[0, 0.81, 0]} />
          <mesh geometry={nodes.pCylinder1_Inox_0.geometry} material={materials.Inox} position={[0, 0.81, 0]} />
          <mesh geometry={nodes.pPlane1_ecrran_0.geometry} material={materials.ecrran} position={[0, 0.81, 0]} />
          <mesh geometry={nodes.pSphere2_Corps_0.geometry} material={materials.Corps} position={[0, 0.81, 0]} />
        </group>
      </group>

      {/** マウス */}
      <group position={[-0.316, -0.478, -0.19]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={0.689}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <mesh geometry={nodes.BOTON_CENTRAL_MAT_Plastic_0.geometry} material={materials.MAT_Plastic} castShadow />
          <mesh geometry={nodes.polySurface2_MAT_Emission_0.geometry} material={materials.MAT_Emission} />
          <mesh geometry={nodes.polySurface4_MAT_Details_0.geometry} material={materials.MAT_Details} />
          <mesh geometry={nodes.polySurface5_MAT_Plastic_0.geometry} material={materials.MAT_Plastic} />
        </group>
      </group>

      {/** 観葉植物の葉っぱ */}
      <group position={[-0.691, -0.735, 0.694]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001}>
        <group scale={42.327}>
          <mesh geometry={nodes.stem__0.geometry} material={materials['Scene_-_Root']} position={[0, -0.359, 0.299]} castShadow />
        </group>
      </group>
      <mesh geometry={nodes.土.geometry} material={materials.マテリアル} position={[-0.684, -0.748, 0.71]} scale={[-0.164, -0.13, -0.164]} />
      <mesh geometry={nodes.植木鉢.geometry} material={materials['Black rubber']} position={[-0.684, -0.813, 0.71]} scale={[-0.164, -0.13, -0.164]} castShadow />

      {/** 床 */}
      <mesh geometry={nodes.床.geometry} material={materials.グレー床} receiveShadow />

      <mesh geometry={nodes.天板.geometry} material={materials.グレー} position={[-0.35, -0.479, 0.032]} receiveShadow castShadow />
      <mesh geometry={nodes.椅子の足.geometry} material={materials['Black rubber']} position={[-0.35, -0.479, 0.032]} />
      <mesh geometry={nodes.くるくる.geometry} material={materials['Black rubber']} position={[-0.512, -0.929, 0.355]} scale={0.023} />
      <mesh geometry={nodes.時計.geometry} material={materials.Blackリニア} position={[-0.993, 0.587, 0.542]} rotation={[0, 0, -Math.PI / 2]} scale={[-0.226, -0.017, -0.227]} />
      <mesh geometry={nodes.部屋001.geometry} material={materials['マテリアル.007']} position={[0.001, 0, 0.001]} />

      {/** Canvas */}
      <mesh geometry={nodes.中心.geometry} material={materials.木目} position={[0.73, -0.591, -0.597]} rotation={[-0.241, -0.359, -0.086]} scale={[1, 1, 0.326]} />
      <mesh geometry={nodes.左右.geometry} material={materials.木目} position={[0.592, -0.591, -0.65]} rotation={[-0.237, -0.333, -0.197]} scale={[1, 1, 0.326]} />
      <mesh geometry={nodes.支え.geometry} material={materials.木目} position={[0.716, -0.675, -0.562]} rotation={[-0.16, -0.366, 1.513]} scale={[1, 0.652, 0.326]} />
      <mesh geometry={nodes.後ろ支え.geometry} material={materials.木目} position={[0.768, -0.72, -0.695]} rotation={[0.355, -0.445, 0.123]} scale={[0.999, 0.643, 0.315]} />
      {hovered === "canvas" &&
        <Annotation position={[0.750, -0.30, -0.606]} scale={0.25}>
          趣味や作品
        </Annotation>
      }
      <mesh
        geometry={nodes.キャンバス.geometry}
        material={materials['04___Default']}
        position={[0.739, -0.502, -0.606]}
        rotation={[1.381, -0.076, 0.385]}
        scale={[0.247, 0.15, 0.15]}
        onPointerOver={
          (e) => {
            setHovered("canvas");
          }}
        onPointerOut={
          (e) => {
            setHovered(null);
          }}
      >
        <Outlines
          color={hoverColor}
          screenspace={false}
          opacity={hovered === "canvas" ? 1 : 0}
          transparent={true}
          thickness={0.08}
          angle={Math.PI}
        />
      </mesh>
      <mesh geometry={nodes.椅子マット.geometry} material={materials.椅子緑} position={[0.6, -0.731, -0.265]} rotation={[0, -0.395, 0]} scale={[0.115, 0.03, 0.115]} />
      <mesh geometry={nodes.椅子足001.geometry} material={materials.木目} position={[0.645, -0.842, -0.154]} rotation={[0, -0.395, 0]} scale={[0.024, 0.106, 0.025]} />

      {/** モニター */}
      {hovered === "monitor" &&
        <Annotation position={[-0.5, -0.05, 0.032]} rotation={[0, Math.PI / 3, 0]} scale={0.25}>
          制作実績
        </Annotation>
      }
      <mesh
        geometry={nodes.モニター.geometry}
        material={materials.MAT_Plastic}
        position={[-0.277, -0.25, 0.032]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        onPointerOver={
          (e) => {
            setHovered("monitor");
          }}
        onPointerOut={
          (e) => {
            setHovered(null);
          }}
      >
        <Outlines
          color={hoverColor}
          screenspace={false}
          opacity={hovered === "monitor" ? 1 : 0}
          transparent={true}
          thickness={0.02}
          angle={Math.PI}
        />
      </mesh>

      <mesh
        geometry={nodes.アーム1.geometry}
        material={materials['Black rubber']}
        position={[-0.555, -0.284, 0.032]}
        scale={0.019}
      >
      </mesh>
      <mesh geometry={nodes.アーム2.geometry} material={materials['Black rubber']} position={[-0.555, -0.322, 0.032]} rotation={[0, -0.036, 0]} scale={0.019} />
      <mesh geometry={nodes.アーム3.geometry} material={materials['Black rubber']} position={[-0.594, -0.322, 0.323]} scale={0.019} />
      <mesh geometry={nodes.マウス置き.geometry} material={materials['Black rubber']} position={[-0.316, -0.479, -0.191]} rotation={[0, -1.571, 0]} scale={[-0.074, -0.093, -0.085]} />
      {/** 椅子 */}
      <group position={[0.09, -0.686, 0.019]} scale={1.15}>
        <mesh geometry={nodes.円柱005.geometry} material={materials.グレー} castShadow />
        <mesh geometry={nodes.円柱005_1.geometry} material={materials.Blackリニア} castShadow />
      </group>
      <mesh geometry={nodes.椅子足.geometry} material={materials.Blackリニア} position={[0.089, -0.873, 0.122]} rotation={[-0.891, 0, 0]} scale={1.15} castShadow />
      <mesh geometry={nodes.椅子足2.geometry} material={materials.Blackリニア} position={[-0.008, -0.873, 0.021]} rotation={[-Math.PI / 2, -0.68, -Math.PI / 2]} scale={1.15} castShadow />

      <mesh geometry={nodes.Keycaps.geometry} material={materials['Keycap material']} position={[-0.399, -0.492, -0.001]} rotation={[0, 1.571, 0]} scale={0.078} />
      <mesh geometry={nodes.Case.geometry} material={materials['Black rubber']} position={[-0.399, -0.492, -0.001]} rotation={[0, 1.571, 0]} scale={0.078} />

      {/** 部屋 */}
      <mesh geometry={nodes.Cube.geometry} material={materials.部屋ベース} castShadow />

      <mesh geometry={nodes.Cube_1.geometry} material={materials.窓} />

      {/** 木壁素材 */}
      <mesh geometry={nodes.板.geometry} material={materials.木目} position={[-0.967, -0.337, 0]} receiveShadow />
      <mesh geometry={nodes.平面.geometry} material={materials['Black rubber']} position={[-0.992, -0.346, 0.529]} rotation={[0, 0, -Math.PI / 2]} scale={[0.615, 0.615, 0.404]} />
    </group >
  )
}

type AnnotationProps = {
  position: [number, number, number] | Vector3;
  rotation?: [number, number, number] | Euler;
  scale?: [number, number, number] | number | Vector3;
  children: React.ReactNode;
};
const Annotation = (
  {
    position,
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    children
  }: AnnotationProps
) => {

  let args = [1.66, 0.47, 0.24];
  if (typeof scale === "number") {
    args.map((v, i) => {
      args[i] = v * scale;
    });
  }
  if (Array.isArray(scale)) {
    args.map((v, i) => {
      args[i] = v * scale[i];
    });
  }

  return (
    <Html
      position={position}
      rotation={rotation}
      scale={scale}
      transform
      occlude="blending"
      geometry={
        // @ts-ignore
        <roundedPlaneGeometry args={args} />
      }
    >
      <div className="flex cursor-pointer select-none items-center justify-center space-x-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-1 px-2 text-xs font-light tracking-wider text-white shadow-inner transition-all duration-200 ease-in-out focus:outline-none"
      >
        {children}
      </div>
    </Html>
  )
}

/**
 * 丸い時計
 */
const CircleClock = () => {

  return (
    <group position={[-1.47, 0.88, 0.815]} rotation={[0, Math.PI / 2, 0]}>
      <mesh scale={0.3}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color={"#fff00f"} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

const Floor = () => {
  return (
    <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial mirror={1} color={0xffffff} opacity={0.75} />
    </mesh>
  )
}


/**
 * LightFormers
 */
function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => (group.current) && (group.current.position.z += delta * 10) > 20 && (group.current.position.z = -60))
  return (
    <>
      {/* Ceiling */}
      <Lightformer intensity={0.75} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer key={i} form="circle" intensity={2} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[3, 1, 1]} />
          ))}
        </group>
      </group>
    </>
  )
}