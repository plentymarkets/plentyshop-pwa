<template>
  <div class="flex flex-col text-sm">
    <p class="pb-2">
      <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
    </p>

    <UiButton variant="secondary" class="mt-2 w-full" :disabled="loadingData" @click="fetchAllTranslations">
      <SfLoaderCircular v-if="loadingData" class="flex justify-center items-center" size="base" />
      <span v-else class="flex items-center">
        {{ getEditorTranslation('label') }}
        <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer ml-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :d="editPath" fill="black" />
          </svg>
        </SfIconBase>
      </span>
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import { SfIconBase, SfLoaderCircular } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';

const { loadKeys } = useEditorLocalizationKeys();
const loadingData = ref(false);

const fetchAllTranslations = async () => {
  loadingData.value = true;
  try {
    await loadKeys();
  } finally {
    loadingData.value = false;
  }
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
