<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // choose any hljs theme

const props = defineProps<{
  prompt: string;
  response: { text?: string; imgUrl?: string };
  loading?: boolean;
}>();

/* ─── MarkdownIt instance ─────────────────────────────────────────────── */
const md = new MarkdownIt();

/**
 * Custom syntax highlighter for code blocks inside markdown
 * Uses highlight.js if language is recognized
 */
md.set({
  highlight(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${
        hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
      }</code></pre>`;
    }
    // fallback: plain escaped HTML
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  }
});

/* ─── Render markdown when response text exists ───────────────────────── */
const rendered = computed(() =>
  props.response.text ? md.render(props.response.text) : ''
);
</script>

<template>
  <!-- USER MESSAGE -->
  <div class="mx-auto w-full max-w-xl rounded-lg border border-slate-700 bg-slate-800 p-3">
    <p class="font-semibold text-cyan-400 mb-1">You</p>
    <p class="whitespace-pre-wrap">{{ prompt }}</p>
  </div>

  <!-- ASSISTANT RESPONSE -->
  <div
    class="mx-auto mt-2 w-full max-w-xl rounded-lg border border-slate-600 bg-slate-700 p-4"
  >
    <p class="font-semibold text-pink-300 mb-2">Assistant</p>

    <!-- Show loading spinner if awaiting response -->
    <div v-if="loading" class="flex justify-center">
      <svg class="animate-spin h-6 w-6 text-pink-300" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </div>

    <!-- Display generated image -->
    <img v-if="response.imgUrl" :src="response.imgUrl" class="mb-3 w-full rounded" />

    <!-- Render markdown response (with highlight.js) -->
    <div
      v-if="response.text && !loading"
      v-html="rendered"
      class="prose dark:prose-invert"
    />
  </div>
</template>