
import daisyui from "daisyui"; 

/** @type {import('tailwindcss').Config} */

export default {

 
  future: {
    modernColorFormat: false,
  },
  
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },

  plugins: [daisyui],
  daisyui: {
    
    oklch: false, 
    
    
    themes: false
  } 
}