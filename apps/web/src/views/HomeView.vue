<script setup lang="ts">
import ChatArea from '@/components/ChatArea.vue';
import PromptForm from '@/components/PromptForm.vue';
import Sidebar from '@/components/Sidebar.vue';
import TopBar from '@/components/TopBar.vue';
import { onMounted, ref } from 'vue';
import { useHistoryStore } from '../stores/useHistoryStore';

const hist = useHistoryStore();
const sidebarOpen = ref(false);

// Novo formato: adiciona mensagem do usuário e resposta no último histórico
function onNewMessage(msg: { prompt: string; response: { text?: string; imgUrl?: string } }) {
  hist.addLocalMessage({ role: 'user', content: msg.prompt });
  hist.addLocalMessage({ role: 'assistant', content: msg.response.text || '' });
}

onMounted(() => {
  if (!hist.history.length) hist.fetch();
});
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <Sidebar
      :open="sidebarOpen"
      :itens="hist.history"
      @close="sidebarOpen = false"
    />

    <main class="flex flex-1 flex-col">
      <TopBar @menu="sidebarOpen = true" />

      <div class="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
        <!-- Exibe apenas a sessão mais recente no ChatArea -->
        <ChatArea :items="hist.history[0]?.messages || []" />
      </div>

      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @new-message="onNewMessage" />
      </footer>
    </main>
  </div>
</template>
