<template>
<div
  class="p-2 absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden w-auto min-w-max"
>
  <form ref="referenceRef" role="search" @submit.prevent="submit">
    <SfInput
      ref="inputRef"
      v-model="inputModel"
      aria-label="Search"
      placeholder="Search"
      @focus="open"
      @keydown="handleInputKeyDown"
    >
      <template #prefix><SfIconSearch /></template>
      <template #suffix>
        <button
          v-if="inputModel"
          type="button"
          aria-label="Reset search"
          class="flex rounded-md focus-visible:outline focus-visible:outline-offset"
          @click="reset"
        >
          <SfIconCancel /></button
      ></template>
    </SfInput>
  </form>

  <div>
    <ul v-if="flattenedPages.length > 0" class="p-2 transition-all duration-300 max-h-[300px] w-auto min-w-max overflow-y-auto">
      <li v-for="page in flattenedPages" :key="page.name">
        <SfListItem
          tag="button"
          type="button"
          class="p-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between text-left"
          @click="() => selectValue(page)"
          @keydown.enter.space.prevent="selectValue(page)"
        >
          <div class="flex items-center">
            <span class="flex items-center">
              <SfIconHome v-if="page.name === t('homepage.homepagetitle')" class="w-4 h-4 mr-2" />
              {{ page.name }}
            </span>
            <span v-if="page.path.split('/').length > 2">
              {{ page.path }}
            </span>
          </div>
        </SfListItem>
      </li>
    </ul>
    <div v-else class="p-2 text-gray-500">No results found.</div>
  </div>
</div>

</template>

<script lang="ts" setup>
import { offset } from '@floating-ui/vue';
import { unrefElement } from '@vueuse/core';
import {
  SfIconCancel,
  SfIconSearch,
  SfInput,
  SfListItem,
  useDisclosure,
  useDropdown,
  useTrapFocus,
  SfIconHome,
} from '@storefront-ui/vue';
const emit = defineEmits(['pageSelected']);

const inputModel = ref('');
const inputRef = ref();
const dropdownListRef = ref();

const { pages } = await usePages();

const { isOpen, close, open } = useDisclosure();
const { referenceRef } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [offset(4)],
});
const { focusables: focusableElements } = useTrapFocus(dropdownListRef as Ref<HTMLElement>, {
  trapTabs: false,
  arrowKeysUpDown: true,
  activeState: isOpen,
  initialFocus: false,
});

const { locale } = useI18n();
const { t } = useI18n();

const flattenPages = (
  pages: { name: string; path: string; children?: unknown[] }[],
): { name: string; path: string }[] => {
  let flatPages: { name: string; path: string }[] = [];
  pages.forEach((page) => {
    flatPages.push({ name: page.name, path: page.path });
    if (page.children) {
      flatPages = flatPages.concat(
        flattenPages(page.children as { name: string; path: string; children?: unknown[] }[]),
      );
    }
  });
  console.log('flatPages', flatPages);
  return flatPages;
};

// const filteredPages = computed(() => {
//   const searchTerm = inputModel.value.toLowerCase();
//   return flattenPages(pages.value).filter(
//     (page) => page.name.toLowerCase().includes(searchTerm) || page.path.toLowerCase().includes(searchTerm),
//   );
// });

const filteredPages = computed(() => {
  const searchTerm = inputModel.value.toLowerCase();
  const allPages = flattenPages(pages.value).filter((page) =>
    page.name.toLowerCase().includes(searchTerm) || page.path.toLowerCase().includes(searchTerm),);
  console.log("allPages", allPages);
  return allPages;
});

const flattenedPages = computed(() => filteredPages.value);

const submit = () => {
  close();
  alert(`Search for phrase: ${inputModel.value}`);
};

const focusInput = () => {
  const inputEl = unrefElement(inputRef)?.querySelector('input');
  inputEl?.focus();
};

const reset = () => {
  inputModel.value = '';
  close();
  focusInput();
};

const selectValue = (page: { name: string; path: string }) => {
  emit('pageSelected', { name: page.name, icon: page.name === t('homepage.homepagetitle') ? 'home' : 'sell' });
  navigateTo(`/${locale.value}${page.path}`);
};

const handleInputKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') reset();
  if (event.key === 'ArrowUp') {
    open();
    if (isOpen && focusableElements.value.length > 0) {
      focusableElements.value[focusableElements.value.length - 1].focus();
    }
  }
  if (event.key === 'ArrowDown') {
    open();
    if (isOpen && focusableElements.value.length > 0) {
      focusableElements.value[0].focus();
    }
  }
};

watch(inputModel, () => {
  if (inputModel.value === '') {
    reset();
  }
});
</script>
