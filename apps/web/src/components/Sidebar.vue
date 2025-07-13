<script setup lang="ts">
import HistoryDrawer from './history/HistoryDrawer.vue';

/**
 * Props:
 *  open  → controla visibilidade no mobile
 *  itens → histórico de prompts
 */
defineProps<{
  open: boolean;
  itens: { prompt: string; createdAt: string }[];
}>();

/** Emite "close" quando clica no botão X ou no backdrop */
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <HistoryDrawer
    :open="open"
    :items="itens"
    @close="emit('close')"
  />
</template>
