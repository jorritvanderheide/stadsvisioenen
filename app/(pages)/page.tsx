import Header from "@/app/components/bars/Header";
import Map from "@/app/components/maps/Map";
import prisma from "@/app/lib/prisma/prisma";

// Fetch stories
async function getData() {
  const res: any = await prisma.story.findMany();

  return res;
}

// Export default
export default async function Home() {
  const data = await getData();

  return (
    <>
      <main className="h-[100svh] w-full overflow-hidden">
        <Header />
        {data && <Map stories={data} />}
      </main>
    </>
  );
}
