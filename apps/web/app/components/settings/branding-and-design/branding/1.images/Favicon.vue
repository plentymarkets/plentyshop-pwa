<template>
  <div class="py-2">
    <UiImagePicker
      :id="'favicon'"
      :label="getEditorTranslation('favicon.label')"
      :image="favicon"
      :placeholder="placeholderImg"
      :dimensions="getEditorTranslation('favicon.description')"
      :tooltip="getEditorTranslation('favicon.tooltip')"
      :selected-image-type="'Favicon'"
      :custom-label="'Change Favicon'"
      @add="handleImageAdd"
      @delete="deleteFavicon()"
    />
    <span class="typography-text-xs text-neutral-700">
      {{ getEditorTranslation('favicon.hint') }}
    </span>
  </div>
</template>

<script setup lang="ts">
const { placeholderImg } = usePickerHelper();

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
