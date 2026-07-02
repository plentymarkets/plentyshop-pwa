<template>
  <div
    class="absolute left-4 top-16 z-popover w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl animate-ai-popin"
    data-testid="ai-prompt-popover"
  >
    <div
      class="absolute -top-2 left-10 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white"
      aria-hidden="true"
    />

    <div class="mb-3 flex items-center gap-2.5">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
        <EditorAiPromptBarAiSparkIcon :size="17" />
      </div>
      <div>
        <div class="text-sm font-bold text-slate-900">{{ titleLabel }}</div>
        <div class="text-xs font-medium text-gray-500">{{ subtitleLabel }}</div>
      </div>
    </div>

    <textarea
      ref="textareaRef"
      v-model="promptModel"
      :placeholder="placeholderLabel"
      rows="2"
      class="w-full resize-none rounded-xl border-2 border-gray-300 px-3 py-2.5 text-sm font-medium leading-snug text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      data-testid="ai-prompt-textarea"
      @keydown.enter.exact.meta.prevent="$emit('generate')"
      @keydown.enter.exact.ctrl.prevent="$emit('generate')"
      @keydown.escape="$emit('close')"
    />

    <div class="mt-3 mb-2 flex items-center gap-1.5">
      <span class="text-xs font-bold tracking-wider text-gray-400">{{ tryLabel }}</span>
      <span class="h-px flex-1 bg-gray-100" aria-hidden="true" />
    </div>

    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="chip in chips"
        :key="chip.label"
        type="button"
        class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer hover:border-slate-900 hover:text-slate-900"
        :data-testid="`ai-chip-${chip.label}`"
        @mousedown.prevent
        @click="$emit('use-chip', chip)"
      >
        <EditorAiPromptBarAiSparkIcon :size="11" class="text-gray-300" />
        {{ chip.label }}
      </button>
    </div>

    <button
      type="button"
      class="mt-3.5 flex w-full items-center gap-2 border-t border-gray-100 py-2.5 text-left cursor-pointer"
      :aria-expanded="refineOpen"
      data-testid="ai-refine-toggle"
      @mousedown.prevent
      @click="$emit('toggle-refine')"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
        <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5" />
        <circle cx="15" cy="6" r="2" />
        <circle cx="7" cy="12" r="2" />
        <circle cx="12" cy="18" r="2" />
      </svg>
      <span class="flex-1 text-sm font-bold text-slate-700">{{ refineLabel }}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': refineOpen }"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <div v-if="refineOpen" class="pb-1" data-testid="ai-refine-panel">
      <div class="mb-2 flex items-center gap-2.5">
        <span class="w-14 text-xs font-bold text-gray-400">{{ toneLabel }}</span>
        <div class="flex flex-1 gap-1.5">
          <button
            v-for="t in tones"
            :key="t"
            type="button"
            :class="pillClasses(t === tone)"
            :data-testid="`ai-tone-${t}`"
            @mousedown.prevent
            @click="$emit('set-tone', t)"
          >
            {{ t }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="w-14 text-xs font-bold text-gray-400">{{ lengthLabel }}</span>
        <div class="flex flex-1 gap-1.5">
          <button
            v-for="l in lengths"
            :key="l"
            type="button"
            :class="pillClasses(l === length)"
            :data-testid="`ai-length-${l}`"
            @mousedown.prevent
            @click="$emit('set-length', l)"
          >
            {{ l }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-3.5 flex items-center justify-between">
      <span class="text-xs font-semibold text-gray-400">{{ shortcutLabel }}</span>
      <button
        type="button"
        :disabled="!canGenerate"
        class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-md cursor-pointer hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        data-testid="ai-generate"
        @mousedown.prevent
        @click="$emit('generate')"
      >
        <EditorAiPromptBarAiSparkIcon :size="14" />
        {{ generateLabel }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { AiChipSuggestion, AiLength, AiTone } from '~/composables/useAiDraftFlow/types';

const props = defineProps<{
  prompt: string;
  tone: AiTone;
  length: AiLength;
  refineOpen: boolean;
  canGenerate: boolean;
  chips: readonly AiChipSuggestion[];
  tones: readonly AiTone[];
  lengths: readonly AiLength[];
}>();

const emit = defineEmits<{
  (e: 'update:prompt', value: string): void;
  (e: 'use-chip', chip: AiChipSuggestion): void;
  (e: 'set-tone', value: AiTone): void;
  (e: 'set-length', value: AiLength): void;
  (e: 'toggle-refine' | 'generate' | 'close'): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const promptModel = computed({
  get: () => props.prompt,
  set: (value: string) => emit('update:prompt', value),
});

onMounted(async () => {
  await nextTick();
  textareaRef.value?.focus();
});

const pillClasses = (selected: boolean) =>
  [
    'flex-1 rounded-lg border px-0 py-1.5 text-center text-xs cursor-pointer',
    selected
      ? 'border-slate-900 bg-slate-900 font-bold text-white'
      : 'border-gray-200 bg-white font-semibold text-slate-700 hover:border-slate-400',
  ].join(' ');

const titleLabel = getEditorTranslation('ai-popover-title');
const subtitleLabel = getEditorTranslation('ai-popover-subtitle');
const placeholderLabel = getEditorTranslation('ai-prompt-placeholder');
const tryLabel = getEditorTranslation('ai-try-label');
const refineLabel = getEditorTranslation('ai-refine-label');
const toneLabel = getEditorTranslation('ai-tone-label');
const lengthLabel = getEditorTranslation('ai-length-label');
const shortcutLabel = getEditorTranslation('ai-shortcut-hint');
const generateLabel = getEditorTranslation('ai-generate-label');
</script>

<style>
@keyframes ai-popin {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-ai-popin {
  animation: ai-popin 0.16s ease-out;
}
</style>

<i18n lang="json">
{
  "en": {
    "ai-popover-title": "Write with AI",
    "ai-popover-subtitle": "Describe what you want to create",
    "ai-prompt-placeholder": "e.g. A warm welcome message for new subscribers",
    "ai-try-label": "TRY",
    "ai-refine-label": "Refine tone & length",
    "ai-tone-label": "Tone",
    "ai-length-label": "Length",
    "ai-shortcut-hint": "⌘ ↵ to generate",
    "ai-generate-label": "Generate"
  }
}
</i18n>
