<template>
  <div
    v-if="paypalUuid"
    :id="'paypal-' + paypalUuid"
    class="z-0 relative paypal-button"
    :class="{ 'opacity-50 pointer-events-none': disabled }"
  />
</template>

<script setup lang="ts">
import { v4 as uuid } from 'uuid';

const paypalUuid = uuid();
const disabled = true;
</script>
