// StoryControls component

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";
import { SessionProps, StoryProps } from "@/app/types/global.t";

const StoryControls: React.FC<{ id: string; story: StoryProps }> = ({
  id,
  story,
}) => {
  const { data: session } = useSession() as unknown as { data: SessionProps };
  const router = useRouter();

  // Delete story
  const handleDelete = async () => {
    if (!session) {
      throw new Error("Not logged in");
    }

    const confirm = window.confirm(
      "Are you sure you want to delete this story?",
    );

    if (confirm) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FETCH_URL}/stories?id=${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      } else {
        router.push("/");
      }
    } else {
      return;
    }
  };

  return (
    <div className="absolute left-0 top-0 flex w-full justify-between p-[6vw] text-white">
      <AnimatedLink>
        <Link href="/" className="h-fit">
          <span className="material-symbols-rounded">arrow_back</span>
        </Link>
      </AnimatedLink>
      {session?.user?.id === story.userId && (
        <div className="flex flex-col items-center gap-4">
          <AnimatedLink>
            <Link href={`/write?id=${story.id}`}>
              <span className="material-symbols-rounded">edit</span>
            </Link>
          </AnimatedLink>
          <AnimatedLink>
            <button onClick={handleDelete}>
              <span className="material-symbols-rounded">delete</span>
            </button>
          </AnimatedLink>
        </div>
      )}
    </div>
  );
};

export default StoryControls;
