<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import TopBar from '@/components/TopBar.vue';
import ChatArea from '@/components/ChatArea.vue';
import PromptForm from '@/components/PromptForm.vue';
import { useHistoryStore } from '../stores/useHistoryStore';
import { useUiStore } from '../stores/useUiStore';

const ui = useUiStore();
const hist = useHistoryStore();
const sidebarOpen = ref(false);

function onNewMessage(msg: {
  prompt: string;
  response: { text?: string; imgUrl?: string };
  loading?: boolean;
}) {
  hist.addLocal({
    ...msg,
    type: 'chat',
    createdAt: new Date().toISOString(),
    tags: []
  });
}

onMounted(() => {
  if (!hist.items.length) hist.fetch();
});
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <Sidebar
      :open="sidebarOpen"
      :items="hist.items"
      @close="sidebarOpen = false"
    />

    <main class="flex flex-1 flex-col">
      <TopBar @menu="sidebarOpen = true" />

      <div class="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
        <ChatArea :items="hist.items" />
      </div>

      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @new-message="onNewMessage" />
      </footer>
    </main>
  </div>
</template>
