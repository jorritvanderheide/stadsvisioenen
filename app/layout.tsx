// RootLayout: The root layout component for the application, which is used to wrap all pages.

// Key features:
// - Provides a consistent layout for all pages.
// - Renders the <html> and <body> tags.

// Related files:
// - /components/contexts/AuthContext.tsx (provides the user session to the app)

// Imports
import AuthContext from "@/components/contexts/AuthContext";
import type { RootLayoutProps } from "@/types/global.t";
import "@/styles/globals.css";

// Export default
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="nl">
      <AuthContext>
        <body>{children}</body>
      </AuthContext>
    </html>
  );
};

export default RootLayout;
