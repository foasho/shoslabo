"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export const AdminLogin = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <div className='ml-2 cursor-pointer select-none text-lg md:ml-4 md:text-xl'>
      {!session ? <Link href={"/blogs/admin"}>Login</Link> : <a onClick={() => signOut()}>Logout</a>}
    </div>
  );
};
