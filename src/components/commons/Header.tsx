import { useRouter } from "next/navigation"


export const Header = ({
  fixed = true,
  fontColor = '#fff',
  title = "SOLB",
}) => {

  const router = useRouter();

  return (
    <div
      className='w-full h-20 bg-transparent flex items-center justify-center z-10 top-0'
      style={{
        color: fontColor,
        position: fixed ? 'fixed' : 'relative',
      }}
    >
      <div className='w-11/12 h-full flex items-center justify-between'>
        <div
          className='flex items-center '>
          <div
            onClick={() => router.push("/")}
            className='ml-2 font-bold text-xl cursor-pointer'>
            {title}
          </div>
        </div>
        <div className='flex items-center'>
          <div className='text-lg md:text-xl ml-2 md:ml-4 cursor-pointer'>
            <a onClick={() => router.push("works")}>
              Works
            </a>
          </div>
          <div className='text-lg md:text-xl ml-2 md:ml-4 cursor-pointer'>
            <a onClick={() => router.push("blogs")}>
              Blog
            </a>
          </div>
          <div className='text-lg md:text-xl ml-2 md:ml-4 cursor-pointer'>
            <a onClick={() => router.push("arts")}>
              Art
            </a>
          </div>
          <div className='text-lg md:text-xl ml-2 md:ml-4 cursor-pointer'>
            <a onClick={() => router.push("about")}>
              About
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}