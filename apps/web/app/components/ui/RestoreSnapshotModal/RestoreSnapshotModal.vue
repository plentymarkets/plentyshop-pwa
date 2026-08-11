<template>
  <UiModal
    :model-value="confirming"
    aria-labelledby="restore-snapshot-modal"
    tag="section"
    role="dialog"
    class="!w-96 !max-w-md h-fit max-h-screen overflow-y-auto p-6 font-editor"
    overlay-classes="z-modal-backdrop"
    @update:model-value="cancelRestore"
  >
    <header class="flex items-center justify-between mb-4">
      <div class="flex items-center text-base font-bold">{{ getEditorTranslation('title') }}</div>
      <button class="absolute right-2 top-2 p-3" @click="cancelRestore">
        <SfIconClose />
      </button>
    </header>
    <p class="mb-5 text-sm leading-6 text-editor-text-default">
      {{ getEditorTranslation('body-prefix') }}
      <strong class="text-editor-text-strong">{{ confirmingLabel }}</strong>
      {{ getEditorTranslation('body-middle') }}
      <strong class="text-editor-text-strong">{{ confirmingDate }}</strong>
      {{ getEditorTranslation('body-suffix') }}
    </p>
    <div class="flex items-center justify-between gap-3">
      <button
        type="button"
        data-testid="restore-snapshot-cancel-button"
        class="border border-editor-button w-full py-2 rounded-md flex items-center justify-center text-sm font-semibold text-editor-button"
        @click="cancelRestore"
      >
        {{ getEditorTranslation('cancel') }}
      </button>
      <button
        type="button"
        data-testid="restore-snapshot-confirm-button"
        class="border border-editor-button bg-editor-button w-full py-2 rounded-md flex items-center justify-center text-sm font-semibold text-white"
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

const { confirming, confirmingSnapshot, restoring, cancelRestore, confirmRestore } = useBlockSnapshots();

const confirmingLabel = computed(() => {
  const snapshot = confirmingSnapshot.value;
  if (!snapshot) {
    return '';
  }

  return getSnapshotVersionName(snapshot);
});

const confirmingDate = computed(() => {
  const snapshot = confirmingSnapshot.value;
  if (!snapshot) {
    return '';
  }

  return new Date(snapshot.createdAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
});
</script>

<i18n lang="json">
{
  "en": {
    "title": "Restore this version?",
    "body-prefix": "The page content will be replaced with the version",
    "body-middle": "from",
    "body-suffix": ". Your current unsaved state will be lost.",
    "cancel": "Cancel",
    "confirm": "Restore version"
  },
  "de": {
    "title": "Restore this version?",
    "body-prefix": "The page content will be replaced with the version",
    "body-middle": "from",
    "body-suffix": ". Your current unsaved state will be lost.",
    "cancel": "Cancel",
    "confirm": "Restore version"
  }
}
</i18n>
