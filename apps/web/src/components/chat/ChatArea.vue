<script setup lang="ts">

import type { UserMessageResponseDTO } from '@42robotics/domain';
import MessageBubble from './MessageBubble.vue';

const { items } = defineProps<{ items: UserMessageResponseDTO[] }>();

/**
 * Groups user/assistant messages into pairs for rendering as chat bubbles.
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

const bubbles = groupMessages(items);
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
