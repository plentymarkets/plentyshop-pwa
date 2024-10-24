<template>
  <picture>
    <img
      id="logo"
      :src="imagePath"
      alt="Header Logo"
      :width="imgWidth"
      :height="imgHeight"
      class="max-h-[100px] max-w-[200px]"
      ref="logo"
    />
  </picture>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const imageExtension = useRuntimeConfig().public.headerLogo.split('.').pop();
const imagePath = '/images/logo.' + imageExtension;
const logo = ref<HTMLImageElement | null>(null);
const imgWidth = ref<string>('');
const imgHeight = ref<string>('');

onMounted(() => {
  if (logo.value) {
    imgWidth.value = logo.value.clientWidth + 'px';
    imgHeight.value = logo.value.clientHeight + 'px';
  }
});
</script>
