"use client"
import { Login } from "@/components/commons/Login";
import { SessionProvider, useSession } from "next-auth/react";
import WagmiProvider from "./wagmi.container";
import { Session } from "next-auth";

/**
 * 認証済みかどうかを判定して、認証済みなら子コンポーネントを表示する
 */
const AuthProvider = ({
  children,
  session
}: {
  children: React.ReactNode;
  session?: Session;
}
) => {

  return (
    <WagmiProvider>
      <SessionProvider session={session} refetchInterval={0}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </SessionProvider>
    </WagmiProvider>
  )
}

const SessionProviderWrapper = ({ children }) => {
  const { data, status } = useSession();
  return (
    <>
      {data &&
        <div className="w-full h-full">
          {children}
        </div>
      }
      {(!data && status !== "loading") &&
        <>
          <Login />
        </>
      }
    </>
  )
}


export default AuthProvider;