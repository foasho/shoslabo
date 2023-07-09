import * as React from "react";
import { Color, extend } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import { geometry } from 'maath';
extend(geometry);

type Props = {
  width: number;
  height: number;
  backgroundColor: Color;
  backgroundOpacity: number;
  roundness: number;
} & JSX.IntrinsicElements["mesh"];

const Container = (props: Props) => {
  const { 
    width, 
    height, 
    backgroundColor, 
    backgroundOpacity, 
    roundness = 0.09,
    ...restProps 
  } =
    props;

  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered, "text");

  return (
    <mesh
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      renderOrder={1}
      {...restProps}
    >
      {/* <planeGeometry args={[width, height]} /> */}
      {/* @ts-ignore */}
      <roundedPlaneGeometry args={[width, height, roundness]} />
      <meshBasicMaterial
        color={backgroundColor}
        transparent
        opacity={backgroundOpacity}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Container;