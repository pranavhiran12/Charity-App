// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}