<script setup lang="ts">
import { useUiStore } from '../stores/useUiStore';

defineEmits<{ menu: [] }>();
const ui = useUiStore();

const modelos = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-3.5', value: 'gpt-3.5' },
  { label: 'GeoAI', value: 'geoai' },
];
</script>

<template>
  <header
    class="relative h-14 flex items-center border-b border-slate-700 bg-slate-950 px-4"
  >
    <button
      class="text-xl text-cyan-400 md:hidden"
      aria-label="Abrir menu"
      @click="$emit('menu')"
    >
      ☰
    </button>

    <div class="absolute left-1/2 -translate-x-1/2">
      <select
        v-model="ui.selectedModel"
        class="bg-slate-800 border border-slate-700 text-cyan-400
               rounded px-3 py-1 text-sm focus:outline-none"
      >
        <option
          v-for="m in modelos"
          :key="m.value"
          :value="m.value"
          class="bg-slate-900"
        >{{ m.label }}</option>
      </select>
    </div>

    <button
      class="ml-auto text-cyan-400 text-lg hidden sm:block"
      aria-label="Configurações (em breve)"
    >
      ✎
    </button>
  </header>
</template>
