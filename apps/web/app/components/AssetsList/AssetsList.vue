<template>
  <div>
    <div v-if="snippets.length === 0">
      <p class="mb-4">No snippets added yet</p>
      <button
        type="button"
        data-testid="add-page-btn"
        class="border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
        @click="onAdd"
      >
        <SfIconAdd />
        {{ getEditorTranslation('add-snippet-label') }}
      </button>
    </div>

    <div v-else class="space-y-3">
      <draggable
        v-model="snippets"
        item-key="uuid"
        handle=".drag-slides-handle"
        class="p-2 rounded"
        filter=".no-drag"
        :animation="150"
        :ghost-class="'opacity-50'"
      >
        <template #item="{ element: asset, index }">
          <div :key="asset.uuid" class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <button
                  class="drag-slides-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-slide-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>
                <span class="font-medium">{{ asset.name || 'Snippet' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="p-1 rounded hover:bg-gray-100" @click="selectAsset(asset)">
                  <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path :d="editPath" fill="black" />
                    </svg>
                  </SfIconBase>
                </button>
                <SfSwitch
                  :model-value="asset.isActive"
                  class="checked:bg-editor-button checked:before:hover:bg-editor-button"
                  @update:model-value="onToggle(asset, !asset.isActive)"
                />
              </div>
            </div>

            <div class="grid grid-cols-[auto,1fr] border rounded-lg max-h-24 overflow-scroll">
              <pre
                class="m-0 py-3 pl-3 pr-2 text-right select-none text-gray-500 bg-gray-50 font-mono text-sm leading-5 whitespace-pre"
                >{{ lineNumbers[asset.uuid] }}</pre
              >
              <textarea
                :id="`snippet-${asset.uuid}-overview`"
                :value="asset.content"
                readonly
                :rows="4"
                name="snippet-overview"
                class="w-full p-3 font-mono text-sm leading-5 outline-none resize-none opacity-40 bg-gray-50"
              />
            </div>
          </div>
        </template>
      </draggable>

      <button
        type="button"
        data-testid="add-page-btn"
        class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
        @click="onAdd"
      >
        <SfIconAdd />
        {{ getEditorTranslation('add-snippet-label') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd, SfIconBase, SfSwitch } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { editPath } from '~/assets/icons/paths/edit';
import type { AssetsListProps } from '~/components/AssetsList/types';
import type { Asset} from '@plentymarkets/shop-api';

const { getAssetsOfType, addOrUpdate, selectAsset } = useCustomAssets();
const props = defineProps<AssetsListProps>();

const snippets = computed({
  get: () => {
    return getAssetsOfType(props.type);
  },
  set: (option) => {
    if (Array.isArray(option)) {
      option.forEach((asset, index) => {
        addOrUpdate({
          ...asset,
          order: index,
        });
      });
    } else {
      addOrUpdate(option);
    }
  },
});

const lineNumbers = reactive<Record<string | number, string>>({});

watch(
  snippets,
  (list) => {
    for (const asset of list) {
      const lines = Math.max(4, (asset.content || '').split('\n').length);
      lineNumbers[asset.uuid || ''] = Array.from({ length: lines }, (_, i) => String(i + 1)).join('\n');
    }
  },
  { immediate: true, deep: true },
);

const onAdd = () => {
  const newAsset = {
    type: props.type,
    name: 'New snippet',
    content: '',
    isActive: false,
    placement: 'head_end',
    scope: null,
    attributes: null,
    language: null,
    assetKey: null,
    order: snippets.value.length,
  } as Asset;

  addOrUpdate(newAsset);
};

const onToggle = (asset: Asset, value: boolean) => addOrUpdate({ ...asset, isActive: value }, false);
</script>

<i18n lang="json">
{
  "en": {
    "label": "CSS Code",
    "add-snippet-label": "Add snippet",
    "tooltip": "Add your custom CSS code here. It will be injected into the head section of your shop.",
    "drag-reorder-aria": "Drag to reorder"
  },
  "de": {
    "label": "CSS Code",
    "add-snippet-label": "Add snippet",
    "tooltip": "Add your custom CSS code here. It will be injected into the head section of your shop.",
    "drag-reorder-aria": "Drag to reorder"
  }
}
</i18n>
