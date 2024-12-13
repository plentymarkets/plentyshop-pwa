<template>
  <SfDropdown v-model="isOpen" placement="bottom-end">
    <template #trigger>
      <div @click="toggle()" class="z-0">
        <slot name="trigger" />
      </div>
    </template>
    <div class="relative z-20">
      <slot />
    </div>
  </SfDropdown>
</template>

<script setup lang="ts">
import { SfDropdown, useDisclosure } from '@storefront-ui/vue';

const { isOpen, toggle } = useDisclosure();
</script>
