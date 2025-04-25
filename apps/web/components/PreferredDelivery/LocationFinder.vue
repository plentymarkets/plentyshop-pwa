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

    <form novalidate @submit.prevent="">
      <div class="py-4 sm:flex sm:gap-4">
        <SfInput
          type="text"
          name="street"
          :placeholder="$t('PreferredDelivery.packstation.streetPlaceholder')"
          wrapper-class="sm:basis-[50%]"
        />

        <SfInput
          type="text"
          name="zipcode"
          :placeholder="$t('PreferredDelivery.packstation.zipcodePlaceholder')"
          wrapper-class="mt-4 sm:mt-0 sm:basis-[25%]"
        />

        <SfInput
          type="text"
          name="city"
          :placeholder="$t('PreferredDelivery.packstation.cityPlaceholder')"
          wrapper-class="mt-4 sm:mt-0 sm:basis-[25%]"
        />
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3">
        <label
          for="DHL-type-packstation"
          class="order-1 sm:order-2 inline-flex items-center gap-2 select-none font-semibold cursor-pointer w-fit"
        >
          <SfCheckbox id="DHL-type-packstation" />
          {{ $t('PreferredDelivery.packstation.dropDownValues.packstation') }}
        </label>

        <label
          for="DHL-type-postal-outlet"
          class="order-2 sm:order-3 inline-flex items-center gap-2 select-none font-semibold cursor-pointer w-fit mt-2 sm:mt-0"
        >
          <SfCheckbox id="DHL-type-postal-outlet" />
          {{ $t('PreferredDelivery.packstation.dropDownValues.postfilial') }}
        </label>

        <UiButton type="submit" variant="secondary" class="order-3 sm:order-1 w-fit mt-3 sm:mt-0">
          {{ $t('PreferredDelivery.packstation.search') }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfCheckbox, SfInput } from '@storefront-ui/vue';
</script>
