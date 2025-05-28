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
          <ul class="space-y-2">
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
                 <div v-if="column.showContactLink" class="mt-2 ml-4 text-sm hover:underline active:underline">
            <SfLink
              :style="{ color: footerSettings.colors.text }"
              :tag="NuxtLink"
              class="no-underline text-neutral-900 hover:cursor-pointer hover:!text-neutral-900 hover:underline active:underline"
              variant="secondary"
              :to="localePath('/contact')"
            >
              Contact
            </SfLink>
          </div>
          <div
            v-if="column.description"
            class="mt-2 ml-4 text-sm hover:underline active:underline hover:cursor-pointer"
            v-html="column.description"
          />

        </div>
      </div>
    </div>

    <div
      v-if="footerSettings.footnote && footerSettings.footnote.trim() !== ''"
      class="text-sm text-center py-4"
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
