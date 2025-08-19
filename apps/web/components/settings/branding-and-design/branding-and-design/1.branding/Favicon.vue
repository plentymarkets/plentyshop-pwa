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
        @select="onImageSelect('Favicon')"
        @delete="deleteFavicon()"
      />
      <SfInput v-else v-model="favicon" placeholder="Enter Favicon URL" type="text" />
      <span class="typography-text-xs text-neutral-700">
        {{ getEditorTranslation('favicon.hint') }}
      </span>
    </label>

    <UiImageSelectorModal
      v-if="runtimeConfig.public.isDev"
      :open="isUploaderOpen"
      :custom-label="customLabel"
      :image-type="''"
      :current-image="activeImage"
      @close="closeUploader"
      @add="handleImageAdd"
    />
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { placeholderImg } = usePickerHelper();
const runtimeConfig = useRuntimeConfig();

const { updateSetting, getSetting } = useSiteSettings('favicon');

const { updateSetting, getSetting } = useSiteSettings('favicon');

const onImageSelect = (setting: 'Logo' | 'Favicon') => {
  openUploader(undefined, setting);
};

const deleteFavicon = () => {
  updateSetting(placeholderImg);
};

const favicon = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

// This handler works for both add and delete (delete sets image to placeholder)
const { handleImageAdd } = useImageAdd(favicon);
const { handleImageAdd } = useImageAdd(favicon);

const activeImage = computed(() => favicon.value);
</script>


<i18n lang="json">
{
  "en": {
    "favicon.label": "Favicon",
    "favicon.tooltip": "A favicon helps customers recognize your site in browser tabs and bookmarks. Required file format: .ico",
    "favicon.description": "32×32 px or 48×48 px (.ico)",
    "favicon.hint": "Recommended dimensions: A square of 32 × 32 px or 48 × 48 px"
  },
  "de": {
    "favicon.label": "Favicon",
    "favicon.tooltip": "A favicon helps customers recognize your site in browser tabs and bookmarks. Required file format: .ico",
    "favicon.description": "32×32 px or 48×48 px (.ico)",
    "favicon.hint": "Recommended dimensions: A square of 32 × 32 px or 48 × 48 px"
  }
}
</i18n>
