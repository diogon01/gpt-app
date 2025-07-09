<script setup lang="ts">
import MessageBubble from '@/components/MessageBubble.vue';
import { onUpdated, ref } from 'vue';

const props = defineProps<{
  itens: any[];
}>();

const end = ref<HTMLElement>();

onUpdated(() => end.value?.scrollIntoView({ behavior: 'smooth' }));
</script>

<template>
  <section class="flex-1 overflow-y-auto space-y-6 px-4 py-6" id="scroll">
    <MessageBubble
      v-for="m in itens"
      :key="m.createdAt"
      :prompt="m.prompt"
      :response="m"
    />
    <div ref="end" />
  </section>
</template>
