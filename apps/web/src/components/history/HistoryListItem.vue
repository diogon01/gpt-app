<script setup lang="ts">
import Icon from '@/components/shared/Icon.vue'; // Reusable SVG icon component
import { nextTick, ref } from 'vue';

/**
 * Props
 * @property {string} label - The session title or first prompt line
 * @property {string} timestamp - The session's unique ISO timestamp
 * @property {boolean} active - Whether the session is currently selected
 * @property {boolean} isPlus - Whether the user has a Plus plan (optional)
 */
defineProps<{
  label: string;
  timestamp: string;
  active: boolean;
  isPlus?: boolean;
}>();

/**
 * Events emitted by this component
 * @event select - Emitted when the item is clicked
 * @event delete - Emitted when the user selects "Delete"
 * @event rename - Emitted when the user selects "Rename"
 * @event share - Emitted when the user selects "Share"
 * @event removeFromProject - Emitted on "Remove from project" (Plus only)
 * @event archive - Emitted on "Archive" option
 */
const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
  rename: [timestamp: string];
  share: [timestamp: string];
  removeFromProject: [timestamp: string];
  archive: [timestamp: string];
}>();

// Menu state and screen position
const open = ref(false);
const menuX = ref(0);
const menuY = ref(0);

/**
 * Opens or closes the context menu and positions it near the button
 * @param {MouseEvent} e - Click event on the menu button
 */
function toggleMenu(e: MouseEvent) {
  e.stopPropagation();
  open.value = !open.value;

  if (open.value) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    menuX.value = rect.left + rect.width - 180;
    menuY.value = rect.top + rect.height + 6;

    nextTick(() => {
      window.addEventListener('click', closeOnce, { once: true });
    });
  }
}

/**
 * Closes the menu when user clicks outside the element
 */
function closeOnce() {
  open.value = false;
}
</script>

<template>
  <li
    class="group relative flex items-center justify-between truncate text-sm px-2 py-1 rounded transition cursor-pointer hover:bg-slate-700"
    :class="{
      'bg-slate-700 text-cyan-300 font-semibold': active,
      'text-slate-300': !active,
    }"
    @click="emit('select', timestamp)"
  >
    <!-- Session title or prompt -->
    <span class="pr-2 truncate">{{ label }}</span>

    <!-- Context menu toggle -->
    <button
      class="invisible group-hover:visible rounded p-1 hover:bg-slate-700 transition"
      @click.stop="toggleMenu"
    >
      ⋯
    </button>

    <!-- Teleported dropdown menu -->
    <Teleport to="body">
      <div
        v-if="open"
        :style="{
          position: 'absolute',
          top: `${menuY}px`,
          left: `${menuX}px`,
          zIndex: 9999,
        }"
        class="w-56 rounded-md bg-slate-800 py-1 text-left shadow-xl border border-slate-600"
      >
        <!-- Share -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('share', timestamp); open = false"
        >
          <Icon name="share" /> Share
        </button>

        <!-- Rename -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('rename', timestamp); open = false"
        >
          <Icon name="rename" /> Rename
        </button>

        <!-- Remove from project (Plus) -->
        <button
          v-if="isPlus"
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('removeFromProject', timestamp); open = false"
        >
          <Icon name="remove" /> Remove from project
        </button>

        <!-- Archive -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('archive', timestamp); open = false"
        >
          <Icon name="archive" /> Archive
        </button>

        <hr class="my-1 border-slate-600" />

        <!-- Delete -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
          @click.stop="emit('delete', timestamp); open = false"
        >
          <Icon name="delete" /> Delete
        </button>
      </div>
    </Teleport>
  </li>
</template>
