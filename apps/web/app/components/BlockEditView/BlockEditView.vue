<template>
  <div class="site-settings-view sticky top-[52px]" data-testid="block-edit-view">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div data-testid="view-title" class="flex items-center text-xl font-bold gap-3">
        <template v-if="customTitle">
          <button class="rounded-full transition-colors" @click="handleBackClick">
            <SfIconChevronLeft />
          </button>
          <span>{{ customTitle }}</span>
        </template>
        <template v-else> {{ getBlockTypeName(blockType) }}s </template>
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

const modules = import.meta.glob('@/components/**/blocks/**/*Form.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const componentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();

const getComponent = (name: string) => {
  if (!name) return null;

  if (componentCache.has(name)) {
    return componentCache.get(name);
  }

  const regex = new RegExp(`${name}Form\\.vue$`, 'i');
  const matched = Object.keys(modules).find((path) => regex.test(path));

  if (matched && modules[matched]) {
    const component = defineAsyncComponent(modules[matched]);
    componentCache.set(name, component);
    return component;
  }

  return '';
};

const currentComponent = computed(() => getComponent(blockType.value));

const blockTypeNames: Record<string, string> = {
  Carousel: 'Image Banner',
  NewsletterSubscribe: 'Newsletter',
  ProductRecommendedProducts: 'Product Gallery',
  TextCard: 'Rich Text',
  CustomerReview: 'Customer reviews',
  ProductLegalInformation: 'Legal Information',
  MultiGrid: 'Layout',
  Footer: 'Footer',
  ItemText: 'Item Details',
  CategoryData: 'Category Data',
  TechnicalData: 'Technical Data',
  ItemData: 'Item Data',
};

const getBlockTypeName = (blockType: string) => {
  return blockTypeNames[blockType] ?? blockType;
};
</script>
