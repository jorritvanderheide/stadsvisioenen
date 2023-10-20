import type { RootLayoutProps } from "@/app/types/global.t";
import "material-symbols";

import AuthContext from "@/app/components/auth/AuthContext";

import "@/app/styles/globals.css";

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
