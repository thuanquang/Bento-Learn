import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Bento Color Palette
                sage: {
                    DEFAULT: "#C5C9A4",
                    muted: "#B5C4A8",
                    light: "#D5D9C4",
                },
                brown: {
                    DEFAULT: "#7A6052",
                    light: "#9A8072",
                },
                peach: {
                    DEFAULT: "#D4A27C",
                    light: "#E4C2A0",
                },
                charcoal: {
                    DEFAULT: "#3A3A3A",
                    light: "#6B6B6B",
                },
                cream: {
                    DEFAULT: "#F8F8F8",
                    dark: "#EFEFEF",
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            fontSize: {
                'xs': ['12px', { lineHeight: '16px' }],
                'sm': ['14px', { lineHeight: '20px' }],
                'base': ['16px', { lineHeight: '24px' }],
                'lg': ['20px', { lineHeight: '28px' }],
                'xl': ['24px', { lineHeight: '32px' }],
                '2xl': ['32px', { lineHeight: '40px' }],
                '3xl': ['48px', { lineHeight: '56px' }],
            },
            borderRadius: {
                'sm': '8px',
                'md': '12px',
                'lg': '20px',
                'full': '9999px',
            },
            boxShadow: {
                'subtle': '0 2px 8px rgba(58, 58, 58, 0.08)',
                'medium': '0 4px 16px rgba(58, 58, 58, 0.12)',
                'large': '0 8px 32px rgba(58, 58, 58, 0.16)',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            transitionDuration: {
                'micro': '150ms',
                'standard': '300ms',
                'emphasis': '500ms',
            },
            animation: {
                'fade-in': 'fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                'flame': 'flame 0.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                flame: {
                    '0%, 100%': { transform: 'scale(1) rotate(-2deg)' },
                    '50%': { transform: 'scale(1.1) rotate(2deg)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
