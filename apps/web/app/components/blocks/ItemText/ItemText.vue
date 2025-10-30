<template>
  <div :style="inlineStyle">
    <UiAccordionItem
      v-if="displayAsCollapsable"
      v-model="initiallyCollapsed"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <h2 class="font-bold text-lg leading-6 md:text-2xl">
          {{ title }}
        </h2>
      </template>
      <div v-if="text" class="no-preflight" v-html="text" />
    </UiAccordionItem>
    <div v-else>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        {{ title }}
      </h2>
      <div v-if="text" class="no-preflight" v-html="text" />
    </div>
    <UiDivider v-if="initiallyCollapsed && text?.length" class="mb-2 mt-2" />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ItemTextProps } from './types';
const props = defineProps<ItemTextProps>();
const title = computed(() => props.content?.title);
const initiallyCollapsed = computed(() => props.content?.initiallyCollapsed);
const displayAsCollapsable = computed(() => props.content?.displayAsCollapsable);
const { currentProduct } = useProducts();
const { locale } = useI18n();

const dummyListEN =
  '- Adding links</br>- Inserting small images or icons</br>- Creating clear and structured tables</br>- Using paragraphs and lists for better readability</br>- And much more.';
const dummyEN =
  "On this page, you can define how your item detail pages should be structured. You decide which content is visible, in what order the elements appear, and how much information you want to provide. To edit the content, hover your mouse over an element and <span style='color:purple'> then click the  purple pencil icon.</span></br></br>The field you are currently looking at is the item text. This is a free text field that can be as long as you like. Use this space to give your customers detailed information about the item, such as special features or possible uses.</br></br>The text you see here is, of course, just placeholder text. It is meant to show you where the item description will be positioned on the item detail page and how it will be displayed.</br></br>The actual item texts are managed in the backend, within the item management section. There, you have a variety of formatting options to help you present your content in an attractive way, such as:" +
  dummyListEN +
  '</br>Make use of these features to customize your item detail pages and create a convincing and enjoyable shopping experience for your customers.';

const dummyListDE =
  '</br>- Einfügen von Links</br>-Integration von kleinen Bildern oder Icons</br>-Erstellen übersichtlicher Tabellen</br>-Verwendung von Absätzen und Listen zur besseren Strukturierung</br>-und vieles mehr.<br>';
const dummyDE =
  "Auf dieser Seite können Sie festlegen, wie Ihre Produktdetailseiten gestaltet werden sollen. Sie bestimmen selbst, welche Inhalte sichtbar sind, in welcher Reihenfolge diese erscheinen und wie umfangreich die Informationen sein sollen. Um die Bearbeitung zu starten, bewegen Sie die Maus über ein Element und <span style='color:purple'> klicken Sie auf den lilafarbenen Stift.</br></span></br>Das Feld, das Sie hier gerade sehen, ist der Artikeltext. Hierbei handelt es sich um einen Fließtext, der beliebig lang sein darf. Nutzen Sie diesen Platz, um Ihren Kundinnen und Kunden ausführliche Informationen zu Ihrem Produkt bereitzustellen, zum Beispiel besondere Merkmale oder Einsatzmöglichkeiten<br></br>Der Text, den Sie aktuell sehen, ist selbstverständlich nur ein Platzhaltertext. Er dient dazu, Ihnen zu veranschaulichen, an welcher Stelle die Produktbeschreibung auf der Produktdetailseite angezeigt wird und wie diese optisch eingebettet ist.</br><br>Die eigentlichen Artikeltexte verwalten Sie im Backend in der Artikelverwaltung. Dort stehen Ihnen zahlreiche Formatierungsmöglichkeiten zur Verfügung, mit denen Sie Ihre Inhalte ansprechend gestalten können, zum Beispiel:" +
  dummyListDE +
  'Nutzen Sie diese Funktionen, um Ihre Produktseiten individuell zu gestalten und ein überzeugendes Einkaufserlebnis zu schaffen.';

const vhtmlTranslations = {
  en: dummyEN,
  de: dummyDE,
};

const text = computed(() => {
  return (
    productGetters.getDescription(currentProduct.value) ??
    vhtmlTranslations[locale.value as keyof typeof vhtmlTranslations] ??
    ''
  );
});
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
