import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";
import type { NextAuthOptions } from "next-auth";
import type { StoryProps, SessionProps } from "@/app/types/global.t";

/**
 * Handle post request
 * @param {boolean} request.prompt - Idea query
 * @returns {Promise<Response>} - Response object
 */
export const POST = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );

  if (!session) {
    return Response.json({ error: "You must be signed in to create stories" });
  }

  const { prompt } = await request.json();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Write a one-sentence idea to for a short story based on these criteria:
            It should be speculative fiction, but not about technology.
            It should be about the future of a specific location in the city of Eindhoven.
            It should be about ${prompt}.
            It is meant to be a fun way to discuss the possbile future of the city in the social domain.
            `,
          },
        ],
        max_tokens: 250,
        temperature: 1,
      }),
    });

    const data = await response.json();

    return Response.json(data.choices[0].message.content);
  } catch (err) {
    return Response.json(err);
  }
};
