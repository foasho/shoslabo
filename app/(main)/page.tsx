import { Home } from "./_components/Home";
import { SeasonSelect } from "./_components/SeasonSelect";
import { SideText } from "./_components/dom/SideText";

export default function Page() {

  return (
    <div
      className="absolute top-0 w-full"
      style={
        {
          height: '100%',
        }
      }
    >
      <div className="flex h-screen w-full md:w-2/3">
        <SeasonSelect />
        <Home />
      </div>
      <div className={"absolute right-0 top-0 z-10 hidden h-screen bg-[#BA2636] md:block md:w-1/3"}>
        <div className="h-full w-full divide-dotted">
          <SideText />
        </div>
      </div>
    </div>
  )
}
