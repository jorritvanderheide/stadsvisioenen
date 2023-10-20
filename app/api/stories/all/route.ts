import prisma from "@/app/lib/prisma/prisma";
import type { NextRequest } from "next/server";

/**
 * Handle get request
 *
 * @returns {Promise<Response>} - Story object or array of story objects
 */
export const GET = async (request: NextRequest): Promise<Response> => {
  try {
    const res = await prisma.story.findMany();

    return Response.json(res);
  } catch (error) {
    return Response.json(error);
  }
};
