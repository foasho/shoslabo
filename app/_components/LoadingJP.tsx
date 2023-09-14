import Image from "next/image"
import { useEffect } from "react"

export const LoadingJP = () => {

  useEffect(() => {}, [])

  return (
    <div className="z-100 path-loader fixed left-0 top-0 h-screen w-screen bg-gray-500">
      <img src="/icons/safari-pinned-tab.svg" />
    </div>
  )
}