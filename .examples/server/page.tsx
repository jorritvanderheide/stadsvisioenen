// Accessing the session from a server page

// Imports
import { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Export default
const Home: NextPage = async () => {
  const session = await getServerSession(authOptions);

  console.log(session);

  return <main></main>;
};

export default Home;
