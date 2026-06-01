<template>
  <div data-testid="tabs-structure-form" class="block-tabs-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="resolvedUuid"
        :min-items="1"
        :section-label="getEditorTranslation('tabs-label')"
        :add-button-label="getEditorTranslation('add-tab-label')"
        @edit-element="editTab"
      />

      <EditorFormPanel v-model="tabSettingsOpen" :title="getEditorTranslation('tab-settings-label')">
        <div class="py-2">
          <UiFormLabel>{{ getEditorTranslation('selected-tab-label') }}</UiFormLabel>
          <select
            v-model="selectedTabUuid"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            data-testid="tabs-selected-tab"
          >
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

        <div class="py-2 flex items-center justify-between">
          <UiFormLabel>{{ getEditorTranslation('show-tabs-as-buttons-label') }}</UiFormLabel>
          <SfSwitch v-model="showTabsAsButtons" data-testid="tabs-show-as-buttons" />
        </div>

        <div class="py-2 flex items-center justify-between">
          <UiFormLabel>{{ getEditorTranslation('show-border-under-tabs-label') }}</UiFormLabel>
          <SfSwitch v-model="showBorderUnderTabs" data-testid="tabs-show-border-under-tabs" />
        </div>

        <div class="py-2">
          <EditorOptionsTabs
            v-model="tabsAlignment"
            :legend="getEditorTranslation('tabs-alignment-label')"
            test-id-prefix="tabs-alignment"
            :options="tabsAlignmentOptions"
          />
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

type TabsAlignment = 'left' | 'center' | 'right';

type TabsStructureBlock = {
  content?: Block[];
  configuration?: {
    visible?: boolean;
    layout?: {
      fullWidth?: boolean;
      showBorderUnderTabs?: boolean;
      showTabsAsButtons?: boolean;
      tabsAlignment?: TabsAlignment;
    };
  };
};

const props = defineProps<{ uuid?: string }>();

const { blockUuid } = useSiteConfiguration();
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();

const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const elementsOpen = ref(true);
const layoutOpen = ref(true);
const { editingBlock, blockForm } = useNestedBlockForm(resolvedUuid);
const { pushEdit } = useBlockEditStack();

const tabsStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, resolvedUuid.value) || {}) as TabsStructureBlock,
);

const tabsConfiguration = computed(() => {
  if (!tabsStructure.value.configuration) {
    tabsStructure.value.configuration = { visible: true };
  }

  if (!tabsStructure.value.configuration.layout) {
    tabsStructure.value.configuration.layout = {
      fullWidth: false,
      showBorderUnderTabs: true,
      showTabsAsButtons: true,
      tabsAlignment: 'left',
    };
  }

  return tabsStructure.value.configuration;
});

const { isFullWidth } = useFullWidthToggleForConfig(computed(() => tabsConfiguration.value));

const showBorderUnderTabs = computed({
  get: () => tabsConfiguration.value.layout?.showBorderUnderTabs !== false,
  set: (value: boolean) => {
    if (!tabsConfiguration.value.layout) {
      tabsConfiguration.value.layout = { fullWidth: false, showTabsAsButtons: true, tabsAlignment: 'left' };
    }
    tabsConfiguration.value.layout.showBorderUnderTabs = value;
  },
});

const showTabsAsButtons = computed({
  get: () => tabsConfiguration.value.layout?.showTabsAsButtons !== false,
  set: (value: boolean) => {
    if (!tabsConfiguration.value.layout) {
      tabsConfiguration.value.layout = { fullWidth: false, showBorderUnderTabs: true, tabsAlignment: 'left' };
    }
    tabsConfiguration.value.layout.showTabsAsButtons = value;
  },
});

const tabsAlignment = computed<TabsAlignment>({
  get: () => tabsConfiguration.value.layout?.tabsAlignment ?? 'left',
  set: (value: TabsAlignment) => {
    if (!tabsConfiguration.value.layout) {
      tabsConfiguration.value.layout = { fullWidth: false, showBorderUnderTabs: true, showTabsAsButtons: true };
    }
    tabsConfiguration.value.layout.tabsAlignment = value;
  },
});

const tabsAlignmentOptions = computed(() => [
  { value: 'left' as TabsAlignment, label: getEditorTranslation('position-left'), testId: 'tabs-align-left' },
  { value: 'center' as TabsAlignment, label: getEditorTranslation('position-center'), testId: 'tabs-align-center' },
  { value: 'right' as TabsAlignment, label: getEditorTranslation('position-right'), testId: 'tabs-align-right' },
]);

const tabSettingsOpen = ref(true);
const selectedTabUuid = ref<string>('');

const tabs = computed(() => tabsStructure.value.content ?? []);

const tabsOptions = computed(() => {
  return tabs.value.map((tab, index) => {
    const settings = (tab.configuration as Record<string, unknown> | undefined)?.tabSettings as
      | Record<string, unknown>
      | undefined;
    const label = typeof settings?.label === 'string' && settings.label.trim().length > 0
      ? settings.label
      : `${getEditorTranslation('tab-label')} ${index + 1}`;
    return {
      uuid: tab.meta.uuid,
      label,
    };
  });
});

watch(
  tabsOptions,
  (options) => {
    if (!options.length) {
      selectedTabUuid.value = '';
      return;
    }

    if (!options.some((option) => option.uuid === selectedTabUuid.value)) {
      selectedTabUuid.value = options[0]?.uuid ?? '';
    }
  },
  { immediate: true },
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
    const settings = ensureTabSettings(selectedTab.value);
    return String(settings.label ?? '');
  },
  set: (value: string) => {
    if (!selectedTab.value) return;
    const settings = ensureTabSettings(selectedTab.value);
    settings.label = value;
  },
});

const editTab = (block: Block) => {
  pushEdit(block);
};
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",
    "tabs-label": "Tabs",
    "add-tab-label": "Add Tab",
    "tab-settings-label": "Tab Names",
    "selected-tab-label": "Selected Tab",
    "tab-label": "Tab",
    "tab-name-label": "Tab name",
    "show-tabs-as-buttons-label": "Show tabs as buttons",
    "show-border-under-tabs-label": "Show border line under tabs",
    "tabs-alignment-label": "Tabs alignment",
    "position-left": "Left",
    "position-center": "Center",
    "position-right": "Right"
  },
  "de": {
    "layout-label": "Layout",
    "tabs-label": "Tabs",
    "add-tab-label": "Add Tab",
    "tab-settings-label": "Tab Names",
    "selected-tab-label": "Selected Tab",
    "tab-label": "Tab",
    "tab-name-label": "Tab name",
    "show-tabs-as-buttons-label": "Show tabs as buttons",
    "show-border-under-tabs-label": "Show border line under tabs",
    "tabs-alignment-label": "Tabs alignment",
    "position-left": "Left",
    "position-center": "Center",
    "position-right": "Right"
  }
}
</i18n>