// Read page: Shows a single story, with comments and ratings.

// Key features:
// - Read a story

// Imports
import Link from "next/dist/client/link";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { StoryProps, SessionProps } from "@/app/types/global.t";

// Generate static paths for all stories
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

  return (
    <main>
      <Link href="/">
        <span className="material-symbols-rounded">arrow_back</span>
      </Link>
      {session?.user?.id === story.userId && (
        <Link href={`/write?id=${story.id}`}>Edit</Link>
      )}
      <h1>{story.title}</h1>
      <Image
        src={story.imageUrl.toString()}
        width={1024}
        height={1024}
        alt="title"
      />
      <div dangerouslySetInnerHTML={{ __html: story.content }} />
    </main>
  );
};

export default Read;
