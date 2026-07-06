<template>
  <div v-if="aiEnabled" class="relative" data-testid="ai-prompt-bar">
    <div class="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2.5">
      <button
        ref="aiButtonRef"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-extrabold cursor-pointer transition-shadow"
        :class="
          aiActive
            ? 'border-slate-900 bg-slate-900 text-white shadow-md hover:bg-slate-800'
            : 'border-gray-300 bg-white text-slate-900 shadow-sm hover:bg-gray-100'
        "
        :aria-expanded="aiActive"
        :disabled="isGenerating"
        data-testid="ai-toggle"
        @mousedown.prevent
        @click="toggle"
      >
        <SfIconStarFilled size="xs" />
        {{ aiLabel }}
      </button>

      <span
        v-if="isReviewing"
        class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-900"
        data-testid="ai-generated-badge"
      >
        <SfIconStarFilled size="xs" />
        {{ generatedBadgeLabel }}
      </span>
    </div>

    <Teleport to="body">
      <EditorAiPromptBarPromptPopover
        v-if="isPromptOpen && anchorRect"
        :anchor-rect="anchorRect"
        :prompt="state.prompt"
        :tone="state.tone"
        :length="state.length"
        :refine-open="state.refineOpen"
        :can-generate="canGenerate"
        :chips="chips"
        :tones="tones"
        :lengths="lengths"
        @update:prompt="promptModel = $event"
        @use-chip="useChip"
        @toggle-refine="toggleRefine"
        @set-tone="setTone"
        @set-length="setLength"
        @generate="generate"
        @close="close"
      />

      <EditorAiPromptBarGeneratingPopover
        v-if="isGenerating && anchorRect"
        :anchor-rect="anchorRect"
        :sub-label="generatingSubLabel"
        @stop="stop"
      />
    </Teleport>

    <Teleport v-if="reviewTarget" :to="reviewTarget" :disabled="!reviewTarget">
      <EditorAiPromptBarReviewActions v-if="isReviewing" @modify="modify" @discard="discard" @keep="keep" />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { SfIconStarFilled } from '@storefront-ui/vue';
import type { AiCoreFunctionality } from '~/composables/useAiTextGeneration/types';

const props = defineProps<{
  storageKey?: string;
  coreFunctionality?: AiCoreFunctionality;
  reviewTarget?: HTMLElement | null;
  getCurrentContent?: () => string;
}>();

const emit = defineEmits<{
  (e: 'apply', content: string): void;
}>();

const aiEnabled = useRuntimeConfig().public.enableAiTextGeneration as boolean;

const {
  state,
  promptModel,
  isPromptOpen,
  isGenerating,
  isReviewing,
  aiActive,
  canGenerate,
  chips,
  tones,
  lengths,
  toggle,
  close,
  useChip,
  setTone,
  setLength,
  toggleRefine,
  generate,
  modify,
  stop,
  discard,
  keep,
} = useAiDraftFlow({
  storageKey: props.storageKey,
  coreFunctionality: props.coreFunctionality,
  getCurrentContent: () => props.getCurrentContent?.() ?? '',
  onApply: (content) => emit('apply', content),
});

const generatingSubLabel = computed(() => `${state.value.tone} tone · ${state.value.length.toLowerCase()} length`);

const aiButtonRef = ref<HTMLButtonElement | null>(null);
const anchorRect = ref<DOMRect | null>(null);

const updateAnchor = () => {
  if (aiButtonRef.value) {
    anchorRect.value = aiButtonRef.value.getBoundingClientRect();
  }
};

watch([isPromptOpen, isGenerating], async ([promptOpen, generating]) => {
  if (promptOpen || generating) {
    await nextTick();
    updateAnchor();
  }
});

const onPointerDownOutside = (event: PointerEvent) => {
  if (!isPromptOpen.value) {
    return;
  }
  const target = event.target as HTMLElement | null;
  if (!target) {
    return;
  }
  if (aiButtonRef.value?.contains(target)) {
    return;
  }
  if (target.closest('[data-testid="ai-prompt-popover"]')) {
    return;
  }
  close();
};

onMounted(() => {
  window.addEventListener('scroll', updateAnchor, true);
  window.addEventListener('resize', updateAnchor);
  document.addEventListener('pointerdown', onPointerDownOutside, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateAnchor, true);
  window.removeEventListener('resize', updateAnchor);
  document.removeEventListener('pointerdown', onPointerDownOutside, true);
});

const aiLabel = getEditorTranslation('ai-label');
const generatedBadgeLabel = getEditorTranslation('ai-generated-badge');
</script>

<i18n lang="json">
{
  "en": {
    "ai-label": "AI",
    "ai-generated-badge": "AI generated"
  },
  "de": {
    "ai-label": "AI",
    "ai-generated-badge": "AI generated"
  }
}
</i18n>
