<template>
  <div class="p-4">
    <SfButton @click="updatePrimaryColor">Update Primary Colour</SfButton>
  </div>
  <div class="p-4">
    <SfButton @click="updateTestConfig">Update Runtime Config</SfButton>
  </div>
  <div class="p4">
    {{ config.public.testConfig }}
  </div>
</template>

<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
const config = useRuntimeConfig();

const updateTestConfig = () => {
  config.public.testConfig = "Hello World!"
};

const updatePrimaryColor = () => {
  document.documentElement.style.setProperty('--colors-primary-700', '165 105 3');
};
</script>
