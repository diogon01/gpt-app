<script setup lang="ts">
import { ref } from 'vue';
import { useUiStore } from '../stores/useUiStore';


const emit = defineEmits<{
  'new-message': [{ prompt: string; response: { text?: string; imgUrl?: string } }];
}>();

const ui      = useUiStore();
const prompt  = ref('');
const loading = ref(false);

async function submit() {
  if (!prompt.value.trim()) return;
  loading.value = true;

  try {
    const res = await fetch('/api/ia', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ prompt: prompt.value, model: ui.model })
    });

    const data = await res.json();

    const response: { text?: string; imgUrl?: string } = {};
    if (data?.choices?.[0]?.message?.content) response.text  = data.choices[0].message.content;
    if (data?.data?.[0]?.url)                  response.imgUrl = data.data[0].url;

    emit('new-message', { prompt: prompt.value, response });
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
