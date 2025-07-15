<script setup lang="ts">
import HistoryListItem from './HistoryListItem.vue';

defineProps<{
  items: { prompt: string; createdAt: string }[];
  activeTimestamp?: string;
}>();

const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
}>();
</script>

<template>
  <ul
    class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-15rem)] 
           scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
  >
    <HistoryListItem
      v-for="i in items"
      :key="i.createdAt"
      :label="i.prompt"
      :timestamp="i.createdAt"
      :active="activeTimestamp === i.createdAt"
      @select="emit('select', $event)"
      @delete="emit('delete', $event)"
    />
  </ul>
</template>
