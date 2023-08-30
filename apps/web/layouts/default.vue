<template>
  <MegaMenu :categories="categoryTree">
    <NuxtLazyHydrate when-visible>
      <UiSearch class="hidden md:block flex-1" />
    </NuxtLazyHydrate>
    <nav class="hidden ml-2 md:flex md:flex-row md:flex-nowrap">
      <NuxtLazyHydrate when-visible>
        <SfButton
          class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
          :tag="NuxtLink"
          :to="paths.cart"
          :aria-label="$t('numberInCart', cartItemsCount)"
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
      </NuxtLazyHydrate>
      <NuxtLazyHydrate when-visible>
        <SfDropdown v-model="isAccountDropdownOpen" placement="bottom-end">
          <template #trigger>
            <SfButton
              variant="tertiary"
              class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
              :class="{ 'bg-primary-900': isAccountDropdownOpen }"
              @click="accountDropdownToggle()"
            >
              <template #prefix><SfIconPerson /></template>
              {{ user.user?.firstName }}
            </SfButton>
          </template>
          <ul class="rounded bg-white shadow-md border border-neutral-100 text-neutral-900 min-w-[152px] py-2">
            <li v-for="{ label, link } in accountDropdown" :key="label">
              <template v-if="label === 'account.logout'">
                <UiDivider class="my-2" />
                <SfListItem tag="button" class="text-left" @click="accountDropdownToggle()">{{ $t(label) }}</SfListItem>
              </template>
              <SfListItem v-else :tag="NuxtLink" :to="link" :class="{ 'bg-neutral-200': $route.path === link }">
                {{ $t(label) }}
              </SfListItem>
            </li>
          </ul>
        </SfDropdown>
      </NuxtLazyHydrate>
    </nav>
    <SfButton
      variant="tertiary"
      class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
      square
      @click="searchModalOpen"
      :aria-label="$t('openSearchModalButtonLabel')"
    >
      <SfIconSearch />
    </SfButton>
  </MegaMenu>
  <UiNotifications />
  <NarrowContainer v-if="breadcrumbs">
    <div class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </div>
  </NarrowContainer>
  <main>
    <slot />
  </main>
  <NuxtLazyHydrate when-idle>
    <UiNavbarBottom />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-idle>
    <Cookiebar />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-visible>
    <UiFooter />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-idle>
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
          {{ $t('search') }}
        </h3>
      </header>
      <UiSearch :close="searchModalClose" />
    </SfModal>
  </NuxtLazyHydrate>
</template>

<script setup lang="ts">
import {
  SfBadge,
  SfButton,
  SfIconShoppingCart,
  SfIconClose,
  SfIconSearch,
  SfIconPerson,
  SfDropdown,
  SfListItem,
  SfModal,
  useDisclosure,
} from '@storefront-ui/vue';
import { useCategoryTree } from '~/composables/useCategoryTree';
import { useCustomer } from '~/composables/useCustomer';
import { DefaultLayoutProps } from '~/layouts/types';

const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure();
const { isOpen: isSearchModalOpen, open: searchModalOpen, close: searchModalClose } = useDisclosure();

defineProps<DefaultLayoutProps>();

const { data: categoryTree } = useCategoryTree();
const { data: cart } = useCart();
const { data: user } = useCustomer();
const { send } = useNotification();
usePageTitle();

const NuxtLink = resolveComponent('NuxtLink');

onMounted(() => {
  send({ message: 'Test alert neutral', type: 'neutral', persist: true });
  send({
    message: 'Test alert positive',
    type: 'positive',
    persist: true,
    action: {
      text: 'action',
      onClick: () => {},
    },
  });
  send({ message: 'Test alert secondary', type: 'secondary', persist: true });
  send({ message: 'Test alert warning', type: 'warning', persist: true });
  send({
    message: 'Test alert error with a longer message',
    type: 'negative',
    persist: true,
    action: {
      text: 'action',
      onClick: () => {},
    },
  });
});

const cartItemsCount = computed(() => cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);

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
    link: '/',
  },
];
</script>
