<template>
  <div v-if="hasAnyInfo">
    <p v-if="manufacturerResponsibleInfo.name">{{ manufacturerResponsibleInfo.name }}</p>
    <p v-if="manufacturerResponsibleInfo.street || manufacturerResponsibleInfo.houseNo">
      {{ manufacturerResponsibleInfo.street }} {{ manufacturerResponsibleInfo.houseNo }}
    </p>
    <p
      v-if="
        manufacturerResponsibleInfo.postCode || manufacturerResponsibleInfo.town || manufacturerResponsibleInfo.country
      "
    >
      {{ manufacturerResponsibleInfo.postCode }} {{ manufacturerResponsibleInfo.town }},&nbsp;
      {{ manufacturerResponsibleInfo.country }}
    </p>
    <p v-if="manufacturerResponsibleInfo.phoneNo">{{ t('phone') }}: {{ manufacturerResponsibleInfo.phoneNo }}</p>
    <p v-if="manufacturerResponsibleInfo.email">{{ t('email') }}: {{ manufacturerResponsibleInfo.email }}</p>
  </div>
  <div v-else>
    {{ t('manufacturer.noResponsibleInformation') }}
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { type ManufacturerResponsibleInfoProps } from '~/components/ManufacturerResponsibleInfo/types';

const props = defineProps<ManufacturerResponsibleInfoProps>();
const { t } = useI18n();

const manufacturerResponsibleInfo = computed(() => ({
  name: productGetters.getManufacturerResponsibleName(props.product),
  street: productGetters.getManufacturerResponsibleStreet(props.product),
  houseNo: productGetters.getManufacturerResponsibleHouseNo(props.product),
  postCode: productGetters.getManufacturerResponsiblePostCode(props.product),
  town: productGetters.getManufacturerResponsibleTown(props.product),
  country: productGetters.getManufacturerResponsibleCountry(props.product),
  email: productGetters.getManufacturerResponsibleEmail(props.product),
  phoneNo: productGetters.getManufacturerResponsiblePhoneNo(props.product),
}));

const hasAnyInfo = computed(() => {
  const info = manufacturerResponsibleInfo.value;
  return Object.values(info).some(Boolean);
});
</script>
