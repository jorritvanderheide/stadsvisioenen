// Dynamic route handler for NextAuth.js
// https://next-auth.js.org/getting-started/example

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma/prisma";

const authHandler = (req, res) => NextAuth(req, res, authOptions);

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export default authHandler;
