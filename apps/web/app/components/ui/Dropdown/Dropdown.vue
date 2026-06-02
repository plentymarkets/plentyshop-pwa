<template>
  <SfDropdown v-model="isOpen" placement="bottom-end">
    <template #trigger>
      <div class="z-base" @click="toggle()">
        <slot name="trigger" />
      </div>
    </template>
    <div class="relative z-editor-inline">
      <slot />
    </div>
  </SfDropdown>
</template>

<script setup lang="ts">
import { SfDropdown, useDisclosure } from '@storefront-ui/vue';

const { isOpen, toggle } = useDisclosure();
</script>
