import Header from "@/app/components/bars/Header";
import Map from "@/app/components/maps/Map";
import { NextPage } from "next";

// Fetch stories
async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FETCH_URL}/stories/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }

  return res.json();
}

// Export default
export default async function Home() {
  const data = await getData();

  console.log(data);

  return (
    <>
      <main className="h-[100svh] w-full overflow-hidden">
        <Header />
        {/* {data && <Map stories={data} />} */}
      </main>
    </>
  );
}
