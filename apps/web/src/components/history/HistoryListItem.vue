<script setup lang="ts">
import EditableLabel from '@/components/history/EditableLabel.vue';
import Icon from '@/components/shared/Icon.vue';
import { nextTick, ref } from 'vue';

/**
 * Props received by the HistoryListItem component.
 * @property {string} label - The display text for the session.
 * @property {string} timestamp - ISO timestamp of the session.
 * @property {string} _id - Unique identifier for the session (from backend).
 * @property {boolean} active - Flag indicating if this session is currently active.
 * @property {boolean} [isPlus] - Optional flag for additional session actions.
 */
const props = defineProps<{
  label: string;
  timestamp: string;
  _id: string;
  active: boolean;
  isPlus?: boolean;
}>();

/**
 * Events emitted by the component.
 * - select: Triggered when the list item is clicked.
 * - delete: Triggered when the session is to be deleted.
 * - rename: Triggered after renaming the session.
 * - share: Triggered when the session is shared.
 * - removeFromProject: Triggered when session is removed from project.
 * - archive: Triggered when the session is archived.
 */
const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
  rename: [_id: string, newTitle: string];
  share: [timestamp: string];
  removeFromProject: [timestamp: string];
  archive: [timestamp: string];
}>();

const menuOpen = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const labelRef = ref<InstanceType<typeof EditableLabel>>();

/**
 * Toggles the contextual menu and calculates its position relative to the clicked element.
 * @param {MouseEvent} e - The mouse click event.
 */
function toggleMenu(e: MouseEvent) {
  e.stopPropagation();
  menuOpen.value = !menuOpen.value;

  if (menuOpen.value) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    menuX.value = rect.left + rect.width - 180;
    menuY.value = rect.top + rect.height + 6;

    nextTick(() =>
      window.addEventListener('click', () => (menuOpen.value = false), {
        once: true,
      }),
    );
  }
}

/**
 * Triggers edit mode on the EditableLabel component.
 */
function triggerRename() {
  menuOpen.value = false;
  labelRef.value?.startEdit();
}
</script>

<template>
  <li
    class="group relative flex items-center justify-between truncate text-sm px-2 py-1 rounded transition cursor-pointer hover:bg-slate-700"
    :class="{
      'bg-slate-700 text-cyan-300 font-semibold': props.active,
      'text-slate-300': !props.active,
    }"
    @click="emit('select', props.timestamp)"
  >
    <!-- Editable label with session rename handler -->
    <EditableLabel
      ref="labelRef"
      :_id="props._id"
      :text="props.label"
      :active="props.active"
      @rename="(_id: string, newTitle: string) => emit('rename', _id, newTitle)"
    />

    <button
      class="invisible group-hover:visible rounded p-1 hover:bg-slate-700 transition"
      @click.stop="toggleMenu"
    >
      ⋯
    </button>

    <Teleport to="body">
      <div
        v-if="menuOpen"
        :style="{ position: 'absolute', top: `${menuY}px`, left: `${menuX}px`, zIndex: 9999 }"
        class="w-56 rounded-md bg-slate-800 py-1 text-left shadow-xl border border-slate-600"
      >
        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('share', props.timestamp); menuOpen = false"
        >
          <Icon name="share" /> Share
        </button>

        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="triggerRename"
        >
          <Icon name="rename" /> Rename
        </button>

        <button
          v-if="props.isPlus"
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('removeFromProject', props.timestamp); menuOpen = false"
        >
          <Icon name="remove" /> Remove from project
        </button>

        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
          @click.stop="emit('archive', props.timestamp); menuOpen = false"
        >
          <Icon name="archive" /> Archive
        </button>

        <hr class="my-1 border-slate-600" />

        <button
          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
          @click.stop="emit('delete', props.timestamp); menuOpen = false"
        >
          <Icon name="delete" /> Delete
        </button>
      </div>
    </Teleport>
  </li>
</template>
