import { } from "three";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { useRecoilValue } from "recoil";
import { seasonStateAtom } from "@/(main)/_atoms/season";

export const Kenrokuen = () => {

  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <RoundedBox
        args={[1, 1, 1]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0]}
      />
    </>
  )
}

const Tree = () => {
  const { scene: snowTree } = useGLTF("/kenrokuen/snow-tree.gltf");
  const season = useRecoilValue(seasonStateAtom);

  return (
    <group>
      <primitive object={snowTree} />
    </group>
  )
}