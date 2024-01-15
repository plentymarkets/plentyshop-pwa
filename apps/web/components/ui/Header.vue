<template>
  <MegaMenu :categories="categoryTree">
    <NuxtLazyHydrate when-visible>
      <UiSearch class="hidden md:block flex-1" />
      <nav class="hidden ml-4 md:flex md:flex-row md:flex-nowrap">
        <SfButton
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md cursor-pointer"
          :aria-label="i18n.t('languageSelector')"
          variant="tertiary"
          square
          data-testid="open-languageselect-button"
          @click="toggleLanguageSelect"
        >
          <template #prefix>
            <SfIconLanguage class="relative" />
          </template>
        </SfButton>
        <SfButton
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
          :tag="NuxtLink"
          :to="localePath(paths.wishlist)"
          :aria-label="i18n.t('numberInWishlist', { count: wishlistItems.length })"
          variant="tertiary"
          square
        >
          <template #prefix>
            <SfIconFavorite />
            <SfBadge
              :content="wishlistItems.length"
              class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
              data-testid="cart-badge"
            />
          </template>
        </SfButton>
        <SfButton
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
          :tag="NuxtLink"
          :to="localePath(paths.cart)"
          :aria-label="i18n.t('numberInCart', { count: cartItemsCount })"
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
        <SfDropdown v-if="isAuthorized" v-model="isAccountDropdownOpen" placement="bottom-end">
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
              <template v-if="label === 'account.logout'">
                <UiDivider class="my-2" />
                <SfListItem tag="button" class="text-left" data-testid="account-dropdown-list-item" @click="logOut()">{{
                  i18n.t(label)
                }}</SfListItem>
              </template>
              <SfListItem
                v-else
                :tag="NuxtLink"
                :to="localePath(link)"
                :class="{ 'bg-neutral-200': $route.path === link }"
                data-testid="account-dropdown-list-item"
              >
                {{ i18n.t(label) }}
              </SfListItem>
            </li>
          </ul>
        </SfDropdown>
        <SfButton
          v-else
          @click="openAuthentication"
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
          variant="tertiary"
          square
        >
          <SfIconPerson />
        </SfButton>
      </nav>
    </NuxtLazyHydrate>
    <div>
      <SfButton
        variant="tertiary"
        class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
        square
        data-testid="open-languageselect-button"
        @click="toggleLanguageSelect"
        :aria-label="i18n.t('languageSelector')"
      >
        <SfIconLanguage />
      </SfButton>
      <SfButton
        variant="tertiary"
        class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
        square
        @click="searchModalOpen"
        :aria-label="i18n.t('openSearchModalButtonLabel')"
      >
        <SfIconSearch />
      </SfButton>
    </div>
  </MegaMenu>
  <LanguageSelector v-if="isLanguageSelectOpen" />
  <UiNotifications />
  <UiModal
    v-model="isAuthenticationOpen"
    tag="section"
    class="h-full md:w-[500px] md:h-fit m-0 p-0"
    aria-labelledby="login-modal"
  >
    <header>
      <div class="text-lg font-medium ml-8">
        <span v-if="isLogin">{{ i18n.t('auth.login.heading') }}</span>
        <span v-else>{{ i18n.t('auth.signup.heading') }}</span>
      </div>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="closeAuthentication">
        <SfIconClose />
      </SfButton>
    </header>
    <LoginComponent v-if="isLogin" @change-view="isLogin = false" @logged-in="closeAuthentication" />
    <register v-else @change-view="isLogin = true" @registered="closeAuthentication" />
  </UiModal>
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
  SfListItem,
  SfIconFavorite,
  useDisclosure,
} from '@storefront-ui/vue';
import LanguageSelector from '~/components/LanguageSelector/LanguageSelector.vue';
import { DefaultLayoutProps } from '~/layouts/types';
import { useCategoryTree, useCustomer } from '~/composables';

defineProps<DefaultLayoutProps>();
const isLogin = ref(true);
const { data: cart } = useCart();
const { data: wishlistItems } = useWishlist();
const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);

const NuxtLink = resolveComponent('NuxtLink');
const i18n = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { open: searchModalOpen } = useDisclosure();
const { isOpen: isLanguageSelectOpen, toggle: toggleLanguageSelect } = useLanguageSelect();
const { data: categoryTree } = useCategoryTree();
const { data: user, isAuthorized, logout } = useCustomer();

watch(
  () => isAuthenticationOpen.value,
  async () => {
    isLogin.value = true;
  },
);

const logOut = async () => {
  await logout();
  accountDropdownToggle();
  router.push(localePath({ path: paths.home }));
};

const accountDropdown = [
  {
    label: 'account.heading',
    link: paths.account,
  },
  {
    label: 'account.ordersAndReturns.section.myOrders',
    link: paths.accountMyOrders,
  },
  {
    label: 'account.ordersAndReturns.section.returns',
    link: paths.accountReturns,
  },
  {
    label: 'account.logout',
    link: paths.home,
  },
];
</script>
