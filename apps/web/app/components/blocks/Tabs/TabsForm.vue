<template>
  <div data-testid="tabs-structure-form" class="block-tabs-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="resolvedUuid"
        :min-items="1"
        :section-label="getEditorTranslation('tabs-label')"
        :add-button-label="getEditorTranslation('add-tab-label')"
        :custom-label="tabLabelFor"
        @edit-element="editTab"
      />

      <EditorFormPanel v-model="designOpen" :title="getEditorTranslation('design-label')">
        <div class="py-2">
          <UiFormLabel>{{ getEditorTranslation('tab-style-label') }}</UiFormLabel>
          <select
            v-model="tabStyle"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            data-testid="tabs-style"
          >
            <option value="underline">{{ getEditorTranslation('style-underline') }}</option>
            <option value="pills">{{ getEditorTranslation('style-pills') }}</option>
            <option value="vertical">{{ getEditorTranslation('style-vertical') }}</option>
          </select>
        </div>
      </EditorFormPanel>

      <EditorFormPanel v-model="tabSettingsOpen" :title="getEditorTranslation('tab-settings-label')">
        <div class="py-2">
          <UiFormLabel>{{ getEditorTranslation('selected-tab-label') }}</UiFormLabel>
          <select
            v-model="selectedTabUuid"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            data-testid="tabs-selected-tab"
          >
            <option value="" disabled>{{ getEditorTranslation('select-placeholder') }}</option>
            <option v-for="option in tabsOptions" :key="option.uuid" :value="option.uuid">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div v-if="selectedTab" class="py-2">
          <UiFormLabel>{{ getEditorTranslation('tab-name-label') }}</UiFormLabel>
          <SfInput v-model="selectedTabName" type="text" data-testid="tabs-tab-name" />
        </div>
      </EditorFormPanel>

      <EditorFormPanel v-model="layoutOpen" :title="getEditorTranslation('layout-label')">
        <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="resolvedUuid" />

        <div v-if="supportsAlignment" class="py-2">
          <EditorOptionsTabs
            v-model="tabsAlignment"
            :legend="getEditorTranslation('tabs-alignment-label')"
            test-id-prefix="tabs-alignment"
            :options="tabsAlignmentOptions"
          />
        </div>

        <div v-if="tabStyle === 'underline'" class="py-2 flex items-center justify-between">
          <UiFormLabel>{{ getEditorTranslation('show-border-under-tabs-label') }}</UiFormLabel>
          <SfSwitch v-model="showBorderUnderTabs" data-testid="tabs-show-border-under-tabs" />
        </div>
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
import type { TabsAlignment, TabStyle, TabsProps, TabsFormProps } from './types';
import { getTabLabel } from './helpers';

const props = defineProps<TabsFormProps>();

const { blockUuid } = useSiteConfiguration();
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { pushEdit } = useBlockEditStack();

const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const elementsOpen = ref(true);
const designOpen = ref(true);
const tabSettingsOpen = ref(true);
const layoutOpen = ref(true);
const selectedTabUuid = ref<string>('');
const editTab = (block: Block) => pushEdit(block);
const tabLabelPrefix = getEditorTranslation('tab-label');

const { editingBlock, blockForm } = useNestedBlockForm(resolvedUuid);

const tabsStructure = computed(() => (findOrDeleteBlockByUuid(data.value, resolvedUuid.value) || {}) as TabsProps);

const tabs = computed(() => tabsStructure.value?.content?.map((tab) => tab) ?? []);

const tabsOptions = computed(() =>
  tabs.value.map((tab, index) => ({
    uuid: tab.meta.uuid,
    label: getTabLabel(tab, index, tabLabelPrefix),
  })),
);

const tabsConfiguration = computed(() => tabsStructure.value.configuration ?? {});

const { isFullWidth } = useFullWidthToggleForConfig(tabsConfiguration);

const layout = computed(() => tabsConfiguration.value.layout);

const tabStyle = computed<TabStyle>({
  get: () => layout.value?.tabStyle ?? 'underline',
  set: (value) => (layout.value!.tabStyle = value),
});

const showBorderUnderTabs = computed({
  get: () => layout.value?.showBorderUnderTabs !== false,
  set: (value: boolean) => (layout.value!.showBorderUnderTabs = value),
});

const tabsAlignment = computed<TabsAlignment>({
  get: () => layout.value?.tabsAlignment ?? 'left',
  set: (value) => (layout.value!.tabsAlignment = value),
});

const supportsAlignment = computed(() => ['underline', 'pills'].includes(tabStyle.value));

const tabsAlignmentOptions = computed(() =>
  (['left', 'center', 'right'] as const).map((value) => ({
    value,
    label: getEditorTranslation(`position-${value}`),
    testId: `tabs-align-${value}`,
  })),
);

const selectedTab = computed(() => {
  if (!selectedTabUuid.value) return null;
  return tabs.value.find((tab) => tab.meta.uuid === selectedTabUuid.value) ?? null;
});

const ensureTabSettings = (block: Block) => {
  if (!block.configuration) block.configuration = { visible: true };
  const config = block.configuration as Record<string, unknown>;
  const tabSettings = (config.tabSettings as Record<string, unknown> | undefined) ?? {};
  if (typeof tabSettings.label !== 'string') tabSettings.label = '';
  config.tabSettings = tabSettings;
  return tabSettings;
};

const selectedTabName = computed({
  get: () => {
    if (!selectedTab.value) return '';
    return String(ensureTabSettings(selectedTab.value).label ?? '');
  },
  set: (value: string) => {
    if (!selectedTab.value) return;
    ensureTabSettings(selectedTab.value).label = value;
  },
});

const tabLabelFor = (block: Block) => {
  const index = tabs.value.findIndex((tab) => tab.meta.uuid === block.meta.uuid);
  return getTabLabel(block, index, tabLabelPrefix);
};
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",
    "design-label": "Design",
    "tab-style-label": "Tab style",
    "style-underline": "Underline",
    "style-pills": "Segmented pills",
    "style-vertical": "Vertical",
    "tabs-label": "Tabs",
    "add-tab-label": "Add Tab",
    "tab-settings-label": "Tab Names",
    "selected-tab-label": "Selected Tab",
    "select-placeholder": "Please select a tab",
    "tab-label": "Tab",
    "tab-name-label": "Tab name",
    "show-border-under-tabs-label": "Show border line under tabs",
    "tabs-alignment-label": "Tabs alignment",
    "position-left": "Left",
    "position-center": "Center",
    "position-right": "Right"
  },
  "de": {
    "layout-label": "Layout",
    "design-label": "Design",
    "tab-style-label": "Tab-Stil",
    "style-underline": "Unterstrich",
    "style-pills": "Segment-Pills",
    "style-vertical": "Vertikal",
    "tabs-label": "Tabs",
    "add-tab-label": "Tab hinzufügen",
    "tab-settings-label": "Tab-Namen",
    "selected-tab-label": "Ausgewählter Tab",
    "select-placeholder": "Bitte Tab auswählen",
    "tab-label": "Tab",
    "tab-name-label": "Tab-Name",
    "show-border-under-tabs-label": "Trennlinie unter Tabs anzeigen",
    "tabs-alignment-label": "Tab-Ausrichtung",
    "position-left": "Links",
    "position-center": "Mitte",
    "position-right": "Rechts"
  }
}
</i18n>
