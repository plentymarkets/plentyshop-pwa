<template>
  <div v-if="manufacturerName || manufacturerExternalName">
    <p v-if="manufacturerName">{{ manufacturerName }}</p>
    <p v-if="manufacturerExternalName">{{ manufacturerExternalName }}</p>
  </div>
  <div v-else>
    {{ t('manufacturer.noInformation') }}
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { type ManufacturerInformationProps } from '~/components/ManufacturerInformation/types';

const props = defineProps<ManufacturerInformationProps>();
const { t } = useI18n();

const manufacturerName = computed(() => productGetters.getManufacturerName(props.product));
const manufacturerExternalName = computed(() => productGetters.getManufacturerExternalName(props.product));
</script>
