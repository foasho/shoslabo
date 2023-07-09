import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Text, useCursor } from "@react-three/drei";
import { Color, ThreeEvent, useThree, extend, Vector2 } from "@react-three/fiber";
import { useFormContext } from "./form";
import { easing, geometry } from 'maath';
extend(geometry);

type ButtonProps = {
  value?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  color?: Color;
  disabled?: boolean;
  disabledColor?: Color;
  backgroundColor?: Color;
  roundness?: number;
  padding?: Vector2;
  font?: string;
};

export type Props = ButtonProps &
  Pick<JSX.IntrinsicElements["group"], "position" | "rotation" | "scale"> &
  Omit<JSX.IntrinsicElements["input"], "ref">;

const Button = (props: ButtonProps) => {
  const {
    backgroundColor,
    width = 1.5,
    height = 0.1325,
    fontSize = 0.0825,
    color = "black",
    roundness = 0.09,
    disabled = false,
    disabledColor = "#c2c2c2",
    padding = [0, 0.05],
    font,
    value,
  } = props;

  const _height = height + padding[1] * 2;
  const _width = width + padding[0] * 2;

  return (
    <group>
      <Text
        fontSize={fontSize}
        color={color}
        renderOrder={3}
        anchorY={"middle"}
        font={font}
      >
        {value}
      </Text>
      <mesh renderOrder={1}>
        {/** @ts-ignore */}
        <roundedPlaneGeometry args={[_width, _height, roundness]} />
        <meshBasicMaterial
          color={disabled?disabledColor: backgroundColor}
          depthWrite={false}
          transparent
        />
      </mesh>
    </group>
  );
};

const Submit = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      value,
      backgroundColor,
      color,
      disabled = false,
      disabledColor,
      roundness,
      children,
      width,
      height,
      fontSize,
      position,
      rotation,
      scale,
      ...restProps
    } = props;

    const root = React.useRef<ReactDOM.Root>(null);
    const formNode = useFormContext();
    const events = useThree((s) => s.events);
    const gl = useThree((s) => s.gl);
    const target = (formNode?.current ||
      events.connected ||
      gl.domElement.parentNode) as HTMLElement;

    const [domEl] = React.useState(() => document.createElement("div"));
    const [hovered, setHovered] = React.useState<boolean>(false);

    useCursor(hovered);

    const handleClick = React.useCallback(
      (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        // @ts-ignore
        if (formNode.current?.requestSubmit) {
          // @ts-ignore
          formNode.current.requestSubmit();
        } else {
          // @ts-ignore
          formNode.current?.submit();
        }
      },
      [formNode]
    );

    React.useLayoutEffect(() => {
      // @ts-ignore
      const curRoot = (root.current = ReactDOM.createRoot(domEl));

      target?.appendChild(domEl);

      return () => {
        target?.removeChild(domEl);
        curRoot.unmount();
      };
    }, [domEl, target]);

    React.useLayoutEffect(() => {
      root.current?.render(
        <input
          ref={ref}
          type="submit"
          value={value}
          style={{
            position: "absolute",
            left: "-1000vw",
            touchAction: "none",
            pointerEvents: "none",
            opacity: 0,
          }}
          {...restProps}
        />
      );
    });

    return (
      <>
        <group
          onClick={(e) => disabled === false && handleClick(e)}
          onPointerOver={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          position={position}
          rotation={rotation}
          scale={scale}
        >
          {children ? children : <Button {...(props as ButtonProps)} />}
        </group>
      </>
    );
  }
);

Submit.displayName = "InputSubmit";

export { Submit };