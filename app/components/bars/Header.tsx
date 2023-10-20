"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { FunctionComponent } from "react";

import AnimatedLink from "@/app/components/buttons/AnimatedLink";

// Header component: Header of the app.

// Key features:
// - Renders the header of the app.

const Header: FunctionComponent = () => {
  const { data: session } = useSession();

  return (
    <header
      className={`pointer-events-none fixed left-0 top-0 z-10 h-[5em] w-screen`}>
      <div className="flex items-center justify-between p-[6vw] xl:py-[4vw]">
        <p className="text-h1 font-bold uppercase text-white drop-shadow-md lg:text-h0">
          Stadsvisioenen
        </p>

        {session ? (
          <>
            {session.user?.email! === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
              <Image
                className="h-[3em] w-[3em] cursor-pointer rounded-full border-[4px] border-white shadow-md"
                src={session.user?.image!}
                width={460}
                height={460}
                alt={`Profile image for ${session.user?.name}`}
              />
            ) : (
              <AnimatedLink>
                <button onClick={() => signOut()}>
                  <Image
                    className="h-[3em] w-[3em] cursor-pointer rounded-full border-[4px] border-white shadow-md"
                    src={session.user?.image!}
                    width={460}
                    height={460}
                    alt={`Profile image for ${session.user?.name}`}
                  />
                </button>
              </AnimatedLink>
            )}
          </>
        ) : (
          <AnimatedLink>
            <Link href="/api/auth/signin" className="relative">
              <div className="flex h-[3em] w-[3em] cursor-pointer items-center justify-center rounded-full border-[4px] border-white bg-white/25 shadow-md">
                <span className="material-symbols-rounded font-semibold text-white">
                  login
                </span>
              </div>
            </Link>
          </AnimatedLink>
        )}
      </div>
    </header>
  );
};

export default Header;
