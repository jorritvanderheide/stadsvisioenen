// CommentForm component

"use client";

import { FormEvent } from "react";

const CommentForm = ({ id }: { id: string }) => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content");

    if (!content) {
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/comments?id=${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="content" required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
