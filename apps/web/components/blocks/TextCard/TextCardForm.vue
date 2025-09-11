<template>
  <UiAccordionItem
    v-model="textSettings"
    data-testid="open-text-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-group-label') }}</h2>
    </template>

    <div data-testid="text-card-form">
      <EditorBlocksTextFieldsGroup
        :model="textCardBlock.text"
        :pretitle-label="getEditorTranslation('pretitle-label')"
        :pretitle-placeholder="getEditorTranslation('pretitle-placeholder')"
        pretitle-testid="input-pretitle"
        :title-label="getEditorTranslation('main-title-label')"
        :title-placeholder="getEditorTranslation('main-title-placeholder')"
        title-testid="input-main-title"
        :subtitle-label="getEditorTranslation('subtitle-label')"
        :subtitle-placeholder="getEditorTranslation('subtitle-placeholder')"
        subtitle-testid="input-subtitle"
        :description-label="getEditorTranslation('html-description-label')"
        :description-placeholder="getEditorTranslation('html-description-placeholder')"
        description-testid="textarea-description"
        :color-label="getEditorTranslation('text-color-label')"
        color-testid="color-input"

      />
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="buttonSettings"
    data-testid="button-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('button-group-label') }}</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('button-text-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.button.label" type="text" data-testid="input-button-label">
          <template #suffix>
            <label for="text-button-label" class="rounded-lg cursor-pointer">
              <input id="text-button-label" v-model="textCardBlock.button.label" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('button-link-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="textCardBlock.button.link" type="text" data-testid="input-button-link">
          <template #suffix>
            <label for="text-button-link" class="rounded-lg cursor-pointer">
              <input id="text-button-link" v-model="textCardBlock.button.link" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <UiFormLabel>{{ getEditorTranslation('outline-label') }}</UiFormLabel>

      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          data-testid="button-outline-primary"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.button.variant === 'primary' }"
          @click="textCardBlock.button.variant = 'primary'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.button.variant !== 'primary' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('button-variant-primary-label') }}
        </div>

        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          data-testid="button-outline-secondary"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.button.variant === 'secondary' }"
          @click="textCardBlock.button.variant = 'secondary'"
        >
          <SfIconCheck :class="{ invisible: textCardBlock.button.variant !== 'secondary' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('button-variant-secondary-label') }}
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>
  <UiAccordionItem
    v-if="runtimeConfig.public.isDev"
    v-model="layoutSettings"
    data-testid="layout-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-group-label') }}</h2>
    </template>

    <div class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="keep-transparent" class="m-0">
        {{ getEditorTranslation('keep-transparent-label') }}
      </UiFormLabel>

      <SfSwitch
        id="keep-transparent"
        v-model="keepTransparent"
        data-testid="switch-keep-transparent"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <div v-if="!keepTransparent" class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="backgroundColor" type="text" data-testid="input-background-color">
          <template #suffix>
            <label
              for="background-color"
              :style="{ backgroundColor: backgroundColor }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input
                id="background-color"
                v-model="backgroundColor"
                data-testid="color-input-background"
                type="color"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
      </label>
    </div>
    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="textCardBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="textCardBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="textCardBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="textCardBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
          />
        </div>
      </div>
      <div class="px-4 py-3">
        <span class="typography-text-xs text-neutral-700">
          {{ getEditorTranslation('spacing-around') }}
        </span>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfSwitch,
  SfIconCheck,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
import type { TextCardFormProps, TextCardContent } from './types';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const runtimeConfig = useRuntimeConfig();

const props = defineProps<TextCardFormProps>();

const textCardBlock = computed<TextCardContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};

  const content = rawContent as Partial<TextCardContent>;

  if (!content.text) content.text = {};
  if (!content.button) content.button = {};
  if (!content.layout) {
    content.layout = {
      backgroundColor: '',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
    };
  }

  return content as TextCardContent;
});

const textSettings = ref(false);
const buttonSettings = ref(false);
const layoutSettings = ref(false);

const keepTransparent = ref(true);
const backgroundColor = ref(textCardBlock.value.layout.backgroundColor || '#ffffff');

watch([keepTransparent, backgroundColor], () => {
  textCardBlock.value.layout.backgroundColor = keepTransparent.value ? 'transparent' : backgroundColor.value;
});
</script>

<i18n lang="json">
{
  "en": {
    "text-group-label": "Text",
    "pretitle-label": "Pre-title",
    "main-title-label": "Main title",
    "subtitle-label": "Subtitle",
    "html-description-label": "HTML Description",
    "text-color-label": "Text Color",
    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-link-label": "Link target",
    "outline-label": "Outline",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary",

    "layout-group-label": "Layout",
    "background-color-label": "Background Color",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements",
    "keep-transparent-label": "Keep background transparent"
  },
  "de": {
    "text-group-label": "Text",
    "pretitle-label": "Pre-title",
    "main-title-label": "Main title",
    "subtitle-label": "Subtitle",
    "html-description-label": "HTML Description",
    "text-color-label": "Text Color",
    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-link-label": "Link target",
    "outline-label": "Outline",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary",

    "layout-group-label": "Layout",
    "background-color-label": "Background Color",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements",
    "keep-transparent-label": "or keep transparent"
  }
}
</i18n>
