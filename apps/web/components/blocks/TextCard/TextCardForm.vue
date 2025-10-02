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
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('pretitle-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="textCardBlock.text.pretitle" type="text" data-testid="input-pretitle">
            <template #suffix>
              <label for="text-pretitle" class="rounded-lg cursor-pointer">
                <input id="text-pretitle" v-model="textCardBlock.text.pretitle" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="textCardBlock.text.title" type="text" data-testid="input-main-title">
            <template #suffix>
              <label for="text-title" class="rounded-lg cursor-pointer">
                <input id="text-title" v-model="textCardBlock.text.title" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('subtitle-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="textCardBlock.text.subtitle" type="text" data-testid="input-subtitle">
            <template #suffix>
              <label for="text-subtitle" class="rounded-lg cursor-pointer">
                <input id="text-subtitle" v-model="textCardBlock.text.subtitle" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('html-description-label') }}</UiFormLabel>
        <SfTextarea
          id="text-html-description"
          v-model="textCardBlock.text.htmlDescription"
          data-testid="textarea-description"
          name="text-html-description"
          rows="3"
          class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('text-color-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="textCardBlock.text.color" type="text" data-testid="input-text-color">
            <template #suffix>
              <label
                for="primary-color"
                :style="{ backgroundColor: textCardBlock.text.color }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="primary-color"
                  v-model="textCardBlock.text.color"
                  data-testid="color-input"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <fieldset class="py-2">
        <legend class="text-sm font-medium text-black">{{ getEditorTranslation('text-align-label') }}</legend>

        <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            for="text-align-left"
            data-testid="text-align-left"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'left' }"
            @click="textCardBlock.text.textAlignment = 'left'"
          >
            <SfIconCheck :class="{ invisible: textCardBlock.text.textAlignment !== 'left' }" class="mr-1 w-[1.1rem]" />
            {{ getEditorTranslation('text-align-option-left-label') }}
          </div>

          <div
            for="text-align-center"
            data-testid="text-align-center"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'center' }"
            @click="textCardBlock.text.textAlignment = 'center'"
          >
            <SfIconCheck
              :class="{ invisible: textCardBlock.text.textAlignment !== 'center' }"
              class="mr-1 w-[1.1rem]"
            />
            {{ getEditorTranslation('text-align-option-center-label') }}
          </div>

          <div
            for="text-align-right"
            data-testid="text-align-right"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': textCardBlock.text.textAlignment === 'right' }"
            @click="textCardBlock.text.textAlignment = 'right'"
          >
            <SfIconCheck :class="{ invisible: textCardBlock.text.textAlignment !== 'right' }" class="mr-1 w-[1.1rem]" />
            {{ getEditorTranslation('text-align-option-right-label') }}
          </div>
        </div>
      </fieldset>
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
        v-model="isTransparent"
        data-testid="switch-keep-transparent"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <div v-if="!isTransparent" class="py-2">
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

    <MarginInput v-model="marginModel" :label="getEditorTranslation('margin-label')" />

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
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfTextarea,
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
const { findOrDeleteBlockByUuid, getBlockDepth } = useBlockManager();

const blockDepth = computed(() => {
  return getBlockDepth(props.uuid || blockUuid.value);
});

const props = defineProps<TextCardFormProps>();

const { defaultMarginLeft, defaultMarginRight } = useDefaultMargins({
  blockDepth: blockDepth.value,
  defaultMargin: 40,
});

const textCardBlock = computed<TextCardContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};

  const content = rawContent as Partial<TextCardContent>;

  if (!content.text) content.text = {};
  if (!content.button) content.button = {};
  if (!content.layout) {
    content.layout = {
      backgroundColor: '',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: defaultMarginLeft.value,
      marginRight: defaultMarginRight.value,
    };
  } else {
    content.layout.marginTop = content.layout.marginTop ?? 0;
    content.layout.marginBottom = content.layout.marginBottom ?? 0;
    content.layout.marginLeft = content.layout.marginLeft ?? defaultMarginLeft.value;
    content.layout.marginRight = content.layout.marginRight ?? defaultMarginRight.value;
  }

  return content as TextCardContent;
});

const marginModel = useMarginModel(textCardBlock.value.layout);

const textSettings = ref(false);
const buttonSettings = ref(false);
const layoutSettings = ref(false);

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
    "margin-label": "Margin",
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
    "margin-label": "Margin",
    "spacing-around": "Spacing around the text elements",
    "keep-transparent-label": "or keep transparent"
  }
}
</i18n>
