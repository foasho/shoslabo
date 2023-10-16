import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3, InstancedMesh, Object3D, DoubleSide } from "three";

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

type AutumnLeafProps = {
  count?: number;
  position?: Vector3;
  size?: number;
  fallSpeed?: number;
  dummy?: Object3D;
};
export const AutumnLeaf = (
  {
    count = 100,
    position = new Vector3(4, 4, 4),
    size = 0.2,
    fallSpeed = 0.005,
    dummy = new Object3D()
  }: AutumnLeafProps
) => {

  const mesh = useRef<InstancedMesh>(null);

  const [leaf1, leaf2, leaf3, leaf4] = useTexture([
    "/textures/autumn/1.png", 
    "/textures/autumn/2.png",
    "/textures/autumn/3.png",
    "/textures/autumn/4.png"
  ]);

  const getTex = () => {
    // Randomでテクスチャを選択
    const tex = Math.floor(Math.random() * 4);
    switch (tex) {
      case 0:
        return leaf1;
      case 1:
        return leaf2;
      case 2:
        return leaf3;
      case 3:
        return leaf4;
      default:
        return leaf1;
    }
  }

  const particles = useMemo(() => {
    const temp: any = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      // Position
      const xFactor = -position.x + Math.random() * position.x * 2;
      const yFactor = -position.y + Math.random() * position.y * 2;
      const zFactor = -position.z + Math.random() * position.z * 2;
      // Rotation
      const rx = Math.PI * randomRange(-1, 1);
      const ry = Math.PI * randomRange(-1, 1);
      const rz = Math.PI * randomRange(-1, 1);
      temp.push({ 
        t, 
        xFactor, 
        yFactor, 
        zFactor, 
        mx: 0, 
        my: 0,
        rx,
        ry,
        rz,
      })
    }
    return temp;
  }, [count, position]);

  // 毎フレーム事にFallSpeed分下に移動させる
  useFrame((state, delta) => {
    if (mesh.current === null) return;
    particles.forEach((particle, i) => {
      let { t } = particle;
      t = particle.t += fallSpeed * randomRange(0.8, 1.2);

      // 落ちるように移動
      // -0.5まで落ちたら上に戻す
      const fally = particle.yFactor - t;
      if (fally < -1.5) {
        particle.t = 0;
        particle.yFactor = -position.y + Math.random() * position.y * 2;
      }
      dummy.position.set(
        particle.xFactor + particle.mx,
        particle.yFactor - t,
        particle.zFactor + particle.my
      );

      // Frame Rotation
      particle.rx += 0.03;
      particle.ry += 0.03;
      particle.rz += 0.02;
      dummy.rotation.set(
        particle.rx,
        particle.ry,
        particle.rz
      );

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    })
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        attach="material"
        map={getTex()}
        transparent={true}
        side={DoubleSide}
      />
    </instancedMesh>
  )
};