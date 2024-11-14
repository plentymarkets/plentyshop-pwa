<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg
        :src="imagePath"
        :alt="`${{ storeName }} logo`"
        class="w-100 h-10 py-2"
        width="150"
        height="40"
        ref="logo"
        preload
      />
    </template>
    <template v-else>
      <img
        id="logo"
        :src="imagePath"
        :alt="`${{ storeName }} logo`"
        :width="imgWidth"
        :height="imgHeight"
        class="max-h-[100px] max-w-[200px]"
        ref="logo"
        preload
      />
    </template>
  </picture>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const storeName = runtimeConfig.public.storeName;
const imageExtension = runtimeConfig.public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;
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
