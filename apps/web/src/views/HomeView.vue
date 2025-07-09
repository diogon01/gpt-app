<script setup lang="ts">
// Importações da Vue
import { ref, onMounted } from 'vue';

// Componentes reutilizáveis
import Sidebar       from '@/components/Sidebar.vue';
import TopBar        from '@/components/TopBar.vue';
import ChatArea      from '@/components/ChatArea.vue';
import PromptForm    from '@/components/PromptForm.vue';

// Stores (Pinia)
import { useHistoryStore } from '../stores/useHistoryStore';
import { useUiStore }      from '../stores/useUiStore';

// Estado global
const ui   = useUiStore();
const hist = useHistoryStore();

// Controle de abertura do menu lateral em mobile
const sidebarOpen = ref(false);

// Função que lida com a geração de conteúdo (prompt)
async function gerar({ prompt, tipo }: {prompt: string; tipo: 'art' | 'geo'}) {
  const provisional = {
    prompt,
    type: tipo,
    createdAt: new Date().toISOString(),
    tags: [],
  };

  // Adiciona entrada local otimista antes da resposta da API
  hist.addLocal(provisional as any);

  ui.isLoading = true;
  try {
    // Requisição à API de geração
    const res = await fetch(`/api/ia/${tipo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(provisional),
    });

    // Mescla resposta da API no item provisório
    Object.assign(provisional, await res.json());
  } catch {
    ui.showToast('Erro ao gerar');
  } finally {
    ui.isLoading = false;
  }
}

// Carrega histórico ao montar se ainda não estiver carregado
onMounted(() => hist.itens.length || hist.fetch());
</script>

<template>
  <!-- Layout base com sidebar + área principal -->
  <div class="flex h-screen bg-slate-950 text-slate-100">
    <!-- Menu lateral com histórico -->
    <Sidebar
      :open="sidebarOpen"
      :itens="hist.itens"
      @close="sidebarOpen = false"
    />

    <!-- Conteúdo principal -->
    <main class="flex flex-1 flex-col">
      <!-- Barra superior com título e botão de menu (mobile) -->
      <TopBar @menu="sidebarOpen = true" />

      <!-- Área de mensagens -->
      <ChatArea :itens="hist.itens" />

      <!-- Rodapé com formulário de prompt -->
      <footer class="border-t border-slate-700 bg-slate-950 p-4">
        <PromptForm @gerar="gerar" />
      </footer>
    </main>
  </div>
</template>
