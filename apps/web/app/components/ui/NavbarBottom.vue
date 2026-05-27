<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-[110] flex flex-row items-stretch md:hidden bg-primary-500 shadow-[0_-2px_10px_rgba(0,0,0,0.15)] pb-[env(safe-area-inset-bottom,0px)]"
    data-testid="navbar-bottom"
  >
    <UiButton
      v-for="{ label, icon, link, ariaLabel } in items"
      :key="label"
      variant="tertiary"
      :aria-label="ariaLabel"
      :class="[
        '!flex !flex-col !items-center !justify-center !gap-0.5 !flex-1 !min-w-0 !h-14 !px-0.5 !py-1.5 !rounded-none bg-primary-500 text-white hover:text-white hover:bg-primary-800 active:text-white active:bg-primary-700',
        { '!bg-primary-700': route.path === link },
      ]"
      size="sm"
      :tag="link ? NuxtLink : undefined"
      :to="link || undefined"
      @click="label === t('common.navigation.bottomNav.products') && open()"
    >
      <template #prefix>
        <div class="relative flex shrink-0 items-center justify-center">
          <component :is="icon" />
          <SfBadge
            v-if="label === t('common.navigation.bottomNav.cart')"
            :content="cartItemsCount"
            :max="99"
            class="translate-x-[5px] translate-y-[-3px] outline outline-primary-500 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-700 flex justify-center items-center text-xs min-w-[16px] min-h-[16px]"
          />
          <SfBadge
            v-if="label === t('common.navigation.bottomNav.wishlist')"
            :content="wishlistItemIds.length"
            :max="99"
            class="translate-x-[5px] translate-y-[-3px] outline outline-primary-500 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-700 flex justify-center items-center text-xs min-w-[16px] min-h-[16px]"
            data-testid="wishlist-badge"
          />
        </div>
      </template>
      <span class="block w-full max-w-full truncate text-center text-[10px] leading-none whitespace-nowrap">
        {{ label }}
      </span>
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import { SfBadge, SfIconShoppingCart, SfIconHome, SfIconMenu, SfIconPerson, SfIconFavorite } from '@storefront-ui/vue';
import { useCustomer } from '~/composables/useCustomer';

const localePath = useLocalePath();
const route = useRoute();
const { wishlistItemIds } = useWishlist();
const { data: cart } = useCart();
const { isAuthorized } = useCustomer();
const { open } = useMegaMenu();

const items = computed(() => [
  {
    label: t('common.navigation.bottomNav.home'),
    ariaLabel: t('common.labels.home'),
    icon: SfIconHome,
    link: localePath(paths.home),
  },
  {
    label: t('common.navigation.bottomNav.products'),
    ariaLabel: t('common.labels.products'),
    icon: SfIconMenu,
    link: '',
  },
  {
    label: t('common.navigation.bottomNav.wishlist'),
    ariaLabel: t('common.labels.wishlist'),
    icon: SfIconFavorite,
    link: localePath(paths.wishlist),
  },
  {
    label: t('common.navigation.bottomNav.cart'),
    ariaLabel: t('common.labels.cart'),
    icon: SfIconShoppingCart,
    link: localePath(paths.cart),
  },
  {
    label: isAuthorized.value
      ? t('common.navigation.bottomNav.account')
      : t('common.navigation.bottomNav.login'),
    ariaLabel: isAuthorized.value ? t('account.navBottomHeadingAccount') : t('account.navBottomHeadingLogin'),
    icon: SfIconPerson,
    link: isAuthorized.value ? localePath(paths.account) : localePath(paths.authLogin),
  },
]);

const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const NuxtLink = resolveComponent('NuxtLink');
</script>
