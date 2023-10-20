import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import StoryControls from "@/app/components/buttons/StoryControls";
import CommentsSection from "@/app/components/sections/CommentsSection";
import RatingSection from "@/app/components/sections/RatingSection";
import StorySection from "@/app/components/sections/StorySection";
import type { SessionProps, StoryProps } from "@/app/types/global.t";
import { getServerSession } from "next-auth/next";
import Image from "next/image";
import Link from "next/link";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";

/**
 * Generates static paths for all stories
 * @returns {any}
 */
export async function generateStaticParams() {
  const stories = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());

  return stories.map((story: StoryProps) => ({
    id: story.id,
  }));
}

// Fetches props for a single story
async function getStory(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FETCH_URL}/stories?id=${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

// Multiple versions of this page will be statically generated using the `params` returned by `generateStaticParams`
const Read = async ({ params }: { params: { id: string } }) => {
  const session: SessionProps | null = await getServerSession(authOptions)!;
  const story: StoryProps = await getStory(params.id);

  return story ? (
    <main>
      {/* Story controls */}
      <StoryControls id={params.id} story={story} />

      {/* Story */}
      <StorySection {...story} />

      {/* Ratings */}
      {session && <RatingSection id={params.id} imageUrl={story.imageUrl} />}

      {/* Comments */}
      <CommentsSection id={params.id} imageUrl={story.imageUrl} />
    </main>
  ) : (
    <main className="relative flex h-[100svh] w-full items-center justify-center p-[6vw]">
      <div className="absolute left-[6vw] top-[6vw]">
        <AnimatedLink>
          <Link href="/" className="h-fit">
            <span className="material-symbols-rounded">arrow_back</span>
          </Link>
        </AnimatedLink>
      </div>
      <h1 className="text-h1 font-bold">Story not found</h1>
      <Image
        className="w-fullobject-cover absolute left-0 top-0 z-[-1] h-full opacity-80 blur-sm brightness-90"
        src="/images/sign-in.webp"
        width={1573}
        height={1180}
        alt="Background image"
      />
    </main>
  );
};

export default Read;
