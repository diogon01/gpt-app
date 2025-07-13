<script setup lang="ts">
import { useAuth } from '../stores/useAuthStore';
import HistoryList from './history/HistoryList.vue';

defineProps<{
  open: boolean;
  itens: { prompt: string; createdAt: string }[];
}>();

const emit = defineEmits<{ close: [] }>();
const auth = useAuth();
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 w-60 bg-slate-800 border-r border-slate-700 p-4',
      'transform transition-transform duration-300 z-40',
      open ? 'translate-x-0' : '-translate-x-full',
      'md:static md:translate-x-0 md:h-auto md:z-0',
    ]"
  >
    <!-- Botão fechar (mobile only) -->
    <button
      class="mb-4 text-lg text-cyan-400 md:hidden"
      aria-label="Fechar menu"
      @click="emit('close')"
    >
      ✕ Fechar
    </button>

    <template v-if="auth.isLoggedIn">
      <h2 class="mb-4 font-semibold text-white">Histórico</h2>
      <HistoryList :items="itens" />
    </template>

    <template v-else>
      <div class="text-sm text-slate-400">
        Faça login para visualizar seu histórico.
      </div>
    </template>
  </aside>
</template>
