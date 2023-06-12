import { Environment, MeshReflectorMaterial, OrbitControls, Scroll, ScrollControls, Sky, useGLTF, useScroll, useTexture } from "@react-three/drei"
import { useThree, applyProps, useLoader, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom, SSR, LUT, Outline } from "@react-three/postprocessing"
import { createContext, useContext, useEffect, useLayoutEffect, useState, useMemo, useRef } from "react"
import { Group, Mesh, Vector3 } from "three"
import { LUTCubeLoader } from 'postprocessing'


export const Home = () => {

  return (
    <MyProvider>
      <ScrollControls
        pages={5}
      >
        <Lighting />
        <MyEffect />
        <Scroll>
          <Table />
        </Scroll>
        <MyCamera />
      </ScrollControls>
    </MyProvider>
  )
}

interface IMyProvider {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  hovered: any;
  setHovered: (hovered: any) => void;
}
const MyContext = createContext({ mode: "light", setMode: (mode: "light" | "dark") => { } } as IMyProvider);
// Provider
const MyProvider = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [hovered, setHovered] = useState<any>(null);
  return (
    <MyContext.Provider value={{ mode, setMode, hovered, setHovered }}>
      {children}
    </MyContext.Provider>
  );
}
// useHook
const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
}

const MyCamera = (
  {
    initPos = new Vector3(0, 1, 1),
    target = new Vector3(0, 0, 0),
  }
) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.copy(initPos);
    camera.lookAt(target);
  }, []);

  return (
    <>
      {/* <OrbitControls /> */}
    </>
  )
}

