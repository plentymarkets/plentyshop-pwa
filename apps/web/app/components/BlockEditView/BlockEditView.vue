<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="block-edit-view">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div data-testid="view-title" class="flex items-center text-xl font-bold gap-3 flex-1 min-w-0">
        <template v-if="customTitle">
          <button class="shrink-0 rounded-full transition-colors" @click="handleBackClick">
            <SfIconChevronLeft />
          </button>
          <span class="block truncate">{{ customTitle }}</span>
        </template>
        <template v-else> {{ blockDisplayName }} </template>
      </div>
      <div class="flex items-center space-x-2">
        <div v-if="blockType !== 'Footer'" class="flex items-center space-x-2">
          <button data-testid="delete-block-button" @click="deleteBlock(blockUuid)">
            <SfIconDelete />
          </button>
          <div class="w-px h-4 bg-gray-300" />
        </div>
        <button data-testid="close-editor-button" @click="drawerOpen = false">
          <SfIconClose />
        </button>
      </div>
    </header>
    <div class="h-[80vh] overflow-y-auto">
      <component
        :is="currentComponent"
        v-if="currentComponent"
        ref="childComponentRef"
        @set-edit-title="handleSetEditTitle"
        @clear-edit-title="clearCustomTitle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconClose, SfIconChevronLeft } from '@storefront-ui/vue';

const { findOrDeleteBlockByUuid } = useBlockManager();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const { drawerOpen, blockType, blockUuid } = useSiteConfiguration();
const { deleteBlock } = useBlockManager();

const customTitle = ref<string | null>(null);
const childComponentRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => void } | null>(null);

const handleSetEditTitle = (title: string) => {
  customTitle.value = title;
};

const clearCustomTitle = () => {
  customTitle.value = null;
};

const handleBackClick = () => {
  if (childComponentRef.value?.exitEditMode) {
    childComponentRef.value.exitEditMode(false);
  }
  clearCustomTitle();
};

const componentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();

const getComponent = (name: string) => {
  if (!name) return null;

  const formName = name + 'Form';

  if (componentCache.has(formName)) {
    return componentCache.get(formName);
  }

  const loader = getBlockLoader(formName);
  if (!loader) return null;

  if (loader) {
    const component = defineAsyncComponent(loader);
    componentCache.set(formName, component);
    return component;
  }

  return '';
};

const currentComponent = computed(() => getComponent(blockType.value));

const blockTypeNames: Record<string, string> = {
  Carousel: 'Carousel',
  NewsletterSubscribe: 'Newsletter',
  ProductRecommendedProducts: 'Product Gallery',
  TextCard: 'Rich Text',
  AnnouncementBar: 'Announcement Bar',
  CustomerReview: 'Customer reviews',
  ProductLegalInformation: 'Legal Information',
  MultiGrid: 'Layout',
  Footer: 'Footer',
  ItemText: 'Item Details',
  CategoryData: 'Category Data',
  TechnicalData: 'Technical Data',
  ItemData: 'Item Data',
  Banner: 'Image Banner',
};

const blockDisplayName = computed(() => {
  if (blockType.value === 'Carousel') {
    const block = findOrDeleteBlockByUuid(data.value, blockUuid.value);
    const firstChild = (block?.content as Array<{ name: string }>)?.[0];
    if (firstChild?.name) {
      return blockTypeNames[firstChild.name] ?? firstChild.name;
    }
  }
  return blockTypeNames[blockType.value] ?? blockType.value;
});
</script>
