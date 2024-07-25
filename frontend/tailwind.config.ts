import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#34C759',
        background: '#F2F2F7',
        accent: '#FF3B30',
        textPrimary: '#000000',
        textSecondary: '#8E8E93',
      },
    },
  },
  plugins: [],
};
export default config;
