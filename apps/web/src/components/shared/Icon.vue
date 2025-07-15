<!-- apps/web/src/components/shared/Icon.vue -->
<script setup lang="ts">
/**
 * Props
 * @property {string} name - Icon identifier
 * @property {string} size - Tailwind size (e.g., h-4 w-4)
 */
defineProps<{
  name: 'share' | 'rename' | 'remove' | 'archive' | 'delete';
  size?: string;
}>();
</script>

<template>
  <span :class="['inline-block', size || 'h-4 w-4']">
    <svg v-if="name === 'share'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12l-3-3m0 0l-3 3m3-3v6m6 3h.01M18 18a2 2 0 100-4 2 2 0 000 4zM6 18a2 2 0 100-4 2 2 0 000 4zM12 18a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
    <svg v-else-if="name === 'rename'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.625 2.625 0 113.712 3.712L7.5 20.25H3v-4.5L16.862 3.487z" />
    </svg>
    <svg v-else-if="name === 'remove'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
    </svg>
    <svg v-else-if="name === 'archive'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25v10.5A1.5 1.5 0 004.5 20.25h15a1.5 1.5 0 001.5-1.5V8.25m-18 0l1.72-4.027A1.5 1.5 0 014.87 3h14.26a1.5 1.5 0 011.65 1.223L22.5 8.25m-18 0h18m-10.5 4.5h3" />
    </svg>
    <svg v-else-if="name === 'delete'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </span>
</template>
