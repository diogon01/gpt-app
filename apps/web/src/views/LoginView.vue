<script setup lang="ts">
import { useAuth } from '../stores/useAuthStore';
import { useHistoryStore } from '../stores/useHistoryStore';

const auth = useAuth();
const history = useHistoryStore();
const emit = defineEmits<{ close: [] }>();


/**
 * Handles login with Google provider and fetches chat history.
 */
async function loginGoogle() {
  try {
    await auth.loginGoogle();
    await history.fetch();
    emit('close');
  } catch (err) {
    console.error('Google login failed:', err);
    alert('Google login failed');
  }
}

/**
 * Handles login with Microsoft provider and fetches chat history.
 */
async function loginMicrosoft() {
  try {
    await auth.loginMicrosoft();
    await history.fetch();
    emit('close');
  } catch (err) {
    console.error('Microsoft login failed:', err);
    alert('Microsoft login failed');
  }
}
</script>


<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow">
      <h1 class="text-2xl font-semibold text-center mb-6">Login 42 Robotics</h1>

      <button
        class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mb-4 transition"
        @click="loginGoogle"
      >
        <svg class="w-5 h-5" viewBox="0 0 533.5 544.3"><path fill="#fff" d="M533.5 278.4c0-17-1.5-34-4.8-50.4H272.1v95.3h147.2c-6.4 34.7-25.5 63.6-54 83.1v68.5h87.3c51.1-47.2 81-116.6 81-196.5z"/><path fill="#fff" d="M272.1 544.3c73.4 0 135.1-24.4 180.1-66.2l-87.3-68.5c-24.3 16.3-55.2 25.8-92.9 25.8-71.3 0-132-48.1-153.7-112.8H28v70.9c44.6 87.7 135.8 150.8 244.1 150.8z"/><path fill="#fff" d="M118.4 322.6c-10.2-30.9-10.2-64.5 0-95.4v-70.9H28c-40.8 79.6-40.8 171.1 0 250.7l90.4-84.4z"/><path fill="#fff" d="M272.1 107.3c39.8 0 75.5 13.7 103.6 40.5l77.6-77.6C403.6 23 341.9 0 272.1 0 163.8 0 72.6 63.1 28 150.8l90.4 70.9c21.7-64.7 82.4-114.4 153.7-114.4z"/></svg>
        Login com Google
      </button>

      <button
        class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        @click="loginMicrosoft"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#fff" d="M1 1h10v10H1V1zm12 0h10v10H13V1zM1 13h10v10H1V13zm12 0h10v10H13V13z"/></svg>
        Login com Microsoft
      </button>
    </div>
  </div>
</template>
