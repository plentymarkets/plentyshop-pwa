<template>
  <SfDrawer
    v-model="open"
    class="asset-drawer h-screen bg-white border-0 shadow-[inset_0px_0px_20px_-20px_#111] category-drawer !absolute ml-[100%] w-[630px] min-w-[500px]"
    :placement="placement"
    :disable-click-away="true"
    :class="[{ 'max-w-[370px]': placement === 'left' || placement === 'right' }]"
  >
    <div class="px-4 py-5 border-b flex justify-between items-center">
      <h3 class="font-bold typography-headline-3 truncate overflow-hidden whitespace-nowrap max-w-[75%]">
        <span>{{ currentAsset.name }}</span>
      </h3>
      <SfIconChevronLeft class="cursor-pointer flex-shrink-0 ml-2" @click="selectAsset({} as Asset)" />
    </div>
    <div class="p-4">
      <div class="mb-4">
        <label>
          <UiFormLabel class="flex gap-1 items-center">
            <div>{{ isCodeAsset ? getEditorTranslation('snippet-name') : getEditorTranslation('name') }}</div>
            <SfTooltip
              :label="getEditorTranslation('snippet-name-tooltip-' + currentAsset.type)"
              placement="right"
              :show-arrow="true"
              class="flex"
            >
              <SfIconInfo class="cursor-pointer" size="sm" />
            </SfTooltip>
          </UiFormLabel>
          <SfInput
            v-model="currentAsset.name"
            data-testid="slider-button-label"
            name="label"
            type="text"
            @update:model-value="() => addOrUpdate(currentAsset)"
          />
        </label>
      </div>
      <div v-if="currentAsset.type === 'javascript'" class="mb-4">
        <div class="flex items-center gap-2 mb-1">
          <UiFormLabel class="m-0">
            {{ getEditorTranslation('placement') }}
          </UiFormLabel>
          <SfTooltip class="z-50" :label="getEditorTranslation('tooltip-text')" placement="right">
            <span class="flex items-center">
              <SfIconInfo size="sm" />
            </span>
          </SfTooltip>
        </div>
        <SfSelect
          v-model="currentAsset.placement"
          data-testid="script-placement-select"
          size="base"
          @update:model-value="() => addOrUpdate(currentAsset)"
        >
          <option v-for="{ value, label } in scriptPlacement" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </div>
      <div class="flex justify-between items-center mb-1">
        <UiFormLabel class="flex flex-col justify-center">
          <div class="flex gap-1">
            <div>{{ getEditorTranslation('custom-' + currentAsset.type) }}</div>
            <SfTooltip
              :label="getEditorTranslation('content-tooltip-' + currentAsset.type)"
              placement="right"
              :show-arrow="true"
              class="flex"
            >
              <SfIconInfo class="cursor-pointer" size="sm" />
            </SfTooltip>
          </div>
          <div class="text-sm">{{ getEditorTranslation('content-hint-' + currentAsset.type) }}</div>
        </UiFormLabel>
        <button
          v-if="isCodeAsset"
          type="button"
          class="format-button flex-shrink-0"
          :disabled="codeEditorRef?.formatting"
          @click="handleFormatCode"
        >
          {{ codeEditorRef?.formatting ? getEditorTranslation('formatting') : getEditorTranslation('format-code') }}
        </button>
      </div>

      <EditorCodeEditor
        v-if="isCodeAsset"
        ref="codeEditorRef"
        v-model="currentAsset.content"
        :language="currentAsset.type as AssetType"
        class="mb-4"
        @update:model-value="() => addOrUpdate(currentAsset)"
      />

      <textarea
        v-else
        v-model="currentAsset.content"
        class="w-full h-32 p-2 border border-gray-300 rounded-md mb-4 font-mono text-sm"
        @input="() => addOrUpdate(currentAsset)"
      />

      <button
        type="button"
        data-testid="add-page-btn"
        class="border border-editor-button p-2 rounded-md flex items-center justify-center gap-1 text-editor-button"
        @click="deleteAsset(currentAsset)"
      >
        <SfIconDelete />
        {{ getEditorTranslation('delete') }}
      </button>
    </div>
  </SfDrawer>
</template>

<script setup lang="ts">
import {
  SfDrawer,
  SfIconDelete,
  SfIconChevronLeft,
  SfInput,
  SfSelect,
  SfTooltip,
  SfIconInfo,
} from '@storefront-ui/vue';
import type { Asset, AssetType } from '@plentymarkets/shop-api';
import type { CodeEditorExposed } from '~/components/AssetDrawer/types';

