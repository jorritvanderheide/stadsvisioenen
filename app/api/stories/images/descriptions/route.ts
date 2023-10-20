import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { NextAuthOptions } from "next-auth";
import type { SessionProps } from "@/app/types/global.t";

/**
 * Handle post request
 * @param {string} request.prompt - Story content to generate image description
 *
 * @returns {Promise<Response>} - Cover image description string
 */
export const POST = async (request: Request): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );

  if (!session) {
    return Response.json({
      error: "You must be signed in to generate image descriptions",
    });
  }

  const { prompt } = await request.json();

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: `Write a short alt-text style description for an image that could be the cover of this story: ${prompt}.`,
          },
        ],
        max_tokens: 250,
        temperature: 1,
      }),
    });

    const data = await res.json();

    const description = data.choices[0].message.content;

    return Response.json(description);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
};
