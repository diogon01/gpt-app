<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  gerar: [{ prompt: string; tipo: 'art' | 'geo' }];
}>();

const prompt = ref('');
const tipo   = ref<'art' | 'geo'>('art');

function submit() {
  if (!prompt.value.trim()) return;
  emit('gerar', { prompt: prompt.value, tipo: tipo.value });
  prompt.value = '';
}
</script>

<template>
  <form @submit.prevent="submit" class="mx-auto max-w-3xl space-y-3">
    <!-- Área de texto ------------------------------------------------>
    <textarea
      v-model="prompt"
      rows="3"
      placeholder="Digite seu prompt…"
      class="w-full resize-none rounded border border-slate-700 bg-slate-800
             px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />

    <!-- Seleção + botão --------------------------------------------->
    <div class="flex gap-2">
      <!-- Tipo -->
      <select
        v-model="tipo"
        class="rounded border border-slate-700 bg-slate-800 px-3 py-2
               focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="art">Arte</option>
        <option value="geo">Geo-Analyze</option>
      </select>

      <!-- Botão enviar -->
      <button
        type="submit"
        class="flex-1 rounded bg-cyan-400 px-4 py-2 font-semibold text-slate-950
               hover:brightness-110"
      >
        Gerar
      </button>
    </div>
  </form>
</template>
