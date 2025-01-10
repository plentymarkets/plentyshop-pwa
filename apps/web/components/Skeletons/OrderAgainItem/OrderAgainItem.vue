<template>
  <div role="status" class="flex relative items-center animate-pulse p-4 border-neutral-200 border-b">
    <div
      class="flex items-center justify-center w-24 h-24 flex-shrink-0 bg-gray-300 text-gray-600 rounded-sm mr-3 sm:w-40 sm:h-40"
    >
      <SfIconBase viewBox="0 0 20 18" size="base" class="fill-gray-600 w-12 h-12 sm:w-20 sm:h-20">
        <path
          d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
        />
      </SfIconBase>
    </div>
    <div class="w-full flex flex-col">
      <div class="h-6 sm:h-8 bg-gray-300 rounded-sm w-full" />
      <div class="h-6 sm:h-8 bg-gray-300 rounded-sm w-[140px] mt-2" />
      <div class="h-4 bg-gray-300 rounded-sm w-11/12 mt-2" />
      <div class="h-4 bg-gray-300 rounded-sm w-7/12 mt-1" />
      <div class="h-6 sm:h-8 bg-gray-300 rounded-sm w-[150px] mt-2" />
    </div>
  </div>
</template>

<script setup>
import { SfIconBase } from '@storefront-ui/vue';
</script>
