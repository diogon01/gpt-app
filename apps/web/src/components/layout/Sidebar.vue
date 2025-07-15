<!-- apps/web/src/components/layout/Sidebar.vue -->
<script setup lang="ts">
import HistoryList from '@/components/history/HistoryList.vue';
import { useAuth } from '../../stores/useAuthStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

const auth = useAuth();
const history = useHistoryStore();

function onSelectSession(timestamp: string) {
  history.setActiveSessionByTimestamp(timestamp);
  emit('close');
}

function onNewChat() {
  history.startNewSession();
  emit('close');
}

function onDeleteSession(timestamp: string) {
  // Por enquanto apenas loga — substitua por lógica real se desejar
  console.log('Excluir sessão:', timestamp);
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-700 p-4',
      'transition-transform duration-300 z-40',
      open ? 'translate-x-0' : '-translate-x-full',
      'md:static md:translate-x-0 md:h-auto md:z-0'
    ]"
  >
    <!-- Botão fixo de fechar (desktop) -->
    <button
      title="Fechar"
      @click="emit('close')"
      class="absolute top-4 -right-4 z-50 hidden md:block bg-slate-700 hover:bg-slate-600 text-white p-1 rounded-r shadow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Botão fechar (mobile) -->
    <button
      class="mb-4 flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 md:hidden"
      @click="emit('close')"
    >
      ✕ Fechar
    </button>

    <template v-if="auth.isLoggedIn">
      <!-- Ações -->
      <div class="space-y-3 mb-6">
        <button
          @click="onNewChat"
          class="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded shadow"
        >
          <span>🖊</span> Novo chat
        </button>
        <button
          disabled
          class="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 bg-slate-800 border border-slate-600 rounded cursor-not-allowed"
        >
          <span>🔍</span> Buscar em chats
        </button>
      </div>

      <!-- Histórico -->
      <h2 class="mb-2 text-sm font-semibold text-slate-300 uppercase tracking-wide">Histórico</h2>
      <HistoryList
        :items="history.summaryItems"
        :activeTimestamp="history.activeSession?.timestamp"
        @select="onSelectSession"
        @delete="onDeleteSession"
      />
    </template>

    <template v-else>
      <div class="text-sm text-slate-400 mt-8">
        Faça login para visualizar seu histórico.
      </div>
    </template>
  </aside>
</template>
