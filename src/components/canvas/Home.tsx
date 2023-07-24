import { Environment, Scroll, ScrollControls, Text, useGLTF, useScroll, useTexture } from "@react-three/drei";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, LUT, Outline, Noise, DepthOfField } from "@react-three/postprocessing";
import { createContext, useContext, useEffect, useState, useMemo, useRef, Suspense } from "react";
import { Group, Mesh, Vector3, ShaderMaterial, Color, Quaternion } from "three";
import { LUTCubeLoader } from 'postprocessing';
// @ts-ignore
import { HomeHtml } from "./HomeHtml";
import { Loading3D } from "../commons/Loading3D";
import ClientOnly from "@/client-only";
import { useRouter } from "next/navigation";

export const Home = ({
  initPos = new Vector3(0, 1, 1),
}) => {

  return (
    <ClientOnly>
      <Canvas 
        id="target"
        style={
          {
            height: '100vh',
            width: '100%',
          }
        }
        camera={
          {
            position: initPos,
          }
        }
      >
        <ScrollControls pages={5}>
          <MyProvider initPos={initPos}>
            <Lighting />
            <MyEffect />
            <Suspense fallback={<Loading3D position={[0, 0, 0]} />}>
              <Table />
            </Suspense>
            <MyCamera initPos={initPos} />
          </MyProvider>
          <Scroll html>
            <HomeHtml />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </ClientOnly>
  )
}

interface IMyProvider {
  initPos: Vector3;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  hovered: any;
  setHovered: (hovered: any) => void;
}
const MyContext = createContext({ mode: "light", setMode: (mode: "light" | "dark") => { } } as IMyProvider);
// Provider
const MyProvider = ({ children, initPos }) => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [hovered, setHovered] = useState<any>(null);
  return (
    <MyContext.Provider value={{ initPos, mode, setMode, hovered, setHovered }}>
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

/**
 * 環境/エフェクト
 */
const MyEffect = () => {

  const { mode, hovered } = useMyContext();
  const [texture, setTexture] = useState(null);
  const selected = hovered ? [hovered] : undefined;

  const edgeColor = mode === "dark" ? "#ffffe0" : "#191970";
  const edgeStrength = mode === "dark" ? 10 : 100;
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
    bloomEffect = <Bloom luminanceThreshold={0.1} mipmapBlur luminanceSmoothing={0} intensity={1.15} />;
  }
  return (
    <>
      <EffectComposer multisampling={0} disableNormalPass autoClear={false}>
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={2}
          height={480}
        />
        {bloomEffect}
        {/* <SSR
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
        /> */}
        {lutEffect}
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
        <Noise opacity={0.05} />
      </EffectComposer>
      <Environment
        preset={mode === "dark" ? "night" : "sunset"}
        background
        blur={0.6}
      >
      </Environment>
    </>
  )
}

/**
 * ライティング
 */
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

/**
 * テーブル
 */
