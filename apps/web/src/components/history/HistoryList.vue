<!-- apps/web/src/components/history/HistoryList.vue -->
<script setup lang="ts">
import HistoryListItem from './HistoryListItem.vue';

/**
 * Props received by the HistoryList component
 * @property {Array} items - List of user sessions (history)
 * @property {string} [activeTimestamp] - The active session timestamp
 */
const props = defineProps<{
  items: { _id: string; prompt: string; createdAt: string }[];
  activeTimestamp?: string;
}>();

/**
 * Emits events to parent
 * @event select - A session was selected (by _id)
 * @event delete - A session was deleted
 * @event rename - A session was renamed with new title
 */
const emit = defineEmits<{
  select: [_id: string];
  delete: [_id: string];
  rename: [_id: string, newTitle: string];
}>();
</script>

<template>
  <ul
    class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-15rem)] 
           scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
  >
    <HistoryListItem
      v-for="i in props.items"
      :key="i._id"
      :label="i.prompt"
      :timestamp="i.createdAt"
      :_id="i._id"
      :active="props.activeTimestamp === i.createdAt"
      @select="emit('select', i._id)"
      @delete="emit('delete', i._id)"
      @rename="(_id, newTitle) => emit('rename', _id, newTitle)"
    />
  </ul>
</template>
