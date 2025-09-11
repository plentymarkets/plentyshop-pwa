<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="availability"
        :options="availabilityOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-availability-6"
        label="label"
        track-by="value"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import type { SettingOption } from '~/utils/editorSettings';
import { getSeoAvailabilityOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('seoAvailability6');
const runtimeConfig = useRuntimeConfig();

const availabilityOptions = computed(() => getSeoAvailabilityOptions());

const availability = computed({
  get: () => {
    return availabilityOptions.value.find((o: SettingOption) => o.value === getSetting());
  },
  set: (option) => updateSetting(option?.value ?? ''),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Availability6",
    "placeholder": "Choose availability"
  },
  "de": {
    "label": "Availability6",
    "placeholder": "Choose availability"
  }
}
</i18n>
