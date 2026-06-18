<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <Multiselect
      v-model="selectedTrailingSlashOption"
      data-testid="editor-trailingSlash-select"
      :options="trailingSlashOptions"
      label="label"
      track-by="value"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { NO_CHANGE, NEVER, ALWAYS } from '~/utils/urlTrailingSlashConstants';

const { updateSetting, getSetting } = useSiteSettings('urlTrailingSlash');

const noChangeLabel = getEditorTranslation('no-change-label');
const removeLabel = getEditorTranslation('remove-label');
const alwaysAddLabel = getEditorTranslation('always-add-label');

const trailingSlashOptions = [
  { value: NO_CHANGE.toString(), label: noChangeLabel },
  { value: NEVER.toString(), label: removeLabel },
  { value: ALWAYS.toString(), label: alwaysAddLabel },
];

const selectedTrailingSlashOption = computed({
  get: () => {
    return trailingSlashOptions.find((o) => o.value === getSetting().toString()) || trailingSlashOptions[0];
  },
  set: (option) => {
    updateSetting(option?.value ?? NO_CHANGE.toString());
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Trailing Slash",
    "description": "Controls how canonicals and generated links are presented.",
    "no-change-label": "Don't modify trailing slashes",
    "remove-label": "Remove trailing slashes",
    "always-add-label": "Always add trailing slashes"
  },
  "de": {
    "label": "Trailing Slash",
    "description": "Controls how canonicals and generated links are presented.",
    "no-change-label": "Don't modify trailing slashes",
    "remove-label": "Remove trailing slashes",
    "always-add-label": "Always add trailing slashes"
  }
}
</i18n>
