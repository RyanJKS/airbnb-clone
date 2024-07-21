import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'airbnb': '#ff385c',  // NOTE: Extend these colours to be used throughout the project
        'airbnb-dark': '#d50027'
      }
    },
  },
  plugins: [],
};
export default config;
