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
                  <div v-for="lang in selectedLocales" :key="lang" class="w-64 flex-shrink-0 mr-2">
                    <textarea
                      v-if="row?.translations?.[lang]?.input !== undefined"
                      :value="row.translations[lang].input"
                      class="p-2 m-1 h-10 resize-none border rounded-lg w-full text-xs"
                      @input="updateTranslationInput(row.key, lang, ($event.target as HTMLTextAreaElement).value)"
                    />
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
import { SfDrawer, SfIconChevronLeft } from '@storefront-ui/vue';

const placement = ref<'left' | 'right'>('left');
const open = ref(true);
const { allLanguages, selectedLocales } = useEditorLocalizationLocales();
const { keys, getCategoryFromKey, getKeyFromFullKey, drawerOpen, updateTranslationInput } = useEditorLocalizationKeys();
const languages = computed(() => {
  return selectedLocales.value
    .map((locale) => {
      const typedLocale = locale as keyof typeof allLanguages;
      return allLanguages[typedLocale] ?? null;
    })
    .filter((lang): lang is string => lang !== null);
});

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
    "edit-translations": "Edit translations"
  },
  "de": {
    "category-key": "Category + Key",
    "edit-translations": "Edit translations"
  }
}
</i18n>
