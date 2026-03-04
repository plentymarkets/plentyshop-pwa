<template>
  <div data-testid="utility-bar-form" class="block-slider-edit sticky top-[52px] h-[80vh] overflow-y-auto">
    <UiAccordionItem
      v-if="editingSectionIndex === undefined"
      v-model="elementsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      content-padding-class="py-4"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('elements-group-label') }}</h2>
      </template>

      <div>
        <draggable
          v-if="sections.length"
          v-model="sections"
          item-key="id"
          handle=".drag-sections-handle"
          class=""
          :filter="'.no-drag'"
        >
          <template #item="{ element: section, index }">
            <div
              :key="section.id"
              class="mb-3 flex items-center justify-between transition-colors"
              :style="
                currentEditingSectionIndex === index
                  ? { backgroundColor: 'rgba(83, 138, 234, 0.1)', borderLeft: '4px solid #538AEA' }
                  : { backgroundColor: 'white', borderLeft: '4px solid transparent' }
              "
            >
              <div class="flex items-center justify-between w-full py-[0.6rem] pl-2 pr-4">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    class="drag-sections-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                    :aria-label="getEditorTranslation('drag-reorder-aria')"
                    :data-testid="`actions-drag-section-handle-${index}`"
                  >
                    <NuxtImg width="18" height="18" :src="dragIcon" />
                  </button>

                  <span
                    class="text-sm font-medium truncate"
                    :class="section.visible !== false ? 'text-gray-700' : 'text-gray-400'"
                  >
                    {{ getSectionLabel(section.id) }}
                  </span>
                </div>

                <button
                  :data-testid="`actions-edit-section-${index}`"
                  class="text-gray-500 rounded-full no-drag"
                  :aria-label="getEditorTranslation('edit-section-aria')"
                  @click="editSection(index)"
                >
                  <SfIconBase size="xs" viewBox="0 0 18 18">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path :d="editPath" fill="currentColor" />
                    </svg>
                  </SfIconBase>
                </button>

                <div :key="`menu-${index}`" class="relative">
                  <button
                    :data-testid="`actions-menu-section-${index}`"
                    class="text-gray-500 rounded-full no-drag"
                    @click="toggleSectionMenu(index)"
                  >
                    <SfIconMoreVert />
                  </button>

                  <div
                    v-if="openSectionMenuIndex === index"
                    class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
                    @click.stop
                  >
                    <div class="px-4 py-3 border-b">
                      <div class="flex items-center justify-between">
                        <UiFormLabel class="mb-0">{{ getEditorTranslation('visibility-label') }}</UiFormLabel>
                        <SfSwitch
                          :model-value="sections[index]?.visible !== false"
                          :data-testid="`actions-toggle-visibility-section-${index}`"
                          :aria-label="getEditorTranslation('toggle-visibility-aria')"
                          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
                          @update:model-value="toggleSectionVisibility(index)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </UiAccordionItem>

    <div v-else-if="sections[editingSectionIndex]" class="space-y-0">
      <component :is="sectionForm" />
    </div>
    <template v-if="editingSectionIndex === undefined">
      <UiAccordionItem
        v-model="layoutOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2 data-testid="utility-bar-layout-title">{{ getEditorTranslation('layout-label') }}</h2>
        </template>

        <div class="space-y-4 py-4">
          <div>
            <UiFormLabel class="mb-1">{{ getEditorTranslation('header-bg-color-label') }}</UiFormLabel>
            <EditorColorPicker v-model="configuration.colors.headerBackgroundColor" class="w-full">
              <template #trigger="{ color, toggle }">
                <SfInput v-model="configuration.colors.headerBackgroundColor" type="text">
                  <template #suffix>
                    <div
                      class="w-6 h-6 rounded border cursor-pointer"
                      :style="{ backgroundColor: color }"
                      @click="toggle"
                    />
                  </template>
                </SfInput>
              </template>
            </EditorColorPicker>
          </div>

          <div>
            <UiFormLabel class="mb-1">{{ getEditorTranslation('icon-color-label') }}</UiFormLabel>
            <EditorColorPicker v-model="configuration.colors.iconColor" class="w-full">
              <template #trigger="{ color, toggle }">
                <SfInput v-model="configuration.colors.iconColor" type="text" @click="toggle">
                  <template #suffix>
                    <div
                      class="w-6 h-6 rounded border cursor-pointer"
                      :style="{ backgroundColor: color }"
                      @click="toggle"
                    />
                  </template>
                </SfInput>
              </template>
            </EditorColorPicker>
          </div>
        </div>

        <div class="py-2">
          <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
          <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowUpward /></span>
              <input
                v-model.number="configuration.layout.paddingTop"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-top"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowDownward /></span>
              <input
                v-model.number="configuration.layout.paddingBottom"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-bottom"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowBack /></span>
              <input
                v-model.number="configuration.layout.paddingLeft"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-left"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
              <span><SfIconArrowForward /></span>
              <input
                v-model.number="configuration.layout.paddingRight"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-right"
              />
            </div>
          </div>
        </div>
      </UiAccordionItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfIconMoreVert,
  SfIconBase,
  SfSwitch,
  SfIconArrowDownward,
  SfIconArrowUpward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { editPath } from '~/assets/icons/paths/edit';
import type { UtilityBarProps, SectionType, UtilityBarSection } from './types';

