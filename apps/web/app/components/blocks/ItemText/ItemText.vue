<template>
  <div :style="inlineStyle">
    <UiAccordionItem v-if="displayAsCollapsable" v-model="initiallyCollapsed"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ title }}
        </h2>
      </template>
      <div class="no-preflight" v-html="text" />
    </UiAccordionItem>
    <div v-else>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        {{ title }}
      </h2>
      <div class="no-preflight" v-html="text" />
    </div>
    <UiDivider v-if="initiallyCollapsed && text?.length" class="mb-2 mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ItemTextProps } from './types';
import type { ItemTextContent } from '~/components/blocks/ItemText/types';
const { t } = useI18n();
const route = useRoute();
const props = defineProps<ItemTextProps>();
const title = computed(() => props.content?.title);
const initiallyCollapsed = computed(() => props.content?.initiallyCollapsed);
const displayAsCollapsable = computed(() => props.content?.displayAsCollapsable);
const { productId } = createProductParams(route.params);
const { data: product } = useProduct(productId);
const text = computed(() => { return productGetters.getDescription(product.value) ?? getEditorTranslation('dummyData') });
const inlineStyle = computed(() => {
  const layout = props.content?.layout || {};
  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});
</script>

<i18n lang="json">{
  "en": {
    "dummyData": "On this page, you can define how your item detail pages should be structured. You decide which content is visible, in what order the elements appear, and how much information you want to provide.  The field you are currently looking at is the item text. This is a free text field that can be as long as you like. Use this space to give your customers detailed information about the item, such as special features or possible uses.  The text you see here is, of course, just placeholder text. It is meant to show you where the item description will be positioned on the item detail page and how it will be displayed.  The actual item texts are managed in the backend, within the item management section. There, you have a variety of formatting options to help you present your content in an attractive way, such as:  - Adding links  - Inserting small images or icons  - Creating clear and structured tables  - Using paragraphs and lists for better readability  - And much more.  Make use of these features to customize your item detail pages and create a convincing and enjoyable shopping experience for your customers.",
  },
  "de": {
    "dummyData": "Auf dieser Seite können Sie festlegen, wie Ihre Produktdetailseiten gestaltet werden sollen. Sie bestimmen selbst, welche Inhalte sichtbar sind, in welcher Reihenfolge diese erscheinen und wie umfangreich die Informationen sein sollen.",
  }
}</i18n>