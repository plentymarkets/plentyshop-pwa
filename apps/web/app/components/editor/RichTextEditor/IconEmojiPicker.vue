<template>
  <div class="relative inline-block z-[500]">
    <SfDropdown v-model="isOpen" placement="bottom-start" @update:model-value="onDropdownToggle">
      <template #trigger>
        <button
          ref="triggerRef"
          type="button"
          data-testid="rte-icon-emoji-trigger"
          class="w-8 h-8 rounded inline-flex items-center justify-center text-sm cursor-pointer text-gray-800 hover:bg-gray-100"
          :class="{ 'bg-gray-100': isOpen }"
          @mousedown.prevent
          @click="isOpen = !isOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path
              d="M480-260q75 0 127.5-52.5T660-440H300q0 75 52.5 127.5T480-260ZM364-516l44-42 42 42 42-42-44-44 44-44-42-42-42 42-44-42-42 42 44 44-44 44 42 42Zm192 0 42-42 44 42 42-42-44-44 44-44-42-42-44 42-42-42-42 42 44 44-44 44 42 42ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
            />
          </svg>
        </button>
      </template>

      <div
        class="-mt-1 z-[300] w-[320px] rounded border border-gray-200 bg-white shadow-lg"
        data-testid="rte-icon-emoji-popover"
        @click.stop
        @mousedown.stop.prevent
      >
        <!-- Tab Header -->
        <div class="flex border-b border-gray-200" role="tablist">
          <button
            type="button"
            role="tab"
            data-testid="rte-icon-emoji-tab-icons"
            :aria-selected="activeTab === 'icons'"
            class="flex-1 px-3 py-2 text-sm font-medium transition-colors"
            :class="
              activeTab === 'icons'
                ? 'text-slate-900 border-b-2 border-slate-800 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            "
            @mousedown.prevent
            @click="activeTab = 'icons'"
          >
            {{ getEditorTranslation('icons-tab-label') }}
          </button>
          <button
            type="button"
            role="tab"
            data-testid="rte-icon-emoji-tab-emojis"
            :aria-selected="activeTab === 'emojis'"
            class="flex-1 px-3 py-2 text-sm font-medium transition-colors"
            :class="
              activeTab === 'emojis'
                ? 'text-slate-900 border-b-2 border-slate-800 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            "
            @mousedown.prevent
            @click="activeTab = 'emojis'"
          >
            {{ getEditorTranslation('emojis-tab-label') }}
          </button>
        </div>

        <!-- Icons Tab -->
        <div v-if="activeTab === 'icons'" class="max-h-[280px] overflow-y-auto p-2">
          <div v-for="category in categories" :key="category" class="mb-2 last:mb-0">
            <div class="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ getCategoryLabel(category) }}
            </div>
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="{ name, icon } in iconsByCategory(category)"
                :key="name"
                type="button"
                :data-testid="`rte-icon-option-${name}`"
                :title="icon.label"
                :aria-label="icon.label"
                class="flex h-8 w-8 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
                @mousedown.prevent
                @click="onSelectIcon(name)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  :viewBox="icon.viewBox"
                  height="20px"
                  width="20px"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path v-for="(p, idx) in icon.paths" :key="idx" :d="p" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Emojis Tab -->
        <div v-else class="frimousse-host">
          <EmojiPicker.Root
            class="frimousse-root"
            :columns="9"
            @emoji-select="onSelectEmoji"
          >
            <EmojiPicker.Search
              class="frimousse-search"
              :placeholder="getEditorTranslation('emoji-search-placeholder')"
            />
            <EmojiPicker.Viewport class="frimousse-viewport">
              <EmojiPicker.Loading class="frimousse-loading">
                {{ getEditorTranslation('emoji-loading-label') }}
              </EmojiPicker.Loading>
              <EmojiPicker.Empty class="frimousse-empty">
                {{ getEditorTranslation('emoji-empty-label') }}
              </EmojiPicker.Empty>
              <EmojiPicker.List class="frimousse-list" />
            </EmojiPicker.Viewport>
          </EmojiPicker.Root>
        </div>
      </div>
    </SfDropdown>
  </div>
</template>

<script setup lang="ts">
import { SfDropdown } from '@storefront-ui/vue';
import { default as EmojiPicker } from 'vue-frimousse';
import { useIconRegistry, type IconCategory } from '~/composables/useIconRegistry';

const props = defineProps<{
  insertIcon: (name: string) => void;
  insertEmoji: (emoji: string) => void;
}>();

type Tab = 'icons' | 'emojis';

const isOpen = ref(false);
const activeTab = ref<Tab>('icons');
const triggerRef = ref<HTMLButtonElement | null>(null);

const { getCategories, getByCategory } = useIconRegistry();

const categories = computed(() => getCategories());

const iconsByCategory = (category: IconCategory) => getByCategory(category);

const categoryLabels: Record<IconCategory, string> = {
  social: 'category-social',
  utility: 'category-utility',
};

const getCategoryLabel = (category: IconCategory) =>
  getEditorTranslation(categoryLabels[category]);

const onDropdownToggle = (open: boolean) => {
  isOpen.value = open;
};

const onSelectIcon = (name: string) => {
  props.insertIcon(name);
  isOpen.value = false;
};

const onSelectEmoji = (event: { emoji: string }) => {
  const emoji = typeof event === 'string' ? event : event?.emoji;
  if (!emoji) return;
  props.insertEmoji(emoji);
  isOpen.value = false;
};
</script>

<style scoped>
.frimousse-host {
  padding: 8px;
}
.frimousse-host :deep([frimousse-root]) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 280px;
}
.frimousse-host :deep([frimousse-search]) {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid rgb(229 231 235);
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}
.frimousse-host :deep([frimousse-search]:focus) {
  border-color: rgb(100 116 139);
}
.frimousse-host :deep([frimousse-viewport]) {
  flex: 1;
  overflow-y: auto;
  position: relative;
}
.frimousse-host :deep([frimousse-list]) {
  user-select: none;
}
.frimousse-host :deep([frimousse-category-header]) {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(107 114 128);
  background: white;
  padding: 4px;
}
.frimousse-host :deep([frimousse-row]) {
  display: flex;
  scroll-margin: 4px;
}
.frimousse-host :deep([frimousse-emoji]) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  font-size: 1.125rem;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  border: none;
}
.frimousse-host :deep([frimousse-emoji][data-active]),
.frimousse-host :deep([frimousse-emoji]:hover) {
  background: rgb(243 244 246);
}
.frimousse-host :deep([frimousse-loading]),
.frimousse-host :deep([frimousse-empty]) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
  color: rgb(107 114 128);
}
</style>

<i18n lang="json">
{
  "en": {
    "icons-tab-label": "Icons",
    "emojis-tab-label": "Emojis",
    "category-social": "Social",
    "category-utility": "Utility",
    "emoji-search-placeholder": "Search emoji...",
    "emoji-loading-label": "Loading…",
    "emoji-empty-label": "No emoji found."
  },
  "de": {
    "icons-tab-label": "Icons",
    "emojis-tab-label": "Emojis",
    "category-social": "Social",
    "category-utility": "Werkzeuge",
    "emoji-search-placeholder": "Emoji suchen...",
    "emoji-loading-label": "Lädt…",
    "emoji-empty-label": "Kein Emoji gefunden."
  }
}
</i18n>