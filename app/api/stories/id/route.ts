import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";

/**
 * Handle get request
 * @param {string=} searchParams.id - Story id from query string
 *
 * @returns {Promise<Response>} - Story object or array of story objects
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id")!;

  try {
    const res = await prisma.story.findUnique({
      where: { id: id },
      include: { user: true },
    });
    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};
