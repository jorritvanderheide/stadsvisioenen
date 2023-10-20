import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";
import type { NextAuthOptions } from "next-auth";
import type { StoryProps, SessionProps } from "@/app/types/global.t";

/**
 * Handle post request
 * @param {boolean} request.topic - Story topic
 * @returns {Promise<Response>} - Response object
 */
export const POST = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );

  if (!session) {
    return Response.json({ error: "You must be signed in to create stories" });
  }

  const { topic } = await request.json();

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
            content: `Write a beginning of a story based on these criteria:
            Extremely provocative and immersive.
            About a possible future of the city of Eindhoven.
            The story should be about ${topic}.
            Make it probable, and not too futuristic. 
            Make it situated to the context of Eindhoven, the Netherlands.
            In the style of a Studio Ghibli movie.
            Use about 150 words.
            `,
          },
        ],
        max_tokens: 350,
        temperature: 1,
      }),
    });

    const data = await response.json();

    return Response.json(data.choices[0].message.content);
  } catch (err) {
    return Response.json(err);
  }
};
