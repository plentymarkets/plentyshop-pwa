<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>

        <UiButton variant="secondary" class="mt-2 mb-5" :disabled="loading" @click="fetchAllTranslations">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <span v-else class="flex items-center">
            {{ getEditorTranslation('label') }}
            <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer ml-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="editPath" fill="black" />
              </svg>
            </SfIconBase>
          </span>
        </UiButton>

        <template v-if="keys.length > 0">
          <div class="m-3">{{ getEditorTranslation('markLanguages') }}</div>
          <EditorLocalizationLanguageSelectCheckbox
            v-for="(language, locale) in allLanguages"
            :key="locale"
            :lang="language"
            :locale="locale"
          />
        </template>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
import { SfIconBase, SfLoaderCircular } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';

const { loadKeys, keys, loading } = useEditorLocalizationKeys();
const { allLanguages, initializeLocales } = useEditorLocalizationLocales();

initializeLocales();

const fetchAllTranslations = async () => {
  try {
    await loadKeys();
    console.log(keys.value);
  } catch (error) {
    console.error(error);
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "label": "Edit Translations",
    "description": "Translate static texts of your shop.",
    "markLanguages": "Mark languages you want to translate. Once marked, chosen languages will be shown in the table."
  },
  "de": {
    "label": "Edit Translations",
    "description": "Translate static texts of your shop.",
    "markLanguages": "Mark languages you want to translate. Once marked, chosen languages will be shown in the table."
  }
}
</i18n>
