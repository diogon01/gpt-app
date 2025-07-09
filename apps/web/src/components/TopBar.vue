<script setup lang="ts">
defineEmits<{ menu: [] }>();
</script>

<template>
  <header
    class="h-14 flex items-center justify-between border-b border-slate-700 bg-slate-950 px-4"
  >
    <button class="md:hidden text-cyan-400 text-xl" @click="$emit('menu')">☰</button>
    <h1 class="mx-auto text-2xl md:text-3xl font-extrabold text-cyan-400">
      InsightCanvas
    </h1>
  </header>
</template>
