import { defineStore } from 'pinia';
import { useAuth } from './useAuthStore';

import type {
    UserHistoryEntity,
    UserHistoryEntryEntity,
    UserMessageEntity,
} from '@42robotics/domain';

/**
 * Represents a full user session, including backend-assigned _id.
 */
type UserHistoryEntry = UserHistoryEntryEntity & { _id: string };

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
         * Returns summarized session data for rendering in sidebar
         * @returns List of session summaries with _id, prompt preview, and creation timestamp
         */
        summaryItems(state): { _id: string; prompt: string; createdAt: string }[] {
            return state.history.map((entry) => {
                const userMsg = entry.messages.find((m) => m.role === 'user');
                return {
                    _id: entry._id,
                    prompt: userMsg?.content ?? '(no prompt)',
                    createdAt: entry.timestamp.toISOString(),
                };
            });
        },
    },

    actions: {
        /**
         * Fetches all chat sessions associated with the authenticated user.
         * Populates the history state and selects the most recent session.
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
                    _id: s._id,
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
         * Fetches a specific session by ID and sets it as the active session.
         * Also caches it locally if it doesn't exist in the current history list.
         *
         * @param id - The MongoDB ObjectId of the session to retrieve
         */
        async fetchById(id: string) {
            this.loading = true;
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser) throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch(`/api/history/${encodeURIComponent(id)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch session');

                const data = await res.json();

                const session: UserHistoryEntry = {
                    _id: data._id,
                    timestamp: new Date(data.timestamp),
                    messages: data.messages.map((m: any) => ({
                        ...m,
                        timestamp: new Date(m.timestamp),
                    })),
                };

                this.activeSession = session;

                const alreadyExists = this.history.some((s) => s._id === session._id);
                if (!alreadyExists) {
                    this.history.unshift(session);
                }
            } catch (err) {
                console.error('Error fetching session by ID:', err);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Renames a specific session by sending a PATCH request to the API.
         * Also updates the session title locally in the store.
         *
         * @param _id - MongoDB ObjectId of the session to rename
         * @param newTitle - New title to assign to the first user message
         */
        async renameSession(_id: string, newTitle: string) {
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser) throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch(`/api/history/${encodeURIComponent(_id)}`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: newTitle }),
                });

                if (!res.ok) throw new Error('Failed to rename session');

                const session = this.history.find((h) => h._id === _id);
                if (session) {
                    const userMsg = session.messages.find((m) => m.role === 'user');
                    if (userMsg) userMsg.content = newTitle;
                }
            } catch (err) {
                console.error('Error renaming session:', err);
            }
        },

        /**
         * Deletes a specific session by sending a DELETE request to the API.
         * Also removes the session from the local store.
         *
         * @param _id - MongoDB ObjectId of the session to delete
         */
        async deleteSession(_id: string) {
            try {
                const authStore = useAuth();
                if (!authStore.firebaseUser) throw new Error('User not authenticated');

                const token = await authStore.firebaseUser.getIdToken();
                const res = await fetch(`/api/history/${encodeURIComponent(_id)}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to delete session');

                this.history = this.history.filter((session) => session._id !== _id);

                if (this.activeSession?._id === _id) {
                    this.activeSession = this.history[0] ?? null;
                }
            } catch (err) {
                console.error('Error deleting session:', err);
            }
        },

        /**
         * Activates a session by matching the provided ISO timestamp.
         * Useful for restoring selected session after initial fetch.
         *
         * @param tsIso - ISO timestamp string
         */
        setActiveSessionByTimestamp(tsIso: string) {
            this.activeSession =
                this.history.find((h) => h.timestamp.toISOString() === tsIso) ?? null;
        },

        /**
         * Appends a new message to the currently active session.
         * If no session is active, a new one is created.
         *
         * @param message - User or assistant message to append
         */
        appendMessage(message: Omit<UserMessageEntity, 'timestamp'>) {
            const msg: UserMessageEntity = {
                ...message,
                timestamp: new Date(),
            };

            if (!this.activeSession) {
                const newSession: UserHistoryEntry = {
                    _id: crypto.randomUUID(),
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
         * Starts a new session, optionally with an initial message.
         * Sets the newly created session as the active one.
         *
         * @param initial - Optional initial message to include in the session
         */
        startNewSession(initial?: Omit<UserMessageEntity, 'timestamp'>) {
            const now = new Date();
            const newSession: UserHistoryEntry = {
                _id: crypto.randomUUID(),
                timestamp: now,
                messages: initial ? [{ ...initial, timestamp: now }] : [],
            };
            this.history.unshift(newSession);
            this.activeSession = newSession;
        },
    },
});
