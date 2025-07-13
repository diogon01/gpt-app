<script setup lang="ts">
import HistoryList from './HistoryList.vue';

defineProps<{
  open: boolean;
  items: { prompt: string; createdAt: string }[];
}>();

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <!-- Backdrop mobile -->
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 md:hidden"
    @click="emit('close')"
  />

  <!-- Apenas a lista, sem título e sem aside duplicado -->
  <HistoryList :items="items" />
</template>
