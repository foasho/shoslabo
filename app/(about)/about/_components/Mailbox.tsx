import { useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "three";

interface IMailBoxProps {
  position?: [number, number, number] | Vector3;
  rotation?: [number, number, number] | Euler;
  scale?: number | [number, number, number] | Vector3;
}
export const MailBox = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 3
}: IMailBoxProps) => {

  const { scene, nodes } = useGLTF("/models/mailbox.glb") as any;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  )
}