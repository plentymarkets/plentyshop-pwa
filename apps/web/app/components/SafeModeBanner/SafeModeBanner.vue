<template>
  <header
    v-if="!isHidden"
    class="fixed h-auto md:h-8 top-0 left-0 w-full z-50 bg-warning-200 px-4 py-2 flex justify-between items-center shadow-md font-medium"
    data-testid="safe-mode-banner"
  >
    <div class="flex-grow text-center">
      {{ getEditorTranslation('safe-mode') }}
    </div>
    <button
      type="button"
      class="ml-4 p-1 hover:bg-warning-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
      data-testid="close-safe-mode-banner"
      :aria-label="getEditorTranslation('close')"
      @click="close"
    >
      <SfIconClose class="h-5 w-5" />
    </button>
  </header>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

const isHidden = useState<boolean>('safe-mode-banner-hidden', () => false);

const close = () => {
  isHidden.value = true;
};
</script>

<i18n lang="json">
{
  "en": {
    "safe-mode": "Shop is running in Safe Mode. User-defined scripts, styles, and meta tags are disabled.",
    "close": "Close"
  },
  "de": {
    "safe-mode": "Shop is running in Safe Mode. User-defined scripts, styles, and meta tags are disabled.",
    "close": "Close"
  }
}
</i18n>
