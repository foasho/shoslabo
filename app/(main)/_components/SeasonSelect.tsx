"use client";
import React, { useEffect } from 'react';
import { useTransition, animated } from '@react-spring/web';

const COLORS = ['#669EF2', '#F9DB6D', '#DC602E', '#83BB70'];
const Items = [
  { name: 'Spring', top: 0, color: COLORS[0] },
  { name: 'Summer', top: 0, color: COLORS[1] },
  { name: 'Autumn', top: 0, color: COLORS[2] },
  { name: 'Winter', top: 0, color: COLORS[3] },
];

export const SeasonSelect = () => {

  // 現在時刻を取得
  const now = new Date();

  const [selectedColor, setSelectedColor] = React.useState(COLORS[0]);

  useEffect(() => { }, [selectedColor]);

  let height = 0;
  const transitions = useTransition(
    Items.map((data, idx) => ({ ...data, top: 64*idx })),
    {
      key: (item: any) => item.name,
      from: { top: 0, opacity: 0 },
      leave: ({ top }) => ({ top, opacity: 1 }),
      enter: ({ top }) => ({ top, opacity: 1 }),
      update: ({ top }) => ({ top }),
    }
  );

  return (
    <div className={"fixed left-4 top-24 z-10"}>
      <div className={"absolute"}>
        {transitions(({ top, ...rest }, item) => (
          <animated.div
            key={item.name}
            className={"absolute"}
            style={{
              ...rest,
              top : `${item.top}px`,
            }}
          >
            <ColorCicle color={item.color} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
          </animated.div>
        ))}
      </div>
    </div>
  )
}

const ColorCicle = ({ color, selectedColor, setSelectedColor }) => {
  return (
    <div
      style={{
        background: color,
      }}
      className={`
        h-12 w-12 cursor-pointer select-none rounded-full 
        ${color === selectedColor ? "border-4 border-white" : ""}
      `}
      onClick={() => {
        setSelectedColor(color);
      }}
    >
    </div>
  )
}
