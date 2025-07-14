// apps/web/src/stores/useHistoryStore.ts

import type { UserHistoryEntry, UserMessage } from '@42robotics/domain';
import { defineStore } from 'pinia';
import { useAuth } from './useAuthStore';

export const useHistoryStore = defineStore('history', {
    state: () => ({
        history: [] as UserHistoryEntry[],
        loading: false,
        activeSession: null as UserHistoryEntry | null,
    }),

    getters: {
        /** Returns summary list for the sidebar */
        summaryItems(state): { prompt: string; createdAt: string }[] {
            return state.history.map(entry => {
                const userMsg = entry.messages.find(m => m.role === 'user');
                return {
                    prompt: userMsg?.content ?? '(no prompt)',
                    createdAt: entry.timestamp,
                };
            });
        },
    },

    actions: {
        /** Fetch all sessions from backend and populate history */
        async fetch() {
            this.loading = true;
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser) throw new Error('User is not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch('/api/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch history');

                const data = await res.json();

                // Safely assign history from backend
                this.history = Array.isArray(data.history) ? data.history : [];
                this.activeSession = this.history[0] ?? null;
            } catch (error) {
                console.error('Error loading user history:', error);
            } finally {
                this.loading = false;
            }
        },

        /** Set which session is currently active (e.g., selected from sidebar) */
        setActiveSessionByTimestamp(timestamp: string) {
            this.activeSession = this.history.find(h => h.timestamp === timestamp) || null;
        },

        /** Add a new message to the active session, or create a new one if needed */
        appendMessage(message: UserMessage) {
            if (!this.activeSession) {
                const newSession: UserHistoryEntry = {
                    timestamp: new Date().toISOString(),
                    messages: [message],
                };
                this.history.unshift(newSession);
                this.activeSession = newSession;
            } else {
                this.activeSession.messages.push(message);
            }
        },

        /** Manually start a new session */
        startNewSession(initialMessage?: UserMessage) {
            const newSession: UserHistoryEntry = {
                timestamp: new Date().toISOString(),
                messages: initialMessage ? [initialMessage] : [],
            };
            this.history.unshift(newSession);
            this.activeSession = newSession;
        },
    },
});
