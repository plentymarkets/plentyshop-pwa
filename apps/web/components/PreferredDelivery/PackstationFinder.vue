<template>
  <div
    v-if="deliveryLocationAvailable"
    class="flex flex-col my-6 md:mx-4 p-4 rounded-md shadow-[inset_0_0_0_0.1rem_rgb(255,204,0)]"
    data-testid="preferred-delivery-location-finder"
  >
    <header class="w-full flex items-center justify-between gap-4">
      <h3 class="font-bold">{{ $t('PreferredDelivery.packstation.title') }}</h3>
      <NuxtImg
        ref="img"
        src="/_nuxt-plenty/images/preferredDelivery/plugin-icon.svg"
        alt="DHL logo"
        width="130"
        height="auto"
        loading="lazy"
        class="block rounded-lg bg-[rgb(255,204,0)] p-3"
      />
    </header>

    <div class="mt-3">{{ $t('PreferredDelivery.packstation.containerTextInfo') }}</div>

    <form novalidate @submit.prevent="validateAndSubmitForm">
      <div class="mt-4 sm:flex sm:gap-4">
        <label class="sm:basis-[50%]">
          <UiFormLabel>{{ $t('PreferredDelivery.packstation.streetLabel') }}</UiFormLabel>
          <SfInput
            v-model="street"
            v-bind="streetAttributes"
            :invalid="Boolean(errors['searchParams.street'])"
            type="text"
            name="street"
            :placeholder="$t('PreferredDelivery.packstation.streetPlaceholder')"
          />
        </label>

        <label class="sm:basis-[25%]">
          <UiFormLabel class="mt-4 sm:mt-0">{{ $t('PreferredDelivery.packstation.zipcodeLabel') }}</UiFormLabel>
          <SfInput
            v-model="zipcode"
            v-bind="zipcodeAttributes"
            :invalid="Boolean(errors['searchParams.zipcode'])"
            type="text"
            name="zipcode"
            :placeholder="$t('PreferredDelivery.packstation.zipcodePlaceholder')"
          />
        </label>

        <label class="sm:basis-[25%]">
          <UiFormLabel class="mt-4 sm:mt-0">{{ $t('PreferredDelivery.packstation.cityLabel') }}</UiFormLabel>
          <SfInput
            v-model="city"
            v-bind="cityAttributes"
            :invalid="Boolean(errors['searchParams.city'])"
            type="text"
            name="city"
            :placeholder="$t('PreferredDelivery.packstation.cityPlaceholder')"
          />
        </label>
      </div>

      <ErrorMessage
        v-if="!street && !zipcode && !city"
        as="div"
        class="flex text-negative-700 text-sm mt-2"
        name="searchParams.street"
      />

      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3 mt-4">
        <label
          for="DHL-type-packstation"
          class="order-1 sm:order-2 inline-flex items-center gap-2 select-none font-semibold cursor-pointer w-fit"
        >
          <SfCheckbox id="DHL-type-packstation" v-model="data.searchParams.searchPackstation" />
          {{ $t('PreferredDelivery.packstation.dropDownValues.packstation') }}
        </label>

        <label
          for="DHL-type-postal-outlet"
          class="order-2 sm:order-3 inline-flex items-center gap-2 select-none font-semibold cursor-pointer w-fit mt-2 sm:mt-0"
        >
          <SfCheckbox id="DHL-type-postal-outlet" v-model="data.searchParams.searchPostfilial" />
          {{ $t('PreferredDelivery.packstation.dropDownValues.postfilial') }}
        </label>

        <UiButton type="submit" :disabled="loading" variant="secondary" class="order-3 sm:order-1 w-fit mt-3 sm:mt-0">
          {{ $t('PreferredDelivery.packstation.search') }}
        </UiButton>
      </div>
    </form>

    <div v-if="data.packstations.length" class="mt-4 flex flex-col sm:flex-row gap-1">
      <div class="rounded-md h-96 sm:h-auto min-h-80 flex-1 sm:basis-[70%] min-w-0 order-1 sm:order-2">cristi</div>
      >

      <ul class="space-y-4 h-96 max-h-96 overflow-y-auto flex-1 sm:basis-[30%] w-full order-2 sm:order-1 mt-3 sm:mt-0">
        <li v-for="(station, index) in data.packstations" :key="index" class="mr-0 sm:mr-3">
          <button
            type="button"
            class="w-full text-left p-3 rounded-md border border-gray-300 hover:border-[rgb(255,204,0)] hover:bg-[rgb(255,204,0)] active:bg-[rgb(255,204,0)] transition-colors duration-150 focus:outline-none"
            @click="handleStationSelection(station)"
          >
            <div class="flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <p
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-white text-xs',
                    station.location.keyword === 'Packstation' ? 'bg-red-500' : 'bg-blue-500',
                  ]"
                >
                  {{ station.location.keyword }}
                </p>

                <span class="text-sm text-gray-500 font-semibold flex justify-between items-center">
                  <SfIconLocationOn size="xs" />
                  {{ (station.distance / 1000).toFixed(2) }} km
                </span>
              </div>

              <p class="font-semibold">{{ station.name }}</p>

              <p class="text-sm">
                {{ station.place.address.streetAddress }}
                <br />
                {{ station.place.address.postalCode }} {{ station.place.address.addressLocality }}
              </p>
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate';
import { SfCheckbox, SfIconLocationOn, SfInput } from '@storefront-ui/vue';
import type { Packstation } from '@plentymarkets/shop-api';

const { loading, data, getShippingProfilesData, deliveryLocationAvailable, validationSchema, submitForm } =
  usePackstationFinder();
const { handleSubmit, errors, validate, defineField } = useForm({ validationSchema: validationSchema });

const [street, streetAttributes] = defineField('searchParams.street');
const [zipcode, zipcodeAttributes] = defineField('searchParams.zipcode');
const [city, cityAttributes] = defineField('searchParams.city');

watch([street, zipcode, city], () => {
  data.value.searchParams.street = street.value as string;
  data.value.searchParams.zipcode = zipcode.value as string;
  data.value.searchParams.city = city.value as string;
});

const validateAndSubmitForm = async () => {
  const formData = await validate();
  if (formData.valid) handleSubmit(() => submitForm())();
};

const handleStationSelection = (station: Packstation) => {
  // console.log('Selected station:', station);
};

const gmapsApiKey = computed(() => data.value.preferredProfilesData.gmapsApiKey);

onNuxtReady(async () => {
  await getShippingProfilesData();
});
</script>

<style scoped>
/* Firefox */
ul {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Chrome, Edge, Safari, ...  */
ul::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}

ul::-webkit-scrollbar-track {
  background: transparent;
  box-shadow: none;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}
</style>
