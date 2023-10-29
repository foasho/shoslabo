"use client";
import { MutableRefObject, useMemo, useRef } from "react";
import { Vector3, Euler, Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Clone, useTexture } from "@react-three/drei";
import { Color, FrontSide, MeshStandardMaterial } from "three";
// @ts-ignore
import CustomShaderMaterial from "three-custom-shader-material";
import vert from "@/shaders/tree.vert";
import { Season, getSeasonToColor } from "@/(main)/_atoms/season";

type TreesProps = {
  season: Season;
};
export const Trees = (
  { season }: TreesProps
) => {

  const color = getSeasonToColor(season);

  return (
    <group position={[0, -1.5, 0]}>
      {/** Treeをまばらに大きさと位置を配置 */}
      <Tree position={[1.2, 0, -4]} rotation={[0, 1, 0]} scale={0.6} leafColor={color} />
      <Tree position={[1.8, 0, -4]} rotation={[0, 3, 0]} scale={0.4} leafColor={color} />
      <Tree position={[2, 0, 1]} rotation={[0, 2, 0]} scale={1.6} leafColor={color} />
    </group>
  );
};

/**
 * 木
 */
interface ITreeProps {
  position?: [number, number, number] | Vector3;
  rotation?: [number, number, number] | Euler;
  scale?: [number, number, number] | Vector3 | number;
  trunkColor?: string;
  leafColor?: string;
  leafScale?: number;
  leafAmount?: number;
}
export const Tree = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  trunkColor = "#b18b55",
  leafColor = "#3f6d21",
  leafScale = 1.0,
  leafAmount = 1.0,
}: ITreeProps) => {
  const tree = useGLTF("/models/tree.glb");
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/** 幹の部分  */}
      <Clone
        // @ts-ignore
        object={tree.nodes.trunk}
        inject={<meshStandardMaterial color={trunkColor} />}
      />
      {/** 葉っぱの部分  */}
      <Clone
        receiveShadow
        castShadow
        // @ts-ignore
        object={tree.nodes.foliage}
        inject={<FoliageMaterial leafColor={leafColor} scale={leafScale} effctBlend={leafAmount} />}
      />
    </group>
  );
};

/**
 * 葉っぱの部分
 * @param param0
 * @returns
 */
export const FoliageMaterial = ({
  leafColor = "#3f6d21",
  leavesTexURL = "/textures/foliage.png",
  scale = 1.0, // 葉っぱの大きさ
  windSpeed = 1.0,
  windTime = 0.0,
  effctBlend = 1.0, // 葉っぱの量
}) => {
  const ref: MutableRefObject<any | null> = useRef(null);
  const alphaMap = useTexture(leavesTexURL);

  useFrame((_, delta) => {
    ref.current.uniforms.u_windTime.value += ref.current.uniforms.u_windSpeed.value * delta;
  });

  const uniforms = useMemo(
    () => ({
      u_effectBlend: { value: effctBlend },
      u_inflate: { value: 0.0 },
      u_scale: { value: scale },
      u_windSpeed: { value: windSpeed },
      u_windTime: { value: windTime },
    }),
    [],
  );

  return (
    <CustomShaderMaterial
      alphaMap={alphaMap}
      alphaTest={0.5}
      baseMaterial={MeshStandardMaterial}
      color={new Color(leafColor).convertLinearToSRGB()}
      ref={ref}
      uniforms={uniforms}
      vertexShader={vert}
      shadowSide={FrontSide}
    />
  );
};
