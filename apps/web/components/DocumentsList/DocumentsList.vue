<template>
  <div v-if="documents && documents.length > 0" data-testid="documents-list" class="documents-list">
    <SfButton
      v-for="(document, key) in documents"
      :key="key"
      :tag="NuxtLink"
      target="_blank"
      @click="downloadFile(document, accessKey)"
      class="mt-4 w-full cursor-pointer"
      variant="secondary"
    >
      {{ getTypeName(orderDocumentGetters.getType(document)) }}
    </SfButton>
  </div>
</template>

<script setup lang="ts">
import { OrderDocument } from '@plentymarkets/shop-api';
import { orderDocumentGetters } from '@plentymarkets/shop-sdk';
import { SfButton } from '@storefront-ui/vue';
import type { DocumentsListProps } from './types';

defineProps<DocumentsListProps>();

const download = (bufferArray: number[], name: string, type: string) => {
  const base64PDF = window.btoa(String.fromCharCode.apply(null, bufferArray));

  let link = document.createElement('a');
  link.href = `data:${type};base64,${base64PDF}`;
  link.download = name;
  link.click();

  setTimeout(() => {
    link.remove();
    window.URL.revokeObjectURL(link.href);
  }, 200);
};

const { data, getDocument } = useOrderDocument();

const i18n = useI18n();

const translations = {
  correction_document: i18n.t('documents.correctionDocuments'),
  credit_note: i18n.t('documents.Credit Note'),
  delivery_note: i18n.t('documents.Delivery Note'),
  dunning_letter: i18n.t('documents.Dunning Letter'),
  invoice_external: i18n.t('documents.Invoice External'),
  invoice: i18n.t('documents.Invoice'),
  offer: i18n.t('documents.Offer'),
  order_confirmation: i18n.t('documents.Order Confirmation'),
  pickup_delivery: i18n.t('documents.Pickup Delivery'),
  pro_forma_invoice: i18n.t('documents.Pro Forma Invoice'),
  receipt: i18n.t('documents.Receipt'),
  return_note: i18n.t('documents.Return Note'),
  success_confirmation: i18n.t('documents.Success Confirmation'),
  reversal_document: i18n.t('documents.Reversal Document'),
};

const getTypeName = (type: string) => {
  return translations[type as keyof typeof translations];
};

const downloadFile = async (document: OrderDocument, accessKey: string) => {
  await getDocument(document, accessKey);

  const name = document.path.replaceAll('/', '_');

  download(data.value, name, 'application/pdf');
};

const NuxtLink = resolveComponent('NuxtLink');
</script>
