<script setup lang="ts">
defineProps<{
  items: { prompt: string; createdAt: string }[];
}>();
</script>

<template>
  <ul class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-7rem)]">
    <li
      v-for="i in items"
      :key="i.createdAt"
      class="truncate text-sm opacity-80 hover:opacity-100"
    >
      {{ i.prompt }}
    </li>
  </ul>
</template>
