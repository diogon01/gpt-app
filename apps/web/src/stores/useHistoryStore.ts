import { defineStore } from 'pinia';

export type MessageRole = 'user' | 'assistant';

export interface UserMessage {
    role: MessageRole;
    content: string;
}

export interface UserHistoryEntry {
    timestamp: string; // ou Date
    messages: UserMessage[];
}

export const useHistoryStore = defineStore('history', {
    state: () => ({
        history: [] as UserHistoryEntry[],
        loading: false
    }),

    actions: {
        /** Load user history from backend */
        async fetch() {
            this.loading = true;
            try {
                const res = await fetch('/api/history');
                if (!res.ok) throw new Error('Failed to fetch history');
                this.history = await res.json();
            } finally {
                this.loading = false;
            }
        },

        /** Append a local message to the latest conversation session */
        addLocalMessage(message: UserMessage) {
            if (this.history.length === 0) {
                // Create first session if it doesn't exist
                this.history.unshift({
                    timestamp: new Date().toISOString(),
                    messages: [message]
                });
            } else {
                this.history[0].messages.push(message);
            }
        },

        /** Start a new session manually (optional) */
        startNewSession(initialMessage?: UserMessage) {
            this.history.unshift({
                timestamp: new Date().toISOString(),
                messages: initialMessage ? [initialMessage] : []
            });
        }
    }
});
