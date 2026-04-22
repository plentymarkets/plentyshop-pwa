<template>
  <div data-testid="utility-bar-form" class="block-slider-edit sticky top-[52px] h-[80vh] overflow-y-auto">
    <BlocksUtilityBarPartialsUtilityBarSectionsList
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
    />

    <BlocksUtilityBarPartialsUtilityBarSectionEditor
      v-if="editingSectionIndex !== undefined"
      :sections="sections"
      :editing-section-index="editingSectionIndex"
      :uuid="props.uuid"
      :section-form="sectionForm"
    />

    <BlocksUtilityBarPartialsUtilityBarLayoutSettings
      v-if="editingSectionIndex === undefined"
      v-model:open="layoutOpen"
      :uuid="props.uuid"
    />
  </div>
</template>

<script setup lang="ts">
import type { UtilityBarFormProps } from './types';

const props = defineProps<UtilityBarFormProps>();

const emit = defineEmits<{
  'set-edit-title': [title: string];
  'clear-edit-title': [];
}>();

const { sections } = useUtilityBarConfiguration(props.uuid);

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
