import { useThree } from "@react-three/fiber";
import React, { createContext, useContext, useRef, useLayoutEffect, useState, forwardRef } from "react";
import ReactDOM, { Root, createRoot } from "react-dom/client";

const FormContext = createContext({ current: null });

export const useFormContext = () => {
  return useContext(FormContext);
}

type Props = Omit<React.HTMLAttributes<HTMLFormElement>, "ref">;

const Form = forwardRef(
  (props: Props, ref: React.MutableRefObject<HTMLFormElement>
) => {
    const { children, ...restProps } = props;
    const events = useThree((s) => s.events);
    const gl = useThree((s) => s.gl);
    const root = useRef<Root>(null);
    const localRef = useRef<HTMLFormElement>(null);
    const domRef: any = ref || localRef;
    const target = (events.connected ||
      gl.domElement.parentNode) as HTMLElement;

    const [domEl] = useState(() => document.createElement("div"));

    useLayoutEffect(() => {
      // @ts-ignore
      const curRoot = (root.current = createRoot(domEl));

      target?.appendChild(domEl);

      return () => {
        target?.removeChild(domEl);
        curRoot.unmount();
      };
    }, [target, domEl]);

    React.useLayoutEffect(() => {
      root.current?.render(
        <form
          ref={domRef}
          id="_r3f-input-form"
          style={{ opacity: 0, pointerEvents: "none", touchAction: "none" }}
          {...restProps}
        ></form>
      );
    });

    return (
      <FormContext.Provider value={domRef}>
        {children}
      </FormContext.Provider>
    );
  }
);

Form.displayName = "Form";

export { Form };