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
          <UiFormLabel v-if="isCodeAsset" class="mb-1">
            {{ getEditorTranslation('snippet-name') }}
          </UiFormLabel>
          <UiFormLabel v-else class="mb-1">
            {{ getEditorTranslation('name') }}
          </UiFormLabel>
          <SfInput
            v-model="currentAsset.name"
            data-testid="slider-button-label"
            name="label"
            type="text"
            :placeholder="getEditorTranslation('button-text-placeholder')"
            @update:model-value="() => addOrUpdate(currentAsset)"
          />
        </label>
      </div>
      <div v-if="currentAsset.type === 'javascript'" class="mb-4">
        <UiFormLabel class="mb-1">
          {{ getEditorTranslation('placement') }}
        </UiFormLabel>
        <SfSelect v-model="currentAsset.placement" size="base" @update:model-value="() => addOrUpdate(currentAsset)">
          <option v-for="{ value, label } in scriptPlacement" :key="value" :value="value">
            {{ label }}
          </option>
        </SfSelect>
      </div>
      <div class="flex justify-between items-center mb-1">
        <UiFormLabel v-if="currentAsset.type === 'css'">
          {{ getEditorTranslation('custom-css') }}
        </UiFormLabel>
        <UiFormLabel v-else-if="currentAsset.type === 'javascript'">
          {{ getEditorTranslation('custom-js') }}
        </UiFormLabel>
        <UiFormLabel v-else-if="currentAsset.type === 'meta'">
          {{ getEditorTranslation('content') }}
        </UiFormLabel>
        <UiFormLabel v-else-if="currentAsset.type === 'external'">
          {{ getEditorTranslation('source-url') }}
        </UiFormLabel>
        <button
          v-if="isCodeAsset"
          type="button"
          class="format-button"
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
        :placeholder="
          currentAsset.type === 'meta' ? getEditorTranslation('content') : getEditorTranslation('source-url')
        "
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
import { SfDrawer, SfIconDelete, SfIconChevronLeft, SfInput, SfSelect } from '@storefront-ui/vue';
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
    "custom-css": "Custom CSS",
    "custom-js": "Custom JS",
    "content": "Content",
    "source-url": "Source URL",
    "format-code": "Format Code",
    "formatting": "Formatting..."
  },
  "de": {
    "snippet-name": "Snippet Name",
    "name": "Name",
    "button-text-placeholder": "label",
    "delete": "Löschen",
    "custom-css": "Custom CSS",
    "custom-js": "Custom JS",
    "content": "Inhalt",
    "source-url": "Quell-URL",
    "format-code": "Code formatieren",
    "formatting": "Formatierung läuft..."
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
