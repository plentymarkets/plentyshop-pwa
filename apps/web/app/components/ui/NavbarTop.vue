<template>
  <header
    :class="[
      'md:h-20 flex flex-col z-50 md:sticky md:-top-5 md:pt-2.5 md:shadow-md',
      { 'text-white': filled },
      { 'bg-white text-[#02C652] border-b border-neutral-200': !filled },
    ]"
    data-testid="navbar-top"
  >
    <div
      :style="{ backgroundColor: headerBackgroundColor }"
      class="flex flex-col md:flex-row md:gap-[clamp(1rem,3vw,3rem)] md:items-center w-full md:h-[60px] max-w-screen-3xl md:py-6 px-4 md:px-6 lg:px-10 mx-auto sticky top-0"
    >
      <NuxtLink :to="localePath(paths.home)" aria-label="Sf Homepage" class="h-6 md:h-7 -mt-1.5">
        <UiLogo />
      </NuxtLink>
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
import { paths } from '~/utils/paths';
const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');
const headerBackgroundColor = computed(() => getHeaderBackgroundColor());

const localePath = useLocalePath();

defineProps<{
  filled?: boolean;
}>();
</script>
