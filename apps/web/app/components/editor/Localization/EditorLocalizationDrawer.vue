<template>
  <SfDrawer
    v-model="open"
    class="bg-white border-0 shadow-[inset_0px_0px_20px_-20px_#111] category-drawer !absolute ml-[100%] w-[calc(50vw+18px)] lg:w-[calc(75vw-66px)] xl:w-[calc(80vw-66px)]"
    :placement="placement"
    :disable-click-away="true"
  >
    <div class="px-4 py-5 border-b flex justify-between items-center">
      <h3 class="font-bold typography-headline-3 truncate overflow-hidden whitespace-nowrap max-w-[75%]">
        {{ getEditorTranslation('edit-translations') }}
      </h3>
      <SfIconChevronLeft class="cursor-pointer flex-shrink-0 ml-2" @click="drawerOpen = false" />
    </div>

    <div class="p-4">
      <SfInput v-model="searchTerm" :aria-label="t('search')" :placeholder="t('search')" @input="debouncedSearchTerm">
        <template #prefix>
          <SfIconSearch />
        </template>
      </SfInput>
      <div class="w-full h-[calc(100vh-230px)] mt-4 overflow-hidden border rounded-lg">
        <div class="relative h-full">
          <div class="flex border-b">
            <div class="flex-shrink-0 flex z-20">
              <div class="w-48 px-4 py-3 font-semibold">{{ getEditorTranslation('category-key') }}</div>
              <div class="w-48 px-4 py-3 font-semibold border-r" />
            </div>

            <div ref="headerScroll" class="overflow-x-auto scrollbar-thin pl-4 w-full flex">
              <div
                v-for="lang in languages"
                :key="lang"
                class="w-64 min-w-64 px-4 py-3 mr-3 font-semibold flex-shrink-0 last:mr-0"
                :class="{ '!w-[calc(50%-12px)]': selectedLocales.length === 2 }"
              >
                {{ lang }}
              </div>
            </div>
          </div>

          <div class="flex overflow-hidden" style="height: calc(100% - 52px)">
            <div ref="leftScroll" class="flex-shrink-0 scrollbar-thin overflow-y-auto z-10">
              <div class="flex flex-col">
                <div v-for="row in filteredKeys ?? keys" :key="row.key" class="flex h-12 text-xs">
                  <div class="w-96 overflow-x-scroll no-scrollbar border-r flex items-center">
                    <div class="p-2 m-2 bg-neutral-100 rounded-lg text-gray-700 flex-shrink-0">
                      {{ getCategoryFromKey(row.key) }}
                    </div>
                    {{ getKeyFromFullKey(row.key) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Scrollable Right Content -->
            <div ref="contentScroll" class="flex-1 overflow-auto no-scrollbar">
              <div class="flex flex-col">
                <div v-for="row in filteredKeys ?? keys" :key="row.key" class="flex h-12">
                  <EditorLocalizationTranslationInput
                    v-for="lang in selectedLocales"
                    :key="`${row.key}-${lang}`"
                    :row-key="row.key"
                    :lang="lang"
                    :translation="row.translations[lang]"
                    @update="handleTranslationInput"
                    @revert="revertToDefault"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SfDrawer>
</template>

<script setup lang="ts">
import { SfDrawer, SfIconChevronLeft, SfIconSearch, SfInput } from '@storefront-ui/vue';
import type { LocalizationMessage } from '@plentymarkets/shop-core';
import { useDebounceFn } from '@vueuse/core';

const placement = ref<'left' | 'right'>('left');
const open = ref(true);
const { allLanguages, selectedLocales } = useEditorLocalizationLocales();
const { keys, filteredKeys, filterKeys, getCategoryFromKey, getKeyFromFullKey, drawerOpen, updateTranslationInput } =
  useEditorLocalizationKeys();
const searchTerm = ref('');
const languages = computed(() => {
  return selectedLocales.value
    .map((locale) => {
      const typedLocale = locale as keyof typeof allLanguages;
      return allLanguages[typedLocale] ?? null;
    })
    .filter((lang): lang is string => lang !== null);
});

const revertToDefault = (key: string, lang: string, data: LocalizationMessage) => {
  updateTranslationInput(key, lang, data.default ?? '');
};

const handleTranslationInput = (key: string, lang: string, value: string) => {
  updateTranslationInput(key, lang, value);
};

const debouncedSearchTerm = useDebounceFn(() => {
  filterKeys(searchTerm.value, selectedLocales.value);
}, 300);

const headerScroll = ref<HTMLElement | null>(null);
const contentScroll = ref<HTMLElement | null>(null);
const leftScroll = ref<HTMLElement | null>(null);

let contentScrollHandler: () => void = () => {};
let headerScrollHandler: () => void = () => {};
let leftScrollHandler: () => void = () => {};

onMounted(() => {
  contentScrollHandler = () => {
    if (headerScroll.value && contentScroll.value) {
      headerScroll.value.scrollLeft = contentScroll.value.scrollLeft;
    }
    if (leftScroll.value && contentScroll.value) {
      leftScroll.value.scrollTop = contentScroll.value.scrollTop;
    }
  };

  leftScrollHandler = () => {
    if (contentScroll.value && leftScroll.value) {
      contentScroll.value.scrollTop = leftScroll.value.scrollTop;
    }
  };

  headerScrollHandler = () => {
    if (contentScroll.value && headerScroll.value) {
      contentScroll.value.scrollLeft = headerScroll.value.scrollLeft;
    }
  };

  contentScroll.value?.addEventListener('scroll', contentScrollHandler);
  leftScroll.value?.addEventListener('scroll', leftScrollHandler);
  headerScroll.value?.addEventListener('scroll', headerScrollHandler);
});

onBeforeUnmount(() => {
  contentScroll.value?.removeEventListener('scroll', contentScrollHandler);
  leftScroll.value?.removeEventListener('scroll', leftScrollHandler);
  headerScroll.value?.removeEventListener('scroll', headerScrollHandler);
});
</script>

<style scoped>
/* Firefox */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

/* WebKit browsers */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.no-scrollbar {
  scrollbar-width: none;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations"
  },
  "de": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations"
  }
}
</i18n>
