import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";
import type { NextAuthOptions } from "next-auth";
import type { StoryProps } from "@/app/types/global.t";

// Handle get request
export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (id) {
    try {
      const res = await prisma.story.findUnique({
        where: { id: id },
      });
      return Response.json(res);
    } catch (error) {
      return Response.json(error);
    }
  } else {
    try {
      const res = await prisma.story.findMany();

      return Response.json(res);
    } catch (error) {
      return Response.json(error);
    }
  }
};

// Handle post request
export const POST = async (request: Request) => {
  const session = await getServerSession(authOptions as NextAuthOptions);

  if (!session) {
    return Response.json({ error: "You must be signed in to create stories" });
  }

  const { title, content, imageUrl, longitude, latitude, published } =
    await request.json();

  try {
    const res: StoryProps = await prisma.story.create({
      data: {
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
    return Response.json(error);
  }
};

// Handle put request
export const PUT = async (request: Request) => {
  const session = await getServerSession(authOptions as NextAuthOptions);

  if (!session) {
    return Response.json({ error: "You must be signed in to edit stories" });
  }

  const { id, title, content, imageUrl, published } = await request.json();

  try {
    const res: StoryProps = await prisma.story.update({
      where: { id: id },
      data: {
        title: title,
        content: content,
        imageUrl: imageUrl,
        published: published,
      },
    });

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};
