<template>
  <footer
    class="pt-10"
    :style="{
      backgroundColor: props.content?.colors?.background || undefined,
      color: props.content?.colors?.text || undefined,
    }"
    data-testid="footer"
  >
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ props.content?.column1?.title }}
          </div>
          <ul>
            <SfListItem
              v-for="({ key: subcategoryKey, link }, idx) in categories[0]?.subcategories || []"
              :key="subcategoryKey || idx"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :tag="NuxtLink"
                :style="{ color: props.content?.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
                variant="secondary"
                :to="localePath(link)"
              >
                {{ t(`categories.${categories[0]?.key}.subcategories.${subcategoryKey}`) }}
              </SfLink>
            </SfListItem>
          </ul>
        </div>

        <div
          v-for="(column, i) in [props.content?.column2, props.content?.column3, props.content?.column4]"
          :key="i"
          class="max-w-[280px] break-words"
        >
          <div class="ml-4 text-lg font-medium leading-7">
            {{ column?.title }}
          </div>
          <div v-if="column?.showContactLink" class="text-sm">
            <li
              class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :style="{ color: props.content?.colors?.text || undefined }"
                :tag="NuxtLink"
                class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                variant="secondary"
                :to="localePath('/contact')"
              >
                Contact
              </SfLink>
            </li>
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
        v-if="props.content?.footnote && props.content.footnote.trim() !== ''"
        class="text-sm py-10 md:py-6 px-10"
        :class="{
          'text-left': props.content?.footnoteAlign === 'left',
          'text-center': props.content?.footnoteAlign === 'center',
          'text-right': props.content?.footnoteAlign === 'right',
        }"
        :style="{
          color: props.content?.colors?.noteText || undefined,
          backgroundColor: props.content?.colors?.noteBackground || undefined,
        }"
      >
        {{ props.content.footnote }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import type { FooterProps } from './types';

import { categories } from '~/mocks';
const { t } = useI18n();
const props = defineProps<FooterProps>();

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
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
