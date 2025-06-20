<template>
  <UiAccordionItem
    v-model="colorsOpen"
    data-testid="color-section"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 class="">
        <slot name="settings-group-title" />
      </h2>
    </template>
    <slot />
  </UiAccordionItem>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { SfIconClose, SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import { _s, _m, _l, _xl } from '#tailwind-config/theme/spacing';

const {
  closeDrawer,
  loadGoogleFont,
  primaryColor,
  secondaryColor,
  iconColor,
  headerBackgroundColor,
  updateBlockSize,
  blockSize,
  selectedFont,
} = useSiteConfiguration();

const fontsOpen = ref(false);
const colorsOpen = ref(false);
const headerOpen = ref(false);
const blocksSpacingOpen = ref(false);

const fonts = ref([]);

onMounted(async () => {
  const response = await fetch('/_nuxt-plenty/editor/fonts.json');

  if (response.ok) {
    fonts.value = await response.json();
  }
});

const btnClasses = ref(
  'py-2 leading-6 px-4 gap-2 !hover:bg-gray-100 uppercase inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed',
);

const blocksSpacingSizes = ref(['s', 'm', 'l', 'xl']);

const spacingInPx = computed(() => {
  if (!blockSize.value) return '0';

  const sizeMap: Record<string, string> = {
    s: _s,
    m: _m,
    l: _l,
    xl: _xl,
  };

  const remValue = parseFloat(sizeMap[blockSize.value]);
  return remValue * 16;
});
</script>
