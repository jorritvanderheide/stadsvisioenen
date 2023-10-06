// Tailwind CSS configuration file for Next.js
// https://nextjs.org/docs/app/building-your-application/styling/tailwind-css#configuring-tailwind

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
