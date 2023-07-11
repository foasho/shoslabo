"use client";
import React from "react";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AdminLogin } from "@/components/commons/Login";

export const AdminProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  session?: Session;
}) => {

  return (
      <SessionProvider session={session} refetchInterval={0}>
        <AdminContent>
          {children}
        </AdminContent>
      </SessionProvider>
  );
}

const AdminContent = ({ children }) => {

  const { data, status } = useSession();

  return (
    <>
      {data && (data.user as any).isAdmin &&
        <>
          {children}
        </>
      }
      {data && !(data.user as any).isAdmin &&
        <>
          権限がありません
        </>
      }
      {!data && status !== 'loading' &&
        <AdminLogin />
      }
    </>
  )
}