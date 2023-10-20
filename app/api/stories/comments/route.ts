import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";
import type { NextAuthOptions } from "next-auth";
import type { SessionProps } from "@/app/types/global.t";

/**
 * Handle get request for fetching user comments on a story
 * @param {string=} searchParams.id - Story id
 *
 * @returns {Promise<Response>} - Comment object array
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (id) {
    try {
      const res = await prisma.comment.findMany({
        where: {
          storyId: id,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      return Response.json(res);
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
 * @param {string} request.content - Comment content
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
    return Response.json({ error: "You must be signed in to write comments" });
  }

  const { content } = await request.json();

  try {
    const res = await prisma.comment.create({
      data: {
        user: { connect: { email: session!.user!.email! } },
        story: { connect: { id: id } },
        content: content,
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};

/**
 * Handle delete request
 * @param {string} searchParams.id - Comment id
 *
 * @returns {Promise<Response>} - Response object
 */
export const DELETE = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;

  if (!session) {
    return Response.json({ error: "You must be signed in to delete comments" });
  }

  try {
    const res = await prisma.comment.delete({
      where: {
        id: id,
        userId: session!.user!.id!,
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};
