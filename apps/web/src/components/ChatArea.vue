<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import MessageBubble from '@/components/MessageBubble.vue';

const props = defineProps<{
  items: { prompt: string; response: { text?: string; imgUrl?: string } }[];
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
    />
    <div ref="end" />
  </section>
</template>
