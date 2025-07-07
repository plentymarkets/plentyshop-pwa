<template>
  <div>
    <EmptyBlock v-if="dataIsEmpty || (data.length === 1 && data[0].name === 'Footer')" />
    <draggable
      v-if="data.length"
      v-model="data"
      item-key="meta.uuid"
      handle=".drag-handle"
      class="content"
      :filter="'.no-drag'"
      :prevent-on-filter="false"
      @change="scrollToBlock"
      @start="handleDragStart"
      @end="handleDragEnd"
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
              'max-w-screen-3xl mx-auto lg:px-10 mt-3':
                block.name !== 'Banner' && block.name !== 'Carousel' && block.name !== 'Footer',
            },
            {
              'px-4 md:px-6':
                block.name !== 'Carousel' &&
                block.name !== 'Banner' &&
                block.name !== 'NewsletterSubscribe' &&
                block.name !== 'Footer',
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
import draggable from 'vuedraggable/src/vuedraggable';
import type { DragEvent, EditablePageProps } from './types';
import { v4 as uuid } from 'uuid';
const { $isPreview } = useNuxtApp();
const props = defineProps<EditablePageProps>();
const { data, getBlocks } = useCategoryTemplate();
const dataIsEmpty = computed(() => data.value.length === 0);
await getBlocks(props.identifier, props.type, 'Footer');

console.log('EditablePage data:', data.value);
console.log('Identifier:', props.identifier);
console.log('Type:', props.type);

const route = useRoute();
if (route.meta.isBlockified) {
  const footerExists = data.value.some((block) => block.name === 'Footer');
  if (!footerExists) {
    data.value.push({
      name: 'Footer',
      type: 'content',
      meta: {
        uuid: uuid(),
      },
      content: {
        column1: { title: 'Legal' },
        column2: { title: 'Contact', description: '', showContactLink: true },
        column3: { title: '', description: '' },
        column4: { title: '', description: '' },
        footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
        footnoteAlign: 'right',

        colors: {
          background: '#cfe4ec',
          text: '#1c1c1c',
          noteBackground: '#e5e5e5',
          noteText: '#000000',
        },
      },
    });
  }
}
const {
  isClicked,
  clickedBlockIndex,
  isTablet,
  blockHasData,
  tabletEdit,
  changeBlockPosition,
  handleDragStart,
  handleDragEnd,
} = useBlockManager();
const scrollToBlock = (evt: DragEvent) => {
  if (evt.moved) {
    const { newIndex } = evt.moved;
    const block = document.getElementById(`block-${newIndex}`);
    if (block) {
      nextTick(() => {
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
};
const { settingsIsDirty, closeDrawer } = useSiteConfiguration();
const { isEditingEnabled, disableActions } = useEditor();
onMounted(() => {
  isEditingEnabled.value = false;
  window.addEventListener('beforeunload', handleBeforeUnload);
});
onMounted(async () => {
  if ($isPreview) {
    await import('./draggable.css');
  }
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
