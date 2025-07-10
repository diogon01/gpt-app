<script setup lang="ts">
defineProps<{
  prompt: string;
  response: { text?: string; imgUrl?: string };
}>();
</script>

<template>
  <!-- USER -->
  <div class="mx-auto w-full max-w-xl rounded-lg border border-slate-700 bg-slate-800 p-3">
    <p class="font-semibold text-cyan-400 mb-1">You</p>
    <p class="whitespace-pre-wrap">{{ prompt }}</p>
  </div>

  <!-- ASSISTANT -->
  <div
    v-if="response.text || response.imgUrl"
    class="mx-auto mt-2 w-full max-w-xl rounded-lg border border-slate-600 bg-slate-700 p-4"
  >
    <p class="font-semibold text-pink-300 mb-2">Assistant</p>

    <img
      v-if="response.imgUrl"
      :src="response.imgUrl"
      class="mb-3 w-full rounded"
    />

    <p v-if="response.text" class="whitespace-pre-wrap">
      {{ response.text }}
    </p>
  </div>
</template>
