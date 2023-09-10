"use client"
import { useRouter } from "next/navigation"

export type HeaderProps = {
  fixed?: boolean;
  fontColor?: string;
  title?: string;
};
const Header = ({
  fixed = true,
  fontColor = '#fff',
  title = "SOLB",
}: HeaderProps) => {

  const router = useRouter();

  return (
    <div
      className='top-0 z-10 flex h-20 w-full items-center justify-center bg-transparent'
      style={{
        color: fontColor,
        position: fixed ? 'fixed' : 'relative',
      }}
    >
      <div className='flex h-full w-11/12 items-center justify-between'>
        <div
          className='flex items-center '>
          <div
            onClick={() => router.push("/")}
            className='ml-2 cursor-pointer select-none text-xl font-bold'>
            {title}
          </div>
        </div>
        <div className='flex items-center'>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <a onClick={() => router.push("works")}>
              Works
            </a>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <a onClick={() => router.push("blogs")}>
              Blog
            </a>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <a onClick={() => router.push("arts")}>
              Art
            </a>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <a onClick={() => router.push("about")}>
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;