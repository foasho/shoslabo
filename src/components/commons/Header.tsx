import { useRouter } from "next/navigation"


export const Header = ({
  fontColor = '#fff',
}) => {

  const router = useRouter();

  return (
    <div
      className='w-full h-20 bg-transparent flex items-center justify-center fixed z-10 top-0'
      style={{
        color: fontColor,
      }}
    >
      <div className='w-11/12 h-full flex items-center justify-between'>
        <div className='flex items-center'>
          <div className='ml-2 font-bold text-xl'>{"Sho'sLabo"}</div>
        </div>
        <div className='flex items-center'>
          <div className='text-xl ml-4 cursor-pointer'>
            <a onClick={() => router.push("works")}>
              Work
            </a>
          </div>
          <div className='text-xl ml-4 cursor-pointer'>
            <a onClick={() => router.push("designs")}>
              Design
            </a>
          </div>
          <div className='text-xl ml-4 cursor-pointer'>
            <a onClick={() => router.push("contact")}>
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}