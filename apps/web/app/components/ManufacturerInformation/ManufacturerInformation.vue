<template>
  <div v-if="hasAnyInfo" class="py-2 px-4">
    <h4 class="typography-headline-4 font-bold text-neutral-900">
      {{ t('manufacturer.header') }}
    </h4>
    <p class="mb-2">{{ t('manufacturer.subtitle') }}</p>

    <div class="border-2 py-2 px-4">
      <p v-if="shouldShow('manufacturerLogo') && manufacturerInfo.logo">
        <NuxtImg :src="manufacturerInfo.logo" :alt="t('manufacturer.logoAlt')" loading="lazy" />
      </p>

      <p v-if="shouldShow('manufacturerName') && manufacturerInfo.name" data-testid="manufacturerInfo-name">
        {{ manufacturerInfo.name }}
      </p>
      <p v-else-if="shouldShow('manufacturerExternalName') && manufacturerInfo.externalName">
        {{ manufacturerInfo.externalName }}
      </p>

      <p v-if="shouldShow('manufacturerLegalName') && manufacturerInfo.legalName">
        {{ manufacturerInfo.legalName }}
      </p>

      <p
        v-if="
          (shouldShow('manufacturerStreet') && manufacturerInfo.street) ||
          (shouldShow('manufacturerHouseNo') && manufacturerInfo.houseNo)
        "
      >
        <span v-if="shouldShow('manufacturerStreet') && manufacturerInfo.street">{{ manufacturerInfo.street }}</span>
        <span v-if="shouldShow('manufacturerHouseNo') && manufacturerInfo.houseNo">
          {{ manufacturerInfo.houseNo }}</span
        >
      </p>

      <p
        v-if="
          (shouldShow('manufacturerPostcode') && manufacturerInfo.postcode) ||
          (shouldShow('manufacturerTown') && manufacturerInfo.town) ||
          (shouldShow('manufacturerCountryId') && manufacturerInfo.country)
        "
      >
        <span v-if="shouldShow('manufacturerPostcode') && manufacturerInfo.postcode">{{
          manufacturerInfo.postcode
        }}</span>
        <span v-if="shouldShow('manufacturerTown') && manufacturerInfo.town"> {{ manufacturerInfo.town }},&nbsp;</span>
        <span v-if="shouldShow('manufacturerCountryId') && manufacturerInfo.country">{{
          manufacturerInfo.country
        }}</span>
      </p>

      <p v-if="shouldShow('manufacturerPhoneNumber') && manufacturerInfo.phoneNumber">
        {{ t('phone') }}: {{ manufacturerInfo.phoneNumber }}
      </p>

      <p v-if="shouldShow('manufacturerFaxNumber') && manufacturerInfo.faxNumber">
        {{ t('fax') }}: {{ manufacturerInfo.faxNumber }}
      </p>

      <p v-if="shouldShow('manufacturerEmail') && manufacturerInfo.email">
        {{ t('email') }}: {{ manufacturerInfo.email }}
      </p>

      <p v-if="shouldShow('manufacturerContactUrl') && manufacturerInfo.contactUrl">
        {{ t('contactUrl') }}: {{ manufacturerInfo.contactUrl }}
      </p>

      <p v-if="shouldShow('manufacturerUrl') && manufacturerInfo.url">
        <NuxtLink :to="manufacturerInfo.url" target="_blank">{{ t('homepage') }}: {{ manufacturerInfo.url }}</NuxtLink>
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

const settings = reactive({} as Record<string, string>);

const settingKeys = [
  'manufacturerName',
  'manufacturerExternalName',
  'manufacturerLegalName',
  'manufacturerLogo',
  'manufacturerUrl',
  'manufacturerStreet',
  'manufacturerHouseNo',
  'manufacturerPostcode',
  'manufacturerTown',
  'manufacturerCountryId',
  'manufacturerPhoneNumber',
  'manufacturerFaxNumber',
  'manufacturerEmail',
  'manufacturerContactUrl',
];

settingKeys.forEach((key: string) => {
  const { getSetting } = useSiteSettings(key);
  settings[key] = getSetting();
});

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

const shouldShow = (field: string) => {
  return settings[field] === '1';
};

const hasAnyInfo = computed(() => {
  const info = manufacturerInfo.value;

  return Object.entries(info).some(([key, value]) => {
    const settingKey = `manufacturer${key.charAt(0).toUpperCase() + key.slice(1)}`;
    return shouldShow(settingKey) && Boolean(value);
  });
});
</script>
