// CommentControls component

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";

const CommentControls: React.FC<{ id: string }> = ({ id }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // TODO - handle edit
  const handleEdit = () => {};

  // Delete comment
  const handleDelete = async () => {
    if (!session) {
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (confirm) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/stories/comments?id=${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      } else {
        router.refresh();
      }
    } else {
      return;
    }
  };

  return (
    <div>
      {/* <button onClick={handleEdit}>Edit</button> */}
      <AnimatedLink>
        <button onClick={handleDelete}>
          <span className="material-symbols-rounded text-gray">delete</span>
        </button>
      </AnimatedLink>
    </div>
  );
};

export default CommentControls;
