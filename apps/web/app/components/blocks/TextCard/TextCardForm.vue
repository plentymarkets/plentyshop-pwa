<template>
  <EditorFormPanel
    v-model="textSettings"
    :title="getEditorTranslation('text-group-label')"
    data-testid="open-text-settings"
  >
    <EditorRichTextEditorForm
      v-model="contentModel"
      :text-align="textCardBlock.text.textAlignment"
      :placeholder="getEditorTranslation('placeholder')"
    />
  </EditorFormPanel>

  <div data-testid="button-settings">
    <EditorFormPanel v-model="buttonSettings" :title="getEditorTranslation('button-group-label')">
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel for="textcard-button-label">{{ getEditorTranslation('button-text-label') }}</UiFormLabel>
        </div>
        <SfInput
          id="textcard-button-label"
          v-model="textCardBlock.button.label"
          type="text"
          data-testid="input-button-label"
        />
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel for="textcard-button-link">{{ getEditorTranslation('button-link-label') }}</UiFormLabel>
        </div>
        <SfInput
          id="textcard-button-link"
          v-model="textCardBlock.button.link"
          type="text"
          data-testid="input-button-link"
        />
      </div>

      <div class="py-2">
        <EditorOptionsTabs
          v-model="buttonVariantModel"
          :legend="getEditorTranslation('outline-label')"
          test-id-prefix="button-variant"
          :options="buttonVariantOptions"
        />
      </div>

      <div class="py-2">
        <EditorOptionsTabs
          v-model="buttonAlignModel"
          :legend="getEditorTranslation('button-align-label')"
          test-id-prefix="button-align"
          :options="buttonAlignOptions"
        />
      </div>
    </EditorFormPanel>
  </div>

  <EditorFormPanel
    v-model="layoutSettings"
    :title="getEditorTranslation('layout-group-label')"
    data-testid="layout-settings"
  >
    <div class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="keep-transparent" class="m-0">
        {{ getEditorTranslation('keep-transparent-label') }}
      </UiFormLabel>

      <SfSwitch
        id="keep-transparent"
        v-model="isTransparent"
        data-testid="switch-keep-transparent"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <div v-if="!isTransparent" class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      </div>
      <EditorColorPicker v-model="backgroundColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput id="textcard-bgcolor" v-model="backgroundColor" type="text" data-testid="input-background-color">
            <template #suffix>
              <button
                type="button"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                :style="{ backgroundColor: color }"
                aria-label="Color picker button"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </template>
      </EditorColorPicker>
    </div>

    <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />

    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            id="textcard-padding-top"
            v-model.number="textCardBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
            aria-label="Top padding"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            id="textcard-padding-bottom"
            v-model.number="textCardBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
            aria-label="Bottom padding"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            id="textcard-padding-left"
            v-model.number="textCardBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
            aria-label="Left padding"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            id="textcard-padding-right"
            v-model.number="textCardBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
            aria-label="Right padding"
          />
        </div>
      </div>
      <div class="px-4 py-3">
        <span class="typography-text-xs text-neutral-700">
          {{ getEditorTranslation('spacing-around') }}
        </span>
      </div>
    </div>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfSwitch,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
import type { TextCardFormProps, TextCardContent } from './types';
const props = defineProps<TextCardFormProps>();

const { allBlocks: data } = useBlocks();

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const textCardBlock = computed<TextCardContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};
  const content = rawContent as Partial<TextCardContent>;

  if (!content.text) content.text = {};
  content.text.pretitle = content.text.pretitle ?? '';
  content.text.title = content.text.title ?? '';
  content.text.subtitle = content.text.subtitle ?? '';
  content.text.htmlDescription = content.text.htmlDescription ?? '';
  content.text.color = content.text.color ?? '';
  content.text.textAlignment = content.text.textAlignment ?? 'left';

  if (!content.button) content.button = {};
  if (!content.button.alignment) content.button.alignment = 'center';

  if (!content.layout) {
    content.layout = {
      backgroundColor: '',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0',
      fullWidth: false,
    };
  }

  return content as TextCardContent;
});

const contentModel = computed<string>({
  get: () => decodeHtmlEntities(textCardBlock.value.text.htmlDescription ?? ''),
  set: (val: string) => {
    textCardBlock.value.text.htmlDescription = val ?? '';
  },
});

const { buttonVariantModel, buttonVariantOptions, buttonAlignModel, buttonAlignOptions } = useEditorOptionsTabs(
  () => textCardBlock.value,
  getEditorTranslation,
);

const { isFullWidth } = useFullWidthToggleForContent(textCardBlock);

const textSettings = ref(true);
const buttonSettings = ref(true);
const layoutSettings = ref(true);

const backgroundColorInit = textCardBlock.value.layout.backgroundColor;
const isTransparent = ref(!backgroundColorInit || backgroundColorInit === 'transparent');
const backgroundColor = ref(isTransparent.value ? '' : backgroundColorInit);

watch([isTransparent, backgroundColor], () => {
  textCardBlock.value.layout.backgroundColor = isTransparent.value ? 'transparent' : backgroundColor.value;
});
</script>
<i18n lang="json">
{
  "en": {
    "text-group-label": "Text",
    "placeholder": "Enter text here...",

    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-link-label": "Link target",
    "outline-label": "Outline",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary",
    "button-align-label": "Button Alignment (x)",
    "button-align-option-left-label": "Left",
    "button-align-option-center-label": "Center",
    "button-align-option-right-label": "Right",

    "layout-group-label": "Layout",
    "background-color-label": "Background Color",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements",
    "keep-transparent-label": "Keep background transparent"
  },
  "de": {
    "text-group-label": "Text",
    "placeholder": "Hier Text eingeben...",

    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-link-label": "Link target",
    "outline-label": "Outline",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary",
    "button-align-label": "Button Alignment (x)",
    "button-align-option-left-label": "Left",
    "button-align-option-center-label": "Center",
    "button-align-option-right-label": "Right",

    "layout-group-label": "Layout",
    "background-color-label": "Background Color",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements",
    "keep-transparent-label": "or keep transparent"
  }
}
</i18n>
