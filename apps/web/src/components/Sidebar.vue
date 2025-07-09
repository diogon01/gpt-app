<script setup lang="ts">
defineProps<{
  open: boolean;
  itens: { prompt: string; createdAt: string }[];
}>();
defineEmits<{ close: [] }>();
</script>

<template>
  <aside
    :class="[
      'w-60 bg-slate-800 border-r border-slate-700 p-4 transition-transform',
      open ? '' : '-translate-x-full md:translate-x-0',
    ]"
  >
    <button
      class="md:hidden mb-4 text-cyan-400 text-lg"
      @click="$emit('close')"
    >
      ✕ Fechar
    </button>

    <h2 class="mb-4 font-semibold">Histórico</h2>
    <ul class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-7rem)]">
      <li
        v-for="i in itens"
        :key="i.createdAt"
        class="truncate text-sm opacity-80 hover:opacity-100"
      >
        {{ i.prompt }}
      </li>
    </ul>
  </aside>
</template>
