<template>
  <UiAccordionItem
    :model-value="isOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    content-padding-class="py-4"
    @update:model-value="isOpen = $event"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('elements-group-label') }}</h2>
    </template>

    <div>
      <draggable
        v-if="items.length"
        v-model="internalItems"
        item-key="meta.uuid"
        handle=".drag-items-handle"
        class=""
        :filter="'.no-drag'"
        @end="onDragEnd"
      >
        <template #item="{ element: item, index }">
          <div
            :key="item.meta.uuid"
            class="mb-3 flex items-center justify-between transition-colors"
            :style="
              currentActiveIndex === index && isBannerBlock(item)
                ? { backgroundColor: 'rgba(83, 138, 234, 0.1)', borderLeft: '4px solid #538AEA' }
                : { backgroundColor: 'white', borderLeft: '4px solid transparent' }
            "
          >
            <div
              class="flex items-center justify-between w-full py-[0.6rem] pl-2 pr-4 cursor-pointer"
              @click="selectItem(index)"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <button
                  class="drag-items-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-item-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>

                <span
                  class="text-sm font-medium truncate"
                  :class="item.configuration?.visible !== false ? 'text-gray-700' : 'text-gray-400'"
                >
                  {{ itemLabels[index] }}
                </span>
              </div>

              <button
                :data-testid="`actions-edit-item-${index}`"
                class="text-gray-500 rounded-full no-drag"
                :aria-label="getEditorTranslation('edit-element-aria')"
                @click="$emit('edit-item', index)"
              >
                <SfIconBase size="xs" viewBox="0 0 18 18">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :d="editPath" fill="currentColor" />
                  </svg>
                </SfIconBase>
              </button>

              <div :key="`menu-${index}`" class="relative">
                <button
                  :data-testid="`actions-menu-item-${index}`"
                  class="text-gray-500 rounded-full no-drag"
                  @click="toggleItemMenu(index)"
                >
                  <SfIconMoreVert />
                </button>

                <div
                  v-if="openItemMenuIndex === index"
                  class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
                  @click.stop
                >
                  <div class="px-4 py-3 border-b">
                    <div class="flex items-center justify-between">
                      <UiFormLabel class="mb-0">{{ getEditorTranslation('visibility-label') }}</UiFormLabel>
                      <SfSwitch
                        :model-value="
                          (internalItems[index]?.configuration as Record<string, unknown>)?.visible !== false
                        "
                        :data-testid="`actions-toggle-visibility-item-${index}`"
                        :aria-label="getEditorTranslation('toggle-visibility-aria')"
                        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
                        @update:model-value="toggleItemVisibility(index)"
                      />
                    </div>
                  </div>

                  <button
                    :data-testid="`actions-delete-item-${index}`"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    :disabled="internalItems.length === minItems"
                    @click="deleteItem(index)"
                  >
                    <SfIconDelete size="sm" />
                    {{ getEditorTranslation('delete-label') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <div class="pt-4 px-4">
        <button
          data-testid="actions-add-block-button"
          class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
          @click="$emit('add-item')"
        >
          <SfIconAdd />
          {{ getEditorTranslation('add-element-label') }}
        </button>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfIconDelete, SfIconAdd, SfIconMoreVert, SfIconBase, SfSwitch } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { editPath } from '~/assets/icons/paths/edit';
import type { Block } from '@plentymarkets/shop-api';
import type { SlideBlock } from '~/components/blocks/structure/Carousel/types';
import type { BlockItemsAccordionProps, BlockItemsAccordionEmits } from './types';

const props = withDefaults(defineProps<BlockItemsAccordionProps>(), {
  minItems: 1,
  modelValue: true,
  currentActiveIndex: -1,
});

const emit = defineEmits<BlockItemsAccordionEmits>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const internalItems = computed<Block[]>({
  get: () =>
    props.items.map((item: Block) => ({
      ...item,
      configuration: {
        ...(item.configuration as Record<string, unknown>),
        visible: (item.configuration as Record<string, unknown>)?.visible !== false,
      },
    })) as SlideBlock[],
  set: (value: Block[]) => emit('update:items', value as SlideBlock[]),
});

const openItemMenuIndex = ref<number | undefined>(undefined);

const toggleItemMenu = (index: number) => {
  openItemMenuIndex.value = openItemMenuIndex.value === index ? undefined : index;
};

const selectItem = (index: number) => {
  emit('select-item', index);
};

const onDragEnd = (event: { newIndex: number }) => {
  selectItem(event.newIndex);
};

const deleteItem = (index: number) => {
  if (internalItems.value.length <= props.minItems) return;
  emit('delete-item', index);
  openItemMenuIndex.value = undefined;
};

const toggleItemVisibility = (index: number) => {
  emit('toggle-item-visibility', index);
};

onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (openItemMenuIndex.value === undefined) return;

    const target = event.target as HTMLElement;
    const openMenuButton = document.querySelector(`[data-testid="actions-menu-item-${openItemMenuIndex.value}"]`);
    const openMenu = document
      .querySelector(`[data-testid="actions-menu-item-${openItemMenuIndex.value}"]`)
      ?.parentElement?.querySelector('.absolute.right-0');

    if (openMenuButton && openMenu) {
      const isClickOnButton = openMenuButton.contains(target);
      const isClickOnMenu = openMenu.contains(target);

      if (!isClickOnButton && !isClickOnMenu) {
        openItemMenuIndex.value = undefined;
      }
    }
  };

  document.addEventListener('click', handleClickOutside);

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>

<i18n lang="json">
{
  "en": {
    "elements-group-label": "Elements",
    "slide-label": "Slide",
    "add-element-label": "Add Element",
    "drag-reorder-aria": "Drag to reorder slide",
    "edit-element-aria": "Edit slide",
    "back-aria": "Go back to slides list",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle slide visibility",
    "delete-label": "Delete"
  },
  "de": {
    "elements-group-label": "Elements",
    "slide-label": "Slide",
    "add-element-label": "Add Element",
    "drag-reorder-aria": "Drag to reorder slide",
    "edit-element-aria": "Edit slide",
    "back-aria": "Go back to slides list",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle slide visibility",
    "delete-label": "Delete"
  }
}
</i18n>
