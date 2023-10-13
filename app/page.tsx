// Home page: The primary landing page for users, showing a map view of the city they are in with nearby stories.

// Key features:
// - Map view of the city
// - List of nearby stories

// Imports
import { NextPage } from "next";
import Map from "@/app/components/maps/Map";

//
async function getStories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }

  return res.json();
}

// Export default
const Home: NextPage = async () => {
  const stories = await getStories();

  return (
    <main className="h-[calc(100svh_-_5em)] w-full overflow-hidden">
      <Map stories={stories} />
    </main>
  );
};

export default Home;
