import type { RootLayoutProps } from "@/types/global.t";
import "@/styles/globals.css";

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
