<template>
  <template
    v-if="showArrow"
  >
    <div
      data-testid="producteprel"
      class="flex items-center gap-2 absolute top-0 right-0"
      style="z-index: 1"
    >
      <SfButton v-if="showArrow" :size="'sm'" variant="tertiary" class="hover:bg-transparent"  @click="open">
        <ArrowSvg :level="eprelValue" :size="size" class="transition-transform duration-200" />
      </SfButton>


    </div>
    <div
      class="flex items-center gap-2 absolute top-0 right-0"
      style="z-index: 2"
    >
      <transition
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen" class="fixed inset-0 bg-neutral-700 bg-opacity-50" />
      </transition>
      <transition
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-10"
      >
        <SfModal
          v-model="isOpen"
          class="max-w-[80%] md:max-w-lg content-end my-[21%] lg:my-[10%]"
          tag="section"
          role="dialog"
          aria-labelledby="productEprelTitle"
          aria-describedby="productEprelContent"
        >
          <header>
            <UiButton variant="tertiary" square :aria-label="t('closeMenu')" class="absolute right-2 top-2 hover:bg-transparent active:bg-transparent" @click="close()">
              <SfIconClose class="text-neutral-500" />
            </UiButton>
            <h3 id="productEprelTitle" class="font-bold typography-headline-4 md:typography-headline-3">
              Energiekennzeichnung
            </h3>
          </header>

            <p id="productEprelContent" class="mt-2 max-h-[70vh]">
              <nuxt-lazy-hydrate when-idle>
                <ProductEprelView
                  :labelurl="labelValue"
                  :datasheeturl="datasheetValue"
                />
              </nuxt-lazy-hydrate>
          </p>
        </SfModal>
      </transition>
    </div>
  </template>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import ArrowSvg from '~/components/ArrowSvg/ArrowSvg.vue';
import type { ProductEprelProps } from './types';
import { SfModal, SfButton, SfIconClose, useDisclosure } from '@storefront-ui/vue';

const { isOpen, open, close } = useDisclosure({ initialValue: false });

const EPREL_PROPERTY_ID = 172;
const LABEL_PROPERTY_ID = 194;
const DATASHEET_PROPERTY_ID = 209;

const props = defineProps<ProductEprelProps>();

const propertyGroups = computed(() => props.product.variationProperties);
const eprelProperty = computed(() => productPropertyGetters.getProperty(EPREL_PROPERTY_ID, propertyGroups.value || []));
const labelProperty = computed(() => productPropertyGetters.getProperty(LABEL_PROPERTY_ID, propertyGroups.value || []));
const datasheetProperty = computed(() => productPropertyGetters.getProperty(DATASHEET_PROPERTY_ID, propertyGroups.value || []));

const size = computed(() => props.size || 'base');

const eprelValue = computed(() =>
  eprelProperty.value ? productPropertyGetters.getPropertyValue(eprelProperty.value) : '',
);

const labelValue = computed(() =>
  labelProperty.value ? productPropertyGetters.getPropertyValue(labelProperty.value) : '',
);

const datasheetValue = computed(() =>
  datasheetProperty.value ? productPropertyGetters.getPropertyValue(datasheetProperty.value) : '',
);



const showArrow = computed(
  () => eprelValue.value !== null && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(eprelValue.value)
);
</script>

<style scoped>
svg {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
