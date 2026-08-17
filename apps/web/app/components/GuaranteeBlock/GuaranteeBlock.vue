<template>
  <div v-if="manufacturer && model && enableGuarantee" class="relative w-full" :style="{ maxWidth }">
    <button
      v-if="!isOpen"
      :aria-label="t('guaranteeLabels.area.open')"
      aria-expanded="false"
      class="block w-full cursor-pointer transition-transform duration-200 ease-out hover:scale-105 focus:outline focus:outline-2 focus:outline-offset-2 outline-secondary-600 rounded"
      type="button"
      @click="isOpen = true"
    >
      <GuaranteeBadge guarantee="TBD" />
    </button>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div v-if="isOpen" aria-expanded="true" class="relative w-full">
        <button
          :aria-label="t('guaranteeLabels.area.close')"
          class="absolute -top-2 -right-2 z-overlap flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md border border-neutral-100 transition-colors hover:bg-neutral-100 focus:outline focus:outline-2 focus:outline-offset-2 outline-secondary-600"
          type="button"
          @click="isOpen = false"
        >
          <SfIconClose size="xs" />
        </button>
        <GuaranteeLabel guarantee="TBD" :manufacturer="manufacturer" :model="model" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
import type { GuaranteeBlockProps } from '~/components/GuaranteeBlock/types';
import { productGetters } from '@plentymarkets/shop-api';

const props = defineProps<GuaranteeBlockProps>();
const enableGuarantee = useFeatureFlag('shopPwaEnableEu2025-1960', false);
const isOpen = ref(false);

const manufacturer = computed(() => {
  const manufacturer = productGetters.getManufacturer(props.product);
  return manufacturer?.externalName ?? null;
});
const model = computed(() => props.product.variation?.model);
</script>
