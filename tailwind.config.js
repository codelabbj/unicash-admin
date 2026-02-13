/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2534C1', // UniCash Logo Blue
                    hover: '#1e2a9e',
                    light: '#4b57d6',
                },
                secondary: '#64748b',
                success: '#39D196', // Keep Green for success
                danger: '#ef4444',
                warning: '#f59e0b',
                background: '#f8fafc',
            }
        },
    },
    plugins: [],
}
