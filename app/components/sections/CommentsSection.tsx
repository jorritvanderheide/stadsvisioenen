// CommentsSection component

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

const CommentsSetion = async ({ id }: { id: string }) => {
  const session = await getServerSession(authOptions);
  const comments: CommentProps[] = await getComments(id);

  return (
    <section id="comments">
      <h2>Comments</h2>
      {comments?.map((comment) => (
        <CommentCard key={comment.id} {...comment} />
      ))}

      {session ? (
        <CommentForm id={id} />
      ) : (
        <p>You must be logged in to write a comment</p>
      )}
    </section>
  );
};

export default CommentsSetion;
