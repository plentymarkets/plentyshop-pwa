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
          <SfInput v-model="footerContent.column1.title" type="text" data-testid="input-title-column-1">
            <template #suffix>
              <label for="text-title-column-1" class="rounded-lg cursor-pointer">
                <input
                  id="text-title-column-1"
                  v-model="footerContent.column1.title"
                  type="text"
                  class="invisible w-8"
                />
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
      <div v-if="enableContractWithdrawalButton" class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel class="mb-1">
            {{ getEditorTranslation('column-1-contract-withdrawal-button-label') }}
          </UiFormLabel>
          <SfSwitch
            v-model="footerContent.column1.showCancellationForm"
            data-testid="showCancellationForm-switch"
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
          <SfInput v-model="footerContent.column2.title" type="text" data-testid="input-title-column-2">
            <template #suffix>
              <label for="input-title-column-2" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-2"
                  v-model="footerContent.column2.title"
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
        <EditorRichTextEditorForm
          :model-value="footerContent.column2.description ?? ''"
          :block-uuid="blockUuid"
          @update:model-value="footerContent.column2.description = $event"
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
          <SfInput v-model="footerContent.column3.title" type="text" data-testid="input-title-column-3">
            <template #suffix>
              <label for="input-title-column-3" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-3"
                  v-model="footerContent.column3.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <EditorRichTextEditorForm
          :model-value="footerContent.column3.description ?? ''"
          :block-uuid="blockUuid"
          @update:model-value="footerContent.column3.description = $event"
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
          <SfInput v-model="footerContent.column4.title" type="text" data-testid="input-title-column-4">
            <template #suffix>
              <label for="input-title-column-4" class="rounded-lg cursor-pointer">
                <input
                  id="input-title-column-4"
                  v-model="footerContent.column4.title"
                  type="text"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <EditorRichTextEditorForm
          :model-value="footerContent.column4.description ?? ''"
          :block-uuid="blockUuid"
          @update:model-value="footerContent.column4.description = $event"
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
          <SfInput v-model="footerContent.footnote" type="text" data-testid="input-footnote">
            <template #suffix>
              <label for="input-footnote" class="rounded-lg cursor-pointer">
                <input id="input-footnote" v-model="footerContent.footnote" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <EditorOptionsTabs
        v-model="footnoteAlignModel"
        :legend="getEditorTranslation('footnotes-align-label')"
        test-id-prefix="footnote-align"
        :options="footnoteAlignOptions"
      />
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
        <EditorColorPicker v-model="footerContent.colors.text" class="w-full">
          <template #trigger="{ color, toggle }">
            <label>
              <SfInput v-model="footerContent.colors.text" type="text" data-testid="text-color-select">
                <template #suffix>
                  <button
                    type="button"
                    class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </label>
          </template>
        </EditorColorPicker>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-background-label') }}</UiFormLabel>
        </div>
        <EditorColorPicker v-model="footerContent.colors.background" class="w-full">
          <template #trigger="{ color, toggle }">
            <label>
              <SfInput v-model="footerContent.colors.background" type="text" data-testid="bg-footer-color-select">
                <template #suffix>
                  <button
                    type="button"
                    class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </label>
          </template>
        </EditorColorPicker>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-footnote-text-label') }}</UiFormLabel>
        </div>
        <EditorColorPicker v-model="footerContent.colors.footnoteText" class="w-full">
          <template #trigger="{ color, toggle }">
            <label>
              <SfInput v-model="footerContent.colors.footnoteText" type="text" data-testid="footnote-text-color-select">
                <template #suffix>
                  <button
                    type="button"
                    class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </label>
          </template>
        </EditorColorPicker>
      </div>
      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('colors-footnote-background-label') }}</UiFormLabel>
        </div>
        <EditorColorPicker v-model="footerContent.colors.footnoteBackground" class="w-full">
          <template #trigger="{ color, toggle }">
            <label>
              <SfInput
                v-model="footerContent.colors.footnoteBackground"
                type="text"
                data-testid="footnote-bg-color-select"
              >
                <template #suffix>
                  <button
                    type="button"
                    class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                    :style="{ backgroundColor: color }"
                    @mousedown.stop
                    @click.stop="toggle"
                  />
                </template>
              </SfInput>
            </label>
          </template>
        </EditorColorPicker>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch } from '@storefront-ui/vue';
import type { FooterContent, FooterBlock } from './types';
import { FOOTER_SWITCH_DEFINITIONS } from './constants';

const { footer } = useBlocks();
const { blockUuid } = useSiteConfiguration();

const firstColumnOpen = ref(false);
const secondColumnOpen = ref(false);
const thirdColumnOpen = ref(false);
const fourthColumnOpen = ref(false);
const footNoteOpen = ref(false);
const footerColors = ref(false);
const { enableContractWithdrawalButton } = useRuntimeConfig().public;

const footerBlock = computed(() => footer.value as FooterBlock);
const footerContent = computed(() => footerBlock.value?.content as FooterContent);

const columnOneSwitches = FOOTER_SWITCH_DEFINITIONS.filter((config) => {
  if (config.columnGroup !== 'legal') return false;

  if (enableContractWithdrawalButton && config.key === 'showCancellationForm') {
    return false;
  }

  return true;
}).map((switchConfig) => ({
  id: `${switchConfig.key}-switch`,
  translationKey: switchConfig.editorTranslationKey,
  model: computed({
    get: () => footerContent.value?.column1[switchConfig.key] as boolean,
    set: (value: boolean) => {
      if (footerBlock.value?.content) {
        (footerBlock.value.content as FooterContent).column1[switchConfig.key] = value;
      }
    },
  }),
}));

const columnTwoSwitches = FOOTER_SWITCH_DEFINITIONS.filter((config) => config.columnGroup === 'services').map(
  (switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: switchConfig.editorTranslationKey,
    model: computed({
      get: () => footerContent.value?.column2[switchConfig.key] as boolean,
      set: (value: boolean) => {
        if (footerBlock.value?.content) {
          (footerBlock.value.content as FooterContent).column2[switchConfig.key] = value;
        }
      },
    }),
  }),
);

const { footnoteAlignModel, footnoteAlignOptions } = useEditorOptionsTabs(
  () => footerBlock.value,
  getEditorTranslation,
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
    "column-1-contract-withdrawal-button-label": "Show Contract Withdrawal Button",
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
    "column-1-cancellation-form-label": "Show Cancellation Form link",
    "column-1-contract-withdrawal-button-label": "Show Contract Withdrawal Button",
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
