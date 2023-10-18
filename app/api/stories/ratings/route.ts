import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";
import type { NextAuthOptions } from "next-auth";
import type { SessionProps } from "@/app/types/global.t";

/**
 * Handle get request for fetching a user's rating for a story
 * @param {string=} searchParams.id - Story id
 *
 * @returns {Promise<Response>} - Rating object
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (id) {
    try {
      const res = await prisma.rating.findMany({
        where: {
          storyId: id,
          user: {
            email: session!.user!.email!,
          },
        },
      });

      const ratingId = res[0] ? res[0].id : null;
      const ratingValue = res[0] ? res[0].rating : 0;

      return Response.json({ ratingId, ratingValue });
    } catch (error) {
      return Response.json(error);
    }
  } else {
    return Response.json({ error: "No story id provided" });
  }
};

/**
 * Handle post request
 * @param {string} searchParams.id - Story id
 * @param {integer} request.rating - Rating value (1-5)
 *
 * @returns {Promise<Response>} - Response object
 */
export const POST = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;

  if (!session) {
    return Response.json({ error: "You must be signed in to rate stories" });
  }

  const { rating } = await request.json();

  try {
    const res = await prisma.rating.create({
      data: {
        user: { connect: { email: session!.user!.email! } },
        story: { connect: { id: id } },
        rating: rating,
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};

/**
 * Handle put request
 * @param {string} searchParams.id - Rating id
 * @param {integer} request.title - Rating value
 *
 * @returns {Promise<Response>} - Response object
 */
export const PUT = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );

  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;

  if (!session) {
    return Response.json({ error: "You must be signed in to edit stories" });
  }

  const { rating } = await request.json();

  try {
    const res = await prisma.rating.update({
      where: { id: id },
      data: {
        rating: rating,
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};
