import { defineConfig } from 'tailwindcss';

export default defineConfig({
    content: ['./index.html', './src/**/*.{vue,ts,js}'],
    theme: {
        colors: {
            /* semantic tokens */
            primary: 'var(--c-primary)',
            surface: 'var(--c-surface)',
            accent: 'var(--c-accent)',
            text: 'var(--c-text)',
            success: 'var(--c-success)',
            danger: 'var(--c-danger)',
            warning: 'var(--c-warning)',
            /* obrigatórios */
            transparent: 'transparent',
            current: 'currentColor',
        },
        extend: {},  // ainda pode estender outras partes
    },
    plugins: [],
});
