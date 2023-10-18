// CommentCard component

import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentControls from "@/app/components/buttons/CommentControls";
import type { CommentProps, SessionProps } from "@/app/types/global.t";

const CommentCard: React.FC<CommentProps> = async (comment) => {
  const session: SessionProps | null = await getServerSession(authOptions);

  // Returns a string representing the time since the comment was created
  function timeSince(date: Date) {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  return (
    <article className="comment">
      <div className="flex gap-[2.5em] w-prose">
        <Image
          className="w-[4em] h-[4em] rounded-full"
          src={comment.user.image}
          width={460}
          height={460}
          alt={`Profile image for ${comment.user.name}`}
        />
        <div className="mt-[0.75em] flex flex-col gap-[1em] text-body w-full">
          <div className="flex justify-between items-center">
            <header>
              <h3 className="text-h3 font-semibold">{comment.user.name}</h3>
              <p>{`${timeSince(new Date(comment.createdAt))} ago`}</p>
            </header>
            {session && session!.user!.id === comment.userId && (
              <CommentControls id={comment.id} />
            )}
          </div>
          <p>{comment.content}</p>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
