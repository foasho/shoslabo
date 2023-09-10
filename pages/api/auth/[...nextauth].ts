import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// DB-Session
import { getOrCreateUserByAdress } from "@/crud/user";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
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
