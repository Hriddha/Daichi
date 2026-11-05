const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        daichi: {
          bg: "#FAF8F5",       // Soft warmth off-white background
          surface: "#FFFFFF",  // Clean white card surfaces
          subtle: "#F2EDE4",   // Soft beige neutral for borders/dividers
          forest: "#2D4A3E",   // Primary brand green
          sage: "#5B7A6A",     // Secondary muted green
          clay: "#D97757",     // Accent warm terracotta
          sand: "#EAE3D2",     // Muted highlight tone
          charcoal: "#262522", // Main text color
          muted: "#75726B",    // Muted text
        },
      },
      borderRadius: {
        warm: "1.25rem",      // 20px soft rounded corners
        "warm-lg": "1.75rem", // 28px soft rounded corners
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