<!-- apps/web/src/components/chat/MessageBubble.vue -->
<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';

/**
 * Props representing the content of a single user-assistant exchange.
 */
const props = defineProps<{
  prompt: string;
  response: { text?: string; imgUrl?: string };
  loading?: boolean;
}>();

/** True when assistant content exists or is being generated */
const hasAssistant = computed(
  () => props.loading || !!props.response.text || !!props.response.imgUrl,
);

const md = new MarkdownIt().set({
  highlight(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${
        hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
      }</code></pre>`;
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
});

/** Renders assistant text with markdown and syntax highlighting */
const rendered = computed(() =>
  props.response.text ? md.render(props.response.text) : '',
);
</script>

<template>
  <!-- USER MESSAGE -->
  <div
    v-if="props.prompt"
    class="mx-auto w-full max-w-6xl rounded-lg border border-slate-700 bg-slate-800 p-4"
  >
    <p class="mb-1 font-semibold text-cyan-400">You</p>
    <p class="whitespace-pre-wrap break-words">{{ props.prompt }}</p>
  </div>

  <!-- ASSISTANT RESPONSE -->
  <div
    v-if="hasAssistant"
    class="mx-auto mt-2 w-full max-w-6xl rounded-lg border border-slate-600 bg-slate-700 p-4"
  >
    <p class="mb-2 font-semibold text-pink-300">Assistant</p>

    <!-- Loader -->
    <div v-if="props.loading" class="flex justify-center">
      <svg class="h-6 w-6 animate-spin text-pink-300" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>

    <!-- Image -->
    <img v-if="props.response.imgUrl" :src="props.response.imgUrl" class="mb-3 w-full rounded" />

    <!-- Markdown Text -->
    <div
      v-if="props.response.text && !props.loading"
      v-html="rendered"
      class="prose dark:prose-invert prose-pre:bg-slate-900 prose-pre:rounded-md prose-pre:p-4 prose-pre:overflow-x-auto break-words whitespace-pre-wrap"
    />
  </div>
</template>
