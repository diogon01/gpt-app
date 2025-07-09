<script setup lang="ts">
/* Emite evento para abrir o menu lateral (mobile) */
defineEmits<{ menu: [] }>();

/* Modelos disponíveis (pode vir de store depois) */
const modelos = ['GPT-4o', 'GPT-3.5', 'GeoAI'];
</script>

<template>
  <header
    class="relative h-14 flex items-center border-b border-slate-700 bg-slate-950 px-4"
  >
    <!-- ▸ Esquerda: ícone hamburger ------------------------------ -->
    <button
      class="text-xl text-cyan-400 md:hidden"
      aria-label="Abrir menu"
      @click="$emit('menu')"
    >
      ☰
    </button>

    <!-- ▸ Centro: seletor de modelo (absoluto p/ ficar sempre central) -->
    <div class="absolute left-1/2 -translate-x-1/2">
      <select
        class="bg-slate-800 border border-slate-700 text-cyan-400
               rounded px-3 py-1 text-sm focus:outline-none"
      >
        <option
          v-for="m in modelos"
          :key="m"
          :value="m"
          class="bg-slate-900"
        >{{ m }}</option>
      </select>
    </div>

    <!-- ▸ Direita: ação (ex.: configs) ---------------------------- -->
    <button
      class="ml-auto text-cyan-400 text-lg hidden sm:block"
      aria-label="Configurações (em breve)"
    >
      ✎
    </button>
  </header>
</template>
