<script setup lang="ts">
// Nenhuma lógica; é só visual
</script>

<template>
  <section class="min-h-screen bg-primary text-text flex flex-col items-center py-10 gap-8">
    <h1 class="text-4xl font-extrabold text-accent">Teste de Paleta</h1>

    <!-- Cartões -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl px-4">
      <div class="rounded-lg bg-surface p-6 border border-surface/50 shadow-md">
        <h2 class="mb-2 text-accent font-semibold">Card 1</h2>
        <p class="opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <div class="rounded-lg bg-surface p-6 border border-surface/50 shadow-md">
        <h2 class="mb-2 text-accent font-semibold">Card 2</h2>
        <p class="opacity-80">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      <div class="rounded-lg bg-surface p-6 border border-surface/50 shadow-md">
        <h2 class="mb-2 text-accent font-semibold">Card 3</h2>
        <p class="opacity-80">Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
      </div>
    </div>

    <!-- Botões -->
    <div class="flex gap-4">
      <button class="px-6 py-2 rounded bg-accent text-primary font-semibold hover:brightness-110">
        Primário
      </button>
      <button class="px-6 py-2 rounded bg-surface border border-surface/50 hover:bg-surface/80">
        Secundário
      </button>
    </div>

    <!-- Alertas -->
    <div class="flex flex-col gap-3 w-full max-w-xl">
      <div class="rounded p-3 bg-success/20 text-success border border-success/40">
        Sucesso: operação concluída
      </div>
      <div class="rounded p-3 bg-warning/20 text-warning border border-warning/40">
        Aviso: atenção aos detalhes
      </div>
      <div class="rounded p-3 bg-danger/20 text-danger border border-danger/40">
        Erro: algo deu errado
      </div>
    </div>
  </section>
</template>
