<template>
  <div class="site-settings-view sticky" data-testid="block-edit-view">
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
        <div v-if="!isGlobalBlock(block)" class="flex items-center space-x-2">
          <button data-testid="delete-form-block-button" @click="deleteBlock(blockUuid)">
            <SfIconDelete />
          </button>
          <div class="w-px h-4 bg-gray-300" />
        </div>
        <button data-testid="close-editor-button" @click="closeBlocksConfigurationDrawer">
          <SfIconClose />
        </button>
      </div>
    </header>
    <div class="h-[80vh] overflow-y-auto">
      <component
        :is="currentComponent"
        v-if="currentComponent"
        :key="`${blockType}-${blockUuid}`"
        ref="childComponentRef"
        :uuid="blockUuid"
        @vue:mounted="handleBackClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconClose, SfIconChevronLeft } from '@storefront-ui/vue';

const { findOrDeleteBlockByUuid } = useBlockManager();
const route = useRoute();
const { allBlocks } = useBlocks();

const { closeBlocksConfigurationDrawer, blocksConfigurationDrawerView, blockType, blockUuid } = useSiteConfiguration();

watch(
  () => route.fullPath,
  () => {
    if (blocksConfigurationDrawerView.value === 'blocksSettings') {
      closeBlocksConfigurationDrawer();
    }
  },
);
const { deleteBlock } = useBlockManager();

const { editTitle: customTitle, clearEditTitle: clearCustomTitle } = useBlockEditTitle();
onBeforeUnmount(() => clearCustomTitle());
const childComponentRef = ref<{ exitEditMode?: (shouldEmit?: boolean) => boolean | undefined } | null>(null);
const handleBackClick = () => {
  if (childComponentRef.value?.exitEditMode) {
    const fullyExited = childComponentRef.value.exitEditMode(false);
    if (fullyExited !== false) clearCustomTitle();
  } else {
    clearCustomTitle();
  }
};

const componentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();

const getComponent = (name: string) => {
  if (!name) return null;

  if (componentCache.has(name)) {
    return componentCache.get(name);
  }

  const loader = getBlockFormLoader(name);
  if (!loader) return null;

  const component = defineAsyncComponent(loader);
  componentCache.set(name, component);
  return component;
};

const currentComponent = computed(() => getComponent(blockType.value));

const block = computed(() => findOrDeleteBlockByUuid(allBlocks.value, blockUuid.value));

const blockDisplayName = computed(() => {
  if (blockType.value === 'Carousel') {
    const firstChild = (block?.value?.content as Array<{ name: string }>)?.[0];
    if (firstChild?.name) {
      return getBlockDisplayName(firstChild.name);
    }
  }
  if (blockType.value === 'UtilityBar' && customTitle.value) {
    return customTitle.value;
  }
  return getBlockDisplayName(blockType.value);
});
</script>
