<template>
  <MegaMenu :categories="categoryTree">
    <template v-if="viewport.isGreaterOrEquals('md')">
      <NuxtLazyHydrate when-visible>
        <UiSearch class="hidden md:block flex-1" />
        <nav class="hidden ml-4 md:flex md:flex-row md:flex-nowrap">
          <SfButton
            v-if="!isLanguageSelectOpen"
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md cursor-pointer"
            :aria-label="t('languageSelector')"
            variant="tertiary"
            square
            data-testid="open-languageselect-button"
            @click="toggleLanguageSelect()"
          >
            <template #prefix>
              <SfIconLanguage class="relative" />
            </template>
          </SfButton>
          <SfButton
            v-else
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md cursor-pointer"
            :aria-label="t('languageSelector')"
            variant="tertiary"
            square
            data-testid="open-languageselect-button"
          >
            <template #prefix>
              <SfIconLanguage class="relative" />
            </template>
          </SfButton>
          <SfButton
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
            :tag="NuxtLink"
            :to="localePath(paths.wishlist)"
            :aria-label="t('numberInWishlist', { count: wishlistItemIds.length })"
            variant="tertiary"
            square
            data-testid="wishlist-page-navigation"
          >
            <template #prefix>
              <SfIconFavorite />
              <SfBadge
                :content="wishlistItemIds.length"
                class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
                data-testid="wishlist-badge"
              />
            </template>
          </SfButton>
          <SfButton
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
            :tag="NuxtLink"
            :to="localePath(paths.cart)"
            :aria-label="t('numberInCart', { count: cartItemsCount })"
            variant="tertiary"
            square
          >
            <template #prefix>
              <SfIconShoppingCart />
              <SfBadge
                :content="cartItemsCount"
                class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
                data-testid="cart-badge"
              />
            </template>
          </SfButton>
          <SfDropdown v-if="isAuthorized" v-model="isAccountDropdownOpen" placement="bottom-end" class="z-50">
            <template #trigger>
              <SfButton
                variant="tertiary"
                class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
                :class="{ 'bg-primary-900': isAccountDropdownOpen }"
                @click="accountDropdownToggle()"
                data-testid="account-dropdown-button"
              >
                <template #prefix>
                  <SfIconPerson />
                </template>
                {{ user.user?.firstName }}
              </SfButton>
            </template>
            <ul class="rounded bg-white shadow-md border border-neutral-100 text-neutral-900 min-w-[152px] py-2">
              <li v-for="({ label, link }, labelIndex) in accountDropdown" :key="`label-${labelIndex}`">
                <template v-if="label === t('account.logout')">
                  <UiDivider class="my-2" />
                  <SfListItem
                    tag="button"
                    class="text-left"
                    data-testid="account-dropdown-logout-item"
                    @click="logOut()"
                  >
                    {{ label }}
                  </SfListItem>
                </template>
                <SfListItem
                  v-else
                  :tag="NuxtLink"
                  :to="link"
                  :class="{ 'bg-neutral-200': $route.path === link }"
                  data-testid="account-dropdown-list-item"
                >
                  {{ label }}
                </SfListItem>
              </li>
            </ul>
          </SfDropdown>
          <SfButton
            v-else
            @click="openAuthentication"
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
            variant="tertiary"
            :aria-label="t('auth.login.openLoginForm')"
            square
          >
            <SfIconPerson />
          </SfButton>
          <SfButton
            v-if="showConfigurationDrawer"
            @click="open = true"
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
            variant="tertiary"
            aria-label="Open configuration drawer"
            square
          >
            <SfIconTune />
          </SfButton>
        </nav>
      </NuxtLazyHydrate>
    </template>

    <div v-else>
      <SfButton
        variant="tertiary"
        class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
        square
        data-testid="open-languageselect-button"
        :aria-label="t('languageSelector')"
        @click="toggleLanguageSelect()"
      >
        <SfIconLanguage />
      </SfButton>
      <SfButton
        variant="tertiary"
        class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
        square
        @click="searchModalOpen"
        :aria-label="t('openSearchModalButtonLabel')"
      >
        <SfIconSearch />
      </SfButton>
    </div>
  </MegaMenu>
  <LanguageSelector />
  <UiNotifications />
  <UiModal
    v-if="viewport.isGreaterOrEquals('md') && isAuthenticationOpen"
    v-model="isAuthenticationOpen"
    tag="section"
    class="h-full md:w-[500px] md:h-fit m-0 p-0 overflow-y-auto"
    aria-labelledby="login-modal"
  >
    <header>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeAuthentication">
        <SfIconClose />
      </SfButton>
    </header>
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="closeAuthentication" :is-modal="true" />
    <Register v-else @change-view="isLogin = true" @registered="closeAuthentication" :is-modal="true" />
  </UiModal>

  <NuxtLazyHydrate v-if="viewport.isLessThan('md')" when-idle>
    <SfModal
      v-model="isSearchModalOpen"
      class="w-full h-full z-50"
      tag="section"
      role="dialog"
      aria-labelledby="search-modal-title"
    >
      <header class="mb-4">
        <SfButton square variant="tertiary" class="absolute right-4 top-2" @click="searchModalClose">
          <SfIconClose class="text-neutral-500" />
        </SfButton>
        <h3 id="search-modal-title" class="absolute left-6 top-4 font-bold typography-headline-4 mb-4">
          {{ t('search') }}
        </h3>
      </header>
      <UiSearch :close="searchModalClose" />
    </SfModal>
  </NuxtLazyHydrate>
  <LazyConfigurationDrawer v-if="showConfigurationDrawer" />
