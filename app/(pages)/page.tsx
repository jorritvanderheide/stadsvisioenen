import Header from "@/app/components/bars/Header";
import Map from "@/app/components/maps/Map";
import { StoryProps } from "@/app/types/global.t";
import { NextPage } from "next";

// Fetch stories
async function getStories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/api/stories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }

  return res.json();
}

// Export default
const Home: NextPage = async () => {
  const stories: StoryProps[] = await getStories();

  return (
    <>
      <main className="h-[100svh] w-full overflow-hidden">
        <Header />
        <Map stories={stories!} />
      </main>
    </>
  );
};

export default Home;
