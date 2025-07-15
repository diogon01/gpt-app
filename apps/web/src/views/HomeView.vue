<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import ChatArea from '@/components/chat/ChatArea.vue';
import PromptForm from '@/components/chat/PromptForm.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import TopBar from '@/components/layout/TopBar.vue';


import { MessageRole } from '@42robotics/domain';
import { useHistoryStore } from '../stores/useHistoryStore';

const route = useRoute();
const history = useHistoryStore();
const sidebarOpen = ref(false);

/**
 * Handles new message event emitted by the PromptForm.
 * Appends both user and assistant messages to the current session.
 *
 * @param msg - Contains the user prompt and assistant response
 */
function onNewMessage(msg: { prompt: string; response: { text?: string; imgUrl?: string } }) {
  history.appendMessage({ role: MessageRole.User, content: msg.prompt });
  history.appendMessage({ role: MessageRole.Assistant, content: msg.response.text || '' });
}

/**
 * Handles rename requests emitted by the sidebar.
 *
 * @param timestamp - Session timestamp used for matching
 * @param newTitle - New title to apply to the session
 */
function onRenameSession(timestamp: string, newTitle: string) {
  history.renameSession(timestamp, newTitle);
}

/**
 * Initializes session based on route param or falls back to full history.
 * This is executed on initial mount or when route param changes.
 */
async function initializeSession() {
  const sessionId = route.params.id as string | undefined;

  if (sessionId) {
    await history.fetchById(sessionId);
  } else if (!history.history.length) {
    await history.fetch();
  }
}

// Load session or full history on mount
onMounted(() => {
  initializeSession();
});

// React to route changes (e.g., when navigating between sessions)
watch(() => route.params.id, () => {
  initializeSession();
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
        <!-- Displays the current session's messages -->
        <ChatArea :items="history.activeSession?.messages || []" />
      </div>

      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @new-message="onNewMessage" />
      </footer>
    </main>
  </div>
</template>
