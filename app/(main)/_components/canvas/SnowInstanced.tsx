"use client";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

type SnowInstancedProps = {
  count?: number;
  position?: Vector3;
  size?: number;
  fallSpeed?: number;
  dummy?: Object3D;
};
export const SnowInstanced = (
  {
    count = 100,
    position = new Vector3(4, 4, 4),
    size = 0.02,
    fallSpeed = 0.015,
    dummy = new Object3D()
  }: SnowInstancedProps
) => {

  const mesh = useRef<InstancedMesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp: any = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      // Position
      const xFactor = -position.x + Math.random() * position.x * 2;
      const yFactor = -position.y + Math.random() * position.y * 2;
      const zFactor = -position.z + Math.random() * position.z * 2;
      temp.push({ t, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp;
  }, [count])

  useEffect(() => {
    if (mesh.current === null) return;
  }, [count, position]);

  // 毎フレーム事にFallSpeed分下に移動させる
  useFrame((state, delta) => {
    if (mesh.current === null) return;
    particles.forEach((particle, i) => {
      let { t } = particle;
      t = particle.t += fallSpeed * randomRange(0.8, 1.2);
      // マウスの動きで風を再現
      const { x, y } = mouse.current;
      particle.mx += (x - state.mouse.x) * 0.1;
      particle.my += (y - state.mouse.y) * 0.1;

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

      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      if (mouse.current) {
        mouse.current = { x: state.mouse.x, y: state.mouse.y };
      }
    })
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
      </instancedMesh>
    </>
  )
};