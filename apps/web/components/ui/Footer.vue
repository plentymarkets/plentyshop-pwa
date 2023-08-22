<template>
  <footer class="pt-10 bg-neutral-100 mb-[58px] md:mb-0" data-testid="footer">
    <div
      class="grid justify-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(4,1fr)] px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto"
      data-testid="section-top"
    >
      <div v-for="{ key, subcategories } in categories" :key="key" class="min-w-[25%] xs:min-w-[50%] flex flex-col">
        <div class="ml-4 text-lg font-medium leading-7 text-neutral-900 font-body">
          {{ $t(`categories.${key}.label`) }}
        </div>
        <SfListItem
          v-for="{ key: subcategoryKey, link } in subcategories"
          :key="subcategoryKey"
          class="py-2 !bg-transparent typography-text-sm font-body"
        >
          <SfLink
            :tag="NuxtLink"
            class="no-underline text-neutral-600 hover:underline hover:!text-neutral-900 active:underline active:!text-neutral-900"
            variant="secondary"
            :to="link"
          >
            {{ $t(`categories.${key}.subcategories.${subcategoryKey}`) }}
          </SfLink>
        </SfListItem>
      </div>
    </div>
    <hr />
    <div class="bg-neutral-900" data-testid="section-bottom">
      <div class="justify-end px-4 py-10 md:flex md:py-6 max-w-screen-3xl mx-auto">
        <p
          class="flex items-center justify-center leading-5 text-center typography-text-sm text-white/50 font-body md:ml-6"
        >
          {{ companyName }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import { categories, companyName } from '~/mocks';

const NuxtLink = resolveComponent('NuxtLink');
</script>
