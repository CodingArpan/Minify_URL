/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'mob_only':{'min': '200px', 'max': '800px'},
      // => @media (min-width: 640px) { ... }

      'md': '800px',
      'tab_only':{'min': '801px', 'max': '1200px'},
      // => @media (min-width: 768px) { ... }
      'mob_tab':{'min': '200px', 'max': '1200px'},


      'lg': '1024px',
      'pc_only':{'min': '1201px'},
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}