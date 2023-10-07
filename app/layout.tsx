// RootLayout: The root layout component for the application, which is used to wrap all pages.

// Key features:
// - Provides a consistent layout for all pages.
// - Renders the <html> and <body> tags.

// Related files:
// - /components/AuthProvider.tsx (provides the user session to the app)

// Imports
import AuthProvider from "@/components/providers/AuthProvider";
import type { RootLayoutProps } from "@/types/global.t";
import "@/styles/globals.css";

// Export default
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="nl">
      <AuthProvider>
        <body>{children}</body>
      </AuthProvider>
    </html>
  );
};

export default RootLayout;
