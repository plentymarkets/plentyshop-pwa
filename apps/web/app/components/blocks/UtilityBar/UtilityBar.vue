<template>
  <div :style="headerPaletteStyle">
    <header v-if="viewport.isGreaterOrEquals('md')" class="relative w-full md:sticky md:shadow-md z-10">
      <div
        class="flex justify-between items-center flex-wrap md:flex-nowrap w-full border-0 border-neutral-200"
        :style="{ backgroundColor: headerBackgroundColor, ...paddingStyles }"
        data-testid="navbar-top"
      >
        <div v-if="isSectionVisible('logo')" class="flex items-center" :style="{ order: getSectionFlexOrder('logo') }">
          <NuxtLink
            :to="localePath(paths.home)"
            :aria-label="t('common.actions.goToHomepage')"
            class="flex shrink-0 w-full lg:w-48 items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
          >
            <UiLogo />
          </NuxtLink>
        </div>

        <template v-if="viewport.isGreaterOrEquals('md') && isSectionVisible('search')">
          <div
            ref="iconSearchContainerRef"
            :style="{ order: getSectionFlexOrder('search') }"
            :class="isFullSearchMode || isIconSearchExpanded || isSearchClosing ? 'flex-1' : 'flex-none w-10 shrink-0'"
          >
            <template v-if="isFullSearchMode">
              <UiSearch class="hidden md:block" />
            </template>

            <template v-else>
              <div class="hidden md:block relative">
                <Transition
                  mode="out-in"
                  enter-active-class="transition-opacity duration-120 ease-out"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition-opacity duration-120 ease-out absolute inset-0"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                  @after-leave="handleSearchAfterLeave"
                >
                  <UiSearch
                    v-if="isIconSearchExpanded"
                    class="w-full"
                    :style="{ transformOrigin: searchExpandOrigin }"
                    :close="collapseIconSearch"
                  />
                </Transition>
                <UiButton
                  v-if="showSearchIcon && !isIconSearchExpanded"
                  variant="tertiary"
                  square
                  class="hover:!bg-header-400 rounded-md"
                  :style="{ color: iconColor }"
                  :aria-label="t('common.actions.search')"
                  @click="expandIconSearch"
                >
                  <SfIconSearch />
                </UiButton>
              </div>
            </template>
          </div>
        </template>
        <nav
          v-if="viewport.isGreaterOrEquals('md') && isSectionVisible('actions')"
          :style="{ order: getSectionFlexOrder('actions') }"
          class="hidden md:flex md:flex-row md:flex-nowrap"
        >
          <template v-if="localeCodes.length > 1 && isActionVisible('language')">
            <UiButton
              v-if="!isLanguageSelectOpen"
              class="group relative hover:!bg-header-400 active:!bg-header-400 mr-1 -ml-0.5 rounded-md cursor-pointer"
              :aria-label="t('common.navigation.languageSelector')"
              variant="tertiary"
              :style="{ color: iconColor, order: getActionOrder('language') }"
              square
              data-testid="open-languageselect-button"
              :disabled="(showConfigurationDrawer && isEditing) || (showConfigurationDrawer && disableActions)"
              @click="toggleLanguageSelect()"
            >
              <template #prefix>
                <SfIconLanguage class="relative" />
              </template>
            </UiButton>
            <UiButton
              v-else
              class="group relative hover:!bg-header-400 active:bg-header-400 mr-1 -ml-0.5 rounded-md cursor-pointer"
              :aria-label="t('common.navigation.languageSelector')"
              :style="{ color: isActive ? iconColor : '', order: getActionOrder('language') }"
              variant="tertiary"
              square
              data-testid="open-languageselect-button"
            >
              <template #prefix>
                <SfIconLanguage class="relative" />
              </template>
            </UiButton>
          </template>
          <UiButton
            v-if="isActionVisible('wishlist')"
            class="group relative hover:!bg-header-400 active:bg-header-400 mr-1 -ml-0.5 rounded-md"
            :tag="NuxtLink"
            :to="localePath(paths.wishlist)"
            :style="{ color: iconColor, order: getActionOrder('wishlist') }"
            :aria-label="t('cart.numberInWishlist', { count: wishlistItemIds.length })"
            variant="tertiary"
            square
            data-testid="wishlist-page-navigation"
          >
            <template #prefix>
              <SfIconFavorite />
              <SfBadge
                :content="wishlistItemIds.length"
                :style="{
                  backgroundColor: iconColor,
                  outlineColor: headerBackgroundColor,
                  color: headerBackgroundColor,
                }"
                class="outline group-hover:outline-primary-800 group-active:outline-primary-700 flex justify-center items-center text-xs min-w-[16px] min-h-[16px]"
                data-testid="wishlist-badge"
                placement="top-right"
                :max="99"
              />
            </template>
          </UiButton>
          <UiButton
            v-if="isActionVisible('cart')"
            class="group relative hover:!bg-header-400 active:!bg-header-400 mr-1 -ml-0.5 rounded-md"
            :tag="NuxtLink"
            :style="{ color: iconColor, order: getActionOrder('cart') }"
            :to="localePath(paths.cart)"
            :aria-label="t('cart.numberInCart', { count: cartItemsCount })"
            variant="tertiary"
            square
          >
            <template #prefix>
              <SfIconShoppingCart />
              <SfBadge
                :content="cartItemsCount"
                :style="{
                  backgroundColor: iconColor,
                  outlineColor: headerBackgroundColor,
                  color: headerBackgroundColor,
                }"
                class="outline group-hover:outline-primary-800 group-active:outline-primary-700 flex justify-center items-center text-xs min-w-[16px] min-h-[16px]"
                data-testid="cart-badge"
                placement="top-right"
                :max="99"
              />
            </template>
          </UiButton>
          <SfDropdown
            v-if="isAuthorized && isActionVisible('account')"
            v-model="isAccountDropdownOpen"
            placement="bottom-end"
            class="z-50"
            :style="{ order: getActionOrder('account') }"
          >
            <template #trigger>
              <UiButton
                variant="tertiary"
                class="relative hover:bg-header-400 active:bg-header-400 rounded-md"
                :style="{ color: iconColor, order: getActionOrder('account') }"
                :class="{ 'bg-primary-700': isAccountDropdownOpen }"
                data-testid="account-dropdown-button"
                @click="accountDropdownToggle()"
              >
                <template #prefix>
                  <SfIconPerson />
                </template>
                {{ user?.firstName }}
              </UiButton>
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
                  :class="{ 'bg-neutral-200': route.path === link }"
                  data-testid="account-dropdown-list-item"
                >
                  {{ label }}
                </SfListItem>
              </li>
            </ul>
          </SfDropdown>
          <UiButton
            v-else-if="!isAuthorized && isActionVisible('account')"
            :style="{ color: iconColor, order: getActionOrder('account') }"
            class="group relative hover:!bg-header-400 active:!bg-header-400 mr-1 -ml-0.5 rounded-md"
            variant="tertiary"
            :aria-label="t('authentication.login.openLoginForm')"
            square
            @click="navigateToLogin"
          >
            <SfIconPerson />
          </UiButton>
        </nav>
      </div>
    </header>

    <MegaMenu
      v-if="viewport.isLessThan('md')"
      :categories="categoryTree"
      :icon-color="iconColor"
      :header-background-color="headerBackgroundColor"
    >
      <div>
        <UiButton
          variant="tertiary"
          class="relative text-white hover:text-white active:text-white hover:!bg-header-400 active:!bg-header-400 rounded-md md:hidden"
          square
          data-testid="open-languageselect-button"
          :style="{ color: iconColor }"
          :aria-label="t('common.navigation.languageSelector')"
          :disabled="(showConfigurationDrawer && isEditing) || (showConfigurationDrawer && disableActions)"
          @click="toggleLanguageSelect()"
        >
          <SfIconLanguage />
        </UiButton>
        <UiButton
          variant="tertiary"
          class="relative text-white hover:text-white active:text-white hover:!bg-header-400 active:!bg-header-400 rounded-md md:hidden"
          square
          :style="{ color: iconColor }"
          :aria-label="t('common.navigation.openSearchModal')"
          @click="searchModalOpen"
        >
          <SfIconSearch />
        </UiButton>
      </div>
    </MegaMenu>

    <UiNavbarBottom
      v-if="viewport.isLessThan('md')"
      :background-color="headerBackgroundColor"
      :icon-color="iconColor"
    />
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
  </div>
