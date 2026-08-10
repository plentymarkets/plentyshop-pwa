<template>
  <UiModal
    :model-value="confirming"
    aria-labelledby="restore-snapshot-modal"
    tag="section"
    role="dialog"
    class="w-[92vw] @md:w-[420px] h-fit max-h-[90vh] overflow-y-auto page-modal"
    overlay-classes="z-modal-backdrop"
    @update:model-value="cancelRestore"
  >
    <header class="flex items-center justify-between mb-6">
      <div class="flex items-center text-lg font-bold">{{ getEditorTranslation('title') }}</div>
      <button class="absolute right-2 top-2 px-4 py-4" @click="cancelRestore">
        <SfIconClose />
      </button>
    </header>
    <p class="mb-6 text-sm leading-relaxed text-editor-text-default">
      {{ getEditorTranslation('body-prefix') }}
      <strong class="text-editor-text-strong">{{ confirmingTime }}</strong>
      {{ getEditorTranslation('body-suffix') }}
    </p>
    <div class="flex items-center justify-between gap-4">
      <button
        type="button"
        data-testid="restore-snapshot-cancel-button"
        class="border border-editor-button w-full py-2 rounded-md flex items-center justify-center text-editor-button"
        @click="cancelRestore"
      >
        {{ getEditorTranslation('cancel') }}
      </button>
      <button
        type="button"
        data-testid="restore-snapshot-confirm-button"
        class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex items-center justify-center text-white"
        :class="{ 'opacity-40 cursor-not-allowed': restoring }"
        :disabled="restoring"
        @click="confirmRestore"
      >
        {{ getEditorTranslation('confirm') }}
      </button>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
import { formatSnapshotDateTime, getSnapshotVersionName } from '~/utils/snapshotLabelHelper';

const { confirming, confirmingSnapshot, restoring, cancelRestore, confirmRestore } = useBlockSnapshots();

const confirmingTime = computed(() => {
  const snapshot = confirmingSnapshot.value;
  if (!snapshot) {
    return '';
  }

  return `"${getSnapshotVersionName(snapshot)}" (${formatSnapshotDateTime(snapshot)})`;
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Restore this version?",
    "body-prefix": "The page content will be replaced with the version from",
    "body-suffix": ". Your current unsaved state will be lost.",
    "cancel": "Cancel",
    "confirm": "Restore version"
  },
  "de": {
    "title": "Restore this version?",
    "body-prefix": "The page content will be replaced with the version from",
    "body-suffix": ". Your current unsaved state will be lost.",
    "cancel": "Cancel",
    "confirm": "Restore version"
  }
}
</i18n>
