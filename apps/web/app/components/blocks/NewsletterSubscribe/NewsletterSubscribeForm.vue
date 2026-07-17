<template>
  <EditorFormPanel v-model="textGroup" :title="getEditorTranslation('text-group-label')">
    <div>
      <EditorRichTextEditorForm
        :model-value="newsletterBlock.text.htmlDescription ?? ''"
        :text-align="newsletterBlock.text.textAlignment ?? 'center'"
        @update:model-value="newsletterBlock.text.htmlDescription = $event"
      />
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
  </EditorFormPanel>
  <EditorFormPanel v-model="buttonGroup" :title="getEditorTranslation('button-group-label')">
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
  </EditorFormPanel>
  <div>
    <EditorFormPanel v-model="settingsGroup" :title="getEditorTranslation('settings-group-label')">
      <div class="mb-6">
        <div class="mb-2 flex items-center gap-2">
          <div class="flex items-center">
            <UiFormLabel class="mb-0 mr-2 inline-block">{{
              getEditorTranslation('email-folder-id-label')
            }}</UiFormLabel>
            <SfTooltip :label="getEditorTranslation('newsletter-form-email-folder-id-tooltip')" class="inline-flex">
              <SfIconInfo size="sm" />
            </SfTooltip>
          </div>
        </div>
        <SfInput
          v-model="newsletterBlock.settings.emailFolderId"
          name="emailFolderId"
          type="number"
          :placeholder="getEditorTranslation('email-folder-id-label')"
          data-testid="newsletter-form-email-folder-id"
          min="1"
        />
      </div>
      <div class="mb-6">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
        <EditorColorPicker v-model="newsletterBlock.text.bgColor" class="w-full">
          <template #trigger="{ color, toggle }">
            <SfInput v-model="newsletterBlock.text.bgColor" type="text" data-testid="newsletter-form-background-color">
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
          </template>
        </EditorColorPicker>
      </div>
    </EditorFormPanel>
    <EditorFormPanel
      v-model="layoutOpen"
      :title="getEditorTranslation('layout-label')"
      data-testid="slider-button-group-title"
    >
      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    </EditorFormPanel>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch, SfTooltip, SfIconInfo } from '@storefront-ui/vue';
import type { NewsletterSubscribeContent } from './types';
import { initializeNewsletterContent } from './utils';

const textGroup = ref(true);
const buttonGroup = ref(true);
const props = defineProps<{ uuid?: string }>();

const settingsGroup = ref(true);
const layoutOpen = ref(true);

const { allBlocks: data } = useBlocks();

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const newsletterBlock = computed<NewsletterSubscribeContent>(() => {
  const uuid = props.uuid || blockUuid.value;
  const rawContent = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};
  return initializeNewsletterContent(rawContent as Partial<NewsletterSubscribeContent>);
});

const { isFullWidth } = useFullWidthToggleForContent(newsletterBlock);
</script>

<i18n lang="json">
{
  "en": {
    "text-group-label": "Text",
    "ask-name-label": "Ask for subscriber's name",
    "display-name-input-label": "Display name input",
    "name-required-label": "Input is required",
    "email-folder-id-label": "Email folder ID",
    "button-group-label": "Button",
    "button-text-label": "Text",
    "button-text-placeholder": "label",
    "newsletter-form-email-folder-id-tooltip": "Find the ID of the email folder in your PlentyONE system under Setup » CRM » Newsletter » Recipient lists.",
    "settings-group-label": "Settings",
    "background-color-label": "Background Color",
    "layout-label": "Layout"
  },
  "de": {
    "text-group-label": "Text",
    "ask-name-label": "Ask for subscriber's name",
    "display-name-input-label": "Display name input",
    "name-required-label": "Input is required",
    "email-folder-id-label": "Email folder ID",
    "button-group-label": "Button",
    "button-text-label": "Text",
    "button-text-placeholder": "label",
    "newsletter-form-email-folder-id-tooltip": "Find the ID of the email folder in your PlentyONE system under Setup » CRM » Newsletter » Recipient lists.",
    "settings-group-label": "Settings",
    "background-color-label": "Background Color",
    "layout-label": "Layout"
  }
}
</i18n>