</template>

<script setup lang="ts">
import {
  SfBadge,
  SfDropdown,
  SfIconClose,
  SfIconLanguage,
  SfIconPerson,
  SfIconSearch,
  SfIconShoppingCart,
  SfListItem,
  SfModal,
  SfIconFavorite,
  // SfIconMenu,
  useDisclosure,
} from '@storefront-ui/vue';
import { onClickOutside } from '@vueuse/core';
import LanguageSelector from '~/components/LanguageSelector/LanguageSelector.vue';
import { getPaletteFromColor } from '~/utils/tailwindHelper';

import type { UtilityBarProps } from './types';

interface Props extends Partial<UtilityBarProps> {
  enableActions?: boolean;
  root?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  enableActions: false,
  root: true,
});

const isLogin = ref(true);
const { data: cart } = useCart();
const { wishlistItemIds } = useWishlist();
const cartItemsCount = ref(0);
const { data: categoryTree, getCategoryTree } = useCategoryTree();

const {
  content,
  paddingStyles,
  isSectionVisible,
  getSectionFlexOrder,
  isActionVisible,
  getActionOrder,
  isFullSearchMode,
} = useUtilityBarConfiguration(props.meta?.uuid);

const iconColor = computed(() => content.value?.color?.iconColor || '');
const headerBackgroundColor = computed(() => content.value?.color?.backgroundColor || '');
const tailwindShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const getGlobalPaletteType = (value: string): 'primary' | 'secondary' | null => {
  const paletteTypeMatch = value.match(/--colors-2-(primary|secondary)-500/);
  const matchedPaletteType = paletteTypeMatch?.[1];

  if (matchedPaletteType === 'primary' || matchedPaletteType === 'secondary') {
    return matchedPaletteType;
  }

  return null;
};

