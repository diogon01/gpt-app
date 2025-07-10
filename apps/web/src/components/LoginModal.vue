<script setup lang="ts">
import { useAuth } from '../stores/auth';

const auth = useAuth();
const emit = defineEmits<{ close: [] }>(); // ✅ Required for emit to work
defineProps<{ open: boolean }>();

async function loginGoogle() {
  try {
    await auth.loginGoogle();
    emit('close');
  } catch (err) {
    alert('Login with Google failed');
  }
}

async function loginMicrosoft() {
  try {
    await auth.loginMicrosoft();
    emit('close');
  } catch (err) {
    alert('Login with Microsoft failed');
  }
}
</script>


<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
      <h2 class="text-lg font-bold mb-4 text-center">Login to 42 Robotics</h2>

      <button
        class="w-full mb-3 flex items-center justify-center gap-2 bg-red-600 text-white rounded py-2 hover:bg-red-700"
        @click="loginGoogle"
      >
        <span>Login with Google</span>
      </button>

      <button
        class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
        @click="loginMicrosoft"
      >
        <span>Login with Microsoft</span>
      </button>

      <button
        class="mt-4 w-full text-sm text-gray-500 hover:underline"
        @click="$emit('close')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
