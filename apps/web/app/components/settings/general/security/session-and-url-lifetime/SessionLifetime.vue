<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip
        :label="getEditorTranslation('tooltip')"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
        data-testid="session-lifetime-tooltip"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="sessionLifetime"
      data-testid="session-lifetime"
      :options="options"
      :placeholder="getEditorTranslation('placeholder')"
      label="label"
      track-by="value"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { SettingOption } from '~/utils/editorSettings';
import { getSessionLifetimeOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('sessionLifetime');

const options = computed(() => getSessionLifetimeOptions());

const sessionLifetime = computed({
  get: () => {
    return options.value.find((o: SettingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Validity of the session cookie",
    "tooltip": "The session cookie serves to bundle information that can be matched with a user. That way, items that have been added to the shopping cart can remain in the user's shopping cart, even if some time has passed in the meantime",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Validity of the session cookie",
    "tooltip": "The session cookie serves to bundle information that can be matched with a user. That way, items that have been added to the shopping cart can remain in the user's shopping cart, even if some time has passed in the meantime",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
