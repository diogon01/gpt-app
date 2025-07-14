import { defineStore } from 'pinia';
import { useAuth } from './useAuthStore';

export type MessageRole = 'user' | 'assistant';

export interface UserMessage {
    role: MessageRole;
    content: string;
}

export interface UserHistoryEntry {
    timestamp: string;
    messages: UserMessage[];
}

export const useHistoryStore = defineStore('history', {
    state: () => ({
        history: [] as UserHistoryEntry[],
        loading: false,
    }),

    actions: {
        /** Load user history from backend with authentication token */
        async fetch() {
            this.loading = true;
            try {
                const authStore = useAuth();

                // Ensure user is authenticated
                if (!authStore.firebaseUser) {
                    throw new Error('User is not authenticated');
                }

                // Retrieve Firebase auth token
                const token = await authStore.firebaseUser.getIdToken();

                // Send request with Authorization header
                const res = await fetch('/api/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch history');

                this.history = await res.json();
            } catch (error) {
                console.error('Error loading user history:', error);
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
