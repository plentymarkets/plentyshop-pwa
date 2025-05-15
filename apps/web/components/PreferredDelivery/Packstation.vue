<template>
  <li :ref="setRef" class="mr-0 sm:mr-3">
    <template v-if="isActive">
      <div class="w-full text-left p-3 rounded-md border border-[rgb(255,204,0)] bg-[rgb(255,204,0)] space-y-3">
        <div class="p-3 rounded bg-yellow-300 select-none">
          <div class="flex justify-between items-center select-none">
            <p :class="stationBadgeClass">{{ station.location.keyword }}</p>
            <span class="text-sm text-gray-700 font-semibold flex items-center gap-1">
              <SfIconLocationOn size="xs" />
              {{ (station.distance / 1000).toFixed(2) }} km
            </span>
          </div>

          <p class="font-semibold text-base select-none">{{ station.name }}</p>
          <p class="text-sm leading-tight select-none">
            {{ station.place.address.streetAddress }}
            <br />
            {{ station.place.address.postalCode }} {{ station.place.address.addressLocality }}
          </p>
        </div>

        <label for="dhl-post-number" class="mt-4 block text-sm font-medium pb-0.5">
          {{ t('PreferredDelivery.packstation.postNumberLabel') }}
        </label>

        <SfInput
          id="dhl-post-number"
          v-model="postNumber"
          type="text"
          name="postnumber"
          :placeholder="t('PreferredDelivery.packstation.postNumberPlaceholder')"
          wrapper-class="w-full !mt-0"
        />

        <UiButton type="button" variant="primary" class="mt-4 w-full" @click="savePackstationAddress(station)">
          {{ t('PreferredDelivery.packstation.setPackstation') }}
        </UiButton>

        <div class="text-xs p-3 rounded select-none bg-yellow-300">
          {{ t('PreferredDelivery.packstation.nameInfo') }}
        </div>

        <ul class="text-xs p-3 text-gray-800 leading-tight rounded bg-yellow-300 select-none">
          <li
            v-for="(openingHour, dayIndex) in station.openingHours"
            :key="dayIndex"
            class="flex justify-between text-xs font-semibold"
          >
            <span>
              {{ t(`PreferredDelivery.packstation.days.${openingHour.dayOfWeek.split('/').pop() ?? ''}`) }}
            </span>
            <span>
              {{ openingHour.opens.slice(0, -3) }}
              <span class="inline-block text-lg text-gray-500 leading-none align-text-bottom">•</span>
              {{ openingHour.closes.slice(0, -3) }}
            </span>
          </li>
        </ul>
      </div>
    </template>

    <template v-else>
      <button
        type="button"
        :class="[
          'w-full text-left p-3 rounded-md border transition-colors duration-150 focus:outline-none',
          isActive
            ? 'border-[rgb(255,204,0)] bg-[rgb(255,204,0)]'
            : 'border-gray-300 hover:border-[rgb(255,204,0)] hover:bg-[rgb(255,204,0)] active:bg-[rgb(255,204,0)]',
        ]"
        @click="$emit('on-station-select', index)"
      >
        <div class="flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <p :class="stationBadgeClass">{{ station.location.keyword }}</p>
            <span class="text-sm text-gray-500 font-semibold flex items-center gap-1">
              <SfIconLocationOn size="xs" />
              {{ (station.distance / 1000).toFixed(2) }} km
            </span>
          </div>
          <p class="font-semibold">{{ station.name }}</p>
          <p class="text-sm">
            {{ station.place.address.streetAddress }}
            <br />
            {{ `${station.place.address.postalCode} ${station.place.address.addressLocality}` }}
          </p>
        </div>
      </button>
    </template>
  </li>
</template>

<script setup lang="ts">
import { SfIconLocationOn, SfInput } from '@storefront-ui/vue';
import type { PackstationProps } from './types';

const { station, index, isActive, setRef } = defineProps<PackstationProps>();

defineEmits(['on-station-select']);

const { t } = useI18n();
const { postNumber, savePackstationAddress } = usePackstationAddress();

const stationBadgeClass = computed(() =>
  [
    'inline-block px-3 py-1 rounded-full text-white text-xs',
    station.location.keyword === 'Packstation' ? 'bg-red-500' : 'bg-blue-500',
  ].join(' '),
);
</script>
