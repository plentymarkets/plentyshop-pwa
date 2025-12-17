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
          <UiFormLabel class="mb-1">{{ getEditorTranslation('button-text-label') }}</UiFormLabel>
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
      <div class="flex justify-between items-center mb-1">
        <UiFormLabel>{{ getEditorTranslation('custom-css') }}</UiFormLabel>
        <button
          type="button"
          class="format-button"
          :disabled="codeEditorRef?.formatting"
          @click="handleFormatCode"
        >
          {{ codeEditorRef?.formatting ? getEditorTranslation('formatting') : getEditorTranslation('format-code') }}
        </button>
      </div>

      <EditorCodeEditor
        ref="codeEditorRef"
        v-model="currentAsset.content"
        :language="currentAsset.type as ('css' | 'javascript' | 'meta' | 'external')"
        class="mb-4"
        @update:model-value="() => addOrUpdate(currentAsset)"
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
import { SfDrawer, SfIconDelete, SfIconChevronLeft, SfInput } from '@storefront-ui/vue';
import type { Asset} from '@plentymarkets/shop-api';

const { currentAsset, selectAsset, addOrUpdate, deleteAsset } = useCustomAssets();

const placement = ref<'left' | 'right'>('left');
const open = ref(true);

const codeEditorRef = ref<{ formatCode: () => void; formatting: Ref<boolean> } | null>(null);

const handleFormatCode = () => {
  if (codeEditorRef.value) {
    codeEditorRef.value.formatCode();
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "button-text-label": "Snippet name",
    "button-text-placeholder": "label",
    "delete": "Delete",
    "custom-css": "Custom CSS",
    "format-code": "Format Code",
    "formatting": "Formatting..."
  },
  "de": {
    "button-text-label": "Snippet name",
    "button-text-placeholder": "label",
    "delete": "Delete",
    "custom-css": "Custom CSS",
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

