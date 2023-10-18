// Tailwind CSS configuration file for Next.js
// https://nextjs.org/docs/app/building-your-application/styling/tailwind-css#configuring-tailwind

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#333",
      white: "#fff",
      gray: "#d9d9d9",
      "gray-dark": "#555",
    },
    fontSize: {
      h0: ["2.5rem", "1.25"],
      h1: ["1.75rem", "1.25"],
      h2: ["1.25rem", "1.25"],
      h3: ["1.1rem", "1.25"],
      body: ["0.9rem", "1.8"],
    },
    extend: {
      spacing: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
