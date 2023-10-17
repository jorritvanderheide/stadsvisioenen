// CommentControls component

"use client";

import { useSession } from "next-auth/react";

const CommentControls: React.FC<{ id: string }> = ({ id }) => {
  const { data: session } = useSession();

  // TODO - handle edit
  const handleEdit = () => {};

  // Delete comment
  const handleDelete = async () => {
    if (!session) {
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/comments?id=${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  };

  return (
    <div>
      {/* <button onClick={handleEdit}>Edit</button> */}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default CommentControls;
