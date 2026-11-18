import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#0B1220", 900: "#0B1220", 800: "#111A2E", 700: "#1A2540", 600: "#2A3657" },
        brand: { 50: "#EEF5FF", 100: "#D9E8FF", 200: "#B5D2FF", 400: "#5B9BFF", 500: "#2F7BFF", 600: "#1A63E6", 700: "#134DB8" },
        accent: { 400: "#FFB547", 500: "#FF9F1C", 600: "#E8850A" },
        mint: { 500: "#16B88A" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,.04), 0 8px 24px -8px rgba(11,18,32,.10)",
        lift: "0 2px 4px rgba(11,18,32,.04), 0 18px 40px -12px rgba(11,18,32,.22)",
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        pulseRing: { "0%": { transform: "scale(.9)", opacity: ".7" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
      },
      animation: { "fade-up": "fade-up .6s ease both", "pulse-ring": "pulseRing 1.8s ease-out infinite" },
    },
  },
  plugins: [],
} satisfies Config;
