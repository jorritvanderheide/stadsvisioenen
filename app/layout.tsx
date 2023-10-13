// RootLayout: The root layout component for the application, which is used to wrap all pages.

// Key features:
// - Provides a consistent layout for all pages.
// - Renders the <html> and <body> tags.

// Related files:
// - /components/contexts/AuthContext.tsx (provides the user session to the app)

// Imports
import AuthContext from "@/app/components/auth/AuthContext";
import type { RootLayoutProps } from "@/app/types/global.t";
import Header from "@/app/components/bars/Header";
import "material-symbols";
import "@/app/styles/globals.css";

// Export default
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="nl">
      <AuthContext>
        <body>
          <Header />
          <div className="mt-[5em]">{children}</div>
        </body>
      </AuthContext>
    </html>
  );
};

export default RootLayout;
