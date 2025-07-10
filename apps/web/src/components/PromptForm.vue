<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  gerar: [{ prompt: string; modelo: string }];
}>();

const prompt  = ref('');
const modelos = ['GPT-4o', 'GPT-3.5', 'GeoAI'];
const modelo  = ref(modelos[0]); // definido externamente via sidebar

function submit() {
  if (!prompt.value.trim()) return;
  emit('gerar', { prompt: prompt.value, modelo: modelo.value });
  prompt.value = '';
}
</script>

<template>
  <form @submit.prevent="submit" class="mx-auto max-w-3xl space-y-3 md:space-y-0 md:flex md:items-start md:gap-2">
    <!-- Prompt -->
    <textarea
      v-model="prompt"
      rows="3"
      placeholder="Digite seu prompt…"
      class="flex-1 resize-none rounded border border-slate-700 bg-slate-800
             px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />

    <!-- Botão -->
    <button
      type="submit"
      class="h-fit rounded bg-cyan-400 px-4 py-2 font-semibold text-slate-950
             hover:brightness-110"
    >
      Gerar
    </button>
  </form>
</template>
