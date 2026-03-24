<template>
  <nav class="w-full fixed bottom-0 left-0 flex flex-row items-stretch md:hidden z-10" data-testid="navbar-bottom">
    <UiButton
      v-for="{ id, label, icon, link } in items"
      :key="id"
      variant="tertiary"
      :class="[
        '!p-1 !pt-3 flex flex-col h-full w-full rounded-none !text-xs !font-base',
        { 'opacity-90': route.path === link && Boolean(link) },
      ]"
      :style="buttonStyle"
      size="sm"
      :tag="link ? NuxtLink : undefined"
      :to="link || undefined"
      @click="id === 'products' && open()"
    >
      <template #prefix>
        <div class="relative">
          <component :is="icon" />
          <SfBadge
            v-if="id === 'cart'"
            :content="cartItemsCount"
            :max="99"
            :style="badgeStyle"
            class="translate-x-[5px] translate-y-[-3px] outline flex justify-center items-center text-xs min-w-[16px] min-h-[16px]"
          />
          <SfBadge
            v-if="id === 'wishlist'"
            :content="wishlistItemIds.length"
            :max="99"
            :style="badgeStyle"
            class="translate-x-[5px] translate-y-[-3px] outline flex justify-center items-center text-xs min-w-[16px] min-h-[16px]"
            data-testid="wishlist-badge"
          />
        </div>
      </template>
      {{ label }}
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import { SfBadge, SfIconShoppingCart, SfIconHome, SfIconMenu, SfIconPerson, SfIconFavorite } from '@storefront-ui/vue';
import { useCustomer } from '~/composables/useCustomer';
import type { ActionType } from '~/components/blocks/UtilityBar/types';
import type { NavbarItem } from './types';

const props = withDefaults(
  defineProps<{
    actionOrder?: ActionType[];
    actionVisibility?: Partial<Record<ActionType, boolean>>;
    backgroundColor?: string;
    iconColor?: string;
  }>(),
  {
    actionOrder: () => ['language', 'wishlist', 'cart', 'account'],
    actionVisibility: () => ({ language: true, wishlist: true, cart: true, account: true }),
    backgroundColor: '#0f4c81',
    iconColor: '#ffffff',
  },
);

const localePath = useLocalePath();
const route = useRoute();
const { wishlistItemIds } = useWishlist();
const { data: cart } = useCart();
const { isAuthorized } = useCustomer();
const { open } = useMegaMenu();

const fixedItems = computed<NavbarItem[]>(() => [
  {
    id: 'home',
    label: t('common.labels.home'),
    icon: SfIconHome,
    link: localePath(paths.home),
  },
  {
    id: 'products',
    label: t('common.labels.products'),
    icon: SfIconMenu,
    link: '',
  },
]);

const configurableActionItems = computed<Record<'wishlist' | 'cart' | 'account', NavbarItem>>(() => ({
  wishlist: {
    id: 'wishlist',
    label: t('common.labels.wishlist'),
    icon: SfIconFavorite,
    link: localePath(paths.wishlist),
  },
  cart: {
    id: 'cart',
    label: t('common.labels.cart'),
    icon: SfIconShoppingCart,
    link: localePath(paths.cart),
  },
  account: {
    id: 'account',
    label: isAuthorized.value ? t('account.navBottomHeadingAccount') : t('account.navBottomHeadingLogin'),
    icon: SfIconPerson,
    link: isAuthorized.value ? localePath(paths.account) : localePath(paths.authLogin),
  },
}));

const orderedActionItems = computed<NavbarItem[]>(() => {
  const allowedActions: ActionType[] = ['wishlist', 'cart', 'account'];

  return props.actionOrder
    .filter((action) => allowedActions.includes(action))
    .filter((action) => props.actionVisibility[action] !== false)
    .map((action) => configurableActionItems.value[action as 'wishlist' | 'cart' | 'account'])
    .filter((item): item is NavbarItem => Boolean(item));
});

const items = computed<NavbarItem[]>(() => [...fixedItems.value, ...orderedActionItems.value]);

const buttonStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  color: props.iconColor,
}));

const badgeStyle = computed(() => ({
  backgroundColor: props.iconColor,
  color: props.backgroundColor,
  outlineColor: props.backgroundColor,
}));

const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const NuxtLink = resolveComponent('NuxtLink');
</script>
