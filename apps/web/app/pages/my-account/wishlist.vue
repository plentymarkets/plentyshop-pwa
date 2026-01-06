<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <h2
    class="hidden md:block col-span-3 typography-headline-4 font-bold mx-4 capitalize"
    data-testid="account-orders-heading"
  >
    {{ t('wishlist') }}
  </h2>
  <ClientOnly>
    <div class="relative col-span-4">
      <WishlistPageContent :with-header="false" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});
const { t } = useI18n();
</script>
