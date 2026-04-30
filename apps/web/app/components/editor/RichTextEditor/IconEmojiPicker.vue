<template>
  <div ref="triggerRef" class="relative inline-block">
    <EditorRichTextEditorMenuButton
      data-testid="rte-icon-picker-button"
      icon-name="emoji"
      :active="open"
      @click="toggle"
    />

    <Teleport to="body">
      <div
        v-if="open"
        :style="floatingStyle"
        class="fixed z-[9999] w-[260px] rounded border border-gray-200 bg-white shadow-lg"
        @mousedown.stop
        @click.stop
      >
      <div class="flex border-b border-gray-200" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          role="tab"
          :data-testid="`rte-picker-tab-${tab.value}`"
          :aria-selected="activeTab === tab.value"
          class="flex-1 px-3 py-2 text-sm font-medium transition-colors"
          :class="
            activeTab === tab.value
              ? 'text-slate-900 border-b-2 border-slate-800 -mb-px'
              : 'text-gray-500 hover:text-gray-700'
          "
          @mousedown.prevent
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-if="activeTab === 'icons'" class="max-h-[280px] overflow-y-auto p-2">
        <div v-for="category in categories" :key="category" class="mb-2 last:mb-0">
          <div class="px-1 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {{ category }}
          </div>
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="{ name, icon } in getIconsByCategory(category)"
              :key="name"
              type="button"
              :data-testid="`rte-icon-${name}`"
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

      <div v-else class="flex flex-col">
        <div class="p-2 border-b border-gray-200">
          <input
            v-model="emojiSearch"
            v-focus
            type="text"
            placeholder="Search emoji..."
            class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded outline-none focus:border-slate-500"
            @mousedown.stop
          />
        </div>
        <div class="max-h-[240px] overflow-y-auto p-2">
          <div class="grid grid-cols-8 gap-0.5">
            <button
              v-for="emoji in filteredEmojis"
              :key="emoji.name"
              type="button"
              :data-testid="`rte-emoji-${emoji.name}`"
              :title="emoji.name"
              :aria-label="emoji.name"
              class="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-gray-100"
              @mousedown.prevent
              @click="onSelectEmoji(emoji.name)"
            >
              {{ emoji.emoji }}
            </button>
          </div>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { IconEmojiPickerTab } from './types';
import { getIconCategories, getIconsByCategory, filterEmojis } from './utils/iconEmojiPickerUtils';

const vFocus = { mounted: (el: HTMLElement) => el.focus() };

const emit = defineEmits<{
  (e: 'select-icon' | 'select-emoji', name: string): void;
}>();

const { triggerRef, open, floatingStyle, toggle, close } = useFloatingDropdown({ align: 'right' });

const activeTab = ref<IconEmojiPickerTab>('icons');
const emojiSearch = ref('');

const tabs: Array<{ value: IconEmojiPickerTab; label: string }> = [
  { value: 'icons', label: 'Icons' },
  { value: 'emojis', label: 'Emojis' },
];

const categories = getIconCategories();
const filteredEmojis = computed(() => filterEmojis(emojiSearch.value));

const closeAndReset = () => {
  close();
  activeTab.value = 'icons';
  emojiSearch.value = '';
};

const onSelectIcon = (name: string) => {
  emit('select-icon', name);
  closeAndReset();
};

const onSelectEmoji = (name: string) => {
  emit('select-emoji', name);
  closeAndReset();
};
</script>
