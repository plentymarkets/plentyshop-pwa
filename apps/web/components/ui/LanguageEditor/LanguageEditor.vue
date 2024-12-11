<template>
  <div class="flex items-center space-x-2">
    <SfIconLanguage />
    <select class="form-select focus:outline-none focus:ring-0 focus:border-transparent">
      <option class="font-medium text-base">English</option>
      <option class="font-medium text-base">German</option>
    </select>
  </div>
</template>
<script setup="ts">
import { SfIconLanguage } from '@storefront-ui/vue';
</script>
