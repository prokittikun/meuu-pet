import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      //new color
      colors: {
        success: {
          50: "#56C596",
          100: "#56C596",
          500: "#56C596",
          600: "#56C596",
        },
        primary: {
          50: "#205272",
          100: "#205272",
          500: "#205272",
          600: "#205272",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
