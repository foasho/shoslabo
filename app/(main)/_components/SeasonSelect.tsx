"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from "recoil";
import { SeasonItems, seasonStateAtom, getColorToSeason, getSeasonToColor, type Season } from '../_atoms/season';

export const SeasonSelect = () => {

  const [selectedSeason, setSelectedSeason] = useRecoilState(seasonStateAtom);

  useEffect(() => {
    if (selectedSeason == null){
      // 現在の月から季節を判定
      const date = new Date();
      const month = date.getMonth();
      let season: Season = "Spring";
      if (month >= 3 && month <= 5) {
        season = "Spring";
      }
      if (month >= 6 && month <= 8) {
        season = "Summer";
      }
      if (month >= 9 && month <= 11) {
        season = "Autumn";
      }
      if (month >= 12 || month <= 2) {
        season = "Winter";
      }
      setSelectedSeason(season);
    }
  });

  const selectSeasonColor = (color: string) => {
    const season = getColorToSeason(color);
    setSelectedSeason(season);
  }

  const selectedColor = useMemo(() => {
    if (selectedSeason === null) return null;
    return getSeasonToColor(selectedSeason);
  }, [selectedSeason]);

  return (
    <div className={"fixed left-4 top-24 z-10"}>
      <div className={"absolute"}>
        {SeasonItems.map((item, index) => {
          return (
            <div
              key={item.name}
              className={"absolute"}
              style={{
                top : `${item.top}px`,
              }}
            >
              <ColorCicle 
                color={item.color} 
                selectedColor={selectedColor} 
                setSelectedColor={selectSeasonColor} 
              />
            </div>
          )
        })}
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
