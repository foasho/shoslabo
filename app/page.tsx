import Image from "next/image"
import { Home } from "./_components/Home"
import { Typography } from "@/components/commons/Typography"

export default async function Page() {

  return (
    <>
      <div
        className="absolute top-0 w-full"
        style={
          {
            height: '100%',
          }
        }
      >
        <div className="flex h-screen w-full md:w-1/2 lg:w-2/3">
          <Home />
        </div>
        <div className={"absolute right-0 top-0 z-10 hidden h-screen bg-red-500 md:block md:w-1/2 lg:w-1/3"}>
          <div className="h-full w-full divide-dotted">
            <div className="flex h-2/3 items-center justify-center">
              <div>
                <Typography variant="h1">
                  かなざわ在住
                </Typography>
                <Typography variant="h1">
                  ITエンジニア
                </Typography>
              </div>
            </div>
            <div className="flex h-1/3 items-center justify-center">
              <img
                src="/img/yagasuri.png"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
