<script setup lang="ts">
import EditableLabel from '@/components/history/EditableLabel.vue';
import Icon from '@/components/shared/Icon.vue';
import { nextTick, ref } from 'vue';

/* -------------------------------------------------------------------------- */
/* Props & Emits                                                              */
/* -------------------------------------------------------------------------- */

const props = defineProps<{
  label: string;
  timestamp: string;
  active: boolean;
  isPlus?: boolean;
}>();

const emit = defineEmits<{
  select: [timestamp: string];
  delete: [timestamp: string];
  rename: [timestamp: string, newTitle: string];
  share: [timestamp: string];
  removeFromProject: [timestamp: string];
  archive: [timestamp: string];
}>();

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */

const menuOpen = ref(false);
const menuX    = ref(0);
const menuY    = ref(0);

const labelRef = ref<InstanceType<typeof EditableLabel>>();

/* -------------------------------------------------------------------------- */
/* Menu helpers                                                               */
/* -------------------------------------------------------------------------- */
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
/** Trigger inline rename inside EditableLabel */
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
    <!-- Editable label component -->
    <EditableLabel
      ref="labelRef"
      :text="props.label"
      :timestamp="props.timestamp"
      :active="props.active"
      @rename="emit('rename', $event[0], $event[1])"
    />

    <!-- MENU BUTTON -->
    <button
      class="invisible group-hover:visible rounded p-1 hover:bg-slate-700 transition"
      @click.stop="toggleMenu"
    >
      ⋯
    </button>

    <!-- CONTEXT MENU -->
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
