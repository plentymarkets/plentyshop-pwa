<template>
  <div data-testid="utility-bar-form" class="block-slider-edit sticky top-[52px] h-[80vh] overflow-y-auto">
    <UtilityBarSectionsList
      v-if="editingSectionIndex === undefined"
      v-model:open="elementsOpen"
      :sections="sections"
      :open-section-menu-index="openSectionMenuIndex"
      :current-editing-section-index="currentEditingSectionIndex"
      :get-section-label="getSectionLabel"
      :get-editor-translation="getEditorTranslation"
      :edit-section="editSection"
      :toggle-section-menu="toggleSectionMenu"
      :toggle-section-visibility="toggleSectionVisibility"
      @update:sections="sections = $event"
    />

    <UtilityBarSectionEditor
      v-if="editingSectionIndex !== undefined"
      :sections="sections"
      :editing-section-index="editingSectionIndex"
      :section-form="sectionForm"
    />

    <UtilityBarLayoutSettings
      v-if="editingSectionIndex === undefined"
      v-model:open="layoutOpen"
      :configuration="configuration"
      :get-editor-translation="getEditorTranslation"
      @update:header-bg-color="configuration.colors.headerBackgroundColor = $event"
      @update:icon-color="configuration.colors.iconColor = $event"
      @update:padding-top="configuration.layout.paddingTop = $event"
      @update:padding-bottom="configuration.layout.paddingBottom = $event"
      @update:padding-left="configuration.layout.paddingLeft = $event"
      @update:padding-right="configuration.layout.paddingRight = $event"
    />
  </div>
</template>

<script setup lang="ts">
import UtilityBarSectionsList from './components/UtilityBarSectionsList.vue';
import UtilityBarLayoutSettings from './components/UtilityBarLayoutSettings.vue';
import UtilityBarSectionEditor from './components/UtilityBarSectionEditor.vue';
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

const { elementsOpen, layoutOpen, editingSectionIndex, openSectionMenuIndex, currentEditingSectionIndex, sectionForm } =
  useUtilityBarForm(sections);

const { getSectionLabel, editSection, exitEditMode, toggleSectionMenu, toggleSectionVisibility } = useUtilityBarActions(
  {
    sections,
    editingSectionIndex,
    openSectionMenuIndex,
    getEditorTranslation,
    emit,
  },
);

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
