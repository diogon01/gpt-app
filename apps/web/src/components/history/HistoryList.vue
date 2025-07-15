<!-- apps/web/src/components/history/HistoryList.vue -->
<script setup lang="ts">
import HistoryListItem from './HistoryListItem.vue';

/**
 * Props received by the HistoryList component
 * @property {Array} items - List of user sessions (history)
 * @property {string} [activeTimestamp] - The active session timestamp
 */
const props = defineProps<{
  items: { prompt: string; createdAt: string }[];
  activeTimestamp?: string;
}>();

/**
 * Emits events to parent
 * @event select - A session was selected
 * @event delete - A session was deleted
 * @event rename - A session was renamed with new title
 */
const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
  rename: [timestamp: string, newTitle: string];
}>();

/**
 * Handles rename event from a list item
 * @param timestamp - Session timestamp (ISO string)
 * @param newTitle - New session title entered by the user
 */
function handleRename(timestamp: string, newTitle: string) {
  emit('rename', timestamp, newTitle);
}
</script>

<template>
  <ul
    class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-15rem)] 
           scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
  >
    <HistoryListItem
      v-for="i in props.items"
      :key="i.createdAt"
      :label="i.prompt"
      :timestamp="i.createdAt"
      :active="props.activeTimestamp === i.createdAt"
      @select="emit('select', $event)"
      @delete="emit('delete', $event)"
      @rename="(newTitle) => handleRename(i.createdAt, newTitle)"
    />
  </ul>
</template>
