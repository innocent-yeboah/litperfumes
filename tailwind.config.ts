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
          "linear-gradient(180deg, rgba(26,26,46,0.55) 0%, rgba(26,26,46,0.25) 38%, rgba(26,26,46,0.72) 100%)",
        "hero-vignette":
          "radial-gradient(ellipse at 70% 40%, transparent 0%, rgba(26,26,46,0.45) 70%, rgba(26,26,46,0.75) 100%)",
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
        "hero-ken": {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        "gold-line": {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 1s ease-out both",
        "hero-ken": "hero-ken 8s ease-out both",
        "gold-line": "gold-line 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both",
      },
    },
  },
  plugins: [],
};

export default config;
