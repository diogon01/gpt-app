<script setup lang="ts">
import ChatArea from '@/components/chat/ChatArea.vue';
import PromptForm from '@/components/chat/PromptForm.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import TopBar from '@/components/layout/TopBar.vue';

import { MessageRole } from '@42robotics/domain';
import { onMounted, ref } from 'vue';
import { useHistoryStore } from '../stores/useHistoryStore';

const history = useHistoryStore();
const sidebarOpen = ref(false);

/**
 * Handle new message event emitted by the PromptForm.
 * Appends both user and assistant messages to the current session.
 */
function onNewMessage(msg: { prompt: string; response: { text?: string; imgUrl?: string } }) {
  history.appendMessage({ role: MessageRole.User, content: msg.prompt });
  history.appendMessage({ role: MessageRole.Assistant, content: msg.response.text || '' });
}

/**
 * Handle rename request from the sidebar and forward to the store method.
 * @param timestamp - The session timestamp
 * @param newTitle - The new session label
 */
function onRenameSession(timestamp: string, newTitle: string) {
  history.renameSession(timestamp, newTitle);
}

// Load existing history on initial mount
onMounted(() => {
  if (!history.history.length) {
    history.fetch();
  }
});
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <!-- Sidebar for mobile -->
    <Sidebar
      :open="sidebarOpen"
      :itens="history.history"
      @close="sidebarOpen = false"
      @rename="onRenameSession"
    />

    <!-- Main layout -->
    <main class="flex flex-1 flex-col">
      <TopBar @menu="sidebarOpen = true" />

      <div class="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
        <!-- Show the current session's messages -->
        <ChatArea :items="history.activeSession?.messages || []" />
      </div>

      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @new-message="onNewMessage" />
      </footer>
    </main>
  </div>
</template>
