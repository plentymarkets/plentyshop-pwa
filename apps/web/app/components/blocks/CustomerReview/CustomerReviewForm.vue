<template>
  <div>
    <UiAccordionItem
      v-model="reviewsOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="customer-review-text"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('customer-reviews-label') }}</h2>
      </template>
      <div data-testid="customer-review-form">
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('title-label') }}</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="customerReview.text.title" type="text" data-testid="input-title">
              <template #suffix>
                <label for="text-title" class="rounded-lg cursor-pointer">
                  <input id="text-title" v-model="customerReview.text.title" type="text" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </label>
        </div>
      </div>
    </UiAccordionItem>
    <UiAccordionItem
      v-model="layoutOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="customer-review-layout"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-group-label') }}</h2>
      </template>
      <div class="py-2 flex items-center justify-between gap-3">
        <UiFormLabel for="display-collapsible" class="m-0">
          {{ getEditorTranslation('display-collapsible-label') }}
        </UiFormLabel>

        <SfSwitch
          id="display-collapsible"
          v-model="isCollapsible"
          data-testid="display-collapsible"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        />
      </div>

      <div class="py-2 flex items-center justify-between gap-3">
        <UiFormLabel for="initially-collapsed" class="m-0">
          {{ getEditorTranslation('initially-collapsed-label') }}
        </UiFormLabel>

        <SfSwitch
          id="initially-collapsed"
          v-model="isInitiallyCollapsed"
          data-testid="initially-collapsed"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        />
      </div>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="customerReview.layout.paddingTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="customerReview.layout.paddingBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="customerReview.layout.paddingLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="customerReview.layout.paddingRight"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-right"
            />
          </div>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import type { CustomerReviewProps, CustomerReviewContent } from './types';
import {
  SfInput,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
  SfSwitch,
} from '@storefront-ui/vue';
const reviewsOpen = ref(true);
const layoutOpen = ref(true);
const props = defineProps<CustomerReviewProps>();

const { findOrDeleteBlockByUuid } = useBlockManager();
const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();

// const customerReview = computed<CustomerReviewContent>(() => {
//   const rawContent = findOrDeleteBlockByUuid(data.value, props.meta.uuid || blockUuid.value)?.content ?? {};
//   return rawContent as CustomerReviewContent;
// });

const customerReview = computed<CustomerReviewContent>(() => {
  const uuid = props.meta?.uuid || blockUuid.value;

  const rawContent = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};
  const content = rawContent as Partial<CustomerReviewContent>;
  if (!content.layout) {
    content.layout = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      collapsible: true,
      initiallyCollapsed: true,
    };
  }
  return content as CustomerReviewContent;
});

const isCollapsibleInit = customerReview.value.layout.collapsible;
const isCollapsible = ref(isCollapsibleInit);

watch(isCollapsible, () => {
  customerReview.value.layout.collapsible = isCollapsible.value;
});

const isInitiallyCollapsedInit = customerReview.value.layout.initiallyCollapsed;
const isInitiallyCollapsed = ref(isInitiallyCollapsedInit);

watch(isInitiallyCollapsed, () => {
  customerReview.value.layout.initiallyCollapsed = isInitiallyCollapsed.value;
});
</script>
<i18n lang="json">
{
  "en": {
    "customer-reviews-label": "Customer reviews",
    "title-label": "Customer reviews",
    "padding-label": "Padding",
    "display-collapsible-label": "Display as collapsible",
    "initially-collapsed-label": "Initially collapsed",
    "layout-group-label": "Layout Settings"
  },
  "de": {
    "customer-reviews-label": "Kundenbewertungen",
    "title-label": "Kundenbewertungen",
    "padding-label": "Padding",
    "display-collapsible-label": "Als zusammenklappbar anzeigen",
    "initially-collapsed-label": "Ursprünglich kollabiert",
    "layout-group-label": "Layout Settings"
  }
}
</i18n>
