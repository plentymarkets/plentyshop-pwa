<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-toast flex items-center justify-center bg-black/40"
      @mousedown.self="cancelAndRevert(props.close)"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-visible">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-sm font-semibold text-gray-800">{{ getEditorTranslation('insert-link') }}</h2>
          <UiButton
            class="text-gray-400 hover:text-gray-600"
            size="sm"
            square
            type="button"
            variant="tertiary"
            @click="cancelAndRevert(props.close)"
          >
            <SfIconClose />
          </UiButton>
        </div>

        <div class="flex border-b border-gray-100 px-5 gap-1 pt-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="
              activeTab === tab.value
                ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-t'
                : 'text-gray-500 hover:text-gray-700'
            "
            class="px-3 py-2 text-sm font-medium rounded-t transition-colors relative"
            type="button"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="px-5 pt-4 pb-5 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1.5">
              {{ getEditorTranslation('text-label') }}
            </label>
            <p
              v-if="isAtomSelection"
              class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            >
              {{ atomDisplayLabel === 'generic-atom-text' ? getEditorTranslation(atomDisplayLabel) : atomDisplayLabel }}
            </p>
            <input
              v-else
              v-model="linkText"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Link text"
              type="text"
            />
          </div>
          <div v-if="activeTab === 'url'">
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-medium text-gray-600">
                {{ getEditorTranslation('url-label') }}
              </label>

              <a
                v-if="urlValue"
                :href="urlValue"
                aria-label="View link"
                class="text-gray-500 hover:text-blue-600 transition-colors"
                rel="noopener noreferrer"
                target="_blank"
                title="View link"
              >
                <svg
                  aria-hidden="true"
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 -960 960 960"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"
                  />
                </svg>
              </a>
            </div>

            <input
              v-model="urlValue"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="https://example.com"
              type="url"
            />
          </div>
          <div v-else-if="activeTab === 'static'">
            <label class="block text-xs font-medium text-gray-600 mb-1.5">
              {{ getEditorTranslation('page-label') }}</label
            >

            <EditorPageSelect :model-value="staticPageValue" @update:model-value="staticPageValue = $event ?? ''" />
          </div>

          <div v-else-if="activeTab === 'category'">
            <label class="block text-xs font-medium text-gray-600 mb-1.5">
              {{ getEditorTranslation('category-label') }}
            </label>

            <EditorCategorySelect
              :base-search-params="{}"
              :model-value="categoryValue"
              @update:model-value="categoryValue = $event ?? ''"
              @update:selected-path="selectedCategoryPath = $event"
            />
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-sm text-gray-700"> {{ getEditorTranslation('open-window-toggle') }}</span>
            <SfSwitch v-model="openInNewWindow" />
          </div>
        </div>
        <div class="px-5 pt-4 pb-5 space-y-4">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">
            {{ getEditorTranslation('rel-label') }}
          </label>
          <Multiselect
            v-model="relValues"
            :clear-on-select="false"
            :close-on-select="false"
            :multiple="true"
            :options="REL_OPTIONS"
            :show-labels="false"
            placeholder="Default (none)"
          />
        </div>
        <div class="flex items-center justify-end gap-2 px-5 py-4">
          <UiButton type="button" variant="secondary" @click="cancelAndRevert(props.close)">
            {{ getEditorTranslation('cancel-button') }}
          </UiButton>

          <UiButton
            :aria-disabled="!canSubmit"
            :class="{
              'pointer-events-none opacity-40 cursor-not-allowed': !canSubmit,
            }"
            :disabled="!canSubmit"
            type="button"
            @click="canSubmit && handleSubmit(props.close)"
          >
            {{ getEditorTranslation('add-link-button') }}
          </UiButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import type { Editor } from '@tiptap/core';
import { SfIconClose, SfSwitch } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';

const props = defineProps<{
  editor: Editor | null | undefined;
  close: () => void;
}>();

const editorRef = computed(() => props.editor);
const REL_OPTIONS = ['noopener', 'noreferrer', 'nofollow', 'sponsored'];

const {
  activeTab,
  urlValue,
  staticPageValue,
  categoryValue,
  openInNewWindow,
  linkText,
  isAtomSelection,
  atomDisplayLabel,
  canSubmit,
  tabs,
  initFromEditor,
  handleSubmit,
  cancelAndRevert,
  selectedCategoryPath,
  relValues,
} = useLinkModal(editorRef);

onMounted(initFromEditor);
</script>
<i18n lang="json">
{
  "en": {
    "add-link-button": "Add Link",
    "cancel-button": "Cancel",
    "open-window-toggle": "Open link in new tab",
    "category-label": "Category",
    "page-label": "Page",
    "url-label": "URL link",
    "text-label": "Text",
    "insert-link": "Insert Link",
    "generic-atom-text": "Content with icon(s)",
    "rel-label": "Rel attribute"
  },
  "de": {
    "add-link-button": "Add Link",
    "cancel-button": "Cancel",
    "open-window-toggle": "Open link in new tab",
    "category-label": "Category",
    "page-label": "Page",
    "url-label": "URL link",
    "text-label": "Text",
    "insert-link": "Insert Link",
    "generic-atom-text": "Content with icon(s)",
    "rel-label": "Rel attribute"
  }
}
</i18n>
