// CommentForm component

"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { profanity } from "@2toad/profanity";
import Button from "../buttons/Button";

const CommentForm = ({ id }: { id: string }) => {
  const router = useRouter();

  // Check for profanity
  const checkProfanity = (content: FormDataEntryValue) => {
    if (profanity.exists(content.toString())) {
      return true;
    } else {
      return false;
    }
  };

  // Handle form submission
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content");

    if (!content) {
      return;
    }

    // Check for profanity
    if (checkProfanity(content)) {
      alert("Profanity detected");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/stories/comments?id=${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    } else {
      const form = document.getElementById("comment-form")! as HTMLFormElement;
      form.reset();
      router.refresh();
    }
  };

  return (
    <form
      id="comment-form"
      onSubmit={onSubmit}
      className="flex w-full items-center gap-[2.5em]">
      <input
        className="w-full rounded-md border border-gray p-[1em] focus:border-gray-dark"
        type="text"
        name="content"
        placeholder="Add a comment"
        required
      />
      <Button
        type="submit"
        className="flex h-[3em] w-[3em] items-center justify-center !rounded-full bg-white">
        <span className="material-symbols-rounded text-black">send</span>
      </Button>
    </form>
  );
};

export default CommentForm;
