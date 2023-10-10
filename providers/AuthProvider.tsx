"use client"
import { Login } from "@/components/commons/Login";
import { SessionProvider, useSession } from "next-auth/react";
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
    <SessionProvider session={session} refetchInterval={0}>
      <SessionProviderWrapper>
        {children}
      </SessionProviderWrapper>
    </SessionProvider>
  )
}

const SessionProviderWrapper = ({ children }) => {
  const { data, status } = useSession();
  return (
    <>
      {data &&
        <div className="h-full w-full">
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