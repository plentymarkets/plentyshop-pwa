<template>
  <div
    data-sticky="true"
    class="w-full py-2 text-center text-white text-sm z-30"
    style="background-color: #e63946;"
  >
    🎉 Block 1 – sticky
  </div>

  <div
    data-sticky="false"
    class="w-full py-3 text-center text-white text-sm"
    style="background-color: #457b9d;"
  >
    📣 Block 2 – nicht sticky
  </div>

  <div
    data-sticky="true"
    class="w-full py-2 text-center text-white text-sm z-30"
    style="background-color: #2a9d8f;"
  >
    🟢 Block 3 – sticky, soll unter Block 1 kleben
  </div>
  <LanguageSelector />
  <UiModal
    v-if="viewport.isGreaterOrEquals('md') && isAuthenticationOpen"
    v-model="isAuthenticationOpen"
    tag="section"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto"
  >
    <header>
      <UiButton
        :aria-label="t('common.navigation.closeDialog')"
        square
        variant="tertiary"
        class="absolute right-2 top-2"
        @click="closeAuthentication"
      >
        <SfIconClose />
      </UiButton>
    </header>
    <LoginComponent
      v-if="isLogin"
      :is-modal="true"
      @change-view="isLogin = false"
      @logged-in="navigateAfterAuth(true)"
    />
    <Register v-else :is-modal="true" @change-view="isLogin = true" @registered="closeAuthentication" />
  </UiModal>

  <NuxtLazyHydrate v-if="viewport.isLessThan('lg')" when-idle>
    <SfModal
      v-model="isSearchModalOpen"
      class="w-full h-full z-50"
      tag="section"
      role="dialog"
      aria-labelledby="search-modal-title"
    >
      <header class="mb-4">
        <UiButton
          :aria-label="t('common.navigation.closeDialog')"
          square
          variant="tertiary"
          class="absolute right-4 top-2"
          @click="searchModalClose"
        >
          <SfIconClose class="text-neutral-500" />
        </UiButton>
        <h3 id="search-modal-title" class="absolute left-6 top-4 font-bold typography-headline-4 mb-4">
          {{ t('common.actions.search') }}
        </h3>
      </header>
      <UiSearch :close="searchModalClose" />
    </SfModal>
  </NuxtLazyHydrate>
</template>

<script setup lang="ts">
import {
  SfIconClose,
  SfModal,
  useDisclosure,
} from '@storefront-ui/vue';
import LanguageSelector from '~/components/LanguageSelector/LanguageSelector.vue';

const isLogin = ref(true);
const { data: cart } = useCart();
const cartItemsCount = ref(0);
useStickyStack();

const { isOpen: isAuthenticationOpen, close: closeAuthentication } = useDisclosure();
const { isOpen: isSearchModalOpen, close: searchModalClose } = useDisclosure();
const { data: categoryTree, getCategoryTree } = useCategoryTree();
const viewport = useViewport();

onNuxtReady(async () => {
  if (categoryTree.value.length === 0) await getCategoryTree();

  cartItemsCount.value = cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0;
});

const navigateAfterAuth = (reload: boolean) => {
  if (reload) {
    window.location.reload();
  } else {
    closeAuthentication();
  }
};

watch(
  () => cart.value?.items,
  (cartItems) => {
    cartItemsCount.value = cartItems?.reduce((price, { quantity }) => price + quantity, 0) ?? 0;
  },
);

watch(
  () => isAuthenticationOpen.value,
  () => (isLogin.value = true),
);
</script>