const emit = defineEmits<{
  'set-edit-title': [title: string];
  'clear-edit-title': [];
}>();

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const elementsOpen = ref(true);
const layoutOpen = ref(true);
const editingSectionIndex = ref<number | undefined>(undefined);
const openSectionMenuIndex = ref<number | undefined>(undefined);

const utilityBarBlock = computed<UtilityBarProps>(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as UtilityBarProps,
);

const configuration = computed<UtilityBarProps['configuration']>({
  get: () => utilityBarBlock.value.configuration || ({} as UtilityBarProps['configuration']),
  set: (value) => {
    if (utilityBarBlock.value) {
      utilityBarBlock.value.configuration = value;
    }
  },
});

const sections = computed({
  get: () => {
    const order: SectionType[] = configuration.value.sectionOrder?.sections || ['logo', 'search', 'actions'];
    return order.map(
      (id): UtilityBarSection => ({
        id,
        name: `UtilityBar${id.charAt(0).toUpperCase()}${id.slice(1)}`,
        visible: configuration.value.sectionVisibility?.[id] !== false,
      }),
    );
  },
  set: (value: UtilityBarSection[]) => {
    if (!configuration.value.sectionOrder) {
      configuration.value.sectionOrder = { sections: [] };
    }
    configuration.value.sectionOrder.sections = value.map((section) => section.id);

    if (!configuration.value.sectionVisibility) {
      configuration.value.sectionVisibility = { logo: true, search: true, actions: true };
    }
    value.forEach((section) => {
      configuration.value.sectionVisibility![section.id] = section.visible !== false;
    });
  },
});

const currentEditingSectionIndex = computed(() => editingSectionIndex.value);

const sectionLabels = computed(() => ({
  logo: getEditorTranslation('logo-section-label'),
  search: getEditorTranslation('search-section-label'),
  actions: getEditorTranslation('actions-section-label'),
}));

const getSectionLabel = (sectionId: SectionType): string => {
  return sectionLabels.value[sectionId] || sectionId;
};

const sectionForms = import.meta.glob('@/components/**/blocks/UtilityBar/**Form.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const sectionForm = computed(() => {
  if (editingSectionIndex.value === undefined) return null;

  const section = sections.value[editingSectionIndex.value];
  if (!section) return null;

  const key = Object.keys(sectionForms).find((path) => path.endsWith(`/${section.name}Form.vue`));
  const loader = key ? sectionForms[key] : undefined;
  return loader ? defineAsyncComponent(loader) : null;
});

const editSection = (index: number) => {
  editingSectionIndex.value = index;
  openSectionMenuIndex.value = undefined;
  const sectionId = sections.value[index]?.id;
  if (sectionId) {
    emit('set-edit-title', getSectionLabel(sectionId));
  }
};

const exitEditMode = (shouldEmit = true) => {
  editingSectionIndex.value = undefined;
  openSectionMenuIndex.value = undefined;
  if (shouldEmit) {
    emit('clear-edit-title');
  }
};

const toggleSectionMenu = (index: number) => {
  if (openSectionMenuIndex.value === index) {
    openSectionMenuIndex.value = undefined;
  } else {
    openSectionMenuIndex.value = index;
  }
};

const toggleSectionVisibility = (index: number) => {
  const section = sections.value[index];
  if (!section) return;

  const updatedSections = [...sections.value];
  const sectionToUpdate = updatedSections[index];

  if (!sectionToUpdate) return;

  sectionToUpdate.visible = !sectionToUpdate.visible;
  sections.value = updatedSections;
};

// onMounted(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     if (openSectionMenuIndex.value === undefined) return;

//     const target = event.target as HTMLElement;
//     const openMenuButton = document.querySelector(`[data-testid="actions-menu-section-${openSectionMenuIndex.value}"]`);
//     const openMenu = document
//       .querySelector(`[data-testid="actions-menu-section-${openSectionMenuIndex.value}"]`)
//       ?.parentElement?.querySelector('.absolute.right-0');

//     if (openMenuButton && openMenu) {
//       const isClickOnButton = openMenuButton.contains(target);
//       const isClickOnMenu = openMenu.contains(target);

//       if (!isClickOnButton && !isClickOnMenu) {
//         openSectionMenuIndex.value = undefined;
//       }
//     }
//   };

//   document.addEventListener('click', handleClickOutside);

//   onBeforeUnmount(() => {
//     document.removeEventListener('click', handleClickOutside);
//   });
// });

defineExpose({
  exitEditMode,
});
</script>

<i18n lang="json">
{
  "en": {
    "elements-group-label": "Elements",
    "edit-section-aria": "Edit section",
    "drag-reorder-aria": "Drag to reorder section",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle section visibility",
    "layout-label": "Layout",

    "header-bg-color-label": "Header Background Color",
    "icon-color-label": "Icon Color",
    "padding-label": "Padding (px)",

    "logo-section-label": "Logo",
    "search-section-label": "Search",
    "actions-section-label": "Actions"
  },
  "de": {
    "elements-group-label": "Elements",
    "edit-section-aria": "Edit section",
    "drag-reorder-aria": "Drag to reorder section",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle section visibility",
    "layout-label": "Layout",

    "header-bg-color-label": "Header Background Color",
    "icon-color-label": "Icon Color",
    "padding-label": "Padding (px)",

    "logo-section-label": "Logo",
    "search-section-label": "Search",
    "actions-section-label": "Actions"
  }
}
</i18n>
