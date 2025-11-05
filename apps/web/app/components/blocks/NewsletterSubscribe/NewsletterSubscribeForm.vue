<template>
  <div>
    <UiAccordionItem
      v-model="textGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('text-group-label') }}</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
          <SfInput
            v-model="newsletterBlock.text.title"
            name="maintitle"
            type="text"
            :placeholder="getEditorTranslation('main-title-placeholder')"
            data-testid="newsletter-form-title"
          />
        </div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('description-label') }}</UiFormLabel>
          <SfTextarea
            v-model="newsletterBlock.text.htmlDescription"
            name="description"
            type="text"
            class="w-full min-h-[232px]"
            :placeholder="getEditorTranslation('description-placeholder')"
            data-testid="newsletter-form-description"
          />
        </div>
        <div class="mb-4">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('ask-name-label') }}</UiFormLabel>
        </div>
        <div class="mb-4">
          <label for="display-name-input" class="flex items-center">
            <SfSwitch
              v-model="newsletterBlock.input.displayNameInput"
              data-testid="newsletter-form-display-name"
              @change="
                newsletterBlock.input.displayNameInput === false ? (newsletterBlock.input.nameIsRequired = false) : null
              "
            />
            <span class="text-sm ml-2 align-top cursor-pointer font-body">{{
              getEditorTranslation('display-name-input-label')
            }}</span>
          </label>
        </div>
        <div class="mb-6">
          <label for="name-input-required" class="flex items-center">
            <SfSwitch
              v-model="newsletterBlock.input.nameIsRequired"
              :disabled="!newsletterBlock.input.displayNameInput"
              data-testid="newsletter-form-mandatory-name"
            />
            <span class="text-sm ml-2 align-top cursor-pointer font-body">{{
              getEditorTranslation('name-required-label')
            }}</span>
          </label>
        </div>
      </div>
    </UiAccordionItem>
  </div>
  <div>
    <UiAccordionItem
      v-model="buttonGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('button-group-label') }}</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('button-text-label') }}</UiFormLabel>
          <SfInput
            v-model="newsletterBlock.button.label"
            name="label"
            type="text"
            :placeholder="getEditorTranslation('button-text-placeholder')"
            data-testid="newsletter-form-button-text"
          />
        </div>
      </div>
    </UiAccordionItem>
  </div>
  <div>
    <UiAccordionItem
      v-model="settingsGroup"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('settings-group-label') }}</h2>
      </template>

      <div>
        <div class="mb-6">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('background-color-label') }}</UiFormLabel>

          <SfInput v-model="newsletterBlock.text.bgColor" type="text" data-testid="newsletter-form-background-color">
            <template #suffix>
              <label
                for="text-color"
                :style="{ backgroundColor: newsletterBlock.text.bgColor }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input id="text-color" v-model="newsletterBlock.text.bgColor" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfTextarea, SfSwitch } from '@storefront-ui/vue';
import type { NewsletterSubscribeContent } from './types';

const textGroup = ref(true);
const buttonGroup = ref(true);
const settingsGroup = ref(true);

const route = useRoute();
const { data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const newsletterBlock = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content || {}) as NewsletterSubscribeContent,
);
</script>

<i18n lang="json">
{
  "en": {
    "text-group-label": "Text",
    "main-title-label": "Main Title",
    "main-title-placeholder": "maintitle",
    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",
    "ask-name-label": "Ask for subscriber's name",
    "display-name-input-label": "Display name input",
    "name-required-label": "Input is required",

    "button-group-label": "Button",
    "button-text-label": "Text",
    "button-text-placeholder": "label",

    "settings-group-label": "Settings",
    "background-color-label": "Background Color"
  },
  "de": {
    "text-group-label": "Text",
    "main-title-label": "Main Title",
    "main-title-placeholder": "maintitle",
    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",
    "ask-name-label": "Ask for subscriber's name",
    "display-name-input-label": "Display name input",
    "name-required-label": "Input is required",

    "button-group-label": "Button",
    "button-text-label": "Text",
    "button-text-placeholder": "label",

    "settings-group-label": "Settings",
    "background-color-label": "Background Color"
  }
}
</i18n>
