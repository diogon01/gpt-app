<script setup lang="ts">
import HistoryList from './HistoryList.vue';

defineProps<{
  open: boolean;
  items: { prompt: string; createdAt: string }[];
}>();

const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 md:hidden"
    @click="emit('close')"
  />

  <aside
    :class="[
      'fixed inset-y-0 left-0 w-60 bg-slate-800 border-r border-slate-700 p-4',
      'transform transition-transform duration-300 z-40',
      open ? 'translate-x-0' : '-translate-x-full',
      'md:static md:translate-x-0 md:h-auto md:z-0',
    ]"
  >
    <button
      class="mb-4 text-lg text-cyan-400 md:hidden"
      aria-label="Close menu"
      @click="emit('close')"
    >
      ✕ Close
    </button>

    <h2 class="mb-4 font-semibold">History</h2>
    <HistoryList :items="items" />
  </aside>
</template>

<style scoped>
@media (min-width: 768px) {
  aside::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
