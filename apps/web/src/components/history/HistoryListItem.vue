<script setup lang="ts">
import Icon from '@/components/shared/Icon.vue'; // Reusable SVG icon component
import { nextTick, ref } from 'vue';

/**
 * Props
 * @property {string} label - Displayed session label
 * @property {string} timestamp - Session unique identifier
 * @property {boolean} active - Whether this session is selected
 * @property {boolean} isPlus - Whether the user is a Plus subscriber (optional)
 */
defineProps<{
  label: string;
  timestamp: string;
  active: boolean;
  isPlus?: boolean;
}>();

/**
 * Events emitted by this component
 * @event select - Fired when user selects a session
 * @event delete - Fired when user clicks "Delete"
 * @event rename - Fired when user clicks "Rename"
 * @event share - Fired when user clicks "Share"
 * @event removeFromProject - Fired when user clicks "Remove from project" (Plus only)
 * @event archive - Fired when user clicks "Archive"
 */
const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
  rename: [timestamp: string];
  share: [timestamp: string];
  removeFromProject: [timestamp: string];
  archive: [timestamp: string];
}>();

// Menu state
const open = ref(false);
const menuX = ref(0);
const menuY = ref(0);

/**
 * Toggles the context menu and calculates screen position
 * @param {MouseEvent} e - Button click event
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
 * Closes the menu when clicking outside
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
      'text-slate-300': !active
    }"
    @click="emit('select', timestamp)"
  >
    <!-- Label -->
    <span class="pr-2 truncate">{{ label }}</span>

    <!-- Menu button -->
    <button
      class="invisible group-hover:visible rounded p-1 hover:bg-slate-700 transition"
      @click.stop="toggleMenu"
    >
      ⋯
    </button>

    <!-- Teleported context menu -->
    <Teleport to="body">
      <div
        v-if="open"
        :style="{
          position: 'absolute',
          top: `${menuY}px`,
          left: `${menuX}px`,
          zIndex: 9999
        }"
        class="w-56 rounded-md bg-slate-800 py-1 text-left shadow-xl border border-slate-600"
      >
        <!-- Shared: Share -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('share', timestamp); open = false"
        >
          <Icon name="share" /> Share
        </button>

        <!-- Shared: Rename -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('rename', timestamp); open = false"
        >
          <Icon name="rename" /> Rename
        </button>

        <!-- Plus only: Remove from project -->
        <button
          v-if="isPlus"
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('removeFromProject', timestamp); open = false"
        >
          <Icon name="remove" /> Remove from project
        </button>

        <!-- Shared: Archive -->
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('archive', timestamp); open = false"
        >
          <Icon name="archive" /> Archive
        </button>

        <hr class="my-1 border-slate-600" />

        <!-- Shared: Delete -->
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