</template>

<script setup lang="ts">
import {
  SfBadge,
  SfButton,
  SfDropdown,
  SfIconClose,
  SfIconLanguage,
  SfIconPerson,
  SfIconSearch,
  SfIconShoppingCart,
  SfIconTune,
  SfListItem,
  SfModal,
  SfIconFavorite,
  useDisclosure,
} from '@storefront-ui/vue';
import LanguageSelector from '~/components/LanguageSelector/LanguageSelector.vue';

const isLogin = ref(true);
const { data: cart } = useCart();
const { wishlistItemIds } = useWishlist();
const cartItemsCount = ref(0);

const NuxtLink = resolveComponent('NuxtLink');
const { t } = useI18n();
const localePath = useLocalePath();
const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { open: searchModalOpen, isOpen: isSearchModalOpen, close: searchModalClose } = useDisclosure();
const { open } = useConfigurationDrawer();
const { toggle: toggleLanguageSelect, isOpen: isLanguageSelectOpen } = useLocalization();
const { data: categoryTree } = useCategoryTree();
const { data: user, isAuthorized, logout } = useCustomer();
const viewport = useViewport();
const runtimeConfig = useRuntimeConfig();

const showConfigurationDrawer = runtimeConfig.public.showConfigurationDrawer;

onNuxtReady(() => {
  cartItemsCount.value = cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0;
});

watch(
  () => cart.value?.items,
  (cartItems) => {
    cartItemsCount.value = cartItems?.reduce((price, { quantity }) => price + quantity, 0) ?? 0;
  },
);

watch(
  () => isAuthenticationOpen.value,
  async () => {
    isLogin.value = true;
  },
);

const logOut = async () => {
  accountDropdownToggle();
  await logout();
  navigateTo(localePath(paths.home));
};

const accountDropdown = computed(() => [
  {
    label: t('account.heading'),
    link: localePath(paths.account),
  },
  {
    label: t('account.ordersAndReturns.section.myOrders'),
    link: localePath(paths.accountMyOrders),
  },
  {
    label: t('account.ordersAndReturns.section.returns'),
    link: localePath(paths.accountReturns),
  },
  {
    label: t('account.logout'),
  },
]);
</script>
