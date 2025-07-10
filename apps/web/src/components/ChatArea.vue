<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import MessageBubble from '@/components/MessageBubble.vue';
import type { HistoryItem } from '../stores/useHistoryStore';

const props = defineProps<{
  items: HistoryItem[];
}>();

const end = ref<HTMLElement | null>(null);
onUpdated(() => end.value?.scrollIntoView({ behavior: 'smooth' }));
</script>

<template>
  <section class="flex-1 overflow-y-auto space-y-6 px-4 py-6">
    <MessageBubble
      v-for="(m, i) in items"
      :key="i"
      :prompt="m.prompt"
      :response="m.response"
      :loading="m.loading"
    />
    <div ref="end" />
  </section>
</template>
