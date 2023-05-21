import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { OrbitControls, useGLTF, Html, GizmoHelper, GizmoViewport, useFont, Text3D } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { DoubleSide, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from '@react-spring/web';
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export const Home = () => {
  const device = detectDeviceType();
  const screenPosition = device == "desktop" ? new Vector3(0, 6.2, 19.5): new Vector3(0, 6.2, 19.5);
  const cameraPosition = device == "desktop" ? new Vector3(0.0, 0.5, 6): new Vector3(0.15, 3.5, -4);
  const charaPosition = device == "desktop" ?new Vector3(0.0, 1.5, 10): new Vector3(0.15, 3.5, 0);
  const [mode, setMode] = useState<"view" | "walk">("view");
  const debug = process.env.NODE_ENV === 'development';
  const [init, setInit] = useState(true);
  const [ready, setReady] = useState(false);
  const controls = useRef<OrbitControlsImpl>(null);
  const { scene } = useGLTF('/models/theater/scene.gltf');
  const font = useFont('/fonts/MPLUS.json');
  const font3d = font.data;
  const { camera, gl } = useThree();

  useEffect(() => {
    if (scene && !init) {
      setTimeout(() => {
        // setReady(true);
      }, 1000);
    }
    if (init) {
      const initPosition = device == "desktop" ? new Vector3(2.0, 0.5, 5) : new Vector3(2.0, 0.5, 8);
      camera.position.copy(initPosition);
      const initLookAt = device == "desktop" ? new Vector3(2.0, 0, 0) : new Vector3(2.0, 0, 0);
      controls.current!.target.copy(initLookAt);
      controls.current!.update();
    }
    // cameraの初期位置を設定
    // camera.position.copy(cameraPosition);
    // controls.current!.target.copy(screenPosition);
    // controls.current!.update();
    // setInit(false);
  }, [scene, init]);

  return (
    <>
      <color attach="background" args={['#15151a']} />
      {init &&
        <>
          <Text3D 
            font={font3d}
          >
            SOLB
          </Text3D>
        </>
      }
      {ready &&
        <>
          {mode == "walk" &&
            <Screen screenPosition={screenPosition} deviceType={device} />
          }
          <hemisphereLight intensity={0.1} />
          <primitive 
            object={scene}
            visible={mode=="walk"}
          />
          {mode == "view" &&
            <>

            </>
          }
        </>
      }
      <OrbitControls
        ref={controls}
        makeDefault={true}
        args={[camera, gl.domElement]}
        camera={camera}
        enabled={!init}
      />
      <MyEffect />
      {/* {debug && <MyDebug />} */}
    </>
  )
}

const Screen = ({
  screenPosition,
  width = 19,
  height = 7.5,
  deviceType = "desktop"
}) => {
  return (
    <group>
      <mesh
        position={screenPosition}
        rotation={[0, -Math.PI, 0]}
      >
        <planeBufferGeometry 
          attach="geometry" 
          args={[width, height]}
        />
        <meshBasicMaterial attach="material" color="white" side={DoubleSide} />
      </mesh>

    </group>
  )
}

const MyEffect = () => {
  return (
    <EffectComposer>
      <Noise premultiply blendFunction={BlendFunction.ADD} />
      <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0} intensity={1.25} />
    </EffectComposer>
  )
}

/**
 * 接続されたデバイスの種類を返す
 */
const detectDeviceType = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window !== 'undefined') {  // check if window is defined (we are on client side)
    const ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)) {
      return "mobile";
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      return "tablet";
    } else {
      return "desktop";
    }
  } else {
    return "desktop";  // as a default, return "desktop" when window is not defined (we are on server side)
  }
};

const MyDebug = () => {
  const ref: MutableRefObject<HTMLDivElement|null> = useRef<HTMLDivElement>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (ref.current) {
      const x = camera.position.x.toFixed(2);
      const y = camera.position.y.toFixed(2);
      const z = camera.position.z.toFixed(2);
      ref.current.innerHTML = `
        <div>
          <div>CameraPosition</div>
          <div>X: ${x}</div>
          <div>Y: ${y}</div>
          <div>Z: ${z}</div>
        </div>
      `;
    }
  });
  return (
    <>
      <GizmoHelper
        alignment="top-left"
        margin={[80, 80]}
      >
        <GizmoViewport
          labelColor="white"
        />
        <Html
        >
          <div 
            style={
              {
                position: "fixed",
                top: "-50px",
                left: "75px",
                zIndex: 1000,
                color: "white",
              }
            }
            ref={ref}
          >
          </div>
        </Html>
      </GizmoHelper>
    </>
  )
}
