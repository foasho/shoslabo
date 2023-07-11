import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
// DB-Session
import { getOrCreateUserByAdress } from "@/crud/user";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    // Wallet
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
          let csrfToken;
          try {
            // @issue: https://github.com/nextauthjs/next-auth/issues/7166
            csrfToken = await getCsrfToken({ req: { headers: req.headers } });
          } catch (e) {
            console.error('Failed to get CSRF token:', e);
          }

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: csrfToken || "",
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
    // Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  // eslint-disable-next-line no-return-await
  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        // eslint-disable-next-line no-param-reassign
        session.address = token.sub;
        // ユーザーがあれば作成、なければ更新
        if (token.sub) {
          const user = await getOrCreateUserByAdress(token.sub);
          session.user = user;
        }
        // EMAILが管理者のものであれば管理者権限を付与
        if (token.email) {
          if (token.email === process.env.ADMIN_AUTH_ADDRESS) {
            session.user.isAdmin = true;
          }
        }
        return session;
      },
    },
  });
}
