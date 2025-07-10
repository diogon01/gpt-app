import { defineStore } from 'pinia';

/** Single chat or generation entry shown in the UI */
export interface HistoryItem {
    _id?: string;
    prompt: string;
    /** `chat` for GPT answers, `art` / `geo` for image / geo generations */
    type: 'chat' | 'art' | 'geo';
    response: {
        text?: string;
        imgUrl?: string;
    };
    tags: string[];
    createdAt: string;
}

export const useHistoryStore = defineStore('history', {
    state: () => ({
        items: [] as HistoryItem[],
        loading: false
    }),

    actions: {
        /** Load full history from the backend (if the user is authenticated) */
        async fetch() {
            this.loading = true;
            try {
                const res = await fetch('/api/history');
                this.items = await res.json();
            } finally {
                this.loading = false;
            }
        },

        /** Push a new message locally so the UI updates instantly */
        addLocal(item: HistoryItem) {
            this.items.unshift(item);
        }
    }
});
