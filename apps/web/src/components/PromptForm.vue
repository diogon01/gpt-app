<script setup lang="ts">
import { ref } from 'vue';
import { useUiStore } from '../stores/useUiStore';

const emit = defineEmits<{
  'new-message': [{ prompt: string; response: { text?: string; imgUrl?: string } }];
}>();

const ui = useUiStore();
const prompt = ref('');
const loading = ref(false);

async function submit() {
  if (!prompt.value.trim()) return;
  loading.value = true;

  try {
    const res = await fetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt.value, model: ui.model })
    });

    const data = await res.json();

    const response: { text?: string; imgUrl?: string } = {};
    if (data?.choices?.[0]?.message?.content) response.text = data.choices[0].message.content;
    if (data?.data?.[0]?.url) response.imgUrl = data.data[0].url;

    emit('new-message', { prompt: prompt.value, response });
  } catch (err) {
    console.error('Request failed', err);
  } finally {
    loading.value = false;
    prompt.value = '';
  }
}
</script>

<template>
  <form @submit.prevent="submit"
        class="relative mx-auto max-w-6xl px-2">
    <div class="relative">
      <textarea v-model="prompt"
                rows="3"
                placeholder="Digite seu prompt…"
                class="w-full resize-none rounded border border-slate-700 bg-slate-800
                       px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-cyan-400
                       whitespace-pre-wrap break-words text-sm md:text-base" />

      <!-- Botão de envio com SVG -->
      <button type="submit"
              :disabled="loading"
              aria-label="Enviar"
              class="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center
                     rounded-full bg-cyan-400 text-black hover:brightness-110
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-md transition-all duration-150">
        
        <!-- Ícone SVG personalizado -->
        <svg v-if="!loading"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12l7-7 7 7M12 5v13" />
      </svg>


        <!-- Spinner -->
        <svg v-else class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </button>
    </div>
  </form>
</template>
