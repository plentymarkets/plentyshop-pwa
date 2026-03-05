<template>
  <div class="block-form-section">
    <UiAccordionItem
      v-model="logoOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('logo-section-label') }}</h2>
      </template>

      <div class="space-y-4 py-4">
        <div>
          <UiFormLabel class="mb-2">{{ getEditorTranslation('logo-image-label') }}</UiFormLabel>
          <p class="text-xs text-gray-500 mb-3">{{ getEditorTranslation('logo-image-hint') }}</p>

          <UiImagePicker
            :label="getEditorTranslation('logo-image-label')"
            :image="logoConfig.logo"
            :placeholder="placeholderImg"
            dimensions="400x200"
            @add="handleLogoUpload"
            @delete="deleteLogoImage"
          />
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import type { UtilityBarProps, LogoSettings } from '../types';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();
const { placeholderImg } = usePickerHelper();

const logoOpen = ref(true);

const utilityBarBlock = computed<UtilityBarProps>(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as UtilityBarProps,
);

const logoConfig = computed<LogoSettings>({
  get: () => utilityBarBlock.value.configuration?.logo || { logo: '' },
  set: (value) => {
    if (utilityBarBlock.value.configuration) {
      utilityBarBlock.value.configuration.logo = value;
    }
  },
});

const handleLogoUpload = (payload: { image: string }): void => {
  logoConfig.value.logo = payload.image;
};

const deleteLogoImage = (): void => {
  logoConfig.value.logo = '';
};
</script>

<i18n lang="json">
{
  "en": {
    "logo-section-label": "Logo Settings",
    "logo-image-label": "Logo Image",
    "logo-image-hint": "Upload your logo image here"
  },
  "de": {
    "logo-section-label": "Logo Einstellungen",
    "logo-image-label": "Logo Bild",
    "logo-image-hint": "Laden Sie Ihr Logo-Bild hier hoch"
  }
}
</i18n>
