import { Line, useCursor, useGLTF, useScroll } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { RxDoubleArrowDown } from "react-icons/rx";
import { EllipseCurve, Group, Mesh } from "three";
import { Loading3D } from "../commons/Loading3D";

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
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false });

export const HomeHtml = ({
  title = "Sho'sLabo",
  fontColor = "#fff",
}) => {
  console.log('HomeHtml');
  const [now, setNow] = useState<Date>();
  const birthStr = "1995-01-11";
  const age = useMemo(() => {
    if (!now) return 0;
    const birth = new Date(birthStr);
    const diff = now.getTime() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  }, [now]);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <>
      {/** タイトルロゴ */}
      <div
        className='px-3 mx-auto h-screen flex flex-wrap justify-center flex-col md:flex-row items-center w-screen'
        style={{
          color: fontColor,
        }}
      >
        <div className="relative w-full h-full">
          <div className='absolute z-10 top-1/2 left-1/2 text-6xl md:text-8xl font-bold text-center w-full -translate-x-1/2 -translate-y-1/2'>
            {title}
          </div>
          {/* <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
            <div className='w-full h-1/2 rounded-full bg-sky-500'>
            </div>
          </div> */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <RxDoubleArrowDown className='w-16 h-16 text-4xl text-gray-700 animate-bounce' />
          </div>
        </div>
      </div>
      {/** 名前と生年月日 */}
      <div
        className='w-screen h-screen flex items-center justify-center'
        style={{
          color: fontColor,
        }}
      >
        <div className='full h-full flex items-center justify-center'>
          {/** Icon */}
          <div className='w-1/4 h-3/4 flex items-center justify-center'>
            <div className='w-1/2 h-1/2 rounded-full bg-sky-500'>
            </div>
          </div>
          {/** Age */}
          <div className='w-3/4 h-3/4 flex flex-col items-center justify-center'>
            <div className='text-6xl font-bold'>
              ShoOsaka
            </div>
            <div className='text-2xl'>
              {birthStr}({age})
            </div>
          </div>
        </div>
      </div>
      {/** 技術スタック一覧(Python <FastAPI, Django, Flask, Tensorflow>, React <Typescript, Three.js>, Cloud <AWS, Azure>) */}
      <div className='h-screen w-screen pt-8  bg-gradient-to-b from-transparent via-indigo-300 via-20% bg-opacity-50'>
        <div className={"px-6 text-white my-4 relative"}>
          <div className={"absolute w-4 h-4 top-[-10px] bg-white z-0 rounded-sm rotate-12 animate-bounce"}></div>
          <div className={"text-3xl font-bold relative z-10 text-white"}>
            技術スタック一覧
          </div>
          <div className={"text-md pt-1 text-indigo-800 font-bold"}>
            Tech Stack
          </div>
        </div>
        <div
          className="w-full h-[350px] px-2 flex relative text-white"
        >
          <div
            className="relative mx-auto hover:scale-[1.1] transition duration-300 md:w-1/3 w-full"
          >
            <Suspense fallback={null}>
              {/** @ts-ignore */}
              <View orbit className="h-full w-full">
                <ambientLight />
                <ReactLogo />
              </View>
            </Suspense>
            {/** タイトルと説明 */}
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                React
              </div>
              <div className='text-md'>
                Typescript, Three.js
              </div>
            </div>
          </div>
          <div
            className="relative mx-auto hover:scale-[1.1] transition duration-300 md:w-1/3 w-full"
          >
            <Suspense fallback={<Loading3D position={[0, 0, 0]}/>}>
              {/** @ts-ignore */}
              <View orbit className="h-full w-full">
                <directionalLight intensity={0.5} position={[0, 1, 5]} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={1}
                />
                <PythonLogo />
                {/** @ts-ignore */}
                {/* <Common /> */}
              </View>
            </Suspense>
            {/** タイトルと説明 */}
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                Python
              </div>
              <div className='text-md my-2'>
                FastAPI, Django, Tensorflow, OpenCV
              </div>
              <div className='text-sx'>
                Web技術を中心に、機械学習や画像処理などの分野で実務経験があります。
                また、Pythonのライブラリを用いて、Webアプリケーションの開発を行った経験があります。
                AIシステムの開発において、機械学習のモデルの開発から、Webアプリケーションの開発まで、
                一貫して開発を行うことができます。
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * ReactLogoのコンポーネント
 */
const ReactLogo = ({
  scale = 0.5,
  color = '#1fb2f5',
  activeColor = '#f5a623',
}) => {
  const mesh = useRef<Group>(null);
  const { gl } = useThree();
  const [hovered, hover] = useState(false);
  const points = useMemo(() => new EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

  useCursor(hovered)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8);
      mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8);
      mesh.current.rotation.z -= delta / 4;
    }
  });

  useEffect(() => {
    // 背景を透過する
    gl.setClearColor('#FFF', 0);
  }, []);

  return (
    <group ref={mesh} scale={scale}>
      {/* @ts-ignore */}
      <Line worldUnits points={points} color={color} lineWidth={0.15} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color={color} lineWidth={0.15} rotation={[0, 0, 1]} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color={color} lineWidth={0.15} rotation={[0, 0, -1]} />
      <mesh onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial roughness={0} color={hovered ? activeColor : color } />
      </mesh>
    </group>
  )
}

/**
 * Pythonのロゴのコンポーネント
 */
const PythonLogo = ({
  cycleTime = 2,
  scale = 0.04,
}) => {
  const grp = useRef<Group>(null);
  const { gl } = useThree();
  const { scene } = useGLTF('/models/python.glb');

  useFrame((state, delta) => {
    if (grp.current) {
      // バウンドさせる
      grp.current.position.y = Math.sin(state.clock.elapsedTime * 2 * Math.PI / cycleTime) * 0.1;
    }
  });

  useEffect(() => {
    // 背景を透過する
    gl.setClearColor('#FFF', 0);
  }, []);

  return (
    <group 
      ref={grp}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  )
}