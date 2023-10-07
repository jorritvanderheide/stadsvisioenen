// Home page: The primary landing page for users, showing a map view of the city they are in with nearby stories.

// Key features:
// -

// Related files:
// -

// Imports
import { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Export default
const Home: NextPage = async () => {
  const session = await getServerSession(authOptions);

  console.log(session);

  return <main></main>;
};

export default Home;
