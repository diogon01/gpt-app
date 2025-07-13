<script setup lang="ts">
import { useAuth } from '../stores/useAuthStore';

const auth  = useAuth();
const emit  = defineEmits<{ close: [] }>();
defineProps<{ open: boolean }>();

/**
 * Sends the Firebase ID token to the API so it can create / refresh the user
 */
async function syncUserWithBackend() {
  const fbUser = auth.firebaseUser;
  if (!fbUser) return;

  const idToken = await fbUser.getIdToken();

  await fetch('/api/auth/sync', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({ service: 'ia' }),
  });
}

/* ------------------ Google ------------------ */
async function loginGoogle() {
  try {
    await auth.loginGoogle();
    await syncUserWithBackend();
    emit('close');
  } catch (err) {
    console.error(err);
    alert('Login with Google failed');
  }
}

/* ------------------ Microsoft ------------------ */
async function loginMicrosoft() {
  try {
    await auth.loginMicrosoft();
    await syncUserWithBackend();
    emit('close');
  } catch (err) {
    console.error(err);
    alert('Login with Microsoft failed');
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
      <h2 class="mb-4 text-center text-lg font-bold">
        Login to 42 Robotics
      </h2>

      <!-- Google -->
      <button
        class="mb-3 flex w-full items-center justify-center gap-2 rounded bg-red-600 py-2 text-white hover:bg-red-700"
        @click="loginGoogle"
      >
        <span>Login with Google</span>
      </button>

      <!-- Microsoft -->
      <button
        class="flex w-full items-center justify-center gap-2 rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        @click="loginMicrosoft"
      >
        <span>Login with Microsoft</span>
      </button>

      <!-- Cancel -->
      <button
        class="mt-4 w-full text-sm text-gray-500 hover:underline"
        @click="emit('close')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