const isHexColor = (value: string): boolean => /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value);

const headerPaletteStyle = computed<Record<string, string>>(() => {
  const baseColor = headerBackgroundColor.value;
  if (!baseColor) {
    return {};
  }

  const paletteType = getGlobalPaletteType(baseColor);
  if (paletteType) {
    return tailwindShades.reduce<Record<string, string>>((style, shadeWeight) => {
      style[`--colors-2-header-${shadeWeight}`] = `var(--colors-2-${paletteType}-${shadeWeight})`;
      return style;
    }, {});
  }

  if (!isHexColor(baseColor)) {
    return {};
  }

  return getPaletteFromColor('header', baseColor).reduce<Record<string, string>>((style, shade) => {
    style[`--colors-2-header-${shade.weight}`] = shade.rgb;
    return style;
  }, {});
});

const NuxtLink = resolveComponent('NuxtLink');
const { localeCodes } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { open: searchModalOpen, isOpen: isSearchModalOpen, close: searchModalClose } = useDisclosure();
const { toggle: toggleLanguageSelect, isOpen: isLanguageSelectOpen } = useLocalization();
const { user, isAuthorized, logout } = useCustomer();
const viewport = useViewport();
const runtimeConfig = useRuntimeConfig();
const showConfigurationDrawer = runtimeConfig.public.showConfigurationDrawer;
const { isEditing, disableActions } = useEditor();
const isActive = computed(() => isLanguageSelectOpen);

onNuxtReady(async () => {
  if (categoryTree.value.length === 0) {
    await getCategoryTree();
  }

  cartItemsCount.value = cart.value?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0;
});

const isIconSearchExpanded = ref(false);
const showSearchIcon = ref(true);
const isSearchClosing = ref(false);
const iconSearchContainerRef = ref<HTMLElement | null>(null);

const searchExpandOrigin = computed(() => {
  const searchOrder = getSectionFlexOrder('search');
  if (searchOrder === 0) return 'left center';
  return 'center center';
});

const expandIconSearch = () => {
  showSearchIcon.value = false;
  isIconSearchExpanded.value = true;
};

const collapseIconSearch = () => {
  isSearchClosing.value = true;
  isIconSearchExpanded.value = false;
  return true;
};

const handleSearchAfterLeave = () => {
  showSearchIcon.value = true;
  isSearchClosing.value = false;
};

onClickOutside(iconSearchContainerRef, () => {
  if (isIconSearchExpanded.value) {
    collapseIconSearch();
  }
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

const logOut = () => handleLogout({ logout, toggle: accountDropdownToggle });

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
const navigateToLogin = () => {
  if (route.path !== localePath(paths.authLogin)) {
    openAuthentication();
  }
};
</script>
