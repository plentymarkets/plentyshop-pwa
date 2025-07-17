<template>
  <div v-if="documents && documents.length > 0" data-testid="documents-list" class="documents-list">
    <UiButton
      v-for="(document, key) in documents"
      :key="key"
      class="mt-4 w-full cursor-pointer"
      variant="secondary"
      @click="downloadPDF(document, orderGetters.getAccessKey(props.order))"
    >
      {{ getDocumentName(document) }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { OrderDocument } from '@plentymarkets/shop-api';
import { orderDocumentGetters, orderGetters } from '@plentymarkets/shop-api';
import type { DocumentsListProps } from './types';

const props = defineProps<DocumentsListProps>();

const documents = computed(() => orderGetters.getDocuments(props.order));

const { data, getDocument, downloadFile } = useOrderDocument();

const { t } = useI18n();

const translations = {
  correction_document: t('documents.correctionDocuments'),
  credit_note: t('documents.Credit Note'),
  delivery_note: t('documents.Delivery Note'),
  dunning_letter: t('documents.Dunning Letter'),
  invoice_external: t('documents.Invoice External'),
  invoice: t('documents.Invoice'),
  offer: t('documents.Offer'),
  order_confirmation: t('documents.Order Confirmation'),
  pickup_delivery: t('documents.Pickup Delivery'),
  pro_forma_invoice: t('documents.Pro Forma Invoice'),
  receipt: t('documents.Receipt'),
  return_note: t('documents.Return Note'),
  success_confirmation: t('documents.Success Confirmation'),
  reversal_document: t('documents.Reversal Document'),
};

const getTypeName = (type: string) => {
  return translations[type as keyof typeof translations];
};

const getDocumentName = (document: OrderDocument) => {
  return getTypeName(orderDocumentGetters.getType(document)) || orderDocumentGetters.getNumberWithPrefix(document);
};

const downloadPDF = async (document: OrderDocument, accessKey: string) => {
  await getDocument(document, accessKey);

  const name = document.path.split('/').join('_');

  downloadFile(data.value, name, 'application/pdf');
};
</script>
