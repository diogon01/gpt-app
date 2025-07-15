<script setup lang="ts">
import { defineExpose, nextTick, ref } from 'vue';

/**
 * Props for EditableLabel
 * @property {string} text - Initial label text
 * @property {string} timestamp - Identifier used for input targeting
 * @property {boolean} active - Whether the item is active
 */
const props = defineProps<{
  text: string;
  timestamp: string;
  active: boolean;
}>();

/**
 * Emits rename event
 * @event rename - Emitted when the user confirms a new title
 */
const emit = defineEmits<{
  rename: [timestamp: string, newTitle: string];
}>();

const editMode = ref(false);
const editText = ref('');
const renameConfirmed = ref(false);

/**
 * Begin editing the label
 */
function startEdit() {
  editText.value = props.text;
  editMode.value = true;
  renameConfirmed.value = false;

  nextTick(() => {
    const input = document.getElementById(`edit-${props.timestamp}`) as HTMLInputElement;
    input?.focus();
    input?.select();
  });
}

/**
 * On ENTER key: confirm and trigger blur
 */
function onEnter(e: KeyboardEvent) {
  e.preventDefault();
  renameConfirmed.value = true;
  (e.target as HTMLInputElement).blur();
}

/**
 * On blur: finalize rename if confirmed
 */
async function onBlur() {
  await nextTick();
  const newTitle = editText.value.trim();
  editMode.value = false;

  if (renameConfirmed.value && newTitle && newTitle !== props.text) {
    emit('rename', props.timestamp, newTitle);
  }

  renameConfirmed.value = false;
}

// Expose editing control to parent
defineExpose({ startEdit });
</script>

<template>
  <template v-if="!editMode">
    <span class="pr-2 truncate">{{ props.text }}</span>
  </template>

  <template v-else>
    <input
      :id="`edit-${props.timestamp}`"
      v-model="editText"
      class="pr-2 w-full bg-slate-600 text-slate-100 rounded px-1 outline-none"
      @keydown.enter="onEnter"
      @keydown.esc.prevent="editMode = false"
      @blur="onBlur"
    />
  </template>
</template>
