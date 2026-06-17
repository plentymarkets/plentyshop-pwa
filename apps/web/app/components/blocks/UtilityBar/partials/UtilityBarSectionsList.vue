<template>
  <EditorFormPanel v-model="isOpen" :title="getEditorTranslation('elements-group-label')" content-class="p-0">
    <draggable
      v-if="sections.length"
      :model-value="sections"
      item-key="id"
      handle=".el-drag-handle"
      :filter="'.no-drag'"
      @update:model-value="$emit('update:sections', $event)"
    >
      <template #item="{ element: section, index }">
        <div
          :data-testid="`actions-section-item-${index}`"
          role="button"
          tabindex="0"
          class="flex items-center gap-1.5 px-2 py-1.5 border-b border-editor-border transition-colors hover:bg-editor-toc-hover cursor-pointer"
          :class="{ 'bg-editor-toc-hover': currentEditingSectionIndex === index || openSectionMenuIndex === index }"
          @click="editSection(index)"
          @keydown.enter.prevent="editSection(index)"
          @keydown.space.prevent="editSection(index)"
        >
          <button
            type="button"
            class="el-drag-handle cursor-grab text-editor-text-dim hover:text-editor-text-placeholder p-0.5 flex-shrink-0"
            :data-testid="`actions-drag-section-handle-${index}`"
            :aria-label="getEditorTranslation('drag-reorder-aria')"
          >
            <SfIconMenu size="xs" />
          </button>

          <div
            class="w-2.5 h-2.5 flex-shrink-0 rounded-sm"
            :style="{ backgroundColor: getBlockColor(section.name, section.visible !== false ? 1 : 0.35) }"
          />

          <span
            class="flex-1 text-xs truncate min-w-0"
            :class="section.visible !== false ? 'text-editor-text-default' : 'text-editor-text-ghost line-through'"
          >
            {{ getSectionLabel(section.id) }}
          </span>

          <SfIconVisibilityOff
            v-if="section.visible === false"
            size="xs"
            class="flex-shrink-0 text-editor-text-ghost"
          />

          <button
            :data-testid="`actions-edit-section-${index}`"
            class="no-drag p-0.5 rounded cursor-pointer text-editor-icon hover:text-editor-accent flex-shrink-0 transition-colors"
            :class="{ 'text-editor-icon/40': section.visible === false }"
            :aria-label="getEditorTranslation('edit-section-aria')"
            @click.stop="editSection(index)"
          >
            <SfIconBase size="xs" viewBox="0 0 18 18">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :d="editPath" fill="currentColor" />
              </svg>
            </SfIconBase>
          </button>

          <div class="no-drag relative flex-shrink-0">
            <button
              :data-testid="`actions-menu-section-${index}`"
              class="p-0.5 rounded cursor-pointer text-editor-icon hover:text-editor-accent transition-colors"
              :class="{
                '!text-editor-icon': openSectionMenuIndex === index,
                'text-editor-icon/40': section.visible === false,
              }"
              :aria-label="getEditorTranslation('section-actions-aria')"
              @click.stop="toggleSectionMenu(index)"
            >
              <SfIconMoreVert size="xs" />
            </button>

            <div
              v-if="openSectionMenuIndex === index"
              class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-editor-border z-dropdown"
              @click.stop
            >
              <div class="px-3 py-2.5 flex items-center justify-between gap-2">
                <span class="text-xs text-editor-text-subtle">{{ getEditorTranslation('visibility-label') }}</span>
                <SfSwitch
                  :model-value="section.visible !== false"
                  :data-testid="`actions-toggle-visibility-section-${index}`"
                  :aria-label="getEditorTranslation('toggle-visibility-aria')"
                  class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
                  @update:model-value="toggleSectionVisibility(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </draggable>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import { SfIconBase, SfIconMenu, SfIconMoreVert, SfIconVisibilityOff, SfSwitch } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import { editPath } from '~/assets/icons/paths/edit';
import type { UtilityBarSection, SectionType } from '../types';

const props = defineProps<{
  sections: UtilityBarSection[];
  openSectionMenuIndex: number | undefined;
  currentEditingSectionIndex: number | undefined;
  getSectionLabel: (sectionId: SectionType) => string;
  getEditorTranslation: (key: string) => string;
  editSection: (index: number) => void;
  toggleSectionMenu: (index: number) => void;
  toggleSectionVisibility: (index: number) => void;
}>();

defineEmits<{
  'update:sections': [sections: UtilityBarSection[]];
}>();

const isOpen = defineModel<boolean>('open', { default: true });

const closeMenu = () => {
  const indexToClose = props.openSectionMenuIndex;
  if (indexToClose === undefined) return;

  nextTick(() => {
    if (props.openSectionMenuIndex === indexToClose) {
      props.toggleSectionMenu(indexToClose);
    }
  });
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeMenu);
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
    "section-actions-aria": "Section actions",
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
    "section-actions-aria": "Section actions",
    "logo-section-label": "Logo",
    "search-section-label": "Search",
    "actions-section-label": "Actions"
  }
}
</i18n>
