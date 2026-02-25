/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                military: {
                    50: '#f0f4e8',
                    100: '#d9e4c0',
                    200: '#b8cc8a',
                    300: '#8fab52',
                    400: '#6e8f2e',
                    500: '#4a6741',
                    600: '#3d5c35',
                    700: '#2e4528',
                    800: '#1e2e1a',
                    900: '#111a0e',
                },
                steel: {
                    50: '#f4f6f8',
                    100: '#e2e7ed',
                    200: '#c4cdd9',
                    300: '#9aaab9',
                    400: '#6e8499',
                    500: '#4e6478',
                    600: '#3c4f60',
                    700: '#2d3c4a',
                    800: '#1e2833',
                    900: '#111820',
                    950: '#090d12',
                },
                danger: {
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                },
                warning: {
                    400: '#fbbf24',
                    500: '#f59e0b',
                },
                success: {
                    400: '#4ade80',
                    500: '#22c55e',
                },
                accent: {
                    400: '#60a5fa',
                    500: '#3b82f6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(rgba(78,100,120,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(78,100,120,0.1) 1px, transparent 1px)",
            },
            backgroundSize: {
                'grid': '40px 40px',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
