/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tous les fichiers React
    "./public/index.html"         // Ajoute ceci si ton projet utilise index.html
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
