<template>
  <SfDrawer
    v-model="open"
    class="bg-white border-0 shadow-[inset_0px_0px_20px_-20px_#111] category-drawer !absolute ml-[100%] w-[calc(50vw+25px)] lg:w-[calc(76vw)]"
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
      <div class="w-full h-[calc(100vh-180px)] overflow-hidden border rounded-lg">
        <div class="relative h-full">
          <div class="flex border-b">
            <div class="flex-shrink-0 flex z-20">
              <div class="w-48 px-4 py-3 font-semibold">{{ getEditorTranslation('category-key') }}</div>
              <div class="w-48 px-4 py-3 font-semibold border-r" />
            </div>

            <div ref="headerScroll" class="flex-1 overflow-x-auto scrollbar-thin">
              <div class="flex">
                <div v-for="lang in languages" :key="lang" class="w-64 px-4 py-3 mr-2 font-semibold flex-shrink-0">
                  {{ lang }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex overflow-hidden" style="height: calc(100% - 52px)">
            <div ref="leftScroll" class="flex-shrink-0 scrollbar-thin overflow-y-auto z-10">
              <div class="flex flex-col">
                <div v-for="(row, index) in keys" :key="index" class="flex h-12 text-xs">
                  <div class="w-96 overflow-hidden border-r flex items-center">
                    <div class="p-2 m-2 bg-neutral-100 rounded-lg text-gray-700">
                      {{ getCategoryFromKey(row.key) }}
                    </div>
                    {{ getKeyFromFullKey(row.key) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Scrollable Right Content -->
            <div ref="contentScroll" class="flex-1 overflow-auto scrollbar-thin">
              <div class="flex flex-col">
                <div v-for="(row, index) in keys" :key="index" class="flex h-12">
                  <div v-for="lang in selectedLocales" :key="lang" class="w-64 flex-shrink-0 m-1 mr-2 group relative">
                    <textarea
                      v-if="row?.translations?.[lang]?.input !== undefined"
                      v-model="row.translations[lang].input"
                      class="p-2 h-10 resize-none border rounded-lg w-full text-xs absolute"
                    />
                    <SfTooltip v-if="row.translations[lang]?.input === row.translations[lang]?.default" :label="getEditorTranslation('default-tooltip')" class="top-1 right-0 z-10 !absolute hidden group-hover:block" strategy="absolute" :show-arrow="true" placement="right">
                      <div class="right-1 p-2 h-8 bg-neutral-100 text-xs rounded-lg absolute text-gray-700">
                        {{ getEditorTranslation('default') }}
                      </div>
                    </SfTooltip>
                    <SfTooltip v-else-if="row.translations[lang]?.default" :label="getEditorTranslation('revert-to-default')" class="right-0 z-10 !absolute" strategy="absolute" :show-arrow="true" placement="right">
                      <div class="h-10 p-2 flex items-center" @click="revertToDefault(row.translations[lang])">
                        <SfIconBase viewBox="0 -960 960 960" size="sm" class="fill-none">
                          <path
                              fill="rgb(var(--colors-2-primary-500) / 1)"
                              d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                          />
                        </SfIconBase>
                      </div>
                    </SfTooltip>
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
import {SfDrawer, SfIconBase, SfIconChevronLeft, SfTooltip} from '@storefront-ui/vue';
import type {LocalizationMessage} from "../../../../../../../shop-core/src/runtime/types";

const placement = ref<'left' | 'right'>('left');
const open = ref(true);
const { allLanguages, selectedLocales } = useEditorLocalizationLocales();
const { keys, getCategoryFromKey, getKeyFromFullKey, drawerOpen } = useEditorLocalizationKeys();
const languages = computed(() => {
  return selectedLocales.value
    .map((locale) => {
      const typedLocale = locale as keyof typeof allLanguages.value;
      return allLanguages.value[typedLocale] ?? null;
    })
    .filter((lang): lang is string => lang !== null);
});

const revertToDefault = (data: LocalizationMessage) => {
  data.input = data.default ?? '';
}

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
.scrollbar-thin::-webkit-scrollbar {
  height: 5px;
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 1px;
}
</style>

<i18n lang="json">
{
  "en": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations",
    "default": "Default",
    "default-tooltip": "This translation is a default value that you can override",
    "revert-to-default": "Revert to default"
  },
  "de": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations",
    "default": "Default",
    "default-tooltip": "This translation is a default value that you can override",
    "revert-to-default": "Revert to default"
  }
}
</i18n>
