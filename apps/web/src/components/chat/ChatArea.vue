<script setup lang="ts">
import type { UserMessage } from '@42robotics/domain';
import MessageBubble from './MessageBubble.vue';

const { items } = defineProps<{ items: UserMessage[] }>();
</script>

<template>
  <section class="space-y-6 px-4 py-6">
    <MessageBubble
      v-for="(msg, i) in items"
      :key="i"
      :prompt="msg.role === 'user' ? msg.content : ''"
      :response="msg.role === 'assistant' ? { text: msg.content } : {}"
    />
  </section>
</template>
