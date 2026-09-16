/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#071A3A",
          navyDark: "#040F22",
          navyLight: "#0D2A5B",
          blue: "#1268FF",
          blueHover: "#0E53CC",
          cyan: "#22D3EE",
          cyanGlow: "rgba(34, 211, 238, 0.15)",
          canvas: "#F7FAFF",
          card: "#FFFFFF",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(7, 26, 58, 0.08)",
        glow: "0 0 20px -3px rgba(18, 104, 255, 0.35)",
        card: "0 1px 3px 0 rgba(7, 26, 58, 0.04), 0 1px 2px -1px rgba(7, 26, 58, 0.04)",
        cardHover: "0 10px 25px -5px rgba(7, 26, 58, 0.1), 0 8px 10px -6px rgba(7, 26, 58, 0.05)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}
