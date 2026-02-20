<template>
  <footer
    v-if="resolvedContent"
    class="pt-10"
    :style="{
      backgroundColor: resolvedContent.content.colors?.background,
      color: resolvedContent.content.colors?.text,
    }"
    data-testid="footer"
  >
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div v-if="getColumnSwitches(resolvedContent.content.column1).length" class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ resolvedContent.content.column1?.title }}
          </div>
          <ul>
            <SfListItem
              v-for="switchConfig in getColumnSwitches(resolvedContent.content.column1)"
              :key="switchConfig.id"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :tag="NuxtLink"
                :style="{ color: resolvedContent.content.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
                variant="secondary"
                :to="localePath(switchConfig.link)"
              >
                {{ switchConfig.translationKey }}
              </SfLink>
            </SfListItem>
          </ul>
        </div>

        <div
          v-for="(column, i) in [
            resolvedContent.content.column2,
            resolvedContent.content.column3,
            resolvedContent.content.column4,
          ]"
          :key="i"
          class="max-w-[280px] break-words"
        >
          <div class="ml-4 text-lg font-medium leading-7">
            {{ column?.title }}
          </div>
          <div v-if="getColumnSwitches(column).length" class="text-sm">
            <ul>
              <SfListItem
                v-for="switchConfig in getColumnSwitches(column)"
                :key="switchConfig.id"
                class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
              >
                <SfLink
                  :tag="NuxtLink"
                  variant="secondary"
                  class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                  :style="{ color: resolvedContent.content.colors?.text }"
                  :to="localePath(switchConfig.link)"
                >
                  {{ switchConfig.translationKey }}
                </SfLink>
              </SfListItem>
            </ul>
          </div>
          <div
            v-if="column?.description"
            class="custom-html ml-4 text-sm hover:cursor-pointer"
            v-html="column.description"
          />
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="resolvedContent.content.footnote && resolvedContent.content.footnote.trim() !== ''"
        class="text-sm py-10 md:py-6 px-10"
        :class="{
          'text-left': resolvedContent.content.footnoteAlign === 'left',
          'text-center': resolvedContent.content.footnoteAlign === 'center',
          'text-right': resolvedContent.content.footnoteAlign === 'right',
        }"
        :style="{
          color: resolvedContent.content.colors?.footnoteText,
          backgroundColor: resolvedContent.content.colors?.footnoteBackground,
        }"
        v-html="resolvedContent.content.footnote"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import type { FooterProps, FooterBlock, FooterSettingsColumn } from './types';

const props = defineProps<FooterProps>();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const { getFooterBlocks, footerCache } = useFooter();
const resolvedContent = ref<FooterBlock | null>(null);
let stopWatch: (() => void) | null = null;

onMounted(() => {
  stopWatch = watch(
    [() => props.content, footerCache],
    () => {
      resolvedContent.value = mapFooterData(props ?? getFooterBlocks());
    },
    { immediate: true, deep: true },
  );
});

onBeforeUnmount(() => {
  stopWatch?.();
});

const getColumnSwitches = (column: FooterSettingsColumn) => {
  return FOOTER_SWITCH_DEFINITIONS.filter((switchConfig) => column[switchConfig.key] === true).map((switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: t(switchConfig.shopTranslationKey),
    link: switchConfig.link,
    state: true,
  }));
};
</script>

<style scoped>
::v-deep(.custom-html li) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

::v-deep(.custom-html li:hover) {
  text-decoration: underline;
}
</style>
