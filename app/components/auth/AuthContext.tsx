// AuthContext component: Wraps the app to make the user session available to any nested components that need to access it.

// Key features:
// - Provides the user session context to the app.

"use client";

// Imports
import { SessionProvider } from "next-auth/react";
import type { AuthContextProps } from "@/app/types/global.t";

// Export default
const AuthContext: React.FC<AuthContextProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthContext;
