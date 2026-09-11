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
        club: {
          deepNavy: "#1E294C",
          navy: "#263260",
          plum: "#56244F",
          burgundy: "#871537",
          crimson: "#B50E2C",
        },
        offWhite: "#F7F7F5",
        ink: "#111318",
        canvas: {
          light: "#FFFFFF",
          subtle: "#F7F7F5",
          card: "#FFFFFF",
          dark: "#1E294C",
        },
        // Retained for neutral base fallbacks
        asphalt: {
          black: "#111318",
          charcoal: "#1E294C",
          dim: "#666666",
          border: "#E5E5E5",
          lightBorder: "#EEEEEE",
        },
      },
      backgroundImage: {
        "club-gradient": "linear-gradient(115deg, #263260 0%, #56244F 48%, #B50E2C 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        pill: "9999px",
      },
      letterSpacing: {
        telemetry: "0.12em",
        tighterHeading: "-0.03em",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
