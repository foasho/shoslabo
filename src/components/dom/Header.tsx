import Link from "next/link";
import { Community } from "./Community";
import { AdminLogin } from "./AdminLogin";

export type HeaderProps = {
  fixed?: boolean;
  fontColor?: string;
  title?: string;
  withLogin?: boolean;
};
const Header = ({ fixed = true, fontColor = "#fff", title = "SOLB", withLogin = false }: HeaderProps) => {
  return (
    <div
      className='top-0 z-10 flex h-20 w-full items-center justify-center bg-transparent'
      style={{
        color: fontColor,
        position: fixed ? "fixed" : "relative",
      }}
    >
      <div className='flex h-full w-11/12 items-center justify-between'>
        <div className='flex items-center '>
          <Link href='/' className='ml-2 cursor-pointer select-none text-xl font-bold'>
            {title}
          </Link>
        </div>
        <div className='flex items-center'>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href='/works'>Works</Link>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href={"/blogs"}>Blog</Link>
          </div>
          <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
            <Link href={"/arts"}>Art</Link>
          </div>
          {withLogin ? (
            <AdminLogin />
          ) : (
            <>
              <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
                <Community />
              </div>
              <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
                <Link href={"/about"}>About</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
