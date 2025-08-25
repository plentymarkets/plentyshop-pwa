<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('favicon.label') }}</UiFormLabel>
      <SfTooltip
        :label="getEditorTranslation('favicon.tooltip')"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <UiImagePicker
        v-if="runtimeConfig.public.isDev"
        :label="getEditorTranslation('favicon.label')"
        :image="favicon"
        :placeholder="placeholderImg"
        :dimensions="getEditorTranslation('favicon.description')"
        :show-tooltip="true"
        :selected-image-type="'Favicon'"
        :custom-label="'Change Favicon'"
        @add="handleImageAdd"
        @delete="deleteFavicon()"
      />
      <SfInput v-else v-model="favicon" placeholder="Enter Favicon URL" type="text" />
      <span class="typography-text-xs text-neutral-700">
        {{ getEditorTranslation('favicon.hint') }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { placeholderImg } = usePickerHelper();
const runtimeConfig = useRuntimeConfig();

const { updateSetting, getSetting } = useSiteSettings('favicon');

const deleteFavicon = () => {
  updateSetting(placeholderImg);
};

const favicon = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const { handleImageAdd } = useImageAdd(favicon);
</script>

<i18n lang="json">
{
  "en": {
    "favicon.label": "Favicon",
    "favicon.tooltip": "A favicon helps customers recognise your shop in browser tabs and bookmarks.",
    "favicon.description": "32×32 px or 48×48 px (.ico)",
    "favicon.hint": "Required format: ICO\nRecommended dimensions: A square of 32 × 32 px or 48 × 48 px"
  },
  "de": {
    "favicon.label": "Favicon",
    "favicon.tooltip": "A favicon helps customers recognise your shop in browser tabs and bookmarks.",
    "favicon.description": "32×32 px or 48×48 px (.ico)",
    "favicon.hint": "Required format: ICO\nRecommended dimensions: A square of 32 × 32 px or 48 × 48 px"
  }
}
</i18n>
