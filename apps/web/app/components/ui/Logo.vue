<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        class="py-2 w-[160px] md:w-[180px] lg:w-[240px] xl:w-[350px] object-contain transition-all duration-300"
        preload
      />
    </template>
    <template v-else>
      <img
        id="logo"
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        class="w-[160px] md:w-[180px] xl:w-[240px] object-contain transition-all duration-300"
        preload
      />
    </template>
  </picture>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { getSetting: getHeaderLogo } = useSiteSettings('headerLogo');

const headerLogo = computed(() => getHeaderLogo());

const storeName = runtimeConfig.public.storename;

const imageExtension = computed(() => headerLogo.value.split('.').pop());
</script>