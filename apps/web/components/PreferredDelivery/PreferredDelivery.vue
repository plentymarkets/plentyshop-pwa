<template>
  <div
    v-if="preferredDeliveryAvailable"
    class="flex flex-col my-6 md:mx-4 p-4 rounded-md shadow-[inset_0_0_0_0.1rem_rgb(255,204,0)]"
    data-testid="preferred-delivery"
  >
    <header class="w-full">
      <NuxtImg
        ref="img"
        src="/_nuxt-plenty/images/preferredDelivery/plugin-icon.svg"
        alt="dhl logo"
        width="256"
        height="auto"
        loading="lazy"
        class="block rounded-lg bg-[rgb(255,204,0)] p-3"
      />
      <h3 class="font-bold mt-4">{{ $t('PreferredDelivery.general.wunschpaketTitle') }}</h3>
    </header>

    <div class="mt-2">{{ $t('PreferredDelivery.general.wunschpaketIntroduction') }}</div>
    <div>{{ $t('PreferredDelivery.general.wunschpaketOptions') }}</div>

    <form novalidate @submit.prevent="validateAndSubmitForm">
      <template v-if="data.day.enabled">
        <div class="mt-3" data-testid="preferred-delivery-day">
          <div class="inline-flex items-center">
            <label
              for="wunschtag-title"
              class="inline-flex items-center flex-row gap-2 select-none font-semibold cursor-pointer"
            >
              <SfCheckbox id="wunschtag-title" v-model="data.day.checked" @change="dayCheckboxChange" />
              {{ $t('PreferredDelivery.general.wunschtagTitle') }}
            </label>
            <SfTooltip :label="$t('PreferredDelivery.general.wunschtagTooltip')" :show-arrow="true" class="ml-1">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
        </div>

        <div class="my-2">
          {{
            $t('PreferredDelivery.general.wunschpaketAdditionalCharge', {
              additionalCharge: data.additionalCharge,
              currency: currency,
            })
          }}
        </div>

        <div class="grid gap-1 grid-cols-3 md:grid-cols-6 mt-1">
          <label v-for="(day, index) in data.preferredDays" :key="`preferred-day-${index}`">
            <input
              type="radio"
              class="peer sr-only"
              :value="day.date"
              :checked="isDayChecked(index)"
              @click="handleDayChange(index)"
            />
            <span
              class="h-20 flex flex-col items-center justify-center py-4 px-1 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-50 hover:bg-primary-50 active:border-[rgb(255,204,0)] active:bg-[rgb(255,204,0)] peer-checked:border-[rgb(255,204,0)] peer-checked:bg-[rgb(255,204,0)] peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed select-none"
            >
              {{ `${day.dayName} ${day.dayNumber}` }}
            </span>
          </label>
        </div>
      </template>

      <template v-if="data.location.enabled">
        <div class="mt-4">
          <div class="inline-flex items-center">
            <label
              for="wunschort-title"
              class="inline-flex items-center flex-row gap-2 select-none font-semibold cursor-pointer"
            >
              <SfCheckbox id="wunschort-title" v-model="data.location.checked" @change="toggleOption('location')" />
              {{ $t('PreferredDelivery.general.wunschortTitle') }}
            </label>
            <SfTooltip :label="$t('PreferredDelivery.general.wunschortTooltip')" :show-arrow="true" class="ml-1">
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
        </div>

        <SfInput
          v-model="locationValue"
          type="text"
          name="location"
          v-bind="locationValueAttributes"
          :invalid="Boolean(errors['location.value'])"
          :placeholder="$t('PreferredDelivery.general.wunschortExample')"
          wrapper-class="mt-4"
        />
        <ErrorMessage as="span" name="location.value" class="flex text-negative-700 text-sm mt-2" />
      </template>

      <template v-if="data.neighbour.enabled">
        <div class="mt-4">
          <div class="inline-flex items-center">
            <label
              for="wunschnachbar-title"
              class="inline-flex items-center flex-row gap-2 select-none font-semibold cursor-pointer"
            >
              <SfCheckbox
                id="wunschnachbar-title"
                v-model="data.neighbour.checked"
                @change="toggleOption('neighbour')"
              />
              {{ $t('PreferredDelivery.general.wunschnachbarTitle') }}
            </label>
            <SfTooltip
              :label="$t('PreferredDelivery.general.wunschnachbarTooltip')"
              :show-arrow="true"
              class="ml-1"
            >
              <SfIconInfo :size="'sm'" />
            </SfTooltip>
          </div>
        </div>

        <SfInput
          v-model="neighbourName"
          type="text"
          name="neighbourName"
          v-bind="neighbourNameAttributes"
          :invalid="Boolean(errors['neighbour.name'])"
          :placeholder="$t('PreferredDelivery.general.wunschnachbarExampleName')"
          wrapper-class="mt-4"
        />
        <ErrorMessage as="span" name="neighbour.name" class="flex text-negative-700 text-sm mt-2" />

        <SfInput
          v-model="neighbourAddress"
          type="text"
          name="neighbourAddress"
          v-bind="neighbourAddressAttributes"
          :invalid="Boolean(errors['neighbour.address'])"
          :placeholder="$t('PreferredDelivery.general.wunschnachbarExampleAddress')"
          wrapper-class="mt-4"
        />
        <ErrorMessage as="span" name="neighbour.address" class="flex text-negative-700 text-sm mt-2" />
      </template>

      <UiButton type="submit" variant="secondary" class="mt-4 w-fit">
        {{ $t('PreferredDelivery.general.apply') }}
      </UiButton>
    </form>
  </div>

  <UiDivider v-if="preferredDeliveryAvailable" class="w-screen md:w-auto -mx-4 md:mx-0" />
