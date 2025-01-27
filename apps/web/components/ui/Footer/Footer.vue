<template>
  <footer class="pt-10 bg-secondary-100 md:mb-0" data-testid="footer" :class="simplifiedFooter ? 'mb-0' : 'mb-[58px]'">
    <div
      class="grid justify-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(4,1fr)] px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto"
      data-testid="section-top"
    >
      <div v-for="{ key, subcategories } in categories" :key="key" class="min-w-[25%] xs:min-w-[50%] flex flex-col">
        <div class="ml-4 text-lg font-medium leading-7 text-neutral-900">
          {{ $t(`categories.${key}.label`) }}
        </div>
        <ul>
          <SfListItem
            v-for="{ key: subcategoryKey, link } in subcategories"
            :key="subcategoryKey"
            class="py-2 !bg-transparent typography-text-sm"
          >
            <SfLink
              :tag="NuxtLink"
              class="router-link-active router-link-exact-active no-underline text-neutral-600 hover:underline hover:!text-neutral-900 active:underline active:!text-neutral-900"
              variant="secondary"
              :to="localePath(link)"
            >
              {{ $t(`categories.${key}.subcategories.${subcategoryKey}`) }}
            </SfLink>
          </SfListItem>
        </ul>
      </div>
    </div>
    <hr />

    <div class="bg-neutral-900" data-testid="section-bottom">
      <div class="justify-end px-4 py-10 md:flex md:py-6 max-w-screen-3xl mx-auto">
        <p class="flex items-center justify-center leading-5 text-center typography-text-sm text-white/50 md:ml-6">
          {{ companyName }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import { categories } from '~/mocks';
import type { FooterProps } from './types';

const storename: string = useRuntimeConfig().public.storename;

const companyName: string = `© ${storename} ${new Date().getFullYear()}`;

const { simplifiedFooter = false } = defineProps<FooterProps>();

const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
</script>
