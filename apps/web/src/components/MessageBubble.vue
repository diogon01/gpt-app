<script setup lang="ts">
defineProps<{
  prompt: string;
  response: { text?: string; imgUrl?: string };
}>();
</script>

<template>
  <!-- usuário -->
  <div class="mx-auto w-full max-w-xl rounded-lg border border-surface/50 bg-surface p-3">
    {{ prompt }}
  </div>

  <!-- resposta IA -->
  <div
    v-if="response.text || response.imgUrl"
    class="mx-auto mt-2 w-full max-w-xl rounded-lg border border-surface/40 bg-primary p-4"
  >
    <img v-if="response.imgUrl" :src="response.imgUrl" class="mb-3 w-full rounded" />
    <p class="whitespace-pre-wrap">{{ response.text }}</p>
  </div>
</template>
