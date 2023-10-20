import Header from "@/app/components/bars/Header";
import Map from "@/app/components/maps/Map";
import { NextPage } from "next";
import type { StoryProps } from "@/app/types/global.t";

// Fetch stories
const getStories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }

  return res.json();
};

// Export default
const Home: NextPage = async () => {
  const stories: StoryProps[] = await getStories();

  return (
    <>
      <main className="h-[100svh] w-full overflow-hidden">
        <Header />
        {stories && <Map stories={stories} />}
      </main>
    </>
  );
};

export default Home;
