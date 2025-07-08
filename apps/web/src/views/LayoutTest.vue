<script setup lang="ts">
// view só de UI – sem lógica
</script>

<template>
  <!-- Fundo escuro padrão + texto claro -->
  <section class="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 gap-8">
    <h1 class="text-4xl font-extrabold text-lime-400">Teste de Paleta (Tailwind default)</h1>

    <!-- Cartões ---------------------------------------------------------------->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4">
      <div class="rounded-lg bg-slate-800 p-6 border border-slate-600 shadow-md">
        <h2 class="mb-2 text-lime-400 font-semibold">Card 1</h2>
        <p class="opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 border border-slate-600 shadow-md">
        <h2 class="mb-2 text-lime-400 font-semibold">Card 2</h2>
        <p class="opacity-80">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 border border-slate-600 shadow-md">
        <h2 class="mb-2 text-lime-400 font-semibold">Card 3</h2>
        <p class="opacity-80">Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>

    <!-- Botões ----------------------------------------------------------------->
    <div class="flex gap-4">
      <button class="px-6 py-2 rounded bg-lime-400 text-slate-900 font-semibold hover:brightness-110">
        Primário
      </button>
      <button class="px-6 py-2 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700">
        Secundário
      </button>
    </div>

    <!-- Alertas ---------------------------------------------------------------->
    <div class="flex flex-col gap-3 w-full max-w-xl">
      <div class="rounded p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
        Sucesso: operação concluída
      </div>
      <div class="rounded p-3 bg-amber-400/20 text-amber-300 border border-amber-300/40">
        Aviso: atenção aos detalhes
      </div>
      <div class="rounded p-3 bg-red-500/20 text-red-400 border border-red-400/40">
        Erro: algo deu errado
      </div>
    </div>
  </section>
</template>
