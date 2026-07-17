<template>
  <header class="relative w-full z-sticky @md:sticky @md:shadow-md">
    <div
      :style="{ backgroundColor: headerBackgroundColor }"
      class="flex justify-between items-center flex-wrap @md:flex-nowrap px-4 @md:px-10 py-3 @md:py-5 w-full border-0 border-neutral-200 @md:z-sticky"
      data-testid="navbar-top"
    >
      <div class="pl-4 @md:pl-0">
        <NuxtLink
          :to="localePath(paths.home)"
          :aria-label="t('common.actions.goToHomepage')"
          class="flex shrink-0 w-full @lg:w-48 items-center mr-auto text-white @md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
        >
          <UiLogo />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { paths } from '~/utils/paths';
const { headerContainer } = useBlocks();
const { getSetting: getPrimaryColor } = useSiteSettings('primaryColor');

const headerBackgroundColor = computed(() => {
  const children = headerContainer.value?.content as
    | Array<{ name: string; content: { color?: { backgroundColor?: string } } }>
    | undefined;
  const utilityBar = children?.find((block) => block.name === 'UtilityBar');
  return utilityBar?.content?.color?.backgroundColor ?? getPrimaryColor();
});

const localePath = useLocalizedPath();
</script>
