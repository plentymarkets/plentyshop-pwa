<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        class="w-100 py-2"
        width="150"
        height="40"
        preload
      />
    </template>
    <template v-else>
      <img
        id="logo"
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        :width="imgWidth"
        :height="imgHeight"
        class="max-h-[100px] max-w-[200px]"
        preload
      />
    </template>
  </picture>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { getSetting: getHeaderLogo } = useSiteSettings('headerLogo');

const headerLogo = computed(() => getHeaderLogo())

const storeName = runtimeConfig.public.storename;

const imageExtension = computed(() => headerLogo.value.split('.').pop());
const logo = ref<HTMLImageElement | null>(null);
const imgWidth = ref<string>('');
const imgHeight = ref<string>('');
onMounted(() => {
  if (logo.value) {
    imgWidth.value = logo.value.clientWidth + '';
    imgHeight.value = logo.value.clientHeight + '';
  }
});
</script>
