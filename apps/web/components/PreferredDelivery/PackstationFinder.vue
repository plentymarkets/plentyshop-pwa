<template>
  <div
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
      <div class="py-4 sm:flex sm:gap-4">
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

        <label class="mt-4 sm:mt-0 sm:basis-[25%]">
          <UiFormLabel>{{ $t('PreferredDelivery.packstation.zipcodeLabel') }}</UiFormLabel>
          <SfInput
            v-model="zipcode"
            v-bind="zipcodeAttributes"
            :invalid="Boolean(errors['searchParams.zipcode'])"
            type="text"
            name="zipcode"
            :placeholder="$t('PreferredDelivery.packstation.zipcodePlaceholder')"
          />
        </label>

        <label class="mt-4 sm:mt-0 sm:basis-[25%]">
          <UiFormLabel>{{ $t('PreferredDelivery.packstation.cityLabel') }}</UiFormLabel>
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

      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
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

        <ErrorMessage
          v-if="!street && !zipcode && !city"
          as="span"
          class="flex text-negative-700 text-sm mt-2"
          name="searchParams.street"
        />

        <UiButton type="submit" :disabled="loading" variant="secondary" class="order-3 sm:order-1 w-fit mt-3 sm:mt-0">
          <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="base" />
          <template v-else>{{ $t('PreferredDelivery.packstation.search') }}</template>
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ErrorMessage, useForm } from 'vee-validate';
import { SfCheckbox, SfInput, SfLoaderCircular } from '@storefront-ui/vue';

const { loading, data, validationSchema, submitForm } = usePackstationFinder();
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
</script>
