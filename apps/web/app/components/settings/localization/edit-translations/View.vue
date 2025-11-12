<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>

        <UiButton variant="secondary" class="mt-2 mb-5" @click="fetchAllTranslations">
          {{ getEditorTranslation('label') }}
          <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer mr-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :d="editPath" fill="black" />
            </svg>
          </SfIconBase>
        </UiButton>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
import { SfIconBase } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';

const { loadKeys, keys } = useEditorLocalizationKeys();

const fetchAllTranslations = async () => {
  await loadKeys();
  console.log(keys.value);
};
</script>

<i18n lang="json">
{
  "en": {
    "label": "Edit Translations",
    "description": "Translate static texts of your shop."
  },
  "de": {
    "label": "Edit Translations",
    "description": "Translate static texts of your shop."
  }
}
</i18n>
