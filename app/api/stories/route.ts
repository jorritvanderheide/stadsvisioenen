import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";
import type { NextAuthOptions } from "next-auth";
import type { StoryProps, SessionProps } from "@/app/types/global.t";

/**
 * Handle get request
 * @param {string=} searchParams.id - Story id from query string
 *
 * @returns {Promise<Response>} - Story object or array of story objects
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (id) {
    try {
      const res = await prisma.story.findUnique({
        where: { id: id },
        include: { user: true },
      });
      return Response.json(res);
    } catch (error) {
      return Response.json(error);
    }
  } else {
    try {
      const res = await prisma.story.findMany({
        where: { published: true },
        orderBy: {
          updatedAt: "asc",
        },
        select: {
          id: true,
          imageUrl: true,
          longitude: true,
          latitude: true,
        },
      });

      return Response.json(res);
    } catch (error) {
      return Response.json(error);
    }
  }
};

/**
 * Handle post request
 * @param {string} request.title - Story title
 * @param {string} request.content - Story content
 * @param {string} request.imageUrl - Story image url
 * @param {number} request.longitude - Story longitude
 * @param {number} request.latitude - Story latitude
 * @param {boolean} request.published - Story published
 *
 * @returns {Promise<Response>} - Response object
 */
export const POST = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );

  if (!session) {
    return Response.json({ error: "You must be signed in to create stories" });
  }

  const { id, title, content, imageUrl, longitude, latitude, published } =
    await request.json();

  try {
    const res = await prisma.story.create({
      data: {
        id: id,
        user: { connect: { email: session!.user!.email! } },
        title: title,
        content: content,
        imageUrl: imageUrl,
        longitude: longitude,
        latitude: latitude,
        published: published,
      },
    });

    return Response.json(res);
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
};

/**
 * Handle put request
 * @param {string} request.id - Story id
 * @param {string} request.title - Story title
 * @param {string} request.content - Story content
 * @param {string} request.imageUrl - Story image url
 *
 * @returns {Promise<Response>} - Response object
 */
export const PUT = async (request: NextRequest): Promise<Response> => {
  const session: SessionProps | null = await getServerSession(
    authOptions as NextAuthOptions
  );

  if (!session) {
    return Response.json({ error: "You must be signed in to edit stories" });
  }

  const { id, title, content, imageUrl, published } = await request.json();

  try {
    const res = await prisma.story.update({
      where: {
        id: id,
        user: {
          email: session!.user!.email!,
        },
      },
      data: {
        title: title,
        content: content,
        imageUrl: imageUrl,
        published: published,
        version: {
          increment: 1,
        },
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};

/**
 * Handle delete request
 * @param {string} searchParams.id - Story id
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
    const res = await prisma.story.delete({
      where: {
        id: id,
        user: {
          email: session!.user!.email!,
        },
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};
