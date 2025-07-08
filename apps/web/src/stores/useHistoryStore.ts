import { defineStore } from 'pinia';

export interface Resultado {
    _id?: string;
    prompt: string;
    type: 'art' | 'geo';
    imgUrl?: string;
    text?: string;
    tags: string[];
    createdAt: string;
}

export const useHistoryStore = defineStore('history', {
    state: () => ({
        itens: [] as Resultado[],
        loading: false
    }),

    actions: {
        async fetch() {
            this.loading = true;
            try {
                const res = await fetch('/api/history');
                this.itens = await res.json();
            } finally {
                this.loading = false;
            }
        },

        addLocal(r: Resultado) {
            this.itens.unshift(r);
        }
    }
});
