<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../stores/useAuthStore';
import { useHistoryStore } from '../../stores/useHistoryStore';

/**
 * Props received by SearchModal
 * @property {boolean} open - Controls modal visibility
 */
const props = defineProps<{ open: boolean }>();

/**
 * Emits events to parent
 * @event close - Fired when backdrop, X button, or a result is clicked
 */
const emit = defineEmits<{ close: [] }>();

/* -------------------------------------------------------------------------- */
/* State                                                                      */
/* -------------------------------------------------------------------------- */
const query = ref(''); // User-typed search term
const results = ref<typeof store.history>([]);
const loading = ref(false);

const store = useHistoryStore();
const router = useRouter();

/* -------------------------------------------------------------------------- */
/* Debounced watcher that hits /api/history/search                            */
/* -------------------------------------------------------------------------- */
let timeout: ReturnType<typeof setTimeout>;

watch(query, async (newQuery) => {
  clearTimeout(timeout);

  if (newQuery.trim().length < 2) {
    results.value = [];
    return;
  }

  loading.value = true;

  timeout = setTimeout(async () => {
    try {
      const auth = useAuth();
      const token = await auth.firebaseUser?.getIdToken();

      const res = await fetch(
        `/api/history/search?q=${encodeURIComponent(newQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error('Failed to fetch search results');

      const data = await res.json();
      results.value = data.matches.map((s: any) => ({
        _id: s._id,
        timestamp: new Date(s.timestamp),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    } catch (err) {
      console.error('Search error:', err);
      results.value = [];
    } finally {
      loading.value = false;
    }
  }, 300);
});

/**
 * Handles click on a search result, sets active session and redirects to history route
 * @param {_id: string} sessionId - The session _id to load and navigate to
 */
function handleSelectSession(session: any) {
  store.activeSession = session;
  emit('close');
  router.push({ name: 'HistorySession', params: { _id: session._id } });
}
</script>


<template>
  <Teleport to="body">
    <div
      v-if="props.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded shadow-lg p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Search Chats</h2>
          <button @click="emit('close')" class="text-slate-400 hover:text-white transition">✖</button>
        </div>

        <!-- Search field -->
        <input
          v-model="query"
          type="text"
          placeholder="Search messages..."
          class="w-full p-2 mb-4 text-white bg-slate-800 border border-slate-600 rounded"
        />

        <!-- Feedback / results -->
        <div v-if="loading" class="text-slate-400">Searching...</div>
        <div v-else-if="results.length === 0 && query.length >= 2" class="text-slate-400">
          No results found.
        </div>

        <ul v-else class="max-h-96 overflow-y-auto space-y-1">
          <li
            v-for="session in results"
            :key="session._id"
            class="p-2 hover:bg-slate-700 rounded cursor-pointer"
            @click="handleSelectSession(session)"
          >
            <div class="text-slate-200 font-medium truncate">
              {{ session.messages.find(m => m.role === 'user')?.content ?? 'Untitled session' }}
            </div>
            <div class="text-xs text-slate-500">{{ session.timestamp.toLocaleString() }}</div>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

