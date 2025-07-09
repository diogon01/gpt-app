<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar       from '@/components/Sidebar.vue';
import TopBar        from '@/components/TopBar.vue';
import ChatArea      from '@/components/ChatArea.vue';
import PromptForm    from '@/components/PromptForm.vue';
import { useHistoryStore } from '../stores/useHistoryStore';
import { useUiStore } from '../stores/useUiStore';


const ui   = useUiStore();
const hist = useHistoryStore();

const sidebarOpen = ref(false);

async function gerar({ prompt, tipo }: {prompt:string; tipo:'art'|'geo'}) {
  const provisional = { prompt, type: tipo, createdAt: new Date().toISOString(), tags: [] };
  hist.addLocal(provisional as any);

  ui.isLoading = true;
  try {
    const res = await fetch(`/api/ia/${tipo}`, {
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
    <Sidebar
      :open="sidebarOpen"
      :itens="hist.itens"
      @close="sidebarOpen = false"
    />

    <main class="flex flex-1 flex-col">
      <TopBar @menu="sidebarOpen = true" />

      <ChatArea :itens="hist.itens" />

      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @gerar="gerar" />
      </footer>
    </main>
  </div>
</template>
