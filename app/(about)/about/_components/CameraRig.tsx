import { useFrame } from '@react-three/fiber';
import { easing } from "maath";

export const CameraRig = () => {
  useFrame((state, delta) => {
    const range = 0.05;
    const d = 30;
    easing.damp3(
      state.camera.position,
      [-range + (state.pointer.x * state.viewport.width) / d,
      (range + state.pointer.y) / d, 5.5],
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  })

  return (
    <></>
  )
}