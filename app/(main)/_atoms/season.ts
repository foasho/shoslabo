import { atom } from "recoil";

const COLORS = ['#FFB7C5', '#F9DB7D', '#DC602E', '#F8F8FF', ];
type SeasonItemProps = {
  name: string;
  top: number;
  color: string;
};
export const SeasonItems: SeasonItemProps[] = [
  { name: 'Spring', top: 0, color: COLORS[0] },
  { name: 'Summer', top: 64, color: COLORS[1] },
  { name: 'Autumn', top: 128, color: COLORS[2] },
  { name: 'Winter', top: 192, color: COLORS[3] },
];
export type Season = "Spring" | "Summer" | "Autumn" | "Winter";


/**
 * 色からSeasonを取得する
 */
export const getColorToSeason = (color: string): Season => {
  return SeasonItems.find((item) => item.color === color)?.name as Season;
}

/**
 * Seasonから色を取得する
 */
export const getSeasonToColor = (season: Season): string => {
  return SeasonItems.find((item) => item.name === season)?.color as string;
}

export const seasonStateAtom = atom<Season|null>({
  key: "seasonState",
  default: null,
});