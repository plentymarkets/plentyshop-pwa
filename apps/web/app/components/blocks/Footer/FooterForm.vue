<template>
  <div class="footer-settings-view sticky" data-testid="footer-settings-drawer">
    <UiAccordionItem
      v-model="firstColumnOpen"
      data-testid="first-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('column-1-group-label') }}</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('column-1-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.column1.title" type="text" data-testid="input-title-column-1">
            <template #suffix>
              <label for="text-title-column-1" class="rounded-lg cursor-pointer">
                <input id="text-title-column-1" v-model="footerBlock.column1.title" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div v-for="switchConfig in columnOneSwitches" :key="switchConfig.id" class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel class="mb-1">{{ getEditorTranslation(switchConfig.translationKey) }}</UiFormLabel>
          <SfSwitch
            v-model="switchConfig.model.value"
            :data-testid="switchConfig.id"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="secondColumnOpen"
      data-testid="second-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('column-2-group-label') }}</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('column-2-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.column2.title" type="text" data-testid="input-title-column-2">
            <template #suffix>
              <label for="input-title-column-2" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-2"
                  v-model="footerBlock.column2.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div v-for="switchConfig in columnTwoSwitches" :key="switchConfig.id" class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel class="mb-1">{{ getEditorTranslation(switchConfig.translationKey) }}</UiFormLabel>
          <SfSwitch
            v-model="switchConfig.model.value"
            :data-testid="switchConfig.id"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('column-2-description-label') }}</UiFormLabel>
        <SfTextarea
          v-model="footerBlock.column2.description"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          :placeholder="getEditorTranslation('column-2-description-placeholder')"
          data-testid="input-text-column-2"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="thirdColumnOpen"
      data-testid="third-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('column-3-group-label') }}</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('column-3-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.column3.title" type="text" data-testid="input-title-column-3">
            <template #suffix>
              <label for="input-title-column-3" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-3"
                  v-model="footerBlock.column3.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('column-3-description-label') }}</UiFormLabel>
        <SfTextarea
          v-model="footerBlock.column3.description"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          :placeholder="getEditorTranslation('column-3-description-placeholder')"
          data-testid="input-text-column-3"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="fourthColumnOpen"
      data-testid="fourth-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('column-4-group-label') }}</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('column-4-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.column4.title" type="text" data-testid="input-title-column-4">
            <template #suffix>
              <label for="input-title-column-4" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-4"
                  v-model="footerBlock.column4.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('column-4-description-label') }}</UiFormLabel>
        <SfTextarea
          v-model="footerBlock.column4.description"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          :placeholder="getEditorTranslation('column-4-description-placeholder')"
          data-testid="input-text-column-4"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="footNoteOpen"
      data-testid="footnote-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('footnotes-group-label') }}</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('footnotes-text-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.footnote" type="text" data-testid="input-footnote">
            <template #suffix>
              <label for="input-footnote" class="rounded-lg cursor-pointer">
                <input id="input-footnote" v-model="footerBlock.footnote" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('footnotes-align-label') }}</UiFormLabel>

        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': footerBlock.footnoteAlign === 'left' }"
            data-testid="footnoteAlign-textbox-y-align-left"
            @click="footerBlock.footnoteAlign = 'left'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: footerBlock.footnoteAlign !== 'left' }" />
            {{ getEditorTranslation('footnotes-align-option-left-label') }}
          </div>

          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': footerBlock.footnoteAlign === 'center' }"
            data-testid="footnoteAlign-textbox-y-align-center"
            @click="footerBlock.footnoteAlign = 'center'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: footerBlock.footnoteAlign !== 'center' }" />
            {{ getEditorTranslation('footnotes-align-option-center-label') }}
          </div>

          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': footerBlock.footnoteAlign === 'right' }"
            data-testid="footnoteAlign-textbox-y-align-right"
            @click="footerBlock.footnoteAlign = 'right'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: footerBlock.footnoteAlign !== 'right' }" />
            {{ getEditorTranslation('footnotes-align-option-right-label') }}
          </div>
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="footerColors"
      data-testid="color-column-section"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('colors-group-label') }}</h2>
      </template>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-text-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.colors.text" type="text" data-testid="text-color-select">
            <template #suffix>
              <label
                for="footer-text-color"
                :style="{ backgroundColor: footerBlock.colors.text }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input id="footer-text-color" v-model="footerBlock.colors.text" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-background-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.colors.background" type="text" data-testid="bg-footer-color-select">
            <template #suffix>
              <label
                for="bg-footer-color"
                :style="{ backgroundColor: footerBlock.colors.background }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="bg-footer-color"
                  v-model="footerBlock.colors.background"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-footnote-text-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.colors.footnoteText" type="text" data-testid="footnote-text-color-select">
            <template #suffix>
              <label
                for="footnote-text-color"
                :style="{ backgroundColor: footerBlock.colors.footnoteText }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="footnote-text-color"
                  v-model="footerBlock.colors.footnoteText"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-footnote-background-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="footerBlock.colors.footnoteBackground" type="text" data-testid="footnote-bg-color-select">
            <template #suffix>
              <label
                for="footnote-bg-color"
                :style="{ backgroundColor: footerBlock.colors.footnoteBackground }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input
                  id="footnote-bg-color"
                  v-model="footerBlock.colors.footnoteBackground"
                  type="color"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfSwitch, SfIconCheck } from '@storefront-ui/vue';
import type { FooterSettings } from './types';
const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const props = defineProps<{ uuid?: string }>();

const firstColumnOpen = ref(false);
const secondColumnOpen = ref(false);
const thirdColumnOpen = ref(false);
const fourthColumnOpen = ref(false);
const footNoteOpen = ref(false);
const footerColors = ref(false);

const getSourceBlock = () => {
  return findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value);
};

const sourceContent = getSourceBlock()?.content || {};
const footerBlock = ref(mapFooterData(sourceContent as FooterSettings));

const columnOneSwitches = FOOTER_SWITCH_DEFINITIONS.filter((config) => config.columnGroup === 'legal').map(
  (switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: switchConfig.editorTranslationKey,
    model: computed({
      get: () => footerBlock.value.column1[switchConfig.key] as boolean,
      set: (value: boolean) => {
        footerBlock.value.column1[switchConfig.key] = value;
      },
    }),
  }),
);

const columnTwoSwitches = FOOTER_SWITCH_DEFINITIONS.filter((config) => config.columnGroup === 'services').map(
  (switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: switchConfig.editorTranslationKey,
    model: computed({
      get: () => footerBlock.value.column2[switchConfig.key] as boolean,
      set: (value: boolean) => {
        footerBlock.value.column2[switchConfig.key] = value;
      },
    }),
  }),
);

watch(
  footerBlock,
  (updatedFooterBlock) => {
    const block = getSourceBlock();
    if (block) {
      block.content = updatedFooterBlock;
    }
  },
  { deep: true },
);
</script>

<i18n lang="json">
{
  "en": {
    "column-1-group-label": "First column",
    "column-1-title-label": "Title",
    "column-1-terms-and-conditions-label": "Show Terms and Conditions link",
    "column-1-cancellation-rights-label": "Show Cancellation Rights link",
    "column-1-cancellation-form-label": "Show Cancellation Form link",
    "column-1-legal-disclosure-label": "Show Legal Disclosure link",
    "column-1-privacy-policy-label": "Show Privacy Policy link",
    "column-1-declaration-of-accessibility-label": "Show Declaration of Accessibility link",

    "column-2-group-label": "Second column",
    "column-2-title-label": "Title",
    "column-2-contact-label": "Show Contact link",
    "column-2-register-label": "Show Register link",
    "column-2-description-label": "Description",
    "column-2-description-placeholder": "Description text for the second column",

    "column-3-group-label": "Third column",
    "column-3-title-label": "Title",
    "column-3-description-label": "Description",
    "column-3-description-placeholder": "Description text for the third column",

    "column-4-group-label": "Fourth column",
    "column-4-title-label": "Title",
    "column-4-description-label": "Description",
    "column-4-description-placeholder": "Description text for the fourth column",

    "footnotes-group-label": "Footnotes",
    "footnotes-text-label": "Footnotes text",
    "footnotes-align-label": "Footnote Alignment",
    "footnotes-align-option-left-label": "Left",
    "footnotes-align-option-center-label": "Center",
    "footnotes-align-option-right-label": "Right",

    "colors-group-label": "Colour",
    "colors-text-label": "Text colour",
    "colors-background-label": "Background colour",
    "colors-footnote-text-label": "Footnote Text colour",
    "colors-footnote-background-label": "Footnote Background colour"
  },
  "de": {
    "column-1-group-label": "First column",
    "column-1-title-label": "Title",
    "column-1-terms-and-conditions-label": "Show the link to Terms and Conditions",
    "column-1-cancellation-rights-label": "Show the link to Cancellation Rights",
    "column-1-cancellation-form-label": "Show the link to Cancellation Form",
    "column-1-legal-disclosure-label": "Show the link to Legal Disclosure",
    "column-1-privacy-policy-label": "Show the link to Privacy Policy",
    "column-1-declaration-of-accessibility-label": "Show the link to Declaration of Accessibility",

    "column-2-group-label": "Second column",
    "column-2-title-label": "Title",
    "column-2-show-contact-link-label": "Show the link to contact form",
    "column-2-show-register-link-label": "Show the link to register form",
    "column-2-description-label": "Description",
    "column-2-description-placeholder": "Description text for the second column",

    "column-3-group-label": "Third column",
    "column-3-title-label": "Title",
    "column-3-description-label": "Description",
    "column-3-description-placeholder": "Description text for the third column",

    "column-4-group-label": "Fourth column",
    "column-4-title-label": "Title",
    "column-4-description-label": "Description",
    "column-4-description-placeholder": "Description text for the fourth column",

    "footnotes-group-label": "Footnotes",
    "footnotes-text-label": "Footnotes text",
    "footnotes-align-label": "Footnote Alignment",
    "footnotes-align-option-left-label": "Left",
    "footnotes-align-option-center-label": "Center",
    "footnotes-align-option-right-label": "Right",

    "colors-group-label": "Colour",
    "colors-text-label": "Text colour",
    "colors-background-label": "Background color",
    "colors-footnote-text-label": "Footnote Text colour",
    "colors-footnote-background-label": "Footnote Background colour"
  }
}
</i18n>
