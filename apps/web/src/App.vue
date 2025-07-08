<script setup lang="ts">
import Loader from '@/components/Loader.vue';
import { useUiStore } from './stores/useUiStore';

const ui = useUiStore();
</script>

<template>
  <router-view />
  <Loader v-if="ui.isLoading" />
  <div
    v-if="ui.toast"
    class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded"
  >
    {{ ui.toast }}
  </div>
</template>
