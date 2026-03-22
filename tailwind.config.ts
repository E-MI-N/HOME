import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          void: "#080808",
          deep: "#0C0C0C",
          surface: "#141414",
          border: "#1C1C1C",
          white: "#F0EEE8",
          dim: "#808078",
          muted: "#383834",
          film: "#6ECFB8",
          planet: "#6ECFB8",
        },
        fantasy: {
          dark: "#080808",
          surface: "#0C0C0C",
          surface2: "#141414",
          border: "#1C1C1C",
          gold: "#6ECFB8",
          "gold-dim": "#4ABDA6",
          "gold-bright": "#8EEBD8",
          purple: "#808078",
          "purple-light": "#A0A098",
          text: "#F0EEE8",
          "text-dim": "#A0A098",
          "text-muted": "#585854",
        },
      },
      fontFamily: {
        display: ["'Press Start 2P'", "monospace"],
        serif: ["'Share Tech Mono'", "Space Mono", "monospace"],
        sans: ["'Exo 2'", "Noto Sans KR", "sans-serif"],
        mono: ["'Space Mono'", "'Courier New'", "monospace"],
        pixel: ["'Press Start 2P'", "monospace"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        scrollBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glitch: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" },
        },
        pixelIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.9s ease forwards",
        "fade-up": "fadeUp 0.8s ease forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "scroll-bounce": "scrollBounce 1.5s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "glitch": "glitch 0.3s ease-in-out infinite",
        "pixel-in": "pixelIn 0.4s steps(4) forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
