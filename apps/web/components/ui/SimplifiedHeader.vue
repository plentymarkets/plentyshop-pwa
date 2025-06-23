<template>
  <header class="relative w-full h-full z-40 md:sticky md:shadow-md">
    <div
      :style="{ backgroundColor: headerBackgroundColor }"
      class="flex justify-between items-center flex-wrap md:flex-nowrap px-4 md:px-10 py-3 md:py-5 w-full h-full border-0 border-neutral-200 md:h-20 md:z-10"
      data-testid="navbar-top"
    >
      <div class="pl-4 md:pl-0">
        <NuxtLink
          :to="localePath(paths.home)"
          aria-label="Sf Homepage"
          class="flex shrink-0 w-full h-8 lg:w-48 lg:h-8 items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
        >
          <UiVsfLogo />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { paths } from '~/utils/paths';
const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');
const headerBackgroundColor = computed(() => getHeaderBackgroundColor())

const localePath = useLocalePath();
</script>
