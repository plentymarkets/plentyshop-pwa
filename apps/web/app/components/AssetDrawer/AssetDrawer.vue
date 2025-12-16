<template>
  <SfDrawer
    v-model="open"
    class="asset-drawer bg-white border-0 shadow-[inset_0px_0px_20px_-20px_#111] category-drawer !absolute ml-[100%] w-[630px] min-w-[500px]"
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
      <UiFormLabel class="mb-1">{{ getEditorTranslation('custom-css') }}</UiFormLabel>

      <EditorCodeEditor
        v-model="currentAsset.content"
        language="css"
        class="mb-4"
        @update:model-value="() => addOrUpdate(currentAsset)"
      />

      <button
        type="button"
        data-testid="add-page-btn"
        class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
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
</script>

<i18n lang="json">
{
  "en": {
    "button-text-label": "Snippet name",
    "button-text-placeholder": "label",
    "custom-css": "Custom CSS"
  },
  "de": {
    "button-text-label": "Snippet name",
    "button-text-placeholder": "label",
    "custom-css": "Custom CSS"
  }
}
</i18n>
