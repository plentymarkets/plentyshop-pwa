<template>
  <UiButton variant="secondary" class="mt-2 mb-5 w-full" :disabled="loading" @click="getAndLog">
    <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
    <span v-else class="flex items-center">
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer mr-2">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="editPath" fill="black" />
        </svg>
      </SfIconBase>
      {{ getEditorTranslation('label') }}
    </span>
  </UiButton>

  <template v-if="keys.length > 0">
    <div class="my-1">{{ getEditorTranslation('markLanguages') }}</div>
    <EditorLocalizationLanguageSelectCheckbox
      v-for="(language, locale) in allLanguages"
      :key="locale"
      :lang="language"
      :locale="locale"
    />
  </template>
</template>

<script setup lang="ts">
import { editPath } from '~/assets/icons/paths/edit';
import { SfIconBase, SfLoaderCircular } from '@storefront-ui/vue';

const { loadKeys, keys, loading } = useEditorLocalizationKeys();
const { allLanguages } = useEditorLocalizationLocales();

const getAndLog = async () => {
  await loadKeys();
  console.log(keys);
};
</script>

<i18n lang="json">
{
  "en": {
    "label": "Edit translations",
    "markLanguages": "Mark languages you want to translate. Once marked, chosen languages will be shown in the table."
  },
  "de": {
    "label": "Edit translations",
    "markLanguages": "Mark languages you want to translate. Once marked, chosen languages will be shown in the table."
  }
}
</i18n>
