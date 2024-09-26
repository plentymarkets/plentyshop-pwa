<template>
  <UiOverlay :visible="open">
    <SfDrawer
      ref="productLegalDrawerRef"
      v-model="open"
      :placement="placement"
      :class="[
        'bg-neutral-50',
        'border',
        'border-gray-300',
        'z-50',
        { 'min-w-[400px]': placement === 'left' || placement === 'right' },
      ]"
    >
      <header class="flex items-center justify-between px-10 py-6 bg-primary-500">
        <div class="flex items-center text-white">{{ t('productLegalDetailsHeader') }}</div>
        <UiButton square variant="tertiary" class="text-white" @click="open = false">
          <SfIconClose />
        </UiButton>
      </header>

      <div
        ref="tablistRef"
        role="tablist"
        aria-label="Select tab"
        aria-orientation="horizontal"
        class="flex gap-2 border-b border-b-neutral-200 p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.label"
          type="button"
          role="tab"
          :aria-selected="isActiveTab(index)"
          :aria-controls="`tabpanel-${index}`"
          :disabled="tab.disabled"
          class="px-4 py-2 rounded-md font-medium whitespace-nowrap text-neutral-500 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 disabled:text-disabled-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          :class="{ '!bg-neutral-100 !text-black': isActiveTab(index) }"
          @click="setActiveTab(index)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div
        v-for="(tab, index) in tabs"
        :key="tab.label"
        role="tabpanel"
        :id="`tabpanel-${index}`"
        :aria-labelledby="`tab-${index}`"
        v-show="isActiveTab(index)"
        class="p-4 text-neutral-500"
      >
        <component :is="tab.component" :product="product" />
      </div>
    </SfDrawer>
  </UiOverlay>
</template>

<script setup lang="ts">
import { SfDrawer, SfIconClose, SfDrawerPlacement, useTrapFocus } from '@storefront-ui/vue';
import { ProductLegalDetailsProps } from '~/components/ProductLegalDetailsDrawer/types';
import ManufacturerResponsibleInfo from '~/components/ManufacturerResponsibleInfo/ManufacturerResponsibleInfo.vue';
import ManufacturerInformation from '~/components/ManufacturerInformation/ManufacturerInformation.vue';

defineProps<ProductLegalDetailsProps>();

const { t } = useI18n();

const placement = ref<`${SfDrawerPlacement}`>('right');
const tabs = [
  { label: 'EU Responsible Person', component: ManufacturerResponsibleInfo, disabled: false },
  { label: 'Manufacturer', component: ManufacturerInformation, disabled: false },
];

const activeTabIndex = ref(0);

const isActiveTab = (index: number) => activeTabIndex.value === index;
const setActiveTab = (index: number) => {
  activeTabIndex.value = index;
};

const productLegalDrawerRef = ref();
const { open } = useProductLegalDetailsDrawer();
useTrapFocus(productLegalDrawerRef, { activeState: open });
</script>
