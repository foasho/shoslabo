import { Text, useTexture } from "@react-three/drei";

export const ContactCircle = ({
  onClick
}) => {
  const [emailTex] = useTexture([
    "/textures/email.png",
  ]);

  return (
    <group
      onClick={onClick}
    >
      <mesh>
        <circleGeometry args={[0.025, 32]} />
        <meshBasicMaterial
          color={"#ffffff"}
          map={emailTex}
        />
      </mesh>
      <Text
        scale={0.03}
        position={[0.08, -0.005, 0]}
        color={"#00BFFF"}
      >
        Contact
      </Text>
    </group>
  )
}