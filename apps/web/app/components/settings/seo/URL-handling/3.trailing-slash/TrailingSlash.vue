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
      :custom-label="(option) => optionLabels[option] || ''"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('label')"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { NO_CHANGE, NEVER, ALWAYS } from '~/utils/urlTrailingSlashConstants';

const { updateSetting, getSetting } = useSiteSettings('urlTrailingSlash');
const { t } = useI18n();

const trailingSlashOptions = [NO_CHANGE.toString(), NEVER.toString(), ALWAYS.toString()];

const optionLabels = computed(() => ({
  [NO_CHANGE.toString()]: t('option-0-label'),
  [NEVER.toString()]: t('option-1-label'),
  [ALWAYS.toString()]: t('option-2-label'),
}));

const selectedTrailingSlashOption = computed({
  get: () => getSetting().toString(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Trailing Slash",
    "description": "Controls how canonicals and generated links are presented.",
    "option-0-label": "Don't modify trailing slashes",
    "option-1-label": "Remove trailing slashes",
    "option-2-label": "Always add trailing slashes"
  },
  "de": {
    "label": "Trailing Slash",
    "description": "Controls how canonicals and generated links are presented.",
    "option-0-label": "Don't modify trailing slashes",
    "option-1-label": "Remove trailing slashes",
    "option-2-label": "Always add trailing slashes"
  }
}
</i18n>
