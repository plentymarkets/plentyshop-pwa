<template>
  <div class="text-sm mr-1" v-if="basePrice">{{ unitContent }} {{ unitName }} | {{ basePrice }}</div>
</template>

<script setup lang="ts">
import {BasePriceProps} from './types';

const props = defineProps<BasePriceProps>();
const { basePrice, unitContent, unitName } = props;
</script>
