<template>
  <UiModal
    :model-value="Boolean(pendingPaste)"
    aria-labelledby="paste-page-content-modal"
    tag="section"
    role="dialog"
    class="!w-96 !max-w-md h-fit max-h-screen overflow-y-auto p-6 font-editor"
    overlay-classes="z-modal-backdrop"
    data-testid="paste-page-content-modal"
    @update:model-value="cancelPaste"
  >
    <header class="flex items-center justify-between mb-4">
      <div id="paste-page-content-modal" class="flex items-center text-base font-bold">
        {{ getEditorTranslation('title') }}
      </div>
      <button class="absolute right-2 top-2 p-3" :aria-label="getEditorTranslation('cancel')" @click="cancelPaste">
        <SfIconClose />
      </button>
    </header>

    <p class="mb-4 text-sm leading-6 text-editor-text-default">{{ getEditorTranslation('body') }}</p>

    <UiAlert
      v-if="calloutVariant"
      :variant="calloutVariant"
      class="mb-4 !justify-start text-left"
      role="alert"
      :data-testid="`paste-modal-callout-${calloutVariant}`"
    >
      {{ getEditorTranslation(calloutVariant === 'negative' ? 'callout-none' : 'callout-some') }}
    </UiAlert>

    <div class="mb-4" data-testid="paste-modal-blocks">
      <div class="text-xs font-semibold uppercase tracking-widest text-editor-text-muted mb-1">
        {{ getEditorTranslation('blocks-heading', { count: entries.length }) }}
      </div>
      <ul class="max-h-60 overflow-y-auto text-sm flex flex-col gap-1.5">
        <li
          v-for="(entry, index) in entries"
          :key="index"
          class="flex items-start gap-2"
          :data-testid="`paste-modal-entry-${entry.status}`"
        >
          <SfIconCheckCircle
            v-if="entry.status === 'compatible'"
            size="sm"
            class="flex-none mt-0.5 text-editor-accent"
            :aria-label="getEditorTranslation('status-compatible')"
          />
          <SfIconWarning
            v-else
            size="sm"
            class="flex-none mt-0.5 text-warning-700"
            :aria-label="getEditorTranslation(`status-${entry.status}`)"
          />
          <span
            :class="entry.status === 'partial' && 'underline decoration-dotted underline-offset-4 cursor-help'"
            :title="entry.status === 'partial' ? entry.skipped.join(', ') : undefined"
            >{{ entry.name }}</span
          >
        </li>
      </ul>
    </div>

    <div class="flex items-center justify-between gap-3">
      <button
        type="button"
        data-testid="paste-modal-cancel"
        class="border border-editor-button w-full py-2 rounded-md flex items-center justify-center text-sm font-semibold text-editor-button"
        @click="cancelPaste"
      >
        {{ getEditorTranslation('cancel') }}
      </button>
      <button
        type="button"
        data-testid="paste-modal-confirm"
        class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex items-center justify-center text-sm font-semibold text-white"
        :class="{ 'opacity-40 cursor-not-allowed': !hasPastableBlocks }"
        :disabled="!hasPastableBlocks"
        @click="confirmPaste"
      >
        {{ getEditorTranslation('confirm') }}
      </button>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconCheckCircle, SfIconWarning } from '@storefront-ui/vue';

const { pendingPaste, cancelPaste, confirmPaste } = useBlockClipboard();

const entries = computed(() =>
  (pendingPaste.value?.entries ?? []).map((entry) => ({
    ...entry,
    name: getBlockDisplayName(entry.name),
    skipped: entry.skipped.map(getBlockDisplayName),
  })),
);
const hasPastableBlocks = computed(() => Boolean(pendingPaste.value?.blocks.length));
const calloutVariant = computed(() => {
  if (!entries.value.length || entries.value.every((entry) => entry.status === 'compatible')) {
    return null;
  }
  return hasPastableBlocks.value ? 'warning' : 'negative';
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Replace page content?",
    "body": "All content blocks on this page will be replaced with the copied page content. Header and footer stay unchanged. You can undo this until you save.",
    "blocks-heading": "Copied blocks ({count})",
    "status-compatible": "Compatible with this page",
    "status-partial": "Partly compatible",
    "status-incompatible": "Not compatible",
    "callout-some": "Some blocks aren't compatible with this page. Incompatible blocks, or the incompatible parts of a block, will be left out.",
    "callout-none": "None of the copied blocks are compatible with this page. There is nothing to paste.",
    "cancel": "Cancel",
    "confirm": "Replace content"
  },
  "de": {
    "title": "Replace page content?",
    "body": "All content blocks on this page will be replaced with the copied page content. Header and footer stay unchanged. You can undo this until you save.",
    "blocks-heading": "Copied blocks ({count})",
    "status-compatible": "Compatible with this page",
    "status-partial": "Partly compatible",
    "status-incompatible": "Not compatible",
    "callout-some": "Some blocks aren't compatible with this page. Incompatible blocks, or the incompatible parts of a block, will be left out.",
    "callout-none": "None of the copied blocks are compatible with this page. There is nothing to paste.",
    "cancel": "Cancel",
    "confirm": "Replace content"
  }
}
</i18n>
