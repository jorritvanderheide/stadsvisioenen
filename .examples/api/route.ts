// Accessing the session from an api route

import { NextResponse } from "next/server";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  try {
    if (session) {
      return NextResponse.json({
        message:
          "This is protected content. You can access this content because you are signed in.",
      });
    } else {
      return NextResponse.json({
        message:
          "You must be signed in to view the protected content on this page",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Unable to fetch protected content at this time.",
    });
  }
}
