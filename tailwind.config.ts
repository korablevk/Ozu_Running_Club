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
        canvas: {
          light: "#FFFFFF",
          subtle: "#F7F7F7",
          card: "#FAFAFA",
          dark: "#111620",
        },
        ozu: {
          navy: "#081935",
          blue: "#0B5ED7",
          light: "#EBF3FE",
          accent: "#1A73E8",
        },
        volt: {
          DEFAULT: "#D4FF00",
          hover: "#C3EB00",
          muted: "#ECFF80",
        },
        asphalt: {
          black: "#000000",
          charcoal: "#151522",
          dim: "#666666",
          border: "#E5E5E5",
          lightBorder: "#EEEEEE",
        },
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
