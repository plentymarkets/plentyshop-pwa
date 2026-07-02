<template>
  <div
    class="absolute -bottom-3 left-1/2 z-overlap inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg animate-ai-floaty"
    data-testid="ai-review-actions"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer hover:bg-gray-100"
      data-testid="ai-review-regenerate"
      @mousedown.prevent
      @click="$emit('regenerate')"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />
      </svg>
      {{ regenerateLabel }}
    </button>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-3 py-2 text-xs font-bold text-gray-400 cursor-pointer hover:bg-red-50 hover:text-red-700"
      data-testid="ai-review-discard"
      @mousedown.prevent
      @click="$emit('discard')"
    >
      {{ discardLabel }}
    </button>
    <span class="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-extrabold text-white shadow-md cursor-pointer hover:bg-slate-800"
      data-testid="ai-review-keep"
      @mousedown.prevent
      @click="$emit('keep')"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12l5 5 9-11" />
      </svg>
      {{ keepLabel }}
    </button>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'regenerate' | 'discard' | 'keep'): void;
}>();

const regenerateLabel = getEditorTranslation('ai-regenerate-label');
const discardLabel = getEditorTranslation('ai-discard-label');
const keepLabel = getEditorTranslation('ai-keep-label');
</script>

<style>
@keyframes ai-floaty {
  0%,
  100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -3px);
  }
}
.animate-ai-floaty {
  animation: ai-floaty 3.5s ease-in-out infinite;
}
</style>

<i18n lang="json">
{
  "en": {
    "ai-regenerate-label": "Modify",
    "ai-discard-label": "Discard",
    "ai-keep-label": "Keep"
  }
}
</i18n>
