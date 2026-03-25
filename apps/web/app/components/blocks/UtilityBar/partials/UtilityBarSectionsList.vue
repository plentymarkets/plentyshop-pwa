<template>
  <UiAccordionItem
    v-model="isOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    content-padding-class="py-4"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('elements-group-label') }}</h2>
    </template>

    <div>
      <div v-if="sections.length" class="space-y-0">
        <template v-for="(section, index) in sections" :key="section.id">
          <div
            class="flex items-center justify-between transition-colors"
            :style="
              currentEditingSectionIndex === index
                ? { backgroundColor: 'rgba(83, 138, 234, 0.1)', borderLeft: '4px solid #538AEA' }
                : { backgroundColor: 'white', borderLeft: '4px solid transparent' }
            "
          >
            <div class="flex items-center justify-between w-full py-[0.6rem] pl-2 pr-4">
              <div class="flex items-center gap-3 flex-1 min-w-0">
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
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfIconMoreVert, SfIconBase, SfSwitch } from '@storefront-ui/vue';
import { editPath } from '~/assets/icons/paths/edit';
import type { UtilityBarSection, SectionType } from '../types';

defineProps<{
  sections: UtilityBarSection[];
  openSectionMenuIndex: number | undefined;
  currentEditingSectionIndex: number | undefined;
  getSectionLabel: (sectionId: SectionType) => string;
  getEditorTranslation: (key: string) => string;
  editSection: (index: number) => void;
  toggleSectionMenu: (index: number) => void;
  toggleSectionVisibility: (index: number) => void;
}>();

const isOpen = defineModel<boolean>('open', { default: true });
</script>

<i18n lang="json">
{
  "en": {
    "elements-group-label": "Elements",
    "edit-section-aria": "Edit section",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle section visibility",
    "logo-section-label": "Logo",
    "search-section-label": "Search",
    "actions-section-label": "Actions"
  },
  "de": {
    "elements-group-label": "Elements",
    "edit-section-aria": "Edit section",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle section visibility",
    "logo-section-label": "Logo",
    "search-section-label": "Search",
    "actions-section-label": "Actions"
  }
}
</i18n>
