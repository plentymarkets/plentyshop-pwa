<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg :src="imagePath" alt="Logo" class="w-100 h-10 py-2" width="150" height="40" preload />
    </template>
    <template v-else>
      <NuxtImg
        id="logo"
        :src="imagePath"
        alt="Header Logo"
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
const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;

const logo = ref<HTMLImageElement | null>(null);
const imgWidth = ref<string>('auto');
const imgHeight = ref<string>('auto');

onMounted(() => {
  if (logo.value && imageExtension !== 'svg') {
    imgWidth.value = logo.value.clientWidth + 'px';
    imgHeight.value = logo.value.clientHeight + 'px';
  }
});
</script>
