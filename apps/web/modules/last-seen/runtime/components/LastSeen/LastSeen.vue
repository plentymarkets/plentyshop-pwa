<template>
  <ClientOnly>
    <UiDivider class="mt-10" />
    <div class="mt-3 w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold">{{ t('lastSeenProducts.title') }}</h3>
        <div class="text-sm text-gray-600">
          {{
            t('lastSeenProducts.pagination', {
              page,
              totalPages,
            })
          }}
        </div>
      </div>

      <div class="relative">
        <!-- Desktop Navigation Buttons -->
        <UiButton
          v-if="page > 1"
          :variant="'secondary'"
          @click="prevPage"
          class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4"
          aria-label="Previous page"
        >
          <SfIconArrowBack />
        </UiButton>

        <SfScrollable class="pb-4" buttons-placement="none" data-testid="last-seen-product-slider">
          <UiProductCard
            v-if="!loading"
            v-for="product in currentPageProducts"
            :key="product.variation.id"
            :product="product"
            is-from-slider
          />
          <div v-else class="flex gap-4">
            <div
              v-for="i in itemsPerPage"
              :key="i"
              class="min-w-[200px] h-[300px] flex items-center justify-center border border-gray-200 rounded-md"
            >
              <SfLoaderCircular size="lg" />
            </div>
          </div>
        </SfScrollable>

        <UiButton
          v-if="page < totalPages"
          :variant="'secondary'"
          @click="nextPage"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4"
          aria-label="Next page"
        >
          <SfIconArrowForward />
        </UiButton>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="totalPages > 1" class="flex md:hidden justify-center items-center gap-4 mt-4">
        <UiButton :variant="'secondary'" @click="prevPage" :disabled="page === 1" size="sm" aria-label="Previous page">
          <SfIconArrowBack />
        </UiButton>

        <!-- Pagination Dots -->
        <div class="flex gap-2">
          <button
            v-for="pageNum in totalPages"
            :key="pageNum"
            @click="goToPage(pageNum)"
            :class="[
              'w-2 h-2 rounded-full transition-all',
              pageNum === page ? 'bg-primary-700 w-6' : 'bg-gray-300 hover:bg-gray-400',
            ]"
            :aria-label="`Go to page ${pageNum}`"
            :aria-current="pageNum === page ? 'page' : undefined"
          />
        </div>

        <UiButton
          :variant="'secondary'"
          @click="nextPage"
          :disabled="page >= totalPages"
          size="sm"
          aria-label="Next page"
        >
          <SfIconArrowForward />
        </UiButton>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { SfIconArrowBack, SfIconArrowForward, SfLoaderCircular, SfScrollable } from '@storefront-ui/vue';
import { useLastSeen } from '../../composables/useLastSeen';

const { currentPageProducts, fetchLastSeenProducts, loading, nextPage, page, prevPage, totalPages, itemsPerPage } =
  useLastSeen(5);

const goToPage = (pageNum: number) => {
  if (pageNum > page.value) {
    while (page.value < pageNum) nextPage();
  } else if (pageNum < page.value) {
    while (page.value > pageNum) prevPage();
  }
};

onNuxtReady(() => {
  watch(
    page,
    () => {
      fetchLastSeenProducts();
    },
    {
      immediate: true,
    },
  );
});
</script>
