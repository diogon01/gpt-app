<!-- apps/web/src/components/history/HistoryListItem.vue -->
<script setup lang="ts">
import { nextTick, ref } from 'vue';

/**
 * Props definition
 * @property {string} label - The visible prompt text for the session
 * @property {string} timestamp - ISO string used as unique session key
 * @property {boolean} active - Whether this session is the active one
 */
defineProps<{
  label: string;
  timestamp: string;
  active: boolean;
}>();

/**
 * Emitted events
 * @event select - Emitted when the item is clicked
 * @event delete - Emitted when the delete option is selected
 */
const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
}>();

/**
 * Whether the menu is open
 * @type {import('vue').Ref<boolean>}
 */
const open = ref(false);

/**
 * Toggles the visibility of the menu
 * @param {MouseEvent} e - The click event
 */
function toggleMenu(e: MouseEvent) {
  e.stopPropagation();
  open.value = !open.value;
  if (open.value)
    nextTick(() => {
      // Close on outside click
      window.addEventListener('click', closeOnce, { once: true });
    });
}

/** Closes the menu */
function closeOnce() {
  open.value = false;
}
</script>

<template>
  <li
    class="group relative flex items-center justify-between truncate text-sm px-2 py-1 rounded transition cursor-pointer hover:bg-slate-700"
    :class="{
      'bg-slate-700 text-cyan-300 font-semibold': active,
      'text-slate-300': !active
    }"
    @click="emit('select', timestamp)"
  >
    <!-- Session label -->
    <span class="pr-2 truncate">{{ label }}</span>

    <!-- Menu trigger button (visible only on hover) -->
    <button
      class="invisible group-hover:visible rounded p-1 hover:bg-slate-700 transition"
      @click.stop="toggleMenu"
    >
      ⋯
    </button>

    <!-- Context menu -->
    <div
      v-if="open"
      class="absolute right-0 top-6 z-10 w-28 rounded-md bg-slate-800
             py-1 text-left shadow-lg border border-slate-600"
    >
      <button
        class="block w-full px-3 py-1 text-red-400 hover:bg-slate-700 text-xs"
        @click.stop="emit('delete', timestamp); open = false"
      >
        Delete
      </button>
    </div>
  </li>
</template>
