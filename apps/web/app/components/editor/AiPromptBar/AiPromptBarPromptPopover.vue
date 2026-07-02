<template>
  <div
    class="fixed z-max w-80 -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl animate-ai-popin"
    :style="anchorStyle"
    data-testid="ai-prompt-popover"
  >
    <div
      class="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white"
      aria-hidden="true"
    />

    <div class="mb-3 flex items-center gap-2.5">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
        <SfIconStarFilled size="sm" />
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
      rows="3"
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
        <SfIconStarFilled size="xs" class="text-gray-300" />
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
      <SfIconTune size="sm" class="text-gray-500" />
      <span class="flex-1 text-sm font-bold text-slate-700">{{ refineLabel }}</span>
      <SfIconExpandMore
        size="sm"
        class="text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': refineOpen }"
      />
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
      <button
        type="button"
        :disabled="!canGenerate"
        class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-extrabold text-white shadow-md cursor-pointer hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        data-testid="ai-generate"
        @mousedown.prevent
        @click="$emit('generate')"
      >
        <SfIconStarFilled size="xs" />
        {{ generateLabel }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfIconStarFilled, SfIconTune, SfIconExpandMore } from '@storefront-ui/vue';
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
  anchorRect: DOMRect;
}>();

const anchorStyle = computed(() => ({
  top: `${props.anchorRect.bottom + 12}px`,
  left: `${props.anchorRect.left + props.anchorRect.width / 2}px`,
}));

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
const generateLabel = getEditorTranslation('ai-generate-label');
</script>

<style>
@keyframes ai-popin {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
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
    "ai-prompt-placeholder": "e.g. A warm welcome message for new customers",
    "ai-try-label": "TRY",
    "ai-refine-label": "Refine tone & length",
    "ai-tone-label": "Tone",
    "ai-length-label": "Length",
    "ai-generate-label": "Generate"
  },
  "de": {
    "ai-popover-title": "Write with AI",
    "ai-popover-subtitle": "Describe what you want to create",
    "ai-prompt-placeholder": "e.g. A warm welcome message for new customers",
    "ai-try-label": "TRY",
    "ai-refine-label": "Refine tone & length",
    "ai-tone-label": "Tone",
    "ai-length-label": "Length",
    "ai-generate-label": "Generate"
  }
}
</i18n>
