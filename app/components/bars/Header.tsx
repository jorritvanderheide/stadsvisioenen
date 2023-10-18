// Header component: Header of the app.

// Key features:
// - Renders the header of the app.

"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";

const Header: FunctionComponent = () => {
  const { data: session } = useSession();

  return (
    <header
      className={`pointer-events-none fixed left-0 top-0 z-10 h-[5em] w-screen`}
    >
      <div className="flex items-center justify-between p-[5em]">
        <p className="text-h0 font-bold uppercase text-white drop-shadow-md">
          Stadsvisioenen
        </p>
        <AnimatedLink>
          {session ? (
            <button onClick={() => signOut()}>
              <Image
                className="h-[4em] w-[4em] cursor-pointer rounded-full border-4 border-white shadow-md"
                src={session.user?.image!}
                width={460}
                height={460}
                alt={`Profile image for ${session.user?.name}`}
              />
              <span className="material-symbols-rounded absolute left-[0.9em] top-[0.9em] hidden font-semibold text-white group-hover:block">
                logout
              </span>
            </button>
          ) : (
            <Link href="/api/auth/signin" className="relative">
              <div className="h-[4em] w-[4em] cursor-pointer rounded-full border-4 border-white shadow-md">
                <span className="material-symbols-rounded absolute left-[0.7em] top-[0.85em] font-semibold text-white">
                  login
                </span>
              </div>
            </Link>
          )}
        </AnimatedLink>
      </div>
    </header>
  );
};

export default Header;
