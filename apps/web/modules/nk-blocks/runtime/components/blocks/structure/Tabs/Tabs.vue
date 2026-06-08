<template>
  <div :class="containerClasses" class="tabs-structure" data-testid="tabs-structure">
    <div
      v-if="visibleTabs.length > 0"
      :class="tabsListClasses"
      role="tablist"
      :aria-label="t('tabs.structure.ariaLabel')"
      aria-orientation="horizontal"
    >
      <template v-for="(tab, index) in visibleTabs" :key="tab.meta.uuid">
        <UiButton
          v-if="showTabsAsButtons"
          :id="getTabId(tab.meta.uuid)"
          type="button"
          role="tab"
          :variant="isActiveTab(index) ? 'primary' : 'secondary'"
          :class="getTabButtonClasses(tab)"
          :aria-selected="isActiveTab(index)"
          :aria-controls="getPanelId(tab.meta.uuid)"
          :data-testid="`tabs-trigger-${index}`"
          @click="activeTabIndex = index"
        >
          {{ getTabLabel(tab, index) }}
        </UiButton>

        <button
          v-else
          :id="getTabId(tab.meta.uuid)"
          type="button"
          role="tab"
          :class="getTabTextClasses(index)"
          :aria-selected="isActiveTab(index)"
          :aria-controls="getPanelId(tab.meta.uuid)"
          :data-testid="`tabs-trigger-${index}`"
          @click="activeTabIndex = index"
        >
          {{ getTabLabel(tab, index) }}
        </button>
      </template>
    </div>

    <div v-if="activeTab" class="pt-4">
      <div
        :id="getPanelId(activeTab.meta.uuid)"
        :aria-labelledby="getTabId(activeTab.meta.uuid)"
        :data-testid="`tabs-panel-${activeTabIndex}`"
        role="tabpanel"
      >
        <slot name="content" :content-block="activeTab" :index="activeTabIndex" />

        <UiBlockPlaceholder
          v-if="shouldDisplayPlaceholder(activeTab.meta.uuid, 'bottom', drawerOpen, drawerView)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';

type TabsAlignment = 'left' | 'center' | 'right';

type TabsStructureConfiguration = {
  layout?: {
    fullWidth?: boolean;
    showBorderUnderTabs?: boolean;
    showTabsAsButtons?: boolean;
    tabsAlignment?: TabsAlignment;
  };
};

type TabSettings = {
  label?: string;
  roundedButtons?: boolean;
  useBorder?: boolean;
};

type TabsStructureProps = {
  content?: Block[];
  configuration?: TabsStructureConfiguration;
};

const props = defineProps<TabsStructureProps>();

const { shouldDisplayPlaceholder } = useBlockManager();
const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);
const { isFullWidth } = useFullWidthToggleForConfig(computed(() => props.configuration ?? {}));

const showBorderUnderTabs = computed(() => props.configuration?.layout?.showBorderUnderTabs !== false);
const showTabsAsButtons = computed(() => props.configuration?.layout?.showTabsAsButtons !== false);
const tabsAlignment = computed<TabsAlignment>(() => props.configuration?.layout?.tabsAlignment ?? 'left');

const visibleTabs = computed(() => {
  return (props.content ?? []).filter((block) => block.configuration?.visible !== false);
});

const containerClasses = computed(() => {
  return isFullWidth.value ? [] : ['px-4', 'md:px-6', 'max-w-screen-3xl', 'mx-auto'];
});

const tabsListClasses = computed(() => {
  const alignmentClasses: Record<TabsAlignment, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return [
    'flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
    showTabsAsButtons.value ? 'gap-2' : 'gap-4',
    alignmentClasses[tabsAlignment.value],
    showBorderUnderTabs.value ? 'border-b border-b-neutral-200 pb-4' : '',
  ];
});

const activeTabIndex = ref(0);

watch(
  visibleTabs,
  (tabs) => {
    if (!tabs.length) {
      activeTabIndex.value = 0;
      return;
    }

    if (activeTabIndex.value >= tabs.length) {
      activeTabIndex.value = 0;
    }
  },
  { immediate: true },
);

const activeTab = computed(() => visibleTabs.value[activeTabIndex.value]);

const isActiveTab = (index: number) => activeTabIndex.value === index;

const getTabSettings = (block: Block): TabSettings => {
  const config = block.configuration as Record<string, unknown> | undefined;
  const tabSettings = config?.tabSettings as TabSettings | undefined;

  return {
    label: tabSettings?.label,
  };
};

const getTabLabel = (block: Block, index: number) => {
  const tabSettings = getTabSettings(block);
  if (typeof tabSettings.label === 'string' && tabSettings.label.trim().length > 0) {
    return tabSettings.label;
  }

  const content = block.content as Record<string, unknown> | undefined;
  const text = content?.text as Record<string, unknown> | undefined;
  const title = text?.title;

  if (typeof title === 'string' && title.trim().length > 0) {
    return title;
  }

  return t('tabs.structure.fallbackLabel', { index: index + 1 });
};

const getTabButtonClasses = (block: Block) => {
  const tabSettings = getTabSettings(block);

  return [
    tabSettings.roundedButtons ? '!rounded-md' : '!rounded-sm',
    tabSettings.useBorder ? 'border border-2' : 'border-0',
  ];
};

const getTabTextClasses = (index: number) => {
  if (isActiveTab(index)) {
    return 'px-1 py-2 whitespace-nowrap border-b-2 border-primary-700 text-primary-700 font-medium';
  }

  return 'px-1 py-2 whitespace-nowrap border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300';
};

const getTabId = (uuid: string) => `tabs-trigger-${uuid}`;
const getPanelId = (uuid: string) => `tabs-panel-${uuid}`;
</script>

<i18n lang="json">
{
  "en": {
    "tabs": {
      "structure": {
        "ariaLabel": "Tabs",
        "fallbackLabel": "Tab {index}"
      }
    }
  },
  "de": {
    "tabs": {
      "structure": {
        "ariaLabel": "Tabs",
        "fallbackLabel": "Tab {index}"
      }
    }
  }
}
</i18n>