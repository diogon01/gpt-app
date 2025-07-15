<script setup lang="ts">
import { defineExpose, nextTick, ref } from 'vue';

/**
 * Component props.
 * @property {string} text - The initial text to display and edit.
 * @property {string} _id - Unique identifier for the session (from backend).
 * @property {boolean} active - Flag indicating whether the session is currently active.
 */
const props = defineProps<{
  text: string;
  _id: string;
  active: boolean;
}>();

/**
 * Component emits.
 * @event rename - Emitted when the label is successfully renamed.
 * @param {string} _id - The session ID being renamed.
 * @param {string} newTitle - The new title entered by the user.
 */
const emit = defineEmits<{
  rename: [_id: string, newTitle: string];
}>();

const editMode = ref(false);             // Tracks whether the label is in edit mode
const editText = ref('');                // Holds the current editable text
const renameConfirmed = ref(false);      // Tracks if rename was confirmed via Enter key

/**
 * Initiates edit mode for the label input.
 * Focuses and selects the current text after DOM update.
 */
function startEdit() {
  editText.value = props.text;
  editMode.value = true;
  renameConfirmed.value = false;

  nextTick(() => {
    const input = document.getElementById(`edit-${props._id}`) as HTMLInputElement;
    input?.focus();
    input?.select();
  });
}

/**
 * Handles the Enter key during editing.
 * Confirms the rename and blurs the input to trigger `onBlur`.
 * 
 * @param {KeyboardEvent} e - The keyboard event.
 */
function onEnter(e: KeyboardEvent) {
  e.preventDefault();
  renameConfirmed.value = true;
  (e.target as HTMLInputElement).blur();
}

/**
 * Handles the blur event after editing.
 * Validates and emits the rename event if conditions are met.
 */
async function onBlur() {
  await nextTick();
  const newTitle = editText.value.trim();
  editMode.value = false;

  if (renameConfirmed.value && newTitle && newTitle !== props.text) {
    emit('rename', props._id, newTitle); // Using backend _id convention
  }

  renameConfirmed.value = false;
}

// Expose method for parent components to trigger edit mode
defineExpose({ startEdit });
</script>

<template>
  <!-- Display mode -->
  <template v-if="!editMode">
    <span class="pr-2 truncate">{{ props.text }}</span>
  </template>

  <!-- Edit mode -->
  <template v-else>
    <input
      :id="`edit-${props._id}`"
      v-model="editText"
      class="pr-2 w-full bg-slate-600 text-slate-100 rounded px-1 outline-none"
      @keydown.enter="onEnter"
      @keydown.esc.prevent="editMode = false"
      @blur="onBlur"
    />
  </template>
</template>
