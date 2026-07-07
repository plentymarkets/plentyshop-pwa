<template>
  <div
    class="absolute -bottom-3 left-1/2 z-overlap inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg animate-ai-floaty"
    data-testid="ai-review-actions"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg bg-transparent px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer hover:bg-gray-100"
      data-testid="ai-review-modify"
      @mousedown.prevent
      @click="$emit('modify')"
    >
      <SfIconTune size="xs" />
      {{ modifyLabel }}
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
      <SfIconCheck size="xs" />
      {{ keepLabel }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { SfIconTune, SfIconCheck } from '@storefront-ui/vue';

defineEmits<{
  (e: 'modify' | 'discard' | 'keep'): void;
}>();

const modifyLabel = getEditorTranslation('ai-modify-label');
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
    "ai-modify-label": "Modify",
    "ai-discard-label": "Discard",
    "ai-keep-label": "Keep"
  },
  "de": {
    "ai-modify-label": "Modify",
    "ai-discard-label": "Discard",
    "ai-keep-label": "Keep"
  }
}
</i18n>
