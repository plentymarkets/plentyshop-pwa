<template>
  <div>
    <UiAccordionItem
      v-model="textOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="customer-review-text"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('text-label') }}</h2>
      </template>
      <div data-testid="customer-review-form">
        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('title-label') }}</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="productLegalInformation.text.title" type="text" data-testid="input-title">
              <template #suffix>
                <label for="text-title" class="rounded-lg cursor-pointer">
                  <input
                    id="text-title"
                    v-model="productLegalInformation.text.title"
                    type="text"
                    class="invisible w-8"
                  />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="py-2">
          <div class="flex justify-between mb-2">
            <UiFormLabel>{{ getEditorTranslation('link-text-label') }}</UiFormLabel>
          </div>
          <label>
            <SfInput v-model="productLegalInformation.text.linkText" type="text" data-testid="input-linkText">
              <template #suffix>
                <label for="text-linkText" class="rounded-lg cursor-pointer">
                  <input
                    id="text-linkText"
                    v-model="productLegalInformation.text.linkText"
                    type="text"
                    class="invisible w-8"
                  />
                </label>
              </template>
            </SfInput>
          </label>
        </div>

        <div class="p-2 mt-2 mb-2 bg-[#EFF4F1] border border-[#BBC6BE] text-[#151A16] rounded-md">
          <span>{{ getEditorTranslation('legal-information-note') }}</span>
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

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="productLegalInformation.layout.paddingTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="productLegalInformation.layout.paddingBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="productLegalInformation.layout.paddingLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="productLegalInformation.layout.paddingRight"
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
import type { ProductLegalInformationProps, ProductLegalInformationContent } from './types';
import {
  SfInput,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
const textOpen = ref(true);
const layoutOpen = ref(true);

const props = defineProps<ProductLegalInformationProps>();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { blockUuid } = useSiteConfiguration();
const { data } = useCategoryTemplate();

const productLegalInformation = computed<ProductLegalInformationContent>(() => {
  const uuid = props.meta?.uuid || blockUuid.value;
  const rawContent = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};
  const content = rawContent as Partial<ProductLegalInformationContent>;

  if (!content.text) {
    content.text = {
      title: '',
      linkText: '',
    };
  } else {
    if (content.text.title === undefined) content.text.title = '';
    if (content.text.linkText === undefined) content.text.linkText = '';
  }

  if (!content.layout) {
    content.layout = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };
  } else {
    if (content.layout.paddingTop === undefined) content.layout.paddingTop = 0;
    if (content.layout.paddingBottom === undefined) content.layout.paddingBottom = 0;
    if (content.layout.paddingLeft === undefined) content.layout.paddingLeft = 0;
    if (content.layout.paddingRight === undefined) content.layout.paddingRight = 0;
  }
  return content as ProductLegalInformationContent;
});
</script>

<i18n lang="json">
{
  "en": {
    "text-label": "Text",
    "title-label": "Title",
    "padding-label": "Padding",
    "layout-group-label": "Layout Settings",
    "link-text-label": "Link Text",
    "legal-information-note": "You can configure which legal information is displayed in the 'EU Responsible Person' and 'Manufacturer' tabs from the backend. You can find them under “Item Settings” > “Legal”."
  },
  "de": {
    "text-label": "Text",
    "title-label": "Titel",
    "padding-label": "Padding",
    "layout-group-label": "Layout Settings",
    "link-text-label": "Link Text",
    "legal-information-note": "Sie können unter „Artikeleinstellungen“ > „Rechtliches“ festlegen, welche rechtlichen Informationen in den Reitern „EU-Verantwortlicher“ und „Hersteller“ angezeigt werden."
  }
}
</i18n>