const Table = () => {
  const scroll = useScroll();
  const { scene: lamp } = useGLTF('/models/lamp/lamp.gltf');
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

/**
 * コンピュータデスク
 */
const ComputerDesk = () => {
  const router = useRouter();
  {/** ThirdPerson用 */}
  const grp = useRef<Group>(null);
  {/** デスク */}
  const { nodes, materials } = useGLTF('/models/computer_desk.glb') as any;
  {/** 南京錠(Loginになる) */}
  const { scene: lock } = useGLTF('/models/lockKey.glb') as any;

  return (
    <group
      ref={grp}
      position={[0, -1.47, 0]}
      scale={2}
    >
      {/** 本体(脚) */}
      <primitive object={nodes['comp_desk_0']} />
      {/** RemoCon */}
      <primitive object={nodes['comp_desk_remote_1']} />
      {/** 天板 */}
      <mesh>
        <primitive object={nodes['comp_desk_top_2']} />
      </mesh>
      {/** 南京錠 */}
      <mesh
        scale={0.005}
        position={[-0.2, 0.7, -0.1]}
        onClick={() => router.push("/blogs/create")}
      >
        <primitive object={lock} />
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
const Monitor = ({
  position = [0, 0.74, -0.25],
}) => {
  const { initPos: initCameraPos } = useMyContext();
  const codeTex = useTexture('/textures/code.png');
  const cameraQut = useRef<Quaternion>();
  const { scene } = useGLTF('/models/monitor.glb') as any;
  const { camera } = useThree();
  const screenRef = useRef<Group>(null);
  const scroll = useScroll();
  const pos = useMemo(() => {
    // [number, number, number]の場合Vector3に変換
    if (Array.isArray(position)) {
      return new Vector3(position[0], position[1], position[2]);
    }
    return position;
  }, []);
  const screenPos = pos.clone().add(new Vector3(0, 0.24, 0.062));

  useEffect(() => {
    initCameraPos.copy(camera.position.clone());
    cameraQut.current = camera.quaternion.clone();
  }, []);

  useFrame((state, delta) => {
    if (!screenRef.current) return;
    const targetPos = screenPos.clone().add(new Vector3(0, -0.55, 0));
    const move = scroll.range(0.6, 1);
    // moveは0 ~ 1の間で動く、1に近づくほどscreenPosに近くなるようにカメラを移動したい
    // 0~0.4を0~1の値を再設定しvalとする。
    const val = (move) / 0.4;
    let newPos = new Vector3().lerpVectors(initCameraPos, targetPos, val);
    const maxVal = 0.86
    if (val < maxVal) {
      if (val > 0.00001)  {
        // カメラに近づき、画面に近づく
        camera.position.copy(newPos);
        screenRef.current.visible = true;
      }
      else {
        screenRef.current.visible = false;
      }
    }
    if (val < 1){
      const targetRot = screenRef.current!.rotation.clone();
      if (cameraQut.current) {
        let initQuaternion = new Quaternion().copy(cameraQut.current!);
        let targetQuaternion = new Quaternion().setFromEuler(targetRot);
        let newQuaternion = new Quaternion().slerpQuaternions(initQuaternion, targetQuaternion, val);
        camera.rotation.setFromQuaternion(newQuaternion);
      }
    }
  });

  return (
    <>
      <group
        position={pos}
        scale={0.01}
        >
        {/** @ts-ignore */}
        <primitive object={scene} />
      </group>
      <group
        position={screenPos}
        scale={0.28}
        ref={screenRef}
      >
        <mesh
        >
          <planeGeometry args={[1.6, 0.9]} />
          <meshBasicMaterial
            map={codeTex}
          />
        </mesh>
        <Text position={[0, 0.3, 0.01]} scale={0.08} color={"#000"}>
          {"SNS"}
        </Text>
      </group>
      {/* <OrbitControls /> */}
    </>
  )
}

/**
 * ノート
 */
const NoteBook = () => {
  const topRef = useRef<any>();
  const { nodes } = useGLTF('/models/notebook.glb') as any;
  const scroll = useScroll();
  const [tex] = useTexture(['/textures/industrial-robot.png']);

  useFrame((state, delta) => {
    if (!topRef.current) return;
    const data = scroll.range(0, 0.2);
    topRef.current.rotation.x = data * Math.PI;
  });

  return (
    <group
      scale={0.2}
      position={[0, 0, 0.2]}
      rotation={
        [0, -Math.PI / 2, 0]
      }
    >
      {/** Pages */}
      <mesh
        position={[0, 0.11, -0.95]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[2.8, 1.95, 1, 1]} />
        <NoteMaterial />
      </mesh>
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
      <primitive object={nodes['cover_up_2']} ref={topRef} />

      {/** Rings */}
      <primitive object={nodes['notrbook_ring_6']} />
    </group>
  )
}

const Pen = () => {
  const scroll = useScroll();
  const penRef = useRef<any>();
  const { nodes } = useGLTF('/models/pen.glb') as any;
  useFrame((state, delta) => {
    if (!penRef.current) return;
    const data = scroll.range(0.0, 0.2);
    const maxY = 3;
    if (data > 0.00001) {
      penRef.current.rotation.x = data * Math.PI / 2;
      penRef.current.position.x = 7.5 * data;
      penRef.current.position.y = maxY * data;
    }
    const write = scroll.range(0.2, 0.4);
    if (write > 0.00001) {
      const val = write * 100;
      // penRef.current.rotation.x = Math.PI / 2 + Math.PI / 24 * Math.sin(val);
      penRef.current.rotation.z = Math.PI / 12 * Math.cos(val);
      // 位置を左上から右下に移動
      penRef.current.position.x = 7.5 + - 5 * write;
      penRef.current.position.z = -8 * write;
      if (write > 0.8) {
        // 初期値に戻す
        // 0.8 ~ 1.0 で上に移動
        penRef.current.position.x = 0;
        penRef.current.position.z = 0;
        // 0.8 ~ 1.0 で上に移動
        penRef.current.position.y = maxY * (write - 0.8);
        penRef.current.rotation.x = 0;
        penRef.current.rotation.z = 0;
      }
    }

  });
  return (
    <group
      rotation={[0, Math.PI, 0]}
      position={[0.3, 0.74, 0]}
      scale={0.03}
    >
      {/** 本体 */}
      <mesh ref={penRef}>
        <primitive object={nodes['Stylo1']} />
      </mesh>
      {/** キャップ */}
      <primitive object={nodes['Capuchon1']} />
    </group>
  )
}

const Alexa = () => {
  const ref = useRef<any>();
  const { mode, setMode, setHovered: onHover, hovered } = useMyContext();
  const { scene, nodes } = useGLTF('/models/alexa.glb') as any;
  const [nightmodeTex, lightmodeTex, arrow] = useTexture(['/textures/nightmode.png', '/textures/lightmode.png', '/textures/right-arrow.png']);
  scene.traverse(function (child) {
    if (child instanceof Mesh) {
      child.layers.enable(10)
    }
  });
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
            <circleGeometry args={[0.1, 32]} />
            <meshBasicMaterial
              map={mode === "dark" ? nightmodeTex : lightmodeTex}
            />
          </mesh>
          {/** 矢印 */}
          <mesh
            scale={0.5}
          >
            <planeGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial
              map={arrow}
              transparent={true}
            />
          </mesh>
          <mesh
            scale={0.5}
            position={[0.075, 0, 0]}
          >
            <circleGeometry args={[0.1, 32]} />
            <meshBasicMaterial
              map={mode === "dark" ? lightmodeTex : nightmodeTex}
            />
          </mesh>
        </group>
      }
      {/* <EffectComposer multisampling={8} autoClear={false}>
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
      </EffectComposer> */}
    </>
  )
}

const NoteMaterial = (
  {
    textColor = '#000000',
    texUrl = '/textures/robot_alpha.jpg',
  }
) => {
  const scroll = useScroll();
  const ref = useRef<any>(null);
  const alphaMap = useTexture(texUrl);

  useFrame((state, delta) => {
    const value = scroll.range(0.2, 0.4);
    if (ref.current) {
      ref.current.uniforms.uAlpha.value = value;
    }
  });

  const uniforms = useMemo(() => ({
    uTex: { value: alphaMap },
    uAlpha: { value: 0.01 },
    uColor: { value: new Color(textColor) },
  }), []);

  const shaderMaterial = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    // depthWrite: false,
    // depthTest: false,
    // blending: AdditiveBlending,
  });

  return (
    // <CustomShaderMaterial
    //   alphaMap={alphaMap}
    //   // alphaTest={0.5}
    //   // baseMaterial={MeshStandardMaterial}
    //   // color={new Color(textColor)}
    //   uniforms={uniforms}
    //   ref={ref}
    //   fragmentShader={fragmentShader}
    // />
    <>
      <primitive
        object={shaderMaterial}
        attach="material"
        ref={ref}
      />
    </>
  )
}

/**
 * Vertex
 */
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment
 */
const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uAlpha;
  uniform vec3 uColor;

  void main() {
    vec4 tex = texture2D(uTex, vUv);
    float alpha = tex.r * uAlpha;
    gl_FragColor = vec4(uColor, alpha);

  }

`;