</template>

<script setup lang="ts">
import { AddressType } from '@plentymarkets/shop-api';
import { SfCheckbox, SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import { ErrorMessage, useForm } from 'vee-validate';
import type { PreferredOptionTypes } from './types';

const {
  data,
  dayCheckboxChange,
  getPreferredProfiles,
  getPreferredDeliveryServices,
  handleDayChange,
  isDayChecked,
  submitForm,
  validationSchema,
  shippingMethodHasPreferredDelivery,
  preferredDeliveryAvailable,
  currency,
} = usePreferredDelivery();
const { defineField, errors, validate, handleSubmit } = useForm({ validationSchema: validationSchema });
const { checkoutAddress: shippingAddress } = useCheckoutAddress(AddressType.Shipping);

onNuxtReady(() => getPreferredProfiles());

const [locationValue, locationValueAttributes] = defineField('location.value');
const [neighbourName, neighbourNameAttributes] = defineField('neighbour.name');
const [neighbourAddress, neighbourAddressAttributes] = defineField('neighbour.address');

const resetPreferredOption = (option: PreferredOptionTypes) => {
  data.value[option].checked = false;

  if (option === 'location') {
    locationValue.value = '';
    return;
  }

  neighbourName.value = '';
  neighbourAddress.value = '';
};

const toggleOption = (option: PreferredOptionTypes) => {
  if (!data.value[option].checked) resetPreferredOption(option);

  if (data.value.location.checked && data.value.neighbour.checked) {
    resetPreferredOption(option === 'location' ? 'neighbour' : 'location');
  }
};

watch(locationValue, (newLocation) => {
  if (newLocation) {
    resetPreferredOption('neighbour');
    data.value.location.checked = true;
  }
});

watch([neighbourName, neighbourAddress], ([newNeighbourName, newNeighbourAddress]) => {
  if (newNeighbourName || newNeighbourAddress) {
    resetPreferredOption('location');
    data.value.neighbour.checked = true;
  }
});

watch(
  () => shippingAddress.value.zipCode,
  (newZip, oldZip) => {
    if (shippingMethodHasPreferredDelivery.value && newZip !== oldZip) getPreferredDeliveryServices();
  },
);

watch(shippingMethodHasPreferredDelivery, (statusUpdated) => {
  if (statusUpdated) getPreferredDeliveryServices();
});

const validateAndSubmitForm = async () => {
  const formData = await validate();

  if (formData.valid)
    handleSubmit(() => {
      data.value.location.value = locationValue.value as string;
      data.value.neighbour.name = neighbourName.value as string;
      data.value.neighbour.address = neighbourAddress.value as string;
      submitForm();
    })();
};
</script>
