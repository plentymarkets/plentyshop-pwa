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
        :style="dropdownStyle"
        class="fixed z-[1000] w-[320px] rounded border border-gray-200 bg-white shadow-lg"
        @mousedown.stop
        @click.stop
      >
        <div class="max-h-[280px] overflow-y-auto p-2">
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
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { userIcons, type UserIconCategory } from './icons';

const props = defineProps<{
  insertIcon: (name: string) => void;
}>();

const root = ref<HTMLElement | null>(null);
const open = ref(false);
const dropdownStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' });

const allIcons = computed(() => Object.entries(userIcons).map(([name, icon]) => ({ name, icon })));

const categories = computed(() => {
  const set = new Set<UserIconCategory>();
  allIcons.value.forEach(({ icon }) => set.add(icon.category));
  return [...set];
});

const iconsByCategory = (category: UserIconCategory) =>
  allIcons.value.filter(({ icon }) => icon.category === category);

const updatePosition = () => {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  const dropdownWidth = 320;
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.right - dropdownWidth}px`,
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

const onDocClick = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', onDocClick);
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
  window.removeEventListener('scroll', close, true);
  window.removeEventListener('resize', close);
});
</script>