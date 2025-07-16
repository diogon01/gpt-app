<script setup lang="ts">
import HistoryList from '@/components/history/HistoryList.vue';
import SearchModal from '@/components/history/SearchModal.vue';

import { computed, ref } from 'vue';
import { useAuth } from '../../stores/useAuthStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

/**
 * Props
 * @property {boolean} open - Controls sidebar visibility (mobile)
 */
const props = defineProps<{ open: boolean }>();
const open = computed(() => props.open);

/**
 * Emits
 * @event close - Triggered when the user requests to close the sidebar
 * @event select - Triggered when a session is selected via _id
 */
const emit = defineEmits<{ close: []; select: [id: string] }>();

/* Stores */
const auth = useAuth();
const history = useHistoryStore();

/* State */
const searchOpen = ref(false);

/* Handlers */
function onSelectSession(_id: string) {
  emit('select', _id);
}
function onNewChat() {
  history.startNewSession();
  emit('close');
}
function onDeleteSession(_id: string) {
  history.deleteSession(_id);
}
function onRenameSession(_id: string, newTitle: string) {
  history.renameSession(_id, newTitle);
}
</script>

<template>
  <aside
    :class="[ 
      'fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-700 p-4',
      'transition-transform duration-300 z-50',
      'md:static md:translate-x-0 md:h-auto',
      open.valueOf() ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <button
      title="Fechar barra lateral"
      aria-label="Fechar barra lateral"
      @click="emit('close')"
      class="absolute top-4 right-4 z-50 text-white p-1 rounded hover:bg-slate-700 transition cursor-pointer md:-right-4 md:bg-slate-700 md:rounded-r md:shadow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <template v-if="auth.isLoggedIn">
      <div class="space-y-3 mb-6 mt-10 md:mt-0">
        <button
          @click="onNewChat"
          class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded shadow"
        >
          <span>🖊</span> New Chat
        </button>
        <button
          @click="searchOpen = true"
          class="w-full flex items-center gap-2 px-4 py-2 text-sm text-white bg-slate-800 border border-slate-600 rounded hover:bg-slate-700 transition"
        >
          <span>🔍</span> Search Chats
        </button>
      </div>

      <h2 class="mb-2 text-sm font-semibold text-slate-300 uppercase tracking-wide">History</h2>

      <HistoryList
        :items="history.summaryItems"
        :activeTimestamp="history.activeSession?.timestamp"
        @select="onSelectSession"
        @delete="onDeleteSession"
        @rename="onRenameSession"
      />
    </template>

    <template v-else>
      <div class="text-sm text-slate-400 mt-8">
        Log in to view your chat history.
      </div>
    </template>

    <SearchModal :open="searchOpen" @close="searchOpen = false" />
  </aside>
</template>
