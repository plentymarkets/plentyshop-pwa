<template>
  <div
    class="fixed z-max w-80 -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl animate-ai-popin"
    :style="anchorStyle"
    data-testid="ai-generating-popover"
  >
    <div
      class="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white"
      aria-hidden="true"
    />

    <div class="mb-3 flex items-center gap-2.5">
      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
        <span class="inline-flex animate-ai-pulse">
          <SfIconStarFilled size="sm" />
        </span>
      </div>
      <div>
        <div class="text-sm font-bold text-slate-900">{{ titleLabel }}</div>
        <div class="text-xs font-medium text-gray-500">{{ subLabel }}</div>
      </div>
    </div>

    <div class="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
      <div class="h-full w-2/5 rounded-full bg-slate-900 animate-ai-indet" />
    </div>

    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-gray-400">{{ hintLabel }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 cursor-pointer hover:bg-gray-50"
        data-testid="ai-stop"
        @mousedown.prevent
        @click="$emit('stop')"
      >
        <SfIconCancel size="xs" />
        {{ stopLabel }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SfIconStarFilled, SfIconCancel } from '@storefront-ui/vue';

const props = defineProps<{
  subLabel: string;
  anchorRect: DOMRect;
}>();

const anchorStyle = computed(() => ({
  top: `${props.anchorRect.bottom + 12}px`,
  left: `${props.anchorRect.left + props.anchorRect.width / 2}px`,
}));

defineEmits<{
  (e: 'stop'): void;
}>();

const titleLabel = getEditorTranslation('ai-generating-title');
const hintLabel = getEditorTranslation('ai-generating-hint');
const stopLabel = getEditorTranslation('ai-stop-label');
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

@keyframes ai-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}
.animate-ai-pulse {
  animation: ai-pulse 1.4s ease-in-out infinite;
}

@keyframes ai-indet {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}
.animate-ai-indet {
  animation: ai-indet 1.4s ease-in-out infinite;
}
</style>

<i18n lang="json">
{
  "en": {
    "ai-generating-title": "Writing your content…",
    "ai-generating-hint": "Usually takes a few seconds",
    "ai-stop-label": "Stop"
  },
  "de": {
    "ai-generating-title": "Writing your content…",
    "ai-generating-hint": "Usually takes a few seconds",
    "ai-stop-label": "Stop"
  }
}
</i18n>
