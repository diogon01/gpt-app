<script setup lang="ts">
import HistoryList from '@/components/history/HistoryList.vue';
import { useAuth } from '../../stores/useAuthStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

/**
 * Props
 * @property {boolean} open - Controls sidebar visibility (mobile)
 */
defineProps<{ open: boolean }>();

/**
 * Emits
 * @event close - Triggered when the user requests to close the sidebar
 */
const emit = defineEmits<{ close: [] }>();

/* -------------------------------------------------------------------------- */
/* Stores                                                                     */
/* -------------------------------------------------------------------------- */

const auth = useAuth();            // User authentication data
const history = useHistoryStore(); // Chat history sessions

/* -------------------------------------------------------------------------- */
/* Handlers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Sets the selected session as active using its timestamp
 * 
 * @param {string} timestamp - ISO timestamp of the session to activate
 */
function onSelectSession(timestamp: string) {
  history.setActiveSessionByTimestamp(timestamp);
  emit('close');
}

/**
 * Starts a new chat session and closes the sidebar
 */
function onNewChat() {
  history.startNewSession();
  emit('close');
}

/**
 * Deletes a session by its MongoDB _id
 * 
 * @param {string} _id - Unique MongoDB identifier of the session
 */
function onDeleteSession(_id: string) {
  history.deleteSession(_id);
}

/**
 * Renames a session by its MongoDB _id
 * 
 * @param {string} _id - Unique MongoDB identifier of the session
 * @param {string} newTitle - The new title to apply to the session
 */
function onRenameSession(_id: string, newTitle: string) {
  history.renameSession(_id, newTitle);
}
</script>

<template>
  <aside
    :class="[ 'fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-700 p-4',
              'transition-transform duration-300 z-50',
              open ? 'translate-x-0' : '-translate-x-full',
              'md:static md:translate-x-0 md:h-auto' ]"
  >
    <!-- Close button (desktop) -->
    <button
      title="Close"
      @click="emit('close')"
      class="absolute top-4 -right-4 z-50 hidden md:block bg-slate-700 hover:bg-slate-600 text-white p-1 rounded-r shadow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Close button (mobile) -->
    <button
      class="mb-4 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 md:hidden"
      @click="emit('close')"
    >
      ✕ Close
    </button>

    <!-- Authenticated view -->
    <template v-if="auth.isLoggedIn">
      <!-- Action buttons -->
      <div class="space-y-3 mb-6">
        <button
          @click="onNewChat"
          class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded shadow"
        >
          <span>🖊</span> New Chat
        </button>
        <button
          disabled
          class="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 bg-slate-800 border border-slate-600 rounded cursor-not-allowed"
        >
          <span>🔍</span> Search Chats
        </button>
      </div>

      <!-- History section -->
      <h2 class="mb-2 text-sm font-semibold text-slate-300 uppercase tracking-wide">
        History
      </h2>

      <HistoryList
        :items="history.summaryItems"
        :activeTimestamp="history.activeSession?.timestamp"
        @select="onSelectSession"
        @delete="onDeleteSession"
        @rename="onRenameSession"
      />
    </template>

    <!-- Unauthenticated view -->
    <template v-else>
      <div class="text-sm text-slate-400 mt-8">
        Log in to view your chat history.
      </div>
    </template>
  </aside>
</template>