const MyEffect = () => {
  const { mode } = useMyContext();
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loader = new LUTCubeLoader();
    loader.load("/luts/std.cube", (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);
  let bloomEffect: any = null;
  if (mode === "light") {
    bloomEffect = <Bloom luminanceThreshold={0.5} mipmapBlur luminanceSmoothing={0} intensity={1.5} />;
  }
  let lutEffect: any = null;
  if (texture && mode === "dark") {
    lutEffect = <LUT lut={texture} />;
  }
  return (
    <>
      {/* <color attach="background" args={['#171720']} /> */}
      <EffectComposer disableNormalPass>
        {bloomEffect}
        <SSR
          temporalResolve={true}
          STRETCH_MISSED_RAYS={true}
          USE_MRT={true}
          USE_NORMALMAP={true}
          USE_ROUGHNESSMAP={true}
          ENABLE_JITTERING={true}
          ENABLE_BLUR={true}
          temporalResolveMix={0.5}
          temporalResolveCorrectionMix={0.5}
          maxSamples={0}
          blurMix={0.2}
          blurKernelSize={1}
          rayStep={0.5}
          intensity={1}
          maxRoughness={0.9}
          jitter={0.3}
          jitterSpread={0.25}
          jitterRough={0.1}
          MAX_STEPS={20}
          NUM_BINARY_SEARCH_STEPS={6}
          maxDepthDifference={10}
          maxDepth={1}
          thickness={10}
          ior={1.45}
        />
        {lutEffect}
      </EffectComposer>
      <Environment
        preset={mode === "dark" ? "night" : "sunset"}
        background blur={0.6}
      >
      </Environment>
    </>
  )
}

const Lighting = () => {
  const { mode } = useMyContext();
  return (
    <>
      {/* <Sky sunPosition={[0, 1, 0]} /> */}
      {mode === "dark" &&
        <>
          <pointLight
            position={[-1.05, 0.8, -0.55]}
            intensity={1}
            color={"#fce2c4"} // 暖色光
          />
        </>
      }
      {mode === "light" &&
        <pointLight position={[0, 10, 0]} intensity={0.5} />
      }
    </>
  )
}

const Table = () => {
  const scroll = useScroll();
  const { camera } = useThree();
  const { scene: lamp } = useGLTF('/models/lamp/lamp.gltf');
  useFrame((state, delta) => {
    const data = scroll.range(0, 1);
    const offset = 1 - scroll.offset;
  });
  return (
    <group
    >
      {/** Lamp */}
      <mesh
        scale={0.02}
        rotation={[0, Math.PI, 0]}
        position={[-1., 0, -0.6]}
      >
        <primitive object={lamp} />
      </mesh>
      {/** NoteBook */}
      <NoteBook />
      {/** Desk */}
      <ComputerDesk />
    </group>
  )
}

const ComputerDesk = () => {
  const [marbleTex] = useTexture(['/textures/marble.jpg']);
  const { nodes } = useGLTF('/models/computer_desk.glb') as any;
  // comp_desk_top_2のGeometryを取得
  const topGeometry = nodes['comp_desk_top_2'].children[0].geometry;
  console.log(topGeometry);
  return (
    <group
      position={[0, -1.47, 0]}
      scale={2}
    >
      {/** 本体(脚) */}
      <primitive object={nodes['comp_desk_0']} />
      {/** RemoCon */}
      <primitive object={nodes['comp_desk_remote_1']} />
      {/** 天板 */}
      <mesh>
        <primitive object={topGeometry} attach="geometry" />
        <MeshReflectorMaterial
          resolution={1024}
          metalness={1}
          roughness={0.5}
          envMapIntensity={1}
          distortion={1}
          // depthToBlurRatioBias={0.65}
          // @ts-ignore
          map={marbleTex}
          isMaterial={true}
          // distortionMap={marbleTex}
          mirror={0.6}
          reflectorOffset={0.2}
          // 木目の色
          color={"#8F775F"}
          transparent={true}
        />
      </mesh>
      {/** モニター */}
      <Monitor />
      {/** キーボード */}
      {/** ペン */}
      <Pen />
      {/** Alexa */}
      <Alexa />
    </group>
  )
}

/**
 * モニター
 */
const Monitor = () => {
  const { scene } = useGLTF('/models/monitor.glb') as any;
  return (
    <mesh
      position={[0, 0.74, -0.25]}
      scale={0.01}
    >
      <primitive object={scene} />
    </mesh>
  )
}

/**
 * ノート
 */
const NoteBook = () => {
  const { nodes } = useGLTF('/models/notebook.glb') as any;
  // console.log(nodes);
  return (
    <group
      scale={0.2}
      position={[0, 0, 0.2]}
      rotation={
        [0, -Math.PI / 2, 0]
      }
    >
      {/** Pages */}
      <primitive object={nodes['Cube002_7']} />
      <primitive object={nodes['Cube003_8']} />
      <primitive object={nodes['Cube004_9']} />
      <primitive object={nodes['Cube005_10']} />
      <primitive object={nodes['Cube006_11']} />
      <primitive object={nodes['Cube007_12']} />
      <primitive object={nodes['Cube008_13']} />
      <primitive object={nodes['Cube009_14']} />
      <primitive object={nodes['Cube010_15']} />
      <primitive object={nodes['Cube011_16']} />
      <primitive object={nodes['Cube012_17']} />
      <primitive object={nodes['Cube013_18']} />
      <primitive object={nodes['Cube014_19']} />
      <primitive object={nodes['Cube015_20']} />
      <primitive object={nodes['Cube016_21']} />

      {/** Cover */}
      <primitive object={nodes['cover_down_1']} />
      <primitive object={nodes['cover_up_2']} />

      {/** Rings */}
      <primitive object={nodes['notrbook_ring_6']} />
    </group>
  )
}

const Pen = () => {
  const { scene } = useGLTF('/models/pen.glb') as any;
  return (
    <group
      rotation={[0, Math.PI, 0]}
      position={[0.3, 0.74, 0]}
      scale={0.03}
    >
      <primitive object={scene} />
    </group>
  )
}

const Alexa = () => {
  const ref = useRef<any>();
  const { mode, setMode, setHovered: onHover, hovered } = useMyContext();
  const selected = hovered ? [hovered] : undefined;
  const { scene, nodes } = useGLTF('/models/alexa.glb') as any;
  const [nightmodeTex, lightmodeTex, arrow] = useTexture(['/textures/nightmode.png', '/textures/lightmode.png', '/textures/right-arrow.png']);
  scene.traverse(function (child) {
    if (child instanceof Mesh) {
      child.layers.enable(10)
    }
  });
  const edgeColor = mode === "dark" ? "#ffffe0" : "#191970";
  const edgeStrength = mode === "dark" ? 10 : 100;
  return (
    <>
      <group
        position={[0.28, 0.74, -0.2]}
      >
        <primitive
          ref={ref}
          object={scene}
          onPointerOver={(e) => onHover(ref)}
          onPointerOut={(e) => onHover(null)}
          onClick={() => {
            if (mode === "dark") {
              setMode("light");
            } else {
              setMode("dark");
            }
          }}
        />
      </group>
      {hovered &&
        <group
          position={[0.28, 0.85, -0.18]}
        >
          <mesh
            scale={0.5}
            position={[-0.075, 0, 0]}
          >
            <circleBufferGeometry args={[0.1, 32]} />
            <meshBasicMaterial
              map={mode === "dark" ? nightmodeTex : lightmodeTex}
            />
          </mesh>
          {/** 矢印 */}
          <mesh
            scale={0.5}
          >
            <planeBufferGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial
              map={arrow}
              transparent={true}
            />
          </mesh>
          <mesh
            scale={0.5}
            position={[0.075, 0, 0]}
          >
            <circleBufferGeometry args={[0.1, 32]} />
            <meshBasicMaterial
              map={mode === "dark" ? lightmodeTex : nightmodeTex}
            />
          </mesh>
        </group>
      }
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          selection={selected}
          selectionLayer={10}
          edgeStrength={edgeStrength}
          // @ts-ignore
          hiddenEdgeColor={edgeColor}
          // @ts-ignore
          visibleEdgeColor={edgeColor}
          blur={true}
        />
      </EffectComposer>
    </>
  )
}