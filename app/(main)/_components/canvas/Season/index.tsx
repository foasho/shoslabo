import { AutumnLeaf } from "./Autumn";
import { SnowInstanced } from "./SnowInstanced";
import { useRecoilValue } from "recoil";
import { seasonStateAtom } from '../../../_atoms/season';
import { Trees } from "./Trees";


export const SeasonScene = () => {

  const selectedSeason = useRecoilValue(seasonStateAtom);

  return (
    <>
      {selectedSeason === "Spring" && (<></>)}
      {selectedSeason === "Summer" && (<></>)}
      {selectedSeason === "Autumn" && (<AutumnLeaf />)}
      {selectedSeason === "Winter" && (<SnowInstanced />)}

      {selectedSeason && (
        <Trees season={selectedSeason} />
      )}
    </>
  )
}