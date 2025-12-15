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
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <SfInput
            v-model="searchTerm"
            :aria-label="t('common.actions.search')"
            :placeholder="t('common.actions.search')"
            @input="debouncedSearchTerm"
          >
            <template #prefix>
              <SfIconSearch />
            </template>
          </SfInput>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <SfSwitch v-model="showMissingOnly" />
          <label
            class="text-sm whitespace-nowrap cursor-pointer select-none"
            @click="showMissingOnly = !showMissingOnly"
          >
            {{ getEditorTranslation('show-missing-only') }}
          </label>
        </div>
      </div>

      <div class="w-full h-[calc(100vh-230px)] mt-4 overflow-hidden border rounded-lg">
        <div class="relative h-full flex flex-col">
          <div class="flex border-b flex-shrink-0">
            <div class="flex-shrink-0 flex z-20">
              <div class="w-48 px-4 py-3 font-semibold">{{ getEditorTranslation('category-key') }}</div>
              <div class="w-48 px-4 py-3 font-semibold border-r" />
            </div>

            <div ref="headerScroll" class="overflow-x-auto scrollbar-thin pl-4 w-full flex">
              <div
                v-for="lang in languages"
                :key="lang"
                class="w-64 px-4 py-3 mr-3 font-semibold flex-shrink-0 last:mr-0"
                :class="{ 'min-w-64 !w-[calc(50%-12px)]': selectedLocales.length === 2 }"
              >
                {{ lang }}
              </div>
            </div>
          </div>

          <div class="flex-1 flex overflow-hidden">
            <div class="flex-shrink-0 z-10" style="width: 384px">
              <div ref="leftScrollerRef" class="h-full overflow-y-auto scrollbar-thin" @scroll="syncScrollLeft">
                <div :style="{ height: `${leftVirtualizer.getTotalSize()}px`, position: 'relative' }">
                  <div
                    v-for="virtualRow in leftVirtualItems"
                    :key="virtualRow.index"
                    :style="{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }"
                  >
                    <div class="flex h-12 text-xs border-r">
                      <div class="w-96 overflow-x-scroll no-scrollbar flex items-center">
                        <div class="p-2 m-2 bg-neutral-100 rounded-lg text-gray-700 flex-shrink-0">
                          {{ getCategoryFromKey(virtualRow.item.key) }}
                        </div>
                        {{ getKeyFromFullKey(virtualRow.item.key) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-hidden">
              <div
                ref="rightScrollerRef"
                class="h-full overflow-x-auto overflow-y-auto no-scrollbar-y scrollbar-thin-x"
                @scroll="syncScrollRight"
              >
                <div :style="{ height: `${rightVirtualizer.getTotalSize()}px`, position: 'relative' }">
                  <div
                    v-for="virtualRow in rightVirtualItems"
                    :key="virtualRow.index"
                    :style="{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }"
                  >
                    <div class="flex h-12">
                      <EditorLocalizationTranslationInput
                        v-for="locale in selectedLocales"
                        :key="`${virtualRow.item.key}-${locale}`"
                        :row-key="virtualRow.item.key"
                        :lang="locale"
                        :translation="virtualRow.item.translations[locale]"
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
      </div>
    </div>
  </SfDrawer>
</template>

<script setup lang="ts">
import { SfDrawer, SfIconChevronLeft, SfIconSearch, SfInput, SfSwitch } from '@storefront-ui/vue';
import type { LocalizationMessage } from '@plentymarkets/shop-core';
import { useDebounceFn } from '@vueuse/core';
import { useVirtualizer } from '@tanstack/vue-virtual';

const placement = ref<'left' | 'right'>('left');
const open = ref(true);
const { allLanguages, selectedLocales } = useEditorLocalizationLocales();
const { keys, filteredKeys, filterKeys, getCategoryFromKey, getKeyFromFullKey, drawerOpen, updateTranslationInput } =
  useEditorLocalizationKeys();
const searchTerm = ref('');
const showMissingOnly = ref(false);

const displayedKeys = computed(() => filteredKeys.value || keys.value);

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
  filterKeys(searchTerm.value, selectedLocales.value, showMissingOnly.value);
}, 300);

