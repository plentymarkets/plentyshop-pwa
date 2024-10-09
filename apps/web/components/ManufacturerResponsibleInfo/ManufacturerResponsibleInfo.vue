<template>
  <div v-if="hasAnyInfo" class="py-2 px-4">
    <h4 class="typography-headline-4 font-bold text-neutral-900">
      {{ t('manufacturer.responsibleHeader') }}
    </h4>
    <p class="mb-2">{{ t('manufacturer.responsibleSubtitle') }}</p>

    <div class="border-2 py-2 px-4">
      <p v-if="manufacturerResponsibleInfo.name">{{ manufacturerResponsibleInfo.name }}</p>
      <p v-if="manufacturerResponsibleInfo.street || manufacturerResponsibleInfo.houseNo">
        {{ manufacturerResponsibleInfo.street }} {{ manufacturerResponsibleInfo.houseNo }}
      </p>
      <p
        v-if="
          manufacturerResponsibleInfo.postCode ||
          manufacturerResponsibleInfo.town ||
          manufacturerResponsibleInfo.country
        "
      >
        {{ manufacturerResponsibleInfo.postCode }}
        <span v-if="manufacturerResponsibleInfo.town"> {{ manufacturerResponsibleInfo.town }},&nbsp;</span>
        {{ manufacturerResponsibleInfo.country }}
      </p>
      <p v-if="manufacturerResponsibleInfo.phoneNo">{{ t('phone') }}: {{ manufacturerResponsibleInfo.phoneNo }}</p>
      <p v-if="manufacturerResponsibleInfo.email">{{ t('email') }}: {{ manufacturerResponsibleInfo.email }}</p>
    </div>
  </div>
  <div v-else>
    {{ t('manufacturer.noResponsibleInformation') }}
  </div>
</template>

<script setup lang="ts">
import { manufacturerGetters, productGetters } from '@plentymarkets/shop-api';
import type { ManufacturerResponsibleInfoProps } from '~/components/ManufacturerResponsibleInfo/types';

const props = defineProps<ManufacturerResponsibleInfoProps>();
const { t } = useI18n();

const manufacturer = productGetters.getManufacturer(props.product);
const country = manufacturerGetters.getManufacturerResponsibleCountry(manufacturer);

const manufacturerResponsibleInfo = computed(() => ({
  name: manufacturerGetters.getManufacturerResponsibleName(manufacturer),
  street: manufacturerGetters.getManufacturerResponsibleStreet(manufacturer),
  houseNo: manufacturerGetters.getManufacturerResponsibleHouseNo(manufacturer),
  postCode: manufacturerGetters.getManufacturerResponsiblePostCode(manufacturer),
  town: manufacturerGetters.getManufacturerResponsibleTown(manufacturer),
  country: Object.keys(country).length > 0 ? country : null,
  email: manufacturerGetters.getManufacturerResponsibleEmail(manufacturer),
  phoneNo: manufacturerGetters.getManufacturerResponsiblePhoneNo(manufacturer),
}));

const hasAnyInfo = computed(() => {
  const info = manufacturerResponsibleInfo.value;
  return Object.values(info).some(Boolean);
});
</script>
