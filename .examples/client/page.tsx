// Accessing the session from a client page

"use client";

// Imports
import { NextPage } from "next";
import { useSession } from "next-auth/react";

// Export default
const Home: NextPage = () => {
  const { data: session, status } = useSession();

  console.log(session);

  return <main></main>;
};

export default Home;
