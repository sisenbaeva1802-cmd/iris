import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      cream: "#FFF9F4", blush: "#F7E8E8", rose: "#E8B7C8", "rose-deep": "#D79AB0",
      sage: "#8C9A7B", "sage-soft": "#E6EADF", ink: "#654B56", "ink-deep": "#4F3743",
    },
    fontFamily: { serif: ["var(--font-serif)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    borderRadius: { card: "1.5rem" },
    boxShadow: { petal: "0 10px 30px -12px rgba(101,75,86,.22)" },
  } },
} satisfies Config;
