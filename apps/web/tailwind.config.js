/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts}'],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#041e2f',
                'brand-surface': '#05314f',
                'brand-line': '#0f3e5e',
                'brand-accent': '#00d9ff',
                'brand-text': '#f1f5f9',
            },
        },
    },
    safelist: [
        {
            // gera bg-*, text-* e border-* para todos os tokens brand-*
            pattern: /^(bg|text|border)-brand-(primary|surface|line|accent|text)$/,
        },
    ],
    plugins: [],
};

