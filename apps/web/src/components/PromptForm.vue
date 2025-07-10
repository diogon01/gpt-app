<script setup lang="ts">
import { ref } from 'vue';
import { useUiStore } from '../stores/useUiStore';


const ui      = useUiStore();          // ui.modelo = 'GPT-4o' | 'GPT-3.5' | 'GeoAI'
const prompt  = ref('');
const loading = ref(false);

async function submit() {
  if (!prompt.value.trim()) return;
  loading.value = true;

  try {
    const res = await fetch('/api/ia', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        prompt : prompt.value,
        model : ui.model            // valor vindo da sidebar / topbar
      })
    });

    const data = await res.json();
    // TODO: tratar resposta (exibir imagem ou texto)
    console.log(data);
  } catch (err) {
    console.error('Request failed', err);
  } finally {
    loading.value = false;
    prompt.value  = '';
  }
}
</script>

<template>
  <form @submit.prevent="submit"
        class="mx-auto max-w-3xl space-y-3 md:space-y-0 md:flex md:items-start md:gap-2">
    <textarea v-model="prompt"
              rows="3"
              placeholder="Digite seu prompt…"
              class="flex-1 resize-none rounded border border-slate-700 bg-slate-800
                     px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400" />

    <button type="submit"
            :disabled="loading"
            class="h-fit rounded bg-cyan-400 px-4 py-2 font-semibold text-slate-950
                   hover:brightness-110 disabled:opacity-50">
      {{ loading ? 'Gerando…' : 'Gerar' }}
    </button>
  </form>
</template>
