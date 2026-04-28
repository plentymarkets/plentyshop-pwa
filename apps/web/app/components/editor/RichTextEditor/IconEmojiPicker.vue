<template>
  <div class="relative inline-block z-[500]">
    <SfDropdown v-model="isOpen" placement="bottom-start">
      <template #trigger>
        <EditorRichTextEditorMenuButton
          data-testid="rte-icon-picker-button"
          icon-name="emoji"
          :active="isOpen"
          @click="isOpen = !isOpen"
        />
      </template>

      <div
        class="-mt-1 z-[300] w-[320px] rounded border border-gray-200 bg-white shadow-lg"
        @click.stop
        @mousedown.prevent
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
    </SfDropdown>
  </div>
</template>

<script setup lang="ts">
import { SfDropdown } from '@storefront-ui/vue';
import { userIcons, type UserIconCategory } from './icons';

const props = defineProps<{
  insertIcon: (name: string) => void;
}>();

const isOpen = ref(false);

const allIcons = computed(() => Object.entries(userIcons).map(([name, icon]) => ({ name, icon })));

const categories = computed(() => {
  const set = new Set<UserIconCategory>();
  allIcons.value.forEach(({ icon }) => set.add(icon.category));
  return [...set];
});

const iconsByCategory = (category: UserIconCategory) => allIcons.value.filter(({ icon }) => icon.category === category);

const onSelectIcon = (name: string) => {
  props.insertIcon(name);
  isOpen.value = false;
};
</script>
