import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Editor from "@/app/components/editors/Editor";
import { NextPage } from "next";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import AnimatedLink from "@/app/components/buttons/AnimatedLink";

// Export default
const Write: NextPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <main>
      <div className="absolute left-0 top-0 flex w-full justify-between p-[6vw] text-white">
        <AnimatedLink>
          <Link href="/" className="h-fit">
            <span className="material-symbols-rounded">arrow_back</span>
          </Link>
        </AnimatedLink>
      </div>

      <Editor />
    </main>
  );
};

export default Write;
