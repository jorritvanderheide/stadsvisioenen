// RootLayout: The root layout component for the application, which is used to wrap all pages.

// Key features:
// - Provides a consistent layout for all pages.
// - Renders the <html> and <body> tags.
// - Adds global styles.
// - Sets global metadata.

// Related files:
// -

import { Metadata } from "next";
import type { RootLayoutProps } from "@/types/global.t";
import "@/styles/globals.css";

// Metadata for all pages
export const metadata: Metadata = {
  applicationName: "Stadsvisioenen",
  title: "Stadsvisioenen",
  description:
    "Burgerplatform voor het maken en delen van fictieve toekomstverhalen, om op een nieuwe manier met de inrichting van steden aan de slag te gaan.",
  keywords: "",
  authors: [
    { name: "Jorrit van der Heide", url: "https://jorritvanderheide.nl" },
  ],
  creator: "Studio van der Heide",
  publisher: "Netlify",
  viewport: { width: "device-width", initialScale: 1 },
  themeColor: "",
  robots: "index, follow",
  icons: {
    icon: "/icon.webp",
  },
  openGraph: {
    type: "website",
    url: "https://stadsvisioenen.nl",
    title: "Stadsvisioenen",
    description:
      "Burgerplatform voor het maken en delen van fictieve toekomstverhalen, om op een nieuwe manier met de inrichting van steden aan de slag te gaan.",
    siteName: "Stadsvisioenen",
    images: [
      {
        url: "https://stadsvisioenen.nl/images/thumbnail.webp",
      },
    ],
  },
};

// Export default
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
