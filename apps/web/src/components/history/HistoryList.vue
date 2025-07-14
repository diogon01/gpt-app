<script setup lang="ts">
defineProps<{
  items: { prompt: string; createdAt: string }[];
  activeTimestamp?: string;
}>();

const emit = defineEmits<{
  select: [timestamp: string];
}>();
</script>

<template>
  <ul class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-7rem)]">
    <li
      v-for="i in items"
      :key="i.createdAt"
      @click="emit('select', i.createdAt)"
      class="cursor-pointer truncate text-sm opacity-80 hover:opacity-100 hover:text-cyan-300"
      :class="{ 'text-cyan-400 font-semibold': activeTimestamp === i.createdAt }"
    >
      {{ i.prompt }}
    </li>
  </ul>
</template>
