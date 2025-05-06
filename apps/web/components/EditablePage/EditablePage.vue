<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty" />
    <div v-if="data.length" class="content">
      <template v-for="(block, index) in data" :key="index">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EditablePageProps } from './types';

const props = defineProps<EditablePageProps>();
const { data, getBlocks } = useCategoryTemplate();
const dataIsEmpty = computed(() => data.value.length === 0);
await getBlocks(props.identifier, props.type);

const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  blockHasData,
  tabletEdit,
  changeBlockPosition,
} = useBlockManager();

const { settingsIsDirty, closeDrawer } = useSiteConfiguration();
const { isEditingEnabled, disableActions } = useEditor();

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
onBeforeRouteLeave((to, from, next) => {
  if (isEditingEnabled.value) {
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
    if (confirmation) {
      closeDrawer();
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});
</script>
