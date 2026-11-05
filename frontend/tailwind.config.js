/** @type {import("tailwindcss").Config} */

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        daichi: {
          bg: "#FAF8F5",       // Warm parchment base
          surface: "#FFFFFF",  
          forest: "#2D4A3E",   // Forest green accent
          sage: "#5B7A6A",     // Muted sage green
          clay: "#D97757",     // Terracotta accent
          sand: "#EAE3D2",     // Soft warm beige
          charcoal: "#262522", // Main text color
          muted: "#75726B",    
        },
      },
      borderRadius: {
        warm: "1.25rem",      // 20px
        "warm-lg": "1.75rem", // 28px
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(45, 37, 30, 0.07)",
        "glass-hover": "0 12px 40px 0 rgba(45, 37, 30, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;