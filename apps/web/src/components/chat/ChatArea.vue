<!-- apps/web/src/components/chat/ChatArea.vue -->
<script setup lang="ts">
import type { UserMessageResponseDTO } from '@42robotics/domain';
import { computed } from 'vue';
import MessageBubble from './MessageBubble.vue';

/**
 * Props received by the ChatArea component
 * @property {UserMessageResponseDTO[]} items - List of messages in the current session
 */
const { items } = defineProps<{ items: UserMessageResponseDTO[] }>();

/**
 * Groups messages into user/assistant pairs to display as chat bubbles.
 *
 * @param {UserMessageResponseDTO[]} messages - Array of messages from the session
 * @returns {Array} Array of objects each containing a user prompt and optional assistant response
 */
function groupMessages(messages: UserMessageResponseDTO[]) {
  const result: { prompt: string; response: { text?: string } }[] = [];

  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    if (current.role === 'user') {
      const next = messages[i + 1];
      result.push({
        prompt: current.content,
        response: next?.role === 'assistant' ? { text: next.content } : {},
      });
    }
  }

  return result;
}

/**
 * Reactive list of chat bubbles generated from the current session messages.
 */
const bubbles = computed(() => groupMessages(items));
</script>

<template>
  <section class="space-y-6 px-4 py-6">
    <MessageBubble
      v-for="(msg, i) in bubbles"
      :key="i"
      :prompt="msg.prompt"
      :response="msg.response"
    />
  </section>
</template>
