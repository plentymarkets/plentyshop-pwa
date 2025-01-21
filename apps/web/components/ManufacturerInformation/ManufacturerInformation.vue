<template>
  <div v-if="hasAnyInfo" class="py-2 px-4">
    <h4 class="typography-headline-4 font-bold text-neutral-900">
      {{ t('manufacturer.header') }}
    </h4>
    <p class="mb-2">{{ t('manufacturer.subtitle') }}</p>

    <div class="border-2 py-2 px-4">
      <p v-if="manufacturerInfo.logo">
        <NuxtImg :src="manufacturerInfo.logo" :alt="t('manufacturer.logoAlt')" loading="lazy" />
      </p>
      <p v-if="manufacturerInfo.name" data-testid="manufacturerInfo-name">{{ manufacturerInfo.name }}</p>
      <p v-else-if="manufacturerInfo.externalName">{{ manufacturerInfo.externalName }}</p>
      <p v-if="manufacturerInfo.legalName">{{ manufacturerInfo.legalName }}</p>
      <p v-if="manufacturerInfo.street || manufacturerInfo.houseNo">
        {{ manufacturerInfo.street }} {{ manufacturerInfo.houseNo }}
      </p>
      <p v-if="manufacturerInfo.postcode || manufacturerInfo.town || manufacturerInfo.country">
        {{ manufacturerInfo.postcode }}
        <span v-if="manufacturerInfo.town"> {{ manufacturerInfo.town }},&nbsp;</span>
        {{ manufacturerInfo.country }}
      </p>
      <p v-if="manufacturerInfo.phoneNumber">{{ t('phone') }}: {{ manufacturerInfo.phoneNumber }}</p>
      <p v-if="manufacturerInfo.faxNumber">{{ t('fax') }}: {{ manufacturerInfo.faxNumber }}</p>
      <p v-if="manufacturerInfo.email">{{ t('email') }}: {{ manufacturerInfo.email }}</p>
      <p v-if="manufacturerInfo.contactUrl">{{ t('contactUrl') }}: {{ manufacturerInfo.contactUrl }}</p>
      <p v-if="manufacturerInfo.url">
        <a :href="manufacturerInfo.url" target="_blank">{{ t('homepage') }}: {{ manufacturerInfo.url }}</a>
      </p>
    </div>
  </div>
  <div v-else>
    {{ t('manufacturer.noInformation') }}
  </div>
</template>

<script setup lang="ts">
import { productGetters, manufacturerGetters } from '@plentymarkets/shop-api';
import type { ManufacturerInformationProps } from '~/components/ManufacturerInformation/types';

const props = defineProps<ManufacturerInformationProps>();
const { t } = useI18n();

const manufacturer = productGetters.getManufacturer(props.product);
const country = manufacturerGetters.getManufacturerCountry(manufacturer);

const manufacturerInfo = computed(() => {
  return {
    logo: manufacturerGetters.getManufacturerLogo(manufacturer),
    name: manufacturerGetters.getManufacturerName(manufacturer),
    externalName: manufacturerGetters.getManufacturerExternalName(manufacturer),
    legalName: manufacturerGetters.getManufacturerLegalName(manufacturer),
    street: manufacturerGetters.getManufacturerStreet(manufacturer),
    houseNo: manufacturerGetters.getManufacturerHouseNo(manufacturer),
    postcode: manufacturerGetters.getManufacturerPostCode(manufacturer),
    town: manufacturerGetters.getManufacturerTown(manufacturer),
    country: Object.keys(country).length > 0 ? country : null,
    email: manufacturerGetters.getManufacturerEmail(manufacturer),
    phoneNumber: manufacturerGetters.getManufacturerPhoneNumber(manufacturer),
    faxNumber: manufacturerGetters.getManufacturerFaxNumber(manufacturer),
    contactUrl: manufacturerGetters.getManufacturerContactUrl(manufacturer),
    url: manufacturerGetters.getManufacturerUrl(manufacturer),
  };
});

const hasAnyInfo = computed(() => {
  const info = manufacturerInfo.value;
  return Object.values(info).some(Boolean);
});
</script>
