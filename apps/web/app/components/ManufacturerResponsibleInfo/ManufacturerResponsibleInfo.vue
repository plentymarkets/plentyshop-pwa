<template>
  <div v-if="hasAnyInfo" class="py-2 px-4">
    <h4 class="typography-headline-4 font-bold text-neutral-900">
      {{ t('manufacturer.responsibleHeader') }}
    </h4>
    <p class="mb-2">{{ t('manufacturer.responsibleSubtitle') }}</p>

    <div class="border-2 py-2 px-4">
      <p v-if="manufacturerResponsibleInfo.name" data-testid="manufacturer-responsible-info-name">
        {{ manufacturerResponsibleInfo.name }}
      </p>
      <p
        v-if="manufacturerResponsibleInfo.street || manufacturerResponsibleInfo.houseNo"
        data-testid="manufacturer-responsible-info-street"
      >
        {{ manufacturerResponsibleInfo.street }} {{ manufacturerResponsibleInfo.houseNo }}
      </p>
      <p
        v-if="
          manufacturerResponsibleInfo.postCode ||
          manufacturerResponsibleInfo.town ||
          manufacturerResponsibleInfo.country
        "
        data-testid="manufacturer-responsible-info-postcode"
      >
        {{ manufacturerResponsibleInfo.postCode }}
        <span v-if="manufacturerResponsibleInfo.town"> {{ manufacturerResponsibleInfo.town }}</span>
        <span v-if="manufacturerResponsibleInfo.town && manufacturerResponsibleInfo.country">, &nbsp;</span>
        <span v-if="manufacturerResponsibleInfo.country">{{ manufacturerResponsibleInfo.country.name }}</span>
      </p>
      <p v-if="manufacturerResponsibleInfo.phoneNo" data-testid="manufacturer-responsible-info-phone">
        {{ t('phone') }}: {{ manufacturerResponsibleInfo.phoneNo }}
      </p>
      <p v-if="manufacturerResponsibleInfo.email" data-testid="manufacturer-responsible-info-email">
        {{ t('email') }}: {{ manufacturerResponsibleInfo.email }}
      </p>
      <p v-if="manufacturerResponsibleInfo.responsibleContactUrl">
        {{ t('responsibleContactUrl') }}: {{ manufacturerResponsibleInfo.responsibleContactUrl }}
      </p>
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
  responsibleContactUrl: manufacturerGetters.getManufacturerResponsibleContactUrl(manufacturer),
}));

const hasAnyInfo = computed(() => {
  const info = manufacturerResponsibleInfo.value;
  return Object.values(info).some(Boolean);
});
</script>
