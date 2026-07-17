<template>
  <div class="tabs-structure" data-testid="tabs-structure">
    <div v-if="tabStyle === 'vertical'" class="flex gap-5 items-start">
      <div
        v-if="visibleTabs.length > 0"
        class="flex flex-col gap-0.5 min-w-[160px] shrink-0 border-r border-neutral-200 pr-3"
        role="tablist"
        :aria-label="getEditorTranslation('tabs.ariaLabel')"
        aria-orientation="vertical"
      >
        <button
          v-for="(tab, index) in visibleTabs"
          :id="getTabId(tab.meta.uuid)"
          :key="tab.meta.uuid"
          type="button"
          role="tab"
          :class="triggerClasses(index)"
          :aria-selected="isActiveTab(index)"
          :aria-controls="getPanelId(tab.meta.uuid)"
          :data-testid="`tabs-trigger-${index}`"
          @click="activeTabIndex = index"
        >
          {{ tabLabel(tab, index) }}
        </button>
      </div>

      <div v-if="activeTab" class="flex-1 min-w-0">
        <div
          :id="getPanelId(activeTab.meta.uuid)"
          :aria-labelledby="getTabId(activeTab.meta.uuid)"
          :data-testid="`tabs-panel-${activeTabIndex}`"
          role="tabpanel"
        >
          <slot name="content" :content-block="activeTab" :index="activeTabIndex" />
          <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(activeTab.meta.uuid, 'bottom', drawerOpen, drawerView)" />
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="visibleTabs.length > 0" :class="barWrapperClasses">
        <div
          :class="barClasses"
          role="tablist"
          :aria-label="getEditorTranslation('tabs.ariaLabel')"
          aria-orientation="horizontal"
        >
          <button
            v-for="(tab, index) in visibleTabs"
            :id="getTabId(tab.meta.uuid)"
            :key="tab.meta.uuid"
            type="button"
            role="tab"
            :class="triggerClasses(index)"
            :aria-selected="isActiveTab(index)"
            :aria-controls="getPanelId(tab.meta.uuid)"
            :data-testid="`tabs-trigger-${index}`"
            @click="activeTabIndex = index"
          >
            {{ tabLabel(tab, index) }}
          </button>
        </div>
      </div>

      <div v-if="activeTab" class="pt-4">
        <div
          :id="getPanelId(activeTab.meta.uuid)"
          :aria-labelledby="getTabId(activeTab.meta.uuid)"
          :data-testid="`tabs-panel-${activeTabIndex}`"
          role="tabpanel"
        >
          <slot name="content" :content-block="activeTab" :index="activeTabIndex" />
          <UiBlockPlaceholder v-if="shouldDisplayPlaceholder(activeTab.meta.uuid, 'bottom', drawerOpen, drawerView)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Block } from '@plentymarkets/shop-api';
import type { TabsProps, TabsAlignment, TabStyle } from './types';
import { getTabLabel } from './helpers';

const props = defineProps<TabsProps>();

const { shouldDisplayPlaceholder } = useBlockManager();
const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

const drawerOpen = computed(() => siteConfigurationDrawerOpen.value);
const drawerView = computed(() => siteConfigurationDrawerView.value);

const tabStyle = computed<TabStyle>(() => props.configuration?.layout?.tabStyle ?? 'underline');
const tabsAlignment = computed<TabsAlignment>(() => props.configuration?.layout?.tabsAlignment ?? 'left');
const showBorderUnderTabs = computed(() => props.configuration?.layout?.showBorderUnderTabs !== false);

const tabLabel = (block: Block, index: number) => getTabLabel(block, index, 'Tab');

const activeTabIndex = ref(0);
const activeTab = computed(() => visibleTabs.value[activeTabIndex.value]);

const isActiveTab = (index: number) => activeTabIndex.value === index;

const getTabId = (uuid: string) => `tabs-trigger-${uuid}`;
const getPanelId = (uuid: string) => `tabs-panel-${uuid}`;

const visibleTabs = computed(() => {
  return (props.content ?? []).filter((block) => block.configuration?.visible !== false);
});

const barWrapperClasses = computed(() => {
  const alignmentClasses: Record<TabsAlignment, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };
  return ['flex', alignmentClasses[tabsAlignment.value]];
});

const barClasses = computed(() => {
  switch (tabStyle.value) {
    case 'pills':
      return ['inline-flex flex-wrap gap-1 bg-neutral-100 p-1 rounded-lg'];
    case 'underline':
    default:
      return ['flex flex-wrap gap-6', showBorderUnderTabs.value ? 'border-b border-neutral-200 pb-px' : ''];
  }
});

const triggerClasses = (index: number) => {
  const active = isActiveTab(index);
  const base = 'cursor-pointer whitespace-nowrap transition-colors';

  const tabStylesMap = {
    pills: {
      layout: 'px-4 py-1.5 rounded-md text-sm',
      active: 'bg-white text-neutral-900 font-medium shadow-sm',
      inactive: 'text-neutral-500 hover:text-neutral-700',
    },
    vertical: {
      layout: 'px-3 py-2.5 text-sm text-left rounded-md',
      active: 'bg-neutral-100 text-neutral-900 font-medium',
      inactive: 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50',
    },
    underline: {
      layout: 'px-1 py-2 text-sm border-b-2',
      active: 'border-primary-700 text-primary-700 font-medium',
      inactive: 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
    },
  };

  const currentStyle = tabStylesMap[tabStyle.value] || tabStylesMap.underline;

  return [base, currentStyle.layout, active ? currentStyle.active : currentStyle.inactive];
};

const keepIndexInBounds = (tabs: Block[]) => {
  if (!tabs.length) {
    activeTabIndex.value = 0;
    return;
  }
  if (activeTabIndex.value >= tabs.length) {
    activeTabIndex.value = 0;
  }
};

watch(
  visibleTabs,
  (tabs) => {
    keepIndexInBounds(tabs);
  },
  { immediate: true },
);
</script>

<i18n lang="json">
{
  "en": {
    "tabs": {
      "ariaLabel": "Tabs"
    }
  },
  "de": {
    "tabs": {
      "ariaLabel": "Tabs"
    }
  }
}
</i18n>
