<template>
  <div ref="root" class="relative inline-block">
    <EditorRichTextEditorMenuButton
      data-testid="rte-icon-picker-button"
      icon-name="emoji"
      :active="open"
      @click="toggle"
    />

    <Teleport to="body">
      <div
        v-if="open"
        data-icon-picker-dropdown
        :style="dropdownStyle"
        class="fixed z-[1000] w-[320px] rounded border border-gray-200 bg-white shadow-lg"
        @mousedown.stop
        @click.stop
      >
        <div class="flex border-b border-gray-200" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            role="tab"
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
                v-for="{ name, icon } in iconsByCategory(category)"
                :key="name"
                type="button"
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
                :title="emoji.name"
                :aria-label="emoji.name"
                class="flex h-8 w-8 items-center justify-center rounded text-lg hover:bg-gray-100"
                @mousedown.prevent
                @click="onSelectEmoji(emoji.name)"
              >
                {{ emoji.emoji }}
              </button>
            </div>
            <div v-if="filteredEmojis.length === 0" class="text-center text-sm text-gray-500 py-4">No emoji found.</div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { emojis } from '@tiptap/extension-emoji';
import { userIcons, type UserIconCategory } from './icons';

const props = defineProps<{
  insertIcon: (name: string) => void;
  insertEmoji: (name: string) => void;
}>();

type Tab = 'icons' | 'emojis';

const root = ref<HTMLElement | null>(null);
const open = ref(false);
const activeTab = ref<Tab>('icons');
const emojiSearch = ref('');
const dropdownStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' });

const tabs: Array<{ value: Tab; label: string }> = [
  { value: 'icons', label: 'Icons' },
  { value: 'emojis', label: 'Emojis' },
];

const allIcons = computed(() => Object.entries(userIcons).map(([name, icon]) => ({ name, icon })));

const categories = computed(() => {
  const set = new Set<UserIconCategory>();
  allIcons.value.forEach(({ icon }) => set.add(icon.category));
  return [...set];
});

const iconsByCategory = (category: UserIconCategory) => allIcons.value.filter(({ icon }) => icon.category === category);

const filteredEmojis = computed(() => {
  const query = emojiSearch.value.trim().toLowerCase();
  if (!query) return emojis.filter((e) => e.emoji);
  return emojis.filter((e) => {
    if (!e.emoji) return false;
    if (e.name.toLowerCase().includes(query)) return true;
    if (e.shortcodes?.some((s) => s.toLowerCase().includes(query))) return true;
    if (e.tags?.some((t) => t.toLowerCase().includes(query))) return true;
    return false;
  });
});

const updatePosition = () => {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.right - 320}px`,
  };
};

const toggle = () => {
  if (!open.value) updatePosition();
  open.value = !open.value;
};

const close = () => {
  open.value = false;
};

const onSelectIcon = (name: string) => {
  props.insertIcon(name);
  close();
};

const onSelectEmoji = (name: string) => {
  props.insertEmoji(name);
  close();
};

const onDocClick = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) close();
};

const onScroll = (e: Event) => {
  const target = e.target as Node | null;
  const dropdown = document.querySelector('[data-icon-picker-dropdown]');
  if (target && dropdown?.contains(target)) return;
  close();
};

onMounted(() => {
  document.addEventListener('mousedown', onDocClick);
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', close);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', close);
});
</script>
