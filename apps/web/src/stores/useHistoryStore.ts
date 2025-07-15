// apps/web/src/stores/useHistoryStore.ts
import { defineStore } from 'pinia';
import { useAuth } from './useAuthStore';

import type {
    UserHistoryEntity,
    UserHistoryEntryEntity,
    UserMessageEntity,
} from '@42robotics/domain';

/**
 * Local alias for a single session (timestamp + messages)
 */
type UserHistoryEntry = UserHistoryEntryEntity;

export const useHistoryStore = defineStore('history', {
    state: () => ({
        /** Full list of sessions returned from the backend */
        history: [] as UserHistoryEntry[],

        /** Global loading flag used by UI components */
        loading: false,

        /** Currently selected chat session */
        activeSession: null as UserHistoryEntry | null,
    }),

    getters: {
        /**
         * Returns summarized data for the sidebar list
         * @returns Array of prompt and timestamp
         */
        summaryItems(state): { prompt: string; createdAt: string }[] {
            return state.history.map((entry) => {
                const userMsg = entry.messages.find((m) => m.role === 'user');
                return {
                    prompt: userMsg?.content ?? '(no prompt)',
                    createdAt: entry.timestamp.toISOString(),
                };
            });
        },
    },

    actions: {
        /**
         * Fetches all chat sessions for the logged-in user
         */
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

                const data: UserHistoryEntity = await res.json();

                this.history = data.sessions.map((s) => ({
                    timestamp: new Date(s.timestamp),
                    messages: s.messages.map((m) => ({
                        ...m,
                        timestamp: new Date(m.timestamp),
                    })),
                }));

                this.activeSession = this.history[0] ?? null;
            } catch (err) {
                console.error('Error loading user history:', err);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Renames a session via PATCH /history/:sessionId
         * and updates local cache
         *
         * @param timestampIso ISO timestamp string of the session
         * @param newTitle     New title to assign to the session
         */
        async renameSession(timestampIso: string, newTitle: string) {
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser) throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch(`/api/history/${encodeURIComponent(timestampIso)}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: newTitle }),
                });

                if (!res.ok) throw new Error('Failed to rename session');

                // Update local cache
                const session = this.history.find(
                    (h) => h.timestamp.toISOString() === timestampIso
                );

                if (session) {
                    const userMsg = session.messages.find((m) => m.role === 'user');
                    if (userMsg) userMsg.content = newTitle;
                }
            } catch (err) {
                console.error('Error renaming session:', err);
            }
        },

        /**
         * Sets the active session based on ISO timestamp
         */
        setActiveSessionByTimestamp(tsIso: string) {
            this.activeSession =
                this.history.find((h) => h.timestamp.toISOString() === tsIso) ?? null;
        },

        /**
         * Appends a message to the active session or creates a new session
         */
        appendMessage(message: Omit<UserMessageEntity, 'timestamp'>) {
            const msg: UserMessageEntity = {
                ...message,
                timestamp: new Date(),
            };

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

        /**
         * Creates a new session with optional initial message
         */
        startNewSession(initial?: Omit<UserMessageEntity, 'timestamp'>) {
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
