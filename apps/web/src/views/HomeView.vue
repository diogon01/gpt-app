<!-- apps/web/src/views/HomeView.vue -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ChatArea from '@/components/chat/ChatArea.vue';
import PromptForm from '@/components/chat/PromptForm.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import TopBar from '@/components/layout/TopBar.vue';

import { MessageRole } from '@42robotics/domain';
import { useHistoryStore } from '../stores/useHistoryStore';

const route = useRoute();
const router = useRouter();
const history = useHistoryStore();
const sidebarOpen = ref(false);

/**
 * Handles new message emitted by PromptForm.
 * Starts a new session if none exists and appends both messages.
 *
 * @param msg - Object containing user prompt and assistant response
 */
async function onNewMessage(msg: { prompt: string; response: { text?: string; imgUrl?: string } }) {
  if (!history.activeSession) {
    history.startNewSession({ role: MessageRole.User, content: msg.prompt });

    if (history.activeSessionId) {
      router.push({ name: 'HistorySession', params: { _id: history.activeSessionId } });
    }
  }

  history.appendMessage({ role: MessageRole.User, content: msg.prompt });
  history.appendMessage({ role: MessageRole.Assistant, content: msg.response.text || '' });
}

/**
 * Handles rename requests emitted by Sidebar.
 *
 * @param _id - Session ID to rename
 * @param newTitle - New title to assign to session
 */
function onRenameSession(_id: string, newTitle: string) {
  history.renameSession(_id, newTitle);
}

/**
 * Handles session selection from Sidebar.
 *
 * @param sessionId - Selected session ID to activate
 */
function onSelectSession(sessionId: string) {
  router.push({ name: 'HistorySession', params: { _id: sessionId } });
  sidebarOpen.value = false;
}

/**
 * Initializes session based on route:
 * - Fetches specific session if ID is present
 * - Loads all history if on root ("/") route
 */
async function initializeSession() {
  const sessionId = route.params._id as string | undefined;

  if (sessionId) {
    await history.fetchById(sessionId);
  } else {
    if (!history.history.length) {
      await history.fetch();
    }
    history.activeSession = null;
  }
}

onMounted(() => {
  initializeSession();
});

watch(() => route.params._id, () => {
  initializeSession();
});
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <!-- Sidebar (mobile) -->
    <Sidebar
      :open="sidebarOpen"
      :itens="history.history"
      @close="sidebarOpen = false"
      @rename="onRenameSession"
      @select="onSelectSession"
    />

    <!-- Main layout -->
    <main class="flex flex-1 flex-col">
      <TopBar @menu="sidebarOpen = true" />

      <div class="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
        <ChatArea :items="history.activeSession?.messages || []" />
      </div>

      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @new-message="onNewMessage" />
      </footer>
    </main>
  </div>
</template>
