import { Metadata } from "next";
import type { RootLayoutProps } from "@/types/global.t";
import "@/styles/globals.css";

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

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
