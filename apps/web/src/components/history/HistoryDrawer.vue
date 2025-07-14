<!-- apps/web/src/components/history/HistoryDrawer.vue -->
<script setup lang="ts">
import { useHistoryStore } from '../../stores/useHistoryStore';
import HistoryList from './HistoryList.vue';

defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

const history = useHistoryStore();

/** Set session and close drawer */
function onSelectSession(timestamp: string) {
  history.setActiveSessionByTimestamp(timestamp);
  emit('close');
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 md:hidden"
    @click="emit('close')"
  />
  <HistoryList
    :items="history.summaryItems"
    :activeTimestamp="history.activeSession?.timestamp"
    @select="onSelectSession"
  />
</template>
