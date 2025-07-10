<script setup lang="ts">
import { ref, onMounted } from 'vue';

/* ── Re-usable components ─────────────────────────────── */
import Sidebar    from '@/components/Sidebar.vue';
import TopBar     from '@/components/TopBar.vue';
import ChatArea   from '@/components/ChatArea.vue';
import PromptForm from '@/components/PromptForm.vue';
import { useHistoryStore } from '../stores/useHistoryStore';
import { useUiStore } from '../stores/useUiStore';

/* ── Pinia stores ─────────────────────────────────────── */


/* The shape expected by the History store */
type Resultado = {
  prompt: string;
  response: { text?: string; imgUrl?: string };
  type:    'chat' | 'art' | 'geo';
  tags:    string[];
  createdAt: string;
};

const ui   = useUiStore();
const hist = useHistoryStore();

/* Sidebar toggle (mobile) */
const sidebarOpen = ref(false);

/* PromptForm → ChatArea bridge
   Creates a complete Resultado object so addLocal() type-checks OK */
function onNewMessage(msg: { prompt: string; response: { text?: string; imgUrl?: string } }) {
  const payload: Resultado = {
    prompt: msg.prompt,
    response: msg.response,
    type: 'chat',          // default conversation type
    tags: [],
    createdAt: new Date().toISOString()
  };

  hist.addLocal(payload);  // optimistic add; store will persist if authenticated
}

/* Load history on first mount */
onMounted(() => {
  if (!hist.items.length) hist.fetch();
});
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <!-- Sidebar with history -->
    <Sidebar
      :open="sidebarOpen"
      :itens="hist.items"
      @close="sidebarOpen = false"
    />

    <!-- Main content -->
    <main class="flex flex-1 flex-col">
      <TopBar @menu="sidebarOpen = true" />

      <!-- Chat scroll area -->
      <ChatArea :items="hist.items" />

      <!-- Footer prompt form -->
      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @new-message="onNewMessage" />
      </footer>
    </main>
  </div>
</template>
