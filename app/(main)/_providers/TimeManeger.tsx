"use client"
import React, { createContext, useContext, useEffect, useRef } from "react";

type TimeContextType = {
  time: number;
  start: boolean;
  readyStart: () => void;
};
export const TimeContext = createContext(
  {
    time: 0,
    start: false,
    readyStart: () => { },
  } as TimeContextType
);
export const useTimeManager = () => useContext(TimeContext);

export const TimeProvider = ({ children }) => {
  const time = useRef<number>(0);
  const [start, setStart] = React.useState<boolean>(false);

  useEffect(() => {
    if (!start) return;
    const interval = setInterval(() => {
      time.current += 0.25;
    }, 250);
    return () => {
      clearInterval(interval);
      time.current = 0;
    }
  }, [start]);

  const readyStart = () => {
    setStart(true);
  }

  return (
    <TimeContext.Provider
      value={{
        time: time.current,
        start,
        readyStart,
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}