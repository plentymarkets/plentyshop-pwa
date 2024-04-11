<template>
  <nav class="w-full fixed bottom-0 left-0 flex flex-row items-stretch md:hidden" data-testid="navbar-bottom">
    <SfButton
      v-for="{ label, icon, link } in items"
      :key="label"
      variant="tertiary"
      :class="[
        '!p-1 !pt-3 flex flex-col h-full w-full rounded-none bg-primary-700 text-white hover:text-white hover:bg-primary-800 active:text-white active:bg-primary-900 !text-xs !font-base',
        { 'text-white bg-primary-900': $route.path === link },
      ]"
      size="sm"
      :tag="link ? NuxtLink : undefined"
      :to="link || undefined"
      @click="label === t('products') && open()"
    >
      <template #prefix>
        <div class="relative">
          <component :is="icon" />
          <SfBadge
            v-if="label === t('cart')"
            :content="cartItemsCount"
            class="outline-white bg-white !text-neutral-900 translate-x-[5px] translate-y-[-3px]"
          />
          <SfBadge
            v-if="label === t('wishlist')"
            :content="wishlistItemIds.length"
            class="outline-white bg-white !text-neutral-900 translate-x-[5px] translate-y-[-3px]"
            data-testid="wishlist-badge"
          />
        </div>
      </template>
      {{ label }}
    </SfButton>
  </nav>
</template>

<script setup lang="ts">
import {
  SfButton,
  SfBadge,
  SfIconShoppingCart,
  SfIconHome,
  SfIconMenu,
  SfIconPerson,
  SfIconFavorite,
} from '@storefront-ui/vue';
import { useCustomer } from '~/composables/useCustomer';
const { wishlistItemIds } = useWishlist();

const localePath = useLocalePath();
const { t } = useI18n();
const { data: cart } = useCart();
const { isAuthorized } = useCustomer();
const { open } = useMegaMenu();

const items = computed(() => [
  {
    label: t('home'),
    icon: SfIconHome,
    link: localePath(paths.home),
  },
  {
    label: t('products'),
    icon: SfIconMenu,
    link: '',
  },
  {
    label: t('wishlist'),
    icon: SfIconFavorite,
    link: localePath(paths.wishlist),
  },
  {
    label: t('cart'),
    icon: SfIconShoppingCart,
    link: localePath(paths.cart),
  },
  {
    label: isAuthorized.value ? t('account.navBottomHeadingAccount') : t('account.navBottomHeadingLogin'),
    icon: SfIconPerson,
    link: isAuthorized.value ? localePath(paths.account) : localePath(paths.authLogin),
  },
]);

const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const NuxtLink = resolveComponent('NuxtLink');
</script>