const { currentAsset, selectAsset, addOrUpdate, deleteAsset } = useCustomAssets();

const placement = ref<'left' | 'right'>('left');
const open = ref(true);

const scriptPlacement = [
  { label: 'Header', value: 'head_end' },
  { label: 'Footer', value: 'body_end' },
];

const codeEditorRef = ref<CodeEditorExposed | null>(null);

const isCodeAsset = computed(() => currentAsset.value.type === 'css' || currentAsset.value.type === 'javascript');

const handleFormatCode = () => {
  if (codeEditorRef.value) {
    codeEditorRef.value.formatCode();
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "snippet-name": "Snippet name",
    "name": "Name",
    "button-text-placeholder": "label",
    "delete": "Delete",
    "placement": "Where to load",
    "custom-css": "Custom CSS",
    "snippet-name-tooltip-css": "You can use the name to identify the code snippet.",
    "content-tooltip-css": "Changes apply globally. Changes apply immediately after saving. Code is not validated.",
    "content-hint-css": "Standard CSS syntax. No style statement required.",
    "custom-javascript": "Custom JS",
    "snippet-name-tooltip-javascript": "You can use the name to identify the code snippet.",
    "content-tooltip-javascript": "Changes apply globally. Changes apply immediately after saving. Code is not validated.",
    "content-hint-javascript": "Standard JS syntax. Script statement is optional and can be customised.",
    "custom-meta": "Content",
    "snippet-name-tooltip-meta": "Specifies the name attribute of the HTML meta tag. Used to identify the metadata type (e.g. description, robots). You can use the name to identify the code snippet.",
    "content-tooltip-meta": "Specifies the content value of the meta tag. This is the actual metadata provided to browsers and search engines.",
    "content-hint-meta": "Plain text",
    "custom-external": "Source URL",
    "snippet-name-tooltip-external": "You can use the name to identify the code snippet.",
    "content-tooltip-external": "Provide the URL of the external script or stylesheet. No validation is applied.",
    "content-hint-external": "Full URL starting with http:// or https://",
    "tooltip-text": "Choose where to load the JavaScript snippet:\nHeader: Runs before the page is fully loaded. Use for scripts that must load early.\nFooter: Runs after the page is fully loaded. Safer for scripts that interact with page elements.",
    "source-url": "Source URL",
    "format-code": "Format Code",
    "formatting": "Formatting..."
  },
  "de": {
    "snippet-name": "Snippet name",
    "name": "Name",
    "button-text-placeholder": "label",
    "delete": "Delete",
    "placement": "Where to load",
    "custom-css": "Custom CSS",
    "snippet-name-tooltip-css": "You can use the name to identify the code snippet.",
    "content-tooltip-css": "Changes apply globally. Changes apply immediately after saving. Code is not validated.",
    "content-hint-css": "Standard CSS syntax. No style statement required.",
    "custom-javascript": "Custom JS",
    "snippet-name-tooltip-javascript": "You can use the name to identify the code snippet.",
    "content-tooltip-javascript": "Changes apply globally. Changes apply immediately after saving. Code is not validated.",
    "content-hint-javascript": "Standard JS syntax. Script statement is optional and can be customised.",
    "custom-meta": "Content",
    "snippet-name-tooltip-meta": "Specifies the name attribute of the HTML meta tag. Used to identify the metadata type (e.g. description, robots). You can use the name to identify the code snippet.",
    "content-tooltip-meta": "Specifies the content value of the meta tag. This is the actual metadata provided to browsers and search engines.",
    "content-hint-meta": "Plain text",
    "custom-external": "Source URL",
    "snippet-name-tooltip-external": "You can use the name to identify the code snippet.",
    "content-tooltip-external": "Provide the URL of the external script or stylesheet. No validation is applied.",
    "content-hint-external": "Full URL starting with http:// or https://",
    "tooltip-text": "Choose where to load the JavaScript snippet:\nHeader: Runs before the page is fully loaded. Use for scripts that must load early.\nFooter: Runs after the page is fully loaded. Safer for scripts that interact with page elements.",
    "source-url": "Source URL",
    "format-code": "Format Code",
    "formatting": "Formatting..."
  }
}
</i18n>

<style scoped>
.format-button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.format-button:hover:not(:disabled) {
  background: #1565c0;
}

.format-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
