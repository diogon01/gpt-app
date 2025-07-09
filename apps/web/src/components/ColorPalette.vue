<script setup lang="ts">
const brand = [
  { name: 'brand-primary',  class: 'bg-brand-primary text-brand-text' },
  { name: 'brand-surface',  class: 'bg-brand-surface text-brand-text' },
  { name: 'brand-line',     class: 'bg-brand-line text-brand-text' },
  { name: 'brand-accent',   class: 'bg-brand-accent text-brand-primary' },
  { name: 'brand-text',     class: 'bg-brand-text text-brand-primary' },
];

const defaults = [
  { name: 'slate-900', class: 'bg-slate-900 text-slate-100' },
  { name: 'slate-800', class: 'bg-slate-800 text-slate-100' },
  { name: 'cyan-400',  class: 'bg-cyan-400 text-slate-900' },
];
</script>

<template>
  <section class="flex flex-col gap-8">
    <!-- Brand -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div
        v-for="c in brand"
        :key="c.name"
        :class="['aspect-square rounded flex items-end p-2 text-[10px] font-mono', c.class]"
      >
        {{ c.name }}
      </div>
    </div>

    <!-- Defaults -->
    <div class="flex gap-4">
      <div
        v-for="c in defaults"
        :key="c.name"
        :class="['h-16 w-16 rounded flex items-end p-1 text-[10px] font-mono', c.class]"
      >
        {{ c.name }}
      </div>
    </div>
  </section>
</template>
