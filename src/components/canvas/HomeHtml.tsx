import { Line, Text3D, useCursor, useFont, useGLTF, useScroll, Text, MeshPortalMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { RxDoubleArrowDown } from "react-icons/rx";
import { DoubleSide, EllipseCurve, Group, Mesh } from "three";
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
  title = "SOLB",
  fontColor = "#fff",
  twitter = "https://twitter.com/sakanosho",
  github = "https://github.com/foasho",
  qiita = "https://qiita.com/osakasho",
}) => {
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
      {/** 1:タイトルロゴ */}
      <div
        className='px-3 mx-auto h-screen flex flex-wrap justify-center flex-col md:flex-row items-center w-screen'
        style={{
          color: fontColor,
        }}
      >
        <FixedFlicker />
        <div className="relative w-full h-full">
          <div id="home-title" className='absolute z-10 top-1/2 left-1/2 text-6xl md:text-8xl font-bold text-center w-full -translate-x-1/2 -translate-y-1/2'>
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
      {/** 2:名前と生年月日 */}
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
            <div className='text-2xl font-bold'>
              <ruby>
                ShoOsaka
                <rt>Web Developer</rt>
              </ruby>
            </div>
            <div className='text-2xl'>
              {birthStr}({age})
            </div>
          </div>
        </div>
      </div>
      {/** 3:技術スタック一覧 */}
      <div className='h-screen w-screen pt-8 px-8'>
        <div className={"px-6 text-white my-4 relative text-center"}>
          <div className={"absolute w-4 h-4 top-[-10px] left-[30%] bg-white z-0 rounded-sm rotate-12 animate-bounce"}></div>
          <div className={"absolute w-4 h-4 top-[-10px] left-[50%] bg-white z-0 rounded-sm rotate-12 animate-bounce"}></div>
          <div className={"absolute w-4 h-4 top-[-10px] left-[70%] bg-white z-0 rounded-sm rotate-12 animate-bounce"}></div>
          <div className={"text-3xl pt-4 font-bold relative z-10 text-white select-none"}>
            技術スタック一覧
          </div>
          <div className={"text-md pt-1 font-bold select-none"}>
            Tech Stack
          </div>
        </div>
        <div
          className="w-full h-full px-2 relative text-white block md:flex"
        >
          {/** React */}
          <div
            className="relative hover:scale-[1.1] transition duration-300 md:w-1/3 w-full px-2"
          >
            <Suspense fallback={null}>
              {/** @ts-ignore */}
              <View orbit className="h-64 w-full">
                <ambientLight />
                <ReactLogo />
              </View>
            </Suspense>
            {/** タイトルと説明 */}
            <div className='text-center'>
              <div className='text-2xl font-bold select-none'>
                React
              </div>
              <div className='text-md select-none'>
                Typescript, Three.js(R3F)
              </div>
              <div className='text-sx select-none'>
                Web開発において、主にReactを用いて開発しています。
                また、3DのWebサイトを作成することができます。
                個人開発でWebGL用3Dエディタを作成しており、
                メタバース関連の3Dアプリケーションを最適に開発することができます。
              </div>
            </div>
          </div>
          {/** Python */}
          <div
            className="relative hover:scale-[1.1] transition duration-300 md:w-1/3 w-full px-2"
          >
            <Suspense fallback={<Loading3D position={[0, 0, 0]} />}>
              {/** @ts-ignore */}
              <View orbit className="h-64 w-full">
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
              <div className='text-2xl font-bold select-none'>
                Python
              </div>
              <div className='text-md my-2 select-none'>
                FastAPI, Django, Tensorflow, OpenCV
              </div>
              <div className='text-sx select-none'>
                Web技術を中心に、機械学習や画像処理などの分野で実務経験があります。
                また、Pythonのライブラリを用いて、Webアプリケーションの開発を行った経験があります。
                AIシステムの開発において、機械学習のモデルの開発から、Webアプリケーションの開発まで、
                一貫して開発を行うことができます。
              </div>
            </div>
          </div>
          {/** Cloud */}
          <div
            className="relative hover:scale-[1.1] transition duration-300 md:w-1/3 w-full px-2"
          >
            <Suspense fallback={null}>
              {/** @ts-ignore */}
              <View orbit className="h-64 w-full">
                <ambientLight />
                <CloudLogo />
              </View>
            </Suspense>
            {/** タイトルと説明 */}
            <div className='text-center'>
              <div className='text-2xl font-bold select-none'>
                Cloud
              </div>
              <div className='text-md select-none'>
                AWS, Azure
              </div>
              <div className='text-sx select-none'>
                AWSを用いたインフラ設計と構築を行った経験があります。
                また、Azureを用いたAADを活用した業務システムの開発を行った経験があります。
                両方のクラウドサービスを用いた開発を行うことができます。
              </div>
            </div>
          </div>
        </div>
      </div>
      {/** 4:経歴 */}
      <div className='h-screen w-screen pt-8 px-8'></div>
      {/** 5:サービス */}
      <div className='h-screen w-screen pt-8 px-8 flex items-center justify-center'>
        {/** 3つのサービスを並べる */}
        <div className="flex flex-wrap md:flex-nowrap">
          {/** 1つ目:【Github】 */}
          <div
            onClick={() => window.open(github, '_blank')}
            className='cursor-pointer w-full md:p-8 md:w-1/3 h-36 md:h-72 md:inline-block items-center justify-center hover:scale-[1.1] transition duration-300'>
            <img
              src='/img/logos/github-logo.png'
              className='w-36 h-36 md:h-72 md:w-72 mx-auto md:p-4'
            />
          </div>
          {/** 2つ目:【Twitterサイト】 */}
          <div
            onClick={() => window.open(twitter, '_blank')}
            className='cursor-pointer w-full md:p-8 md:w-1/3 h-36 md:h-72 my-4 md:my-4 md:inline-block items-center justify-center hover:scale-[1.1] transition duration-300'>
            <img
              src='/img/logos/twitter-logo.png'
              className='w-36 h-36 md:h-72 md:w-72 mx-auto md:p-4'
            />
          </div>
          {/** 3つ目:【Qiitaシステム】 */}
          <div
            onClick={() => window.open(qiita, '_blank')}
            className='cursor-pointer w-full md:p-8 md:w-1/3 h-36 md:h-72 md:inline-block items-center justify-center hover:scale-[1.1] transition duration-300'>
            <img
              src='/img/logos/qiita-logo.png'
              className='w-36 h-36 md:h-72 md:w-72 mx-auto md:p-4'
            />
          </div>
        </div>
      </div>


    </>
  )
}

