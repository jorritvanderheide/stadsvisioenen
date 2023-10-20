import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Editor from "@/app/components/editors/Editor";
import { NextPage } from "next";
import { getServerSession } from "next-auth/next";

// Export default
const Write: NextPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <main>
      <Editor />
    </main>
  );
};

export default Write;
