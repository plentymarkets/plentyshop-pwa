<template>
  <footer
    class="pt-10"
    :style="{
      backgroundColor: footerSettings.colors.background,
      color: footerSettings.colors.text,
    }"
    data-testid="footer"
  >
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ footerSettings.column1.title }}
          </div>
          <ul>
            <SfListItem
              v-for="{ key: subcategoryKey, link } in categories[0].subcategories"
              :key="subcategoryKey"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :tag="NuxtLink"
                :style="{ color: footerSettings.colors.text }"
                class="no-underline text-neutral-600 hover:!text-neutral-900 hover:underline active:underline"
                variant="secondary"
                :to="localePath(link)"
              >
                {{ t(`categories.${categories[0].key}.subcategories.${subcategoryKey}`) }}
              </SfLink>
            </SfListItem>
          </ul>
        </div>

        <div
          v-for="(column, i) in [footerSettings.column2, footerSettings.column3, footerSettings.column4]"
          :key="i"
          class="max-w-[280px] break-words"
        >
          <div class="ml-4 text-lg font-medium leading-7">
            {{ column.title }}
          </div>
          <div v-if="column.showContactLink" class="text-sm">
            <li
              class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :style="{ color: footerSettings.colors.text }"
                :tag="NuxtLink"
                class="no-underline text-neutral-900 hover:cursor-pointer hover:!text-neutral-900 hover:underline active:underline"
                variant="secondary"
                :to="localePath('/contact')"
              >
                Contact
              </SfLink>
            </li>
          </div>
          <div
            v-if="column.description"
            class="custom-html ml-4 py-2 text-sm hover:cursor-pointer"
            v-html="column.description"
          />
        </div>
      </div>
    </div>
    <div
      v-if="footerSettings.footnote && footerSettings.footnote.trim() !== ''"
      class="text-sm py-10 md:py-6 px-4"
      :class="{
        'text-left': footerSettings.footnoteAlign === 'left',
        'text-center': footerSettings.footnoteAlign === 'center',
        'text-right': footerSettings.footnoteAlign === 'right',
      }"
      :style="{
        color: footerSettings.colors.noteText,
        backgroundColor: footerSettings.colors.noteBackground,
      }"
    >
      {{ footerSettings.footnote }}
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import { categories } from '~/mocks';

const { t } = useI18n();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const { footerSettings } = useSiteConfiguration();
</script>

<style scoped>
::v-deep(.custom-html li) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
