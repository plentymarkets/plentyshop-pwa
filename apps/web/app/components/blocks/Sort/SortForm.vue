<template>
  <div class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600">
    <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" />
    <span class="italic">{{ getEditorTranslation('no-settings-hint') }}</span>
  </div>
</template>
<script setup lang="ts">
import { SfIconWarning } from '@storefront-ui/vue';

</script>

<i18n lang="json">
{
  "en": {
    "no-settings-hint": "This block doesn't have any settings."
  },
  "de": {
    "no-settings-hint": "This block doesn't have any settings."
  }
}
</i18n>
