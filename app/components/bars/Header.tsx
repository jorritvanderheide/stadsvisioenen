// Header component: Header of the app.

// Key features:
// - Renders the header of the app.

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header
      className={`fixed top-0 left-0 w-screen h-[5em] flex justify-center items-center ${
        session ? `bg-green-500` : `bg-red-500`
      }`}>
      {session ? (
        <Link href="/api/auth/signout">Sign out</Link>
      ) : (
        <Link href="/api/auth/signin">Sign in</Link>
      )}
    </header>
  );
};

export default Header;
