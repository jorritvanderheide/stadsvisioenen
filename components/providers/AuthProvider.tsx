// AuthProvider component: Wraps the app to make the user session available to any nested components that need to access it.

// Key features:
// - Provides the user session to the app.

"use client";

// Imports
import { SessionProvider } from "next-auth/react";
import type { AuthProviderProps } from "@/types/global.t";

// Export default
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