watch(showMissingOnly, (newValue) => filterKeys(searchTerm.value, selectedLocales.value, newValue));
watch(selectedLocales, (newLocales) => filterKeys(searchTerm.value, newLocales, showMissingOnly.value), { deep: true });

const headerScroll = ref<HTMLElement | null>(null);
const leftScrollerRef = ref<HTMLElement | null>(null);
const rightScrollerRef = ref<HTMLElement | null>(null);

const leftVirtualizerOptions = computed(() => ({
  count: displayedKeys.value.length,
  getScrollElement: () => leftScrollerRef.value,
  estimateSize: () => 48,
  overscan: 30,
  getItemKey: (index: number) => displayedKeys.value[index]?.key ?? index,
}));

const rightVirtualizerOptions = computed(() => ({
  count: displayedKeys.value.length,
  getScrollElement: () => rightScrollerRef.value,
  estimateSize: () => 48,
  overscan: 30,
  getItemKey: (index: number) => displayedKeys.value[index]?.key ?? index,
}));

const leftVirtualizer = useVirtualizer(leftVirtualizerOptions);
const rightVirtualizer = useVirtualizer(rightVirtualizerOptions);

const leftVirtualItems = computed(() => {
  return leftVirtualizer.value.getVirtualItems().map((virtualItem) => ({
    ...virtualItem,
    item: displayedKeys.value[virtualItem.index]!,
  }));
});

const rightVirtualItems = computed(() => {
  return rightVirtualizer.value.getVirtualItems().map((virtualItem) => ({
    ...virtualItem,
    item: displayedKeys.value[virtualItem.index]!,
  }));
});

let scrollPending = false;
let headerScrollPending = false;

const syncScrollLeft = () => {
  if (!scrollPending && leftScrollerRef.value && rightScrollerRef.value) {
    scrollPending = true;
    requestAnimationFrame(() => {
      if (leftScrollerRef.value && rightScrollerRef.value) {
        rightScrollerRef.value.scrollTop = leftScrollerRef.value.scrollTop;
      }
      scrollPending = false;
    });
  }
};

const syncScrollRight = () => {
  if (!scrollPending && leftScrollerRef.value && rightScrollerRef.value) {
    scrollPending = true;
    requestAnimationFrame(() => {
      if (leftScrollerRef.value && rightScrollerRef.value) {
        leftScrollerRef.value.scrollTop = rightScrollerRef.value.scrollTop;

        if (headerScroll.value && rightScrollerRef.value) {
          headerScroll.value.scrollLeft = rightScrollerRef.value.scrollLeft;
        }
      }
      scrollPending = false;
    });
  }
};

const headerScrollHandler = () => {
  if (!headerScrollPending && headerScroll.value && rightScrollerRef.value) {
    headerScrollPending = true;
    requestAnimationFrame(() => {
      if (headerScroll.value && rightScrollerRef.value) {
        rightScrollerRef.value.scrollLeft = headerScroll.value.scrollLeft;
      }
      headerScrollPending = false;
    });
  }
};

onMounted(() => {
  headerScroll.value?.addEventListener('scroll', headerScrollHandler, { passive: true });
});

onBeforeUnmount(() => {
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

.scrollbar-thin-x {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.scrollbar-thin-x::-webkit-scrollbar {
  height: 5px;
  width: 0;
}

.scrollbar-thin-x::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 5px;
}

.scrollbar-thin-x::-webkit-scrollbar-track {
  background: transparent;
}

.no-scrollbar-y {
  scrollbar-width: none;
}

.no-scrollbar-y::-webkit-scrollbar {
  width: 0;
}

.no-scrollbar {
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations",
    "show-missing-only": "Show missing translations only"
  },
  "de": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations",
    "show-missing-only": "Show missing translations only"
  }
}
</i18n>
