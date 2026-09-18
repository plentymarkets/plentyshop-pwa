<template>
  <div data-testid="details-list-form" class="block-details-list-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="resolvedUuid"
        :min-items="1"
        :section-label="getEditorTranslation('items-label')"
        :add-button-label="getEditorTranslation('add-item-label')"
        :custom-label="itemLabelFor"
        :quick-add-options="detailsListQuickAddOptions"
        @edit-element="editItem"
      />

      <EditorFormPanel v-model="itemSettingsOpen" :title="getEditorTranslation('item-settings-label')">
        <div class="py-2">
          <UiFormLabel>{{ getEditorTranslation('selected-item-label') }}</UiFormLabel>
          <select
            v-model="selectedItemUuid"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            data-testid="details-list-selected-item"
          >
            <option value="" disabled>{{ getEditorTranslation('select-placeholder') }}</option>
            <option v-for="option in itemOptions" :key="option.uuid" :value="option.uuid">
              {{ option.label }}
            </option>
          </select>
        </div>

        <template v-if="selectedItem">
          <div class="py-2">
            <UiFormLabel>{{ getEditorTranslation('item-label-label') }}</UiFormLabel>
            <SfInput v-model="selectedItemLabel" type="text" data-testid="details-list-item-label" />
          </div>

          <div class="py-2 flex items-center justify-between">
            <UiFormLabel>{{ getEditorTranslation('item-default-open-label') }}</UiFormLabel>
            <SfSwitch v-model="selectedItemDefaultOpen" data-testid="details-list-item-default-open" />
          </div>
        </template>
      </EditorFormPanel>

      <EditorFormPanel v-model="layoutOpen" :title="getEditorTranslation('layout-label')">
        <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="resolvedUuid" />
      </EditorFormPanel>
    </div>

    <div v-else class="space-y-0">
      <component :is="blockForm" :uuid="editingBlock.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch } from '@storefront-ui/vue';
import type { Block } from '@plentymarkets/shop-api';
import type { DetailsListProps, DetailsListFormProps, DetailsListItemConfiguration } from './types';
import { getDetailsListItemLabel } from './helpers';

const props = defineProps<DetailsListFormProps>();

const { blockUuid } = useSiteConfiguration();
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { pushEdit } = useBlockEditStack();

const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const elementsOpen = ref(true);
const itemSettingsOpen = ref(true);
const layoutOpen = ref(true);
const selectedItemUuid = ref<string>('');
const editItem = (block: Block) => pushEdit(block);
const itemLabelPrefix = getEditorTranslation('item-label');

const { editingBlock, blockForm } = useNestedBlockForm(resolvedUuid);

const detailsListStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, resolvedUuid.value) || {}) as DetailsListProps,
);

const items = computed(() => detailsListStructure.value?.content?.map((item) => item) ?? []);

const itemOptions = computed(() =>
  items.value.map((item, index) => ({
    uuid: item.meta.uuid,
    label: getDetailsListItemLabel(item, index, itemLabelPrefix),
  })),
);

const detailsListConfiguration = computed(() => detailsListStructure.value.configuration ?? {});

const { isFullWidth } = useFullWidthToggleForConfig(detailsListConfiguration);

const selectedItem = computed(() => {
  if (!selectedItemUuid.value) {
    return null;
  }
  return items.value.find((item) => item.meta.uuid === selectedItemUuid.value) ?? null;
});

const ensureDetailsSettings = (block: Block) => {
  if (!block.configuration) {
    block.configuration = { visible: true };
  }
  const config = block.configuration as DetailsListItemConfiguration;
  const detailsSettings = config.detailsSettings ?? {};
  if (typeof detailsSettings.label !== 'string') {
    detailsSettings.label = '';
  }
  if (typeof detailsSettings.defaultOpen !== 'boolean') {
    detailsSettings.defaultOpen = false;
  }
  config.detailsSettings = detailsSettings;
  return detailsSettings;
};

const selectedItemLabel = computed({
  get: () => {
    if (!selectedItem.value) {
      return '';
    }
    return ensureDetailsSettings(selectedItem.value).label ?? '';
  },
  set: (value: string) => {
    if (!selectedItem.value) {
      return;
    }
    ensureDetailsSettings(selectedItem.value).label = value;
  },
});

const selectedItemDefaultOpen = computed({
  get: () => {
    if (!selectedItem.value) {
      return false;
    }
    return ensureDetailsSettings(selectedItem.value).defaultOpen ?? false;
  },
  set: (value: boolean) => {
    if (!selectedItem.value) {
      return;
    }
    ensureDetailsSettings(selectedItem.value).defaultOpen = value;
  },
});

const itemLabelFor = (block: Block) => {
  const index = items.value.findIndex((item) => item.meta.uuid === block.meta.uuid);
  return getDetailsListItemLabel(block, index, itemLabelPrefix);
};
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",
    "items-label": "Items",
    "add-item-label": "Add Item",
    "item-settings-label": "Item Settings",
    "selected-item-label": "Selected Item",
    "select-placeholder": "Please select an item",
    "item-label": "Item",
    "item-label-label": "Item label",
    "item-default-open-label": "Open by default"
  },
  "de": {
    "layout-label": "Layout",
    "items-label": "Items",
    "add-item-label": "Add Item",
    "item-settings-label": "Item Settings",
    "selected-item-label": "Selected Item",
    "select-placeholder": "Please select an item",
    "item-label": "Item",
    "item-label-label": "Item label",
    "item-default-open-label": "Open by default"
  }
}
</i18n>
