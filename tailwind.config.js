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
                    DEFAULT: '#1e40af', // blue-800 based on user preference/frontend analysis
                    hover: '#1e3a8a',
                    light: '#3b82f6',
                },
                secondary: '#64748b',
                success: '#22c55e',
                danger: '#ef4444',
                warning: '#f59e0b',
                background: '#f8fafc',
            }
        },
    },
    plugins: [],
}
