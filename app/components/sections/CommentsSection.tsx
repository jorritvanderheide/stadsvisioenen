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
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/stories/comments?id=${id}`,
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

const CommentsSection = async ({
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
      <div className="flex w-full justify-center rounded-b-2xl border-t-[1px] border-gray bg-white p-[7.5vh]">
        <div className="flex w-full flex-col items-center gap-[2.5em]">
          <h2 className="text-h2 font-bold">Comments</h2>
          {comments.length > 0 ? (
            comments?.map((comment) => (
              <CommentCard key={comment.id} {...comment} />
            ))
          ) : (
            <p className="italic text-gray">No comments yet</p>
          )}
        </div>
      </div>
      <div className="relative -mb-[7.5vh] flex w-full justify-center p-[7.5vh]">
        <Image
          className="absolute bottom-0 left-0 z-[-1] h-full w-full object-cover opacity-80 blur-2xl"
          src={imageUrl}
          width={1024}
          height={1024}
          alt={`Blurred background`}
        />
        <div className="flex w-full max-w-prose justify-center">
          {session ? (
            <CommentForm id={id} />
          ) : (
            <p className="italic text-white">
              You must be logged in to write a comment
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentsSection;
