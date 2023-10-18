// CommentForm component

"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { profanity } from "@2toad/profanity";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";

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
      `${process.env.NEXT_PUBLIC_FETCH_URL}/stories/comments?id=${id}`,
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
      className="flex gap-[2.5em] w-full">
      <input
        className="w-full h-[2.5em] px-1 border-b-2 bg-transparent outline-none border-white text-white"
        type="text"
        name="content"
        placeholder="Add a comment"
        required
      />
      <AnimatedLink>
        <button type="submit">
          <span className="material-symbols-rounded text-white pt-2">send</span>
        </button>
      </AnimatedLink>
    </form>
  );
};

export default CommentForm;
