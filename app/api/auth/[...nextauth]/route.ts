// Dynamic route handler for NextAuth.js
// https://next-auth.js.org/getting-started/example

import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/app/lib/prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    session: async ({ session, user }: any) => {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
