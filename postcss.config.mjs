// Tailwind v4 handles PostCSS via its dedicated plugin. No tailwind.config.js
// needed; tokens and utilities live inside globals.css via @theme.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
