<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <SfInput v-model="cancellationEmail" type="text" data-testid="cancellation-email" />
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('cancellationFormRecipient');

const cancellationEmail = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Cancellation Form Email",
    "tooltip": "Enter the email address to which messages from the contract cancellation form should be sent. The form is found under /cancellation-form"
  },
  "de": {
    "label": "Cancellation Form Email",
    "tooltip": "Enter the email address to which messages from the contract cancellation form should be sent. The form is found under /cancellation-form"
  }
}
</i18n>
