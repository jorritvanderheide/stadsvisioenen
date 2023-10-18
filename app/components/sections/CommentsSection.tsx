// CommentsSection component

import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentCard from "@/app/components/cards/CommentCard";
import CommentForm from "@/app/components/forms/CommentForm";
import type { CommentProps } from "@/app/types/global.t";

// Fetches the comments for a story
const getComments = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/comments?id=${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const CommentsSetion = async ({
  id,
  imageUrl,
}: {
  id: string;
  imageUrl: string;
}) => {
  const session = await getServerSession(authOptions);
  const comments: CommentProps[] = await getComments(id);

  return (
    <section id="comments">
      <div className="bg-white p-[7.5vh] w-full justify-center flex border-t-[1px] border-gray rounded-b-2xl">
        <div className="flex flex-col items-center gap-[2.5em]">
          <h2 className="text-h2 font-bold">Comments</h2>
          {comments.length > 0 ? (
            comments?.map((comment) => (
              <CommentCard key={comment.id} {...comment} />
            ))
          ) : (
            <p className="text-gray italic">No comments yet</p>
          )}
        </div>
      </div>
      <div className="relative w-screen p-[7.5vh] -mb-[7.5vh] flex justify-center">
        <Image
          className="absolute bottom-0 left-0 blur-2xl opacity-80 z-[-1] w-full object-cover"
          src={imageUrl}
          width={1024}
          height={1024}
          alt={`Blurred background`}
        />
        <div className="w-prose flex justify-center">
          {session ? (
            <CommentForm id={id} />
          ) : (
            <p className="text-white italic">
              You must be logged in to write a comment
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentsSetion;
