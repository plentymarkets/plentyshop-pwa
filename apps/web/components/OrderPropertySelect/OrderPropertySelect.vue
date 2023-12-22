<template>
  <div class="w-full">
    <!--some-->
  </div>
</template>

<script setup lang="ts">
import { OrderPropertySelectProps } from './types';

const props = defineProps<OrderPropertySelectProps>();
const productProperty = props.productProperty;
const hasTooltip = props.hasTooltip;
</script>
