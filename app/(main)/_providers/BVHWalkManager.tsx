"use client"
import React, { createContext, useContext } from "react";

type BVHWalkContextType = {
  start: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
};
export const BVHWalkContext = createContext(
  {} as BVHWalkContextType
);
export const useBVHWalk = () => useContext(BVHWalkContext);

export const BVHPhysicsProvider = ({ children }) => {
  const [start, setStart] = React.useState<boolean>(false);
  return (
    <BVHWalkContext.Provider
      value={{
        start,
        setStart,
      }}
    >
      {children}
    </BVHWalkContext.Provider>
  )
}