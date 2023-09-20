import Link from "next/link";

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
          <Link
            href='/'
            className='ml-2 cursor-pointer select-none text-xl font-bold'
          >
            {title}
          </Link>
        </div>
        <div className='flex items-center'>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href='/works'>
              Works
            </Link>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href={"/blogs"}>
              Blog
            </Link>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href={"/art"}>
              Art
            </Link>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href={"/about"}>
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;