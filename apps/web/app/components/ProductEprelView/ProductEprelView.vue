<template>
  <template v-if="labelUrl && datasheetUrl">
      <img
        :src="labelurl"
        :alt="'EU-Energielabel'"
        class="max-h-[50vh]"
      />
    <div class="mt-5">
      <a :href="datasheetUrl" target="_blank" rel="noopener noreferrer">
        <UiButton variant="secondary" :aria-label="'Produktdatenblatt'" class="w-full">
          <SfIconOpenInNew />
          Produktdatenblatt
        </UiButton>
      </a>
    </div>

  </template>
</template>

<script setup lang="ts">
import { SfIconOpenInNew } from '@storefront-ui/vue';
import type { ProductEprelViewProps } from './types';
import { computed } from 'vue';

const productEprelViewProps = defineProps<ProductEprelViewProps>();

const labelUrl = computed(() => productEprelViewProps.labelurl || '');
const datasheetUrl = computed(() => productEprelViewProps.datasheeturl);
</script>