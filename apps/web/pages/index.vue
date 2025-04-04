<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" />
    <draggable
      v-if="data.length"
      v-model="data"
      item-key="meta.uuid"
      handle=".drag-handle"
      class="content"
      :filter="'.no-drag'"
      :prevent-on-filter="false"
      @change="scrollToBlock"
    >
      <template #item="{ element: block, index }">
        <PageBlock
          :index="index"
          :block="block"
          :disable-actions="disableActions"
          :is-clicked="isClicked"
          :clicked-block-index="clickedBlockIndex"
          :is-tablet="isTablet"
          :block-has-data="blockHasData"
          :change-block-position="changeBlockPosition"
          :root="true"
          class="group"
          :class="[
            {
              'max-w-screen-3xl mx-auto lg:px-10 mt-3': block.name !== 'Banner' && block.name !== 'Carousel',
            },
            {
              'px-4 md:px-6':
                block.name !== 'Carousel' && block.name !== 'Banner' && block.name !== 'NewsletterSubscribe',
            },
          ]"
          data-testid="block-wrapper"
          @click="tabletEdit(index)"
        />
      </template>
    </draggable>
  </div>
</template>
<script lang="ts" setup>
import draggable from 'vuedraggable';
import type { Block } from '@plentymarkets/shop-api';
const { isClicked, clickedBlockIndex, isTablet, blockHasData, tabletEdit, changeBlockPosition } = useBlockManager();

interface DragEvent<T = Block> {
  added?: {
    element: T;
    newIndex: number;
  };
  removed?: {
    element: T;
    oldIndex: number;
  };
  moved?: {
    element: T;
    oldIndex: number;
    newIndex: number;
  };
}

const { t } = useI18n();
const { settingsIsDirty } = useSiteConfiguration();

const { data, getBlocks } = useCategoryTemplate();

const dataIsEmpty = computed(() => data.value.length === 0);

const { isEditingEnabled, disableActions } = useEditor();
const { getRobots, setRobotForStaticPage } = useRobots();

const { setPageMeta } = usePageMeta();

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

await getBlocks('index', 'immutable');

onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

const hasUnsavedChanges = () => {
  return !isEditingEnabled.value && !settingsIsDirty.value;
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges()) return;
  event.preventDefault();
};

const scrollToBlock = (evt: DragEvent) => {
  if (evt.moved) {
    const { newIndex } = evt.moved;

    const block = document.getElementById(`block-${newIndex}`);
    if (block) {
      nextTick(() => {
        block.scrollIntoView(true);
      });
    }
  }
};

getRobots();
setRobotForStaticPage('Homepage');
</script>
