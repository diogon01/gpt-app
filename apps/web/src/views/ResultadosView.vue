<script setup lang="ts">
import { useHistoryStore } from '../stores/useHistoryStore';


const hist = useHistoryStore();
if (!hist.itens.length) hist.fetch();
</script>

<template>
  <section class="max-w-5xl mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <article v-for="r in hist.itens" :key="r._id" class="border rounded-lg overflow-hidden">
      <img v-if="r.imgUrl" :src="r.imgUrl" alt="" class="w-full h-48 object-cover">
      <div class="p-4">
        <p class="text-sm text-slate-500 mb-2">{{ r.prompt }}</p>
        <p class="text-xs text-slate-400">{{ new Date(r.createdAt).toLocaleString() }}</p>
      </div>
    </article>
  </section>
</template>
