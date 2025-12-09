<template>
    <div class="w-full">
        <SfScrollable class="w-full" buttons-placement="floating">
            <div v-for="n in itemsCount" :key="n" class="w-full">
                <div role="status" class="animate-pulse border-neutral-200 border-b">
                    <div
                        class="flex items-center justify-center w-48 h-48 flex-shrink-0 bg-gray-300 text-gray-600 rounded-sm sm:w-48 sm:h-48">
                        <SfIconBase viewBox="0 0 20 18" size="base" class="fill-gray-600 w-12 h-12 sm:w-20 sm:h-20">
                            <path
                                d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </SfIconBase>
                    </div>
                    <div class="w-full mt-2 flex flex-col">
                        <div class="h-6 sm:h-6 bg-gray-300 rounded-sm w-[145px]" />
                        <div class="h-5 sm:h-5 bg-gray-300 rounded-sm w-[160px] mt-2" />
                        <div class="h-7 sm:h-7 bg-gray-300 rounded-lg w-[100px] mt-16" />
                    </div>
                </div>
            </div>
        </SfScrollable>
    </div>
</template>
<script setup lang="ts">
import { SfIconBase, SfScrollable } from '@storefront-ui/vue';
import { ProductSliderSkeletonProps } from './types';

const { itemsCount = 5 } = defineProps<ProductSliderSkeletonProps>();

</script>