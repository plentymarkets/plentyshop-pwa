<template>
  <div
    v-if="deliveryLocationAvailable"
    class="flex flex-col my-6 p-4 rounded-md shadow-[inset_0_0_0_0.1rem_rgb(255,204,0)]"
    data-testid="preferred-delivery-location-finder"
  >
    <UiAccordionItem
      v-model="packstationAccordionOpen"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none"
    >
      <template #summary>
        <header class="w-full flex items-center justify-between gap-4">
          <h2 class="font-bold">{{ t('PreferredDelivery.packstation.title') }}</h2>
          <NuxtImg
            ref="img"
            src="/_nuxt-plenty/images/preferredDelivery/plugin-icon.svg"
            alt="DHL logo"
            width="100"
            height="auto"
            loading="lazy"
            class="block rounded-lg bg-[rgb(255,204,0)] p-3 mr-2 sm:mr-4"
          />
        </header>
      </template>

      <div class="mt-3">{{ t('PreferredDelivery.packstation.containerTextInfo') }}</div>

      <form novalidate @submit.prevent="validateAndSubmitForm">
        <div class="mt-4 sm:flex sm:gap-4">
          <label class="sm:basis-[50%]">
            <UiFormLabel>{{ t('PreferredDelivery.packstation.streetLabel') }}</UiFormLabel>
            <SfInput
              v-model="street"
              v-bind="streetAttributes"
              :invalid="Boolean(errors['searchParams.street'])"
              type="text"
              name="street"
              :placeholder="t('PreferredDelivery.packstation.streetPlaceholder')"
            />
          </label>

          <label class="sm:basis-[25%]">
            <UiFormLabel class="mt-4 sm:mt-0">{{ t('PreferredDelivery.packstation.zipcodeLabel') }}</UiFormLabel>
            <SfInput
              v-model="zipcode"
              v-bind="zipcodeAttributes"
              :invalid="Boolean(errors['searchParams.zipcode'])"
              type="text"
              name="zipcode"
              :placeholder="t('PreferredDelivery.packstation.zipcodePlaceholder')"
            />
          </label>

          <label class="sm:basis-[25%]">
            <UiFormLabel class="mt-4 sm:mt-0">{{ t('PreferredDelivery.packstation.cityLabel') }}</UiFormLabel>
            <SfInput
              v-model="city"
              v-bind="cityAttributes"
              :invalid="Boolean(errors['searchParams.city'])"
              type="text"
              name="city"
              :placeholder="t('PreferredDelivery.packstation.cityPlaceholder')"
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
            {{ t('PreferredDelivery.packstation.dropDownValues.packstation') }}
          </label>

          <label
            for="DHL-type-postal-outlet"
            class="order-2 sm:order-3 inline-flex items-center gap-2 select-none font-semibold cursor-pointer w-fit mt-2 sm:mt-0"
          >
            <SfCheckbox id="DHL-type-postal-outlet" v-model="data.searchParams.searchPostfilial" />
            {{ t('PreferredDelivery.packstation.dropDownValues.postfilial') }}
          </label>

          <UiButton
            type="submit"
            :disabled="loading"
            variant="secondary"
            class="order-3 sm:order-1 min-w-[120px] w-fit mt-3 sm:mt-0"
          >
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
            <template v-else>{{ t('PreferredDelivery.packstation.search') }}</template>
          </UiButton>
        </div>
      </form>

      <div v-if="data.packstations.length" class="mt-4 flex flex-col sm:flex-row gap-1">
        <div
          id="map"
          ref="mapElement"
          class="border border-gray-300 bg-gray-300 rounded-md h-96 sm:h-auto min-h-80 flex-1 sm:basis-[65%] min-w-0 order-1 sm:order-2"
        />

        <ul
          class="space-y-4 h-[520px] max-h-[520px] overflow-y-auto flex-1 sm:basis-[35%] w-full order-2 sm:order-1 mt-3 sm:mt-0"
        >
          <PreferredDeliveryPackstation
            v-for="(station, index) in data.packstations"
            :key="index"
            :station="station"
            :index="index"
            :is-active="currentPackstationIndex === index"
            :set-ref="(el) => (packstationRefs[index] = el as HTMLElement)"
            @on-station-select="showPackstationDetails(index, realMarkers[index])"
          />
        </ul>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate';
import { SfCheckbox, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const { loading, data, getShippingProfilesData, deliveryLocationAvailable, validationSchema, submitForm } =
  usePackstationFinder();

const { mapElement, packstationRefs, currentPackstationIndex, showPackstationDetails, realMarkers } =
  usePackstationMap();

const { t } = useI18n();
const { handleSubmit, errors, validate, defineField } = useForm({ validationSchema: validationSchema });

const [street, streetAttributes] = defineField('searchParams.street');
const [zipcode, zipcodeAttributes] = defineField('searchParams.zipcode');
const [city, cityAttributes] = defineField('searchParams.city');

const packstationAccordionOpen = ref(true);

const validateAndSubmitForm = async () => {
  const formData = await validate();
  if (formData.valid) handleSubmit(() => submitForm())();
};

onNuxtReady(async () => await getShippingProfilesData());

watch(street, (updatedStreet) => (data.value.searchParams.street = updatedStreet || ''));
watch(zipcode, (updatedZipcode) => (data.value.searchParams.zipcode = updatedZipcode || ''));
watch(city, (updatedCity) => (data.value.searchParams.city = updatedCity || ''));
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
