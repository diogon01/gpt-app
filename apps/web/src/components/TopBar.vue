<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuth } from '../stores/useAuthStore';
import { useUiStore } from '../stores/useUiStore';
import LoginModal from './LoginModal.vue';

defineEmits<{ menu: [] }>();

const ui = useUiStore();
const auth = useAuth();

const showDropdown = ref(false);
const showLogin = ref(false);

const isLoggedIn = computed(() => auth.isLoggedIn);
const userStatus = computed(() =>
  auth.user?.isPlus ? 'plus' : 'free'
);
const userName = computed(() => auth.user?.displayName ?? 'Anonymous');
const userAvatar = computed(() =>
  auth.user?.photoURL || `https://ui-avatars.com/api/?name=${userName.value}&background=random`
);

const models = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-3.5', value: 'gpt-3.5' },
  { label: 'GeoAI', value: 'geoai' },
];

// Fecha dropdown ao clicar fora
function handleClickOutside(e: MouseEvent) {
  const dropdown = document.getElementById('user-dropdown');
  if (dropdown && !dropdown.contains(e.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <header class="relative h-14 flex items-center border-b border-slate-700 bg-slate-950 px-4">
    <!-- Botão menu mobile -->
    <button class="text-xl text-cyan-400 md:hidden" aria-label="Open menu" @click="$emit('menu')">
      ☰
    </button>

    <!-- Seletor de modelo centralizado -->
    <div class="absolute left-1/2 -translate-x-1/2">
      <select
        v-model="ui.model"
        class="bg-slate-800 border border-slate-700 text-cyan-400 rounded px-3 py-1 text-sm focus:outline-none"
      >
        <option
          v-for="m in models"
          :key="m.value"
          :value="m.value"
          class="bg-slate-900"
        >
          {{ m.label }}
        </option>
      </select>
    </div>

    <!-- Área do usuário -->
    <div class="ml-auto flex items-center gap-3">
      <!-- Não logado -->
      <template v-if="!isLoggedIn">
        <button
          @click="showLogin = true"
          class="text-sm text-cyan-400 border border-cyan-400 rounded px-3 py-1 hover:bg-cyan-400 hover:text-black transition"
        >
          Sign in
        </button>
        <LoginModal :open="showLogin" @close="showLogin = false" />
      </template>

      <!-- Logado -->
      <template v-else>
        <div class="relative" id="user-dropdown">
          <img
            :src="userAvatar"
            class="h-8 w-8 rounded-full border-2 border-cyan-400 cursor-pointer"
            alt="avatar"
            @click.stop="showDropdown = !showDropdown"
          />

          <div
            v-if="showDropdown"
            class="absolute right-0 mt-2 w-48 rounded bg-slate-800 text-sm shadow-lg border border-slate-700 z-50"
          >
            <div class="p-3 border-b border-slate-700">
              <p class="font-semibold text-cyan-300">{{ userName }}</p>
              <span v-if="userStatus === 'plus'" class="text-xs text-yellow-400 font-bold">PLUS</span>
              <span v-else class="text-xs text-slate-400">Free Plan</span>
            </div>
            <ul class="divide-y divide-slate-700">
              <li class="p-2 hover:bg-slate-700 cursor-pointer">My Projects</li>
              <li class="p-2 hover:bg-slate-700 cursor-pointer">Settings</li>
              <li class="p-2 hover:bg-slate-700 cursor-pointer text-red-400" @click="auth.logout()">Logout</li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </header>
</template>
