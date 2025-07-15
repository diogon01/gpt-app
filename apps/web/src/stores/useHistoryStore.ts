// apps/web/src/stores/useHistoryStore.ts
import { defineStore } from 'pinia';
import { useAuth } from './useAuthStore';

import type {
    UserHistoryEntity,
    UserHistoryEntryEntity,
    UserMessageEntity,
} from '@42robotics/domain';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/** Local alias for a single session (timestamp + messages) */
type UserHistoryEntry = UserHistoryEntryEntity;

/* -------------------------------------------------------------------------- */
/* Pinia store                                                                */
/* -------------------------------------------------------------------------- */

export const useHistoryStore = defineStore('history', {
    /* ------------------------------------------------------------------------ */
    /* State                                                                    */
    /* ------------------------------------------------------------------------ */
    state: () => ({
        /** Full list of sessions returned from the backend */
        history: [] as UserHistoryEntry[],

        /** Global loading flag used by UI components */
        loading: false,

        /** Currently selected chat session */
        activeSession: null as UserHistoryEntry | null,
    }),

    /* ------------------------------------------------------------------------ */
    /* Getters                                                                  */
    /* ------------------------------------------------------------------------ */
    getters: {
        /**
         * Sidebar-friendly summary list (first user prompt + ISO timestamp)
         * @param state - Pinia reactive state
         * @returns Array consumed by `HistoryList.vue`
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

    /* ------------------------------------------------------------------------ */
    /* Actions                                                                  */
    /* ------------------------------------------------------------------------ */
    actions: {
        /* ---------------------------------------------------------------------- */
        /* Remote calls                                                            */
        /* ---------------------------------------------------------------------- */

        /**
         * Fetches all chat sessions for the logged-in user
         * and hydrates local state.
         */
        async fetch() {
            this.loading = true;
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser)
                    throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch('/api/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch history');

                const data: UserHistoryEntity = await res.json();

                // Backend now returns `sessions` (renamed from `history`)
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
         * Sends `PATCH /history/:sessionId` to rename a session
         * and updates the local cache so the sidebar shows the new title.
         *
         * @param timestampIso - Session identifier (ISO string from `createdAt`)
         * @param newTitle     - New title provided by the user
         */
        async renameSession(timestampIso: string, newTitle: string) {
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser)
                    throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch(
                    `/api/history/${encodeURIComponent(timestampIso)}`,
                    {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title: newTitle }),
                    },
                );

                if (!res.ok) throw new Error('Failed to rename session');

                /* ---- Update local copy so UI reflects the new title instantly ---- */
                const session = this.history.find(
                    (h) => h.timestamp.toISOString() === timestampIso,
                );

                if (session) {
                    const userMsg = session.messages.find((m) => m.role === 'user');
                    if (userMsg) userMsg.content = newTitle;
                }
            } catch (err) {
                console.error('Error renaming session:', err);
            }
        },

        /* ---------------------------------------------------------------------- */
        /* Local-only helpers                                                      */
        /* ---------------------------------------------------------------------- */

        /**
         * Sets the active chat session given its ISO timestamp.
         */
        setActiveSessionByTimestamp(tsIso: string) {
            this.activeSession =
                this.history.find((h) => h.timestamp.toISOString() === tsIso) ?? null;
        },

        /**
         * Appends a message to the active session;
         * if none exists, a new session is created automatically.
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
         * Starts a brand-new empty session (or with an initial user message).
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
