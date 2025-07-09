<script setup lang="ts">
/**
 * Props:
 *  open  → controla visibilidade no mobile
 *  itens → histórico de prompts
 */
defineProps<{
  open: boolean;
  itens: { prompt: string; createdAt: string }[];
}>();

/** Emite "close" quando clica no botão X ou no backdrop */
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <!-- Backdrop (só aparece em mobile quando sidebar aberto) -->
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-black/40 md:hidden"
    @click="emit('close')"
  />

  <!-- Drawer -->
  <aside
    :class="[
      // layout base: largura fixa, cor, borda
      'fixed inset-y-0 left-0 w-60 bg-slate-800 border-r border-slate-700 p-4',
      'transform transition-transform duration-300 z-40',
      // estado aberto/fechado no mobile (md:hidden)
      open ? 'translate-x-0' : '-translate-x-full',
      // em md: o sidebar vira estático dentro do fluxo
      'md:static md:translate-x-0 md:h-auto md:z-0',
    ]"
  >
    <!-- Botão fechar (apenas mobile) -->
    <button
      class="mb-4 text-lg text-cyan-400 md:hidden"
      aria-label="Fechar menu"
      @click="emit('close')"
    >
      ✕ Fechar
    </button>

    <!-- Conteúdo -->
    <h2 class="mb-4 font-semibold">Histórico</h2>

    <ul class="space-y-2 overflow-y-auto pr-1 max-h-[calc(100vh-7rem)]">
      <li
        v-for="i in itens"
        :key="i.createdAt"
        class="truncate text-sm opacity-80 hover:opacity-100"
      >
        {{ i.prompt }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
/* Remove o scroll-bar no desktop, mantém no mobile */
@media (min-width: 768px) {
  aside::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
