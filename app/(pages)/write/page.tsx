// Write page: Shows a form to write a new story or edit an existing one.

// Key features:
// - Write a new story
// - Edit an existing story

// Imports
import { NextPage } from "next";
import Editor from "@/app/components/editors/Editor";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
