// apps/web/src/stores/useHistoryStore.ts
import type { UserHistory, UserMessage } from '@42robotics/domain';
import { defineStore } from 'pinia';
import { useAuth } from './useAuthStore';

/** A single chat session inside UserHistory */
type UserHistoryEntry = UserHistory['history'][number];

export const useHistoryStore = defineStore('history', {
    state: () => ({
        history: [] as UserHistoryEntry[],
        loading: false,
        activeSession: null as UserHistoryEntry | null,
    }),

    getters: {
        /** List used in the sidebar */
        summaryItems(state): { prompt: string; createdAt: string }[] {
            return state.history.map(entry => {
                const userMsg = entry.messages.find(m => m.role === 'user');
                return {
                    prompt: userMsg?.content ?? '(no prompt)',
                    createdAt: entry.timestamp.toISOString(),
                };
            });
        },
    },

    actions: {
        /** Load all sessions from backend */
        async fetch() {
            this.loading = true;
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser) throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch('/api/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch history');

                const data: UserHistory = await res.json();

                // Convert plain JSON dates → Date objects
                this.history = data.history.map(h => ({
                    timestamp: new Date(h.timestamp),
                    messages: h.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })),
                }));

                this.activeSession = this.history[0] ?? null;
            } catch (err) {
                console.error('Error loading user history:', err);
            } finally {
                this.loading = false;
            }
        },

        /** Select a session using its ISO string timestamp */
        setActiveSessionByTimestamp(tsIso: string) {
            this.activeSession =
                this.history.find(h => h.timestamp.toISOString() === tsIso) ?? null;
        },

        /**
         * Append a message to the active session or create a new one.
         * Timestamp is injected automatically.
         */
        appendMessage(message: Omit<UserMessage, 'timestamp'>) {
            const msg: UserMessage = { ...message, timestamp: new Date() };

            if (!this.activeSession) {
                const newSession: UserHistoryEntry = {
                    timestamp: msg.timestamp,
                    messages: [msg],
                };
                this.history.unshift(newSession);
                this.activeSession = newSession;
            } else {
                this.activeSession.messages.push(msg);
            }
        },

        /** Start a brand-new chat session */
        startNewSession(initial?: Omit<UserMessage, 'timestamp'>) {
            const now = new Date();
            const newSession: UserHistoryEntry = {
                timestamp: now,
                messages: initial ? [{ ...initial, timestamp: now }] : [],
            };
            this.history.unshift(newSession);
            this.activeSession = newSession;
        },
    },
});