/**
 * スクロールちらつき防止用のコンポーネント
 */
const FixedFlicker = () => {
  const changeFixed = () => {
    const target = document.getElementById("target");
    if (target) {
      if (!target.children[0]) return;
      if (target.children[0] instanceof HTMLElement) {
        // さらに子要素を取得する
        const child = target.children[0].children[1];
        if (child instanceof HTMLElement) {
          child.style.position = "fixed";
        }
      }
    }
  }
  useEffect(() => {
    // スクロール部のカクツキがでるため、targetのchildren[0]のさらにchild[1](2つ目)要素fixedにする
    setTimeout(() => {
      changeFixed();
    }, 1000);
  }, []);

  return (
    <></>
  )
}

/**
 * 3DのViewのコンポーネント
 */

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
        <meshPhysicalMaterial roughness={0} color={hovered ? activeColor : color} />
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
  const { scene } = useGLTF('/models/python.glb');
  const grp = useRef<Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (grp.current) {
      // バウンドさせる
      grp.current.position.y = Math.sin(t * 2 * Math.PI / cycleTime) * 0.1;
      grp.current.rotation.y = Math.sin(t) * (Math.PI / 8);
      grp.current.rotation.x = Math.cos(t) * (Math.PI / 8);
    }
  });

  return (
    <group
      ref={grp}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  )
}

/**
 * 
 */
const CloudLogo = ({
  cycleTime = 2,
  scale = 0.07,
}) => {

  const font = useFont('/fonts/MPLUS.json');
  const { scene } = useGLTF('/models/aws.glb');
  const grp = useRef<Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (grp.current) {
      // バウンドさせる
      grp.current.position.y = Math.sin(t * 2 * Math.PI / cycleTime) * 0.1;
      grp.current.rotation.y = Math.sin(t) * (Math.PI / 8);
      grp.current.rotation.x = Math.cos(t) * (Math.PI / 8);
    }
  });

  return (
    <group
      ref={grp}
    >
      <group position={[-1.5, 0, 0]}>
        <Text3D
          font={font.data}
        >
          {"AWS"}
          <meshStandardMaterial
            attach={'material'}
            color={'#FFF'}
          />
        </Text3D>
        <group
          scale={scale}
          position={[-0.1, -0.25, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <primitive object={scene} />
        </group>
      </group>
    </group>
  )
}

export const SelectCanvas = () => {

  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
    </>
  )
}