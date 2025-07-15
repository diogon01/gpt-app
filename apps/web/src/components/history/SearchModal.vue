<script setup lang="ts">
/* ===========================================================================
 * SearchModal – Full-screen overlay used to search through chat history
 * ---------------------------------------------------------------------------
 * Props
 *  - open (boolean): controls modal visibility (rendered only when true)
 *
 * Emits
 *  - close (): emitted when user clicks backdrop, close (X) button or selects
 *              a session – parent component deve zerar `open`.
 * ---------------------------------------------------------------------------
 * Author: 42 Robotics – Front-end team
 * ==========================================================================*/


import { computed, ref, watch } from 'vue';
import { useHistoryStore } from '../../stores/useHistoryStore';

/** Controls modal visibility (passed by parent) */
const props = defineProps<{ open: boolean }>();

/** Emits close event to parent */
const emit = defineEmits<{ close: [] }>();

/* -------------------------------------------------------------------------- */
/* State & Store                                                              */
/* -------------------------------------------------------------------------- */

const query = ref('');                      // User search query
const store = useHistoryStore();            // Pinia history store reference

/* -------------------------------------------------------------------------- */
/* Computed                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Filter sessions that contain the search term at least in one message.
 * Case-insensitive matching on `content`.
 */
const filteredSessions = computed(() =>
  query.value.trim()
    ? store.history.filter(session =>
        session.messages.some(msg =>
          msg.content.toLowerCase().includes(query.value.toLowerCase())
        )
      )
    : []
);

/* -------------------------------------------------------------------------- */
/* Watchers                                                                   */
/* -------------------------------------------------------------------------- */

// Example placeholder: add debounce / analytics hooks here if needed
watch(() => query.value, () => {
  /* Optional side-effects while typing */
});
</script>

<template>
  <!-- Teleport guarantees the modal is appended to <body>, not inside Sidebar -->
  <Teleport to="body">
    <!-- Render only when `open === true` -->
    <div
      v-if="props.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click.self="emit('close')"
    >
      <!-- Modal card -->
      <div
        class="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded shadow-lg p-6"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">
            Search Chats
          </h2>
          <button
            @click="emit('close')"
            class="text-slate-400 hover:text-white transition"
          >
            ✖
          </button>
        </div>

        <!-- Search input -->
        <input
          v-model="query"
          type="text"
          placeholder="Search messages..."
          class="w-full p-2 mb-4 text-white bg-slate-800 border border-slate-600 rounded"
        />

        <!-- Results -->
        <div
          v-if="filteredSessions.length === 0"
          class="text-slate-400"
        >
          No results found.
        </div>

        <ul
          v-else
          class="max-h-96 overflow-y-auto space-y-1"
        >
          <li
            v-for="session in filteredSessions"
            :key="session._id"
            class="p-2 hover:bg-slate-700 rounded cursor-pointer"
            @click="() => { store.activeSession = session; emit('close'); }"
          >
            <!-- First user message or fallback -->
            <div class="text-slate-200 font-medium truncate">
              {{ session.messages.find(m => m.role === 'user')?.content ?? 'Untitled session' }}
            </div>
            <div class="text-xs text-slate-500">
              {{ session.timestamp.toLocaleString() }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
