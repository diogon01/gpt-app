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
 *
 * - If no session exists and a `sessionId` is provided, the backend session is fetched and the user is routed.
 * - If no session exists and no `sessionId` is provided, an in-memory session is initialized (anonymous user).
 * - If a session already exists, messages are appended directly.
 *
 * @param msg - Object containing user prompt, assistant response, and optional session ID
 */
async function onNewMessage(msg: {
  prompt: string;
  response: { text?: string; imgUrl?: string };
  sessionId?: string;
}) {
  const isFirstMessage = !history.activeSession;

  if (isFirstMessage) {
    if (msg.sessionId) {
      // Authenticated user with backend-created session
      await history.fetchById(msg.sessionId);
      router.push({ name: 'HistorySession', params: { _id: msg.sessionId } });
    } else {
      // Anonymous user → local-only session
      history.resetSession();
      history.appendMessage({
        role: MessageRole.User,
        content: msg.prompt,
      });
      history.appendMessage({
        role: MessageRole.Assistant,
        content: msg.response.text ?? '',
      });
    }
  } else {
    // Continuation of an existing session
    history.appendMessage({
      role: MessageRole.User,
      content: msg.prompt,
    });
    history.appendMessage({
      role: MessageRole.Assistant,
      content: msg.response.text ?? '',
    });
  }
}

/**
 * Handles session rename emitted by the Sidebar component.
 *
 * @param _id - Session ID to rename
 * @param newTitle - New session title
 */
function onRenameSession(_id: string, newTitle: string) {
  history.renameSession(_id, newTitle);
}

/**
 * Handles session selection from the Sidebar.
 *
 * @param sessionId - Session ID selected by the user
 */
function onSelectSession(sessionId: string) {
  router.push({ name: 'HistorySession', params: { _id: sessionId } });
  sidebarOpen.value = false;
}

/**
 * Initializes the current session on view load or route change.
 * - Fetches the session from the backend if a session ID is present in the route.
 * - Otherwise loads all user history and resets the active session.
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
