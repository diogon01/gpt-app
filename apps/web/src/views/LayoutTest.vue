<script setup lang="ts">
// apenas visual
</script>

<template>
  <section class="min-h-screen flex flex-col items-center gap-8 py-10 bg-slate-950 text-slate-100">
    <!-- Título ------------------------------------------------------>
    <h1 class="text-4xl font-extrabold text-cyan-400">Teste de Paleta (Tailwind)</h1>

    <!-- Cartões ----------------------------------------------------->
    <div class="grid w-full max-w-6xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-lg bg-slate-800 p-6 border border-slate-700 shadow-md">
        <h2 class="mb-2 font-semibold text-cyan-400">Card 1</h2>
        <p class="opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 border border-slate-700 shadow-md">
        <h2 class="mb-2 font-semibold text-cyan-400">Card 2</h2>
        <p class="opacity-80">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      <div class="rounded-lg bg-slate-800 p-6 border border-slate-700 shadow-md">
        <h2 class="mb-2 font-semibold text-cyan-400">Card 3</h2>
        <p class="opacity-80">Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>

    <!-- Botões ------------------------------------------------------>
    <div class="flex gap-4">
      <button class="rounded bg-cyan-400 px-6 py-2 font-semibold text-slate-950 hover:brightness-110">
        Primário
      </button>
      <button class="rounded bg-slate-800 px-6 py-2 border border-slate-700 hover:bg-slate-700">
        Secundário
      </button>
    </div>

    <!-- Alertas ----------------------------------------------------->
    <div class="flex w-full max-w-xl flex-col gap-3">
      <div class="rounded border border-emerald-400/40 bg-emerald-500/20 p-3 text-emerald-400">
        Sucesso: operação concluída
      </div>
      <div class="rounded border border-amber-300/40 bg-amber-400/20 p-3 text-amber-300">
        Aviso: atenção aos detalhes
      </div>
      <div class="rounded border border-red-400/40 bg-red-500/20 p-3 text-red-400">
        Erro: algo deu errado
      </div>
    </div>
  </section>
</template>
