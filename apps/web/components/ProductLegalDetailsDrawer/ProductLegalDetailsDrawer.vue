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
        <UiButton
          v-for="(tab, index) in tabs"
          :key="tab.label"
          type="button"
          role="tab"
          :variant="isActiveTab(index) ? 'primary' : 'secondary'"
          :aria-selected="isActiveTab(index)"
          :aria-controls="`tabpanel-${index}`"
          :disabled="tab.disabled"
          @click="setActiveTab(index)"
        >
          {{ tab.label }}
        </UiButton>
      </div>

      <div
        v-for="(tab, index) in tabs"
        :key="tab.label"
        role="tabpanel"
        :id="`tabpanel-${index}`"
        :aria-labelledby="`tab-${index}`"
        v-show="isActiveTab(index)"
        class="p-4"
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
  { label: t('manufacturer.euResponsibleTabName'), component: ManufacturerResponsibleInfo, disabled: false },
  { label: t('manufacturer.manufacturerTabName'), component: ManufacturerInformation, disabled: false },
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
