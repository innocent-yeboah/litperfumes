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
        brand: {
          navy: "#1A1A2E",
          gold: "#C9A962",
          champagne: "#C9A962",
          rose: "#E8C4C4",
          white: "#FAF8F5",
          ink: "#1A1A1A",
          mist: "#F2F0EB",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-wash":
          "linear-gradient(135deg, rgba(26,26,46,0.78) 0%, rgba(26,26,46,0.4) 50%, rgba(201,169,98,0.28) 100%)",
        "gold-fade":
          "linear-gradient(180deg, rgba(201,169,98,0.12) 0%, rgba(250,248,245,0) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
