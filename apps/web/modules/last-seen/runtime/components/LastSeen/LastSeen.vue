<template>
  <ClientOnly>
    <UiDivider class="mt-10" />
    <div class="mt-3 w-full">
      <div class="flex justify-between">
        <h3 class="font-bold mb-3">Last seen products</h3>
        <div>Seite {{ page }} von {{ totalPages }} </div>
      </div>
      <div class="flex justify-between items-center gap-4">
        <UiButton :variant="'secondary'" @click="prevPage()">
          <SfIconArrowBack></SfIconArrowBack>
        </UiButton>
        <SfScrollable class="pb-4 scrollbar-hidden" buttons-placement="none" data-testid="last-seen-product-slider">
          <UiProductCard v-if="!loading" v-for="product in currentPageProducts" :key="product.variation.id" :product="product"
            is-from-slider />
          <div v-else class="flex gap-4">
            <div v-for="i in itemsPerPage" :key="i" class="min-w-[200px] h-[300px] flex items-center justify-center border border-gray-200 rounded-md">
              <SfLoaderCircular size="lg"/>
            </div>
          </div>
        </SfScrollable>
        <UiButton :variant="'secondary'" @click="nextPage">
          <SfIconArrowForward></SfIconArrowForward>
        </UiButton>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { SfIconArrowBack, SfIconArrowForward, SfLoaderCircular, SfScrollable } from '@storefront-ui/vue';
import { useLastSeen } from '../../composables/useLastSeen';
const { currentPageProducts, fetchLastSeenProducts, loading, nextPage, page, prevPage, totalPages, itemsPerPage } = useLastSeen(5);

onNuxtReady(() => {
  watch(
    [page, ],
    () => {
      fetchLastSeenProducts();
    },
    {
      immediate: true,
    },
  );
});
</script>
