<template>
  <div
    class="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-b border-gray-200"
    data-testid="ai-prompt-bar"
  >
    <button
      type="button"
      class="inline-flex items-center gap-1.5 px-2.5 h-8 rounded text-sm font-semibold border cursor-pointer"
      :class="
        isOpen
          ? 'bg-slate-800 border-gray-300 text-white hover:bg-slate-700'
          : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'
      "
      data-testid="ai-prompt-bar-toggle"
      :aria-expanded="isOpen"
      @mousedown.prevent
      @click="toggle"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="18px" width="18px" viewBox="0 -960 960 960" fill="currentColor">
        <path
          d="m480-80-80-160-160-80 160-80 80-160 80 160 160 80-160 80-80 160ZM200-560l-40-80-80-40 80-40 40-80 40 80 80 40-80 40-40 80Zm600 80-40-80-80-40 80-40 40-80 40 80 80 40-80 40-40 80Z"
        />
      </svg>
      AI
    </button>

    <div v-if="isOpen" class="flex flex-1 min-w-0 items-center gap-2">
      <input
        ref="promptInputRef"
        v-model="prompt"
        type="text"
        class="flex-1 min-w-0 h-8 px-2 text-sm border border-gray-300 rounded outline-none focus:border-slate-800"
        :placeholder="placeholderLabel"
        :disabled="loading"
        data-testid="ai-prompt-bar-input"
        @keydown.enter.prevent="run"
        @keydown.escape="close"
      />
      <button
        type="button"
        class="inline-flex items-center justify-center h-8 px-3 rounded text-sm font-semibold bg-slate-800 text-white border border-gray-300 cursor-pointer hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!prompt.trim() || loading"
        data-testid="ai-prompt-bar-generate"
        @mousedown.prevent
        @click="run"
      >
        {{ loading ? loadingLabel : generateLabel }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CoreFunctionality } from '@plentymarkets/shop-api';

const props = defineProps<{
  storageKey?: string;
  coreFunctionality?: CoreFunctionality;
}>();

const emit = defineEmits<{
  (e: 'generated', content: string): void;
}>();

const { generate, loading } = useAiTextGeneration(props.storageKey);

const isOpen = ref(false);
const prompt = ref('');
const promptInputRef = ref<HTMLInputElement | null>(null);

const placeholderLabel = getEditorTranslation('ai-prompt-placeholder');
const generateLabel = getEditorTranslation('ai-generate-label');
const loadingLabel = getEditorTranslation('ai-generating-label');

const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    promptInputRef.value?.focus();
  }
};

const close = () => {
  isOpen.value = false;
};

const run = async () => {
  const trimmed = prompt.value.trim();
  if (!trimmed || loading.value) {
    return;
  }
  const result = await generate({ prompt: trimmed, coreFunctionality: props.coreFunctionality });
  if (result.status === 'error') {
    return;
  }
  if (result.content) {
    emit('generated', result.content);
    prompt.value = '';
    close();
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "ai-prompt-placeholder": "Describe what you want to write…",
    "ai-generate-label": "Generate",
    "ai-generating-label": "Generating…"
  }
}
</i18n>
