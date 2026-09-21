import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201d",
        sage: "#dfe9dd",
        moss: "#526b55",
        lime: "#c9ed72",
        cream: "#f7f8f3",
        line: "#e5e8e1",
        coral: "#e98a6b"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-manrope)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 50px rgba(23, 32, 29, .08)"
      }
    }
  },
  plugins: []
};

export default config;
