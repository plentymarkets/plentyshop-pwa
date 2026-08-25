<template>
  <div class="py-2 flex items-center justify-between gap-3">
    <UiFormLabel for="configure-individually" class="m-0">
      {{ getEditorTranslation('configure-individually-label') }}
    </UiFormLabel>
    <SfSwitch
      id="configure-individually"
      v-model="configureIndividually"
      data-testid="switch-configure-individually"
      class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
    />
  </div>

  <div
    v-if="hasMissingSizes"
    class="flex items-start gap-2 pb-2 text-sm text-neutral-600"
    role="alert"
    aria-live="polite"
    data-testid="mismatched-sizes-hint"
  >
    <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" aria-hidden="true" />
    <span class="italic">{{ getEditorTranslation('mismatched-sizes-hint') }}</span>
  </div>

  <div class="images">
    <UiImagePicker
      v-if="!configureIndividually"
      :label="getEditorTranslation('image-label')"
      :image="image.wideScreen"
      :placeholder="placeholderImg"
      :dimensions="imageDimensions.wideScreen"
      selected-image-type="wideScreen"
      @add="(payload) => emit('add', { ...payload, type: 'wideScreen', applyToAllSizes: true })"
      @delete="emit('delete', { type: 'wideScreen', applyToAllSizes: true })"
    />

    <template v-else>
      <UiImagePicker
        v-for="type in imageTypes"
        :key="type"
        :label="labels[type]"
        :image="image[type]"
        :placeholder="placeholderImg"
        :dimensions="imageDimensions[type]"
        :selected-image-type="type"
        @add="(payload) => emit('add', { image: payload.image, name: payload.name, type, applyToAllSizes: false })"
        @delete="emit('delete', { type, applyToAllSizes: false })"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch, SfIconWarning } from '@storefront-ui/vue';
import type {
  ResponsiveImagePickerProps,
  ResponsiveImagePickerAddPayload,
  ResponsiveImagePickerDeletePayload,
} from './types';

const props = defineProps<ResponsiveImagePickerProps>();
const emit = defineEmits<{
  (e: 'add', payload: ResponsiveImagePickerAddPayload): void;
  (e: 'delete', payload: ResponsiveImagePickerDeletePayload): void;
}>();

const { placeholderImg, labels, imageDimensions, imageTypes } = usePickerHelper();

const configureIndividually = useState('responsive-image-picker-configure-individually', () => false);

const PLACEHOLDER_IMAGE_FILENAME = 'placeholder-image.png';

const isEmptySize = (value?: string) => !value || value.endsWith(PLACEHOLDER_IMAGE_FILENAME);

const hasMissingSizes = computed(() => {
  if (configureIndividually.value) {
    return false;
  }
  const emptySizesCount = imageTypes.filter((type) => isEmptySize(props.image[type])).length;
  return emptySizesCount > 0 && emptySizesCount < imageTypes.length;
});
</script>

<i18n lang="json">
{
  "en": {
    "configure-individually-label": "Configure screen sizes individually",
    "image-label": "Image",
    "mismatched-sizes-hint": "Some screen sizes still miss an image. Enable individual configuration to review them."
  },
  "de": {
    "configure-individually-label": "Configure screen sizes individually",
    "image-label": "Image",
    "mismatched-sizes-hint": "Some screen sizes still miss an image. Enable individual configuration to review them."
  }
}
</i18n>
