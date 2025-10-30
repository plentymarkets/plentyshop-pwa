


<!-- <template>
  <div class="p-4 flex">
    <p class="font-bold leading-6 cursor-pointer" data-testid="open-manufacturer-drawer" @click="openDrawer()">
      <span>{{ props.content.text.linkText }}</span>
      <SfIconChevronRight />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { ProductLegalInformationProps } from './types';
const props = defineProps<ProductLegalInformationProps>();

const { openDrawer } = useProductLegalDetailsDrawer();
</script> -->


<template>
  <div class="p-4 flex">
    <p
      class="font-bold leading-6 cursor-pointer"
      data-testid="open-manufacturer-drawer"
      @click="openDrawer(meta.uuid)"
    >
      <span>{{ props.content.text.linkText }}</span>
      <SfIconChevronRight />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { ProductLegalInformationProps } from './types';
const props = defineProps<ProductLegalInformationProps>();
const { meta } = props;

const { openDrawer } = useProductLegalDetailsDrawer();
</script>