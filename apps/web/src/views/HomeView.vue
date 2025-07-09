<!-- apps/web/src/views/HomeView.vue -->
<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import MessageBubble              from '@/components/MessageBubble.vue';
import { useHistoryStore } from '../stores/useHistoryStore';
import { useUiStore } from '../stores/useUiStore';


const prompt       = ref('');
const tipo         = ref<'art' | 'geo'>('art');
const ui           = useUiStore();
const hist         = useHistoryStore();
const chatEnd      = ref<HTMLElement>();
const sidebarOpen  = ref(false);

async function gerar() {
  if (!prompt.value.trim()) return;

  const provisional = {
    prompt: prompt.value,
    type:   tipo.value,
    createdAt: new Date().toISOString(),
    tags: [],
  };
  hist.addLocal(provisional as any);
  prompt.value = '';

  await nextTick();
  chatEnd.value?.scrollIntoView({ behavior: 'smooth' });

  ui.isLoading = true;
  try {
    const res = await fetch(`/api/ia/${tipo.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(provisional),
    });
    Object.assign(provisional, await res.json());
  } catch {
    ui.showToast('Erro ao gerar');
  } finally {
    ui.isLoading = false;
  }
}

onMounted(() => hist.itens.length || hist.fetch());
</script>

<template>
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <!-- ▸ Sidebar -------------------------------------------------- -->
    <aside
      :class="[
        'w-60 bg-slate-800 border-r border-slate-700 p-4 transition-transform',
        sidebarOpen ? '' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <button
        class="md:hidden mb-4 text-cyan-400 text-lg"
        @click="sidebarOpen = false"
      >
        ✕ Fechar
      </button>

      <h2 class="mb-4 font-semibold">Histórico</h2>
      <ul class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-7rem)]">
        <li
          v-for="r in hist.itens"
          :key="r.createdAt"
          class="truncate text-sm opacity-80 hover:opacity-100"
        >
          {{ r.prompt }}
        </li>
      </ul>
    </aside>

    <!-- ▸ Área principal ------------------------------------------ -->
    <main class="flex flex-col flex-1">
      <!-- Header -->
      <header
        class="h-14 flex items-center justify-between border-b border-slate-700 px-4 bg-slate-950"
      >
        <button
          class="md:hidden text-cyan-400 text-xl"
          @click="sidebarOpen = true"
        >
          ☰
        </button>
        <h1 class="mx-auto text-2xl md:text-3xl font-extrabold text-cyan-400">
          InsightCanvas
        </h1>
      </header>

      <!-- Mensagens -->
      <section id="scroll" class="flex-1 overflow-y-auto space-y-6 px-4 py-6">
        <MessageBubble
          v-for="r in hist.itens"
          :key="r.createdAt"
          :prompt="r.prompt"
          :response="r"
        />
        <div ref="chatEnd" />
      </section>

      <!-- Input fixo -->
      <footer class="border-t border-slate-700 p-4 bg-slate-950">
        <form @submit.prevent="gerar" class="mx-auto max-w-3xl space-y-3">
          <textarea
            v-model="prompt"
            rows="3"
            placeholder="Digite seu prompt…"
            class="w-full resize-none rounded border border-slate-700 bg-slate-800 p-3
                   focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <div class="flex gap-2">
            <select
              v-model="tipo"
              class="rounded border border-slate-700 bg-slate-800 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="art">Arte</option>
              <option value="geo">Geo-Analyze</option>
            </select>

            <button
              type="submit"
              class="flex-1 rounded bg-cyan-400 px-4 py-2 font-semibold text-slate-950
                     hover:brightness-110"
            >
              Gerar
            </button>
          </div>
        </form>
      </footer>
    </main>
  </div>
</template>

