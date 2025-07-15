<script setup lang="ts">
import { defineExpose, nextTick, ref } from 'vue';

const props = defineProps<{
  text: string;
  sessionId: string;
  active: boolean;
}>();

const emit = defineEmits<{
  rename: [sessionId: string, newTitle: string];
}>();

const editMode = ref(false);
const editText = ref('');
const renameConfirmed = ref(false);

function startEdit() {
  editText.value = props.text;
  editMode.value = true;
  renameConfirmed.value = false;

  nextTick(() => {
    const input = document.getElementById(`edit-${props.sessionId}`) as HTMLInputElement;
    input?.focus();
    input?.select();
  });
}

function onEnter(e: KeyboardEvent) {
  e.preventDefault();
  renameConfirmed.value = true;
  (e.target as HTMLInputElement).blur();
}

async function onBlur() {
  await nextTick();
  const newTitle = editText.value.trim();
  editMode.value = false;

  if (renameConfirmed.value && newTitle && newTitle !== props.text) {
    emit('rename', props.sessionId, newTitle);
  }

  renameConfirmed.value = false;
}

defineExpose({ startEdit });
</script>

<template>
  <template v-if="!editMode">
    <span class="pr-2 truncate">{{ props.text }}</span>
  </template>

  <template v-else>
    <input
      :id="`edit-${props.sessionId}`"
      v-model="editText"
      class="pr-2 w-full bg-slate-600 text-slate-100 rounded px-1 outline-none"
      @keydown.enter="onEnter"
      @keydown.esc.prevent="editMode = false"
      @blur="onBlur"
    />
  </template>
</template>
