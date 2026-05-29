<template>
  <MegaMenu :categories="filteredCategoryTree">
    <template v-if="viewport.isGreaterOrEquals('lg')">
      <div
        class="hidden lg:flex flex-row items-stretch justify-start flex-shrink-0 w-fit gap-1 lg:gap-1 min-[1152px]:gap-2 min-[1280px]:gap-3 min-[1367px]:gap-3 relative z-10 transition-all duration-300"
      >
        <div
          class="flex flex-col items-end justify-center text-[9px] lg:text-[10px] min-[1152px]:text-[11px] min-[1280px]:text-[13px] min-[1367px]:text-[16px] font-extrabold text-[#062633] leading-tight min-[1280px]:leading-snug min-[1367px]:leading-relaxed tracking-wide whitespace-nowrap transition-all duration-300"
        >
          <NuxtLink to="/reparatur-und-instandhaltung" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Reparatur und Instandsetzung</NuxtLink>
          <NuxtLink to="/abbau-und-demontage" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Abbau und Demontage</NuxtLink>
          <NuxtLink to="/ueberuns" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Über uns</NuxtLink>
          <a href="https://www.waren-ankauf.de/" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Ankauf</a>
          <NuxtLink to="/team" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Team</NuxtLink>
        </div>

        <NuxtLink
          to="/leasing-finanzierung"
          aria-label="Finanzieren und Leasen"
          class="self-stretch active:scale-95 transition-transform duration-200 flex-shrink-0"
        >
          <img
            src="/_nuxt-plenty/images/image009-2.png"
            alt="Jetzt günstig finanzieren und leasen"
            class="self-stretch h-full -mt-2 lg:-mt-2 min-[1367px]:mt-0 max-w-[68px] lg:max-w-[80px] min-[1152px]:max-w-[100px] min-[1280px]:max-w-[120px] min-[1367px]:max-w-[160px] w-auto object-contain rounded-md shadow-sm transition-all duration-300"
          />
        </NuxtLink>
      </div>

      <div
        class="hidden lg:flex flex-1 flex-row items-center justify-end mr-1 lg:mr-1 min-[1152px]:mr-2 min-[1280px]:mr-3 min-[1367px]:mr-6 gap-1 lg:gap-1 min-[1152px]:gap-2 min-[1280px]:gap-3 min-[1367px]:gap-5 transition-all duration-300 min-w-0"
      >
        <NuxtLink
          to="https://www.waren-ankauf.de/ankauf/"
          target="_blank"
          rel="noopener noreferrer"
          class="active:scale-95 transition-transform duration-200 flex-shrink-0"
        >
          <img
            src="/_nuxt-plenty/images/image010.png"
            alt="Ankaufsformular"
            class="h-[40px] lg:h-[50px] min-[1152px]:h-[58px] min-[1280px]:h-[84px] min-[1367px]:h-[110px] max-w-[62px] lg:max-w-[78px] min-[1152px]:max-w-[90px] min-[1280px]:max-w-[128px] min-[1367px]:max-w-[172px] w-auto object-contain transition-all duration-300"
          />
        </NuxtLink>

        <div class="flex flex-col items-end justify-center gap-0 lg:gap-1 flex-shrink-0">
          <nav
            class="flex flex-row flex-nowrap items-center gap-0.5"
          >
            <div class="mr-3"><GoogleTranslate /></div>

            <template v-if="localeCodes.length > 1">
              <UiButton
                v-if="!isLanguageSelectOpen"
                class="group relative hover:!bg-header-400 active:!bg-header-400 mr-1 -ml-0.5 rounded-md cursor-pointer"
                :aria-label="t('common.navigation.languageSelector')"
                variant="tertiary"
                :style="{ color: iconColor }"
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
                :style="{ color: isActive ? iconColor : '' }"
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
              v-if="wishlistItemIds.length > 0"
              class="group relative hover:!bg-header-400 active:bg-header-400 mr-1 -ml-0.5 rounded-md"
              :tag="NuxtLink"
              :to="localePath(paths.wishlist)"
              :style="{ color: iconColor }"
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
              class="group relative hover:!bg-header-400 active:bg-header-400 mr-1 -ml-0.5 rounded-md"
              :tag="NuxtLink"
              :style="{ color: iconColor }"
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
            <SfDropdown v-if="isAuthorized" v-model="isAccountDropdownOpen" placement="bottom-end" class="z-50">
              <template #trigger>
                <UiButton
                  variant="tertiary"
                  class="relative hover:bg-header-400 active:bg-header-400 rounded-md"
                  :style="{ color: iconColor }"
                  :class="{ 'bg-primary-700': isAccountDropdownOpen }"
                  data-testid="account-dropdown-button"
                  @click="accountDropdownToggle()"
                >
                  <template #prefix>
                    <SfIconPerson />
                  </template>
                  <span>{{ user?.firstName }}</span>
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
              v-else
              :style="{ color: iconColor }"
              class="group relative hover:!bg-header-400 active:!bg-header-400 mr-1 -ml-0.5 rounded-md"
              variant="tertiary"
              :aria-label="t('authentication.login.openLoginForm')"
              square
              @click="navigateToLogin"
            >
              <SfIconPerson />
            </UiButton>
          </nav>

          <a
            href="tel:+492862587950"
            class="text-[10px] lg:text-[11px] min-[1152px]:text-xs min-[1280px]:text-base min-[1367px]:text-base font-black transition-all duration-300 whitespace-nowrap pr-1 lg:pr-2 hover:text-blue-600 mt-0 lg:mt-1"
            style="color: #062633"
          >
            +49 2862 58795 0
          </a>

          <div
            v-if="!isHomePage"
            class="w-full min-[992px]:max-w-[280px] lg:max-w-[300px] min-[1280px]:max-w-[320px] min-[1367px]:max-w-[360px] mt-2 transition-all duration-300 self-end"
          >
            <UiSearch />
          </div>
        </div>
      </div>
    </template>

    <div v-if="viewport.isLessThan('lg')" class="flex items-center justify-end">
      <div
        class="flex flex-col items-end justify-center text-[7px] min-[375px]:text-[8px] font-extrabold text-[#062633] leading-tight tracking-wide whitespace-nowrap"
      >
        <NuxtLink to="/reparatur-und-instandhaltung" class="hover:text-blue-600 transition-colors flex items-center gap-1"
          ><span>•</span>Reparatur und Instandsetzung</NuxtLink
        >
        <NuxtLink to="/abbau-und-demontage" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Abbau und Demontage</NuxtLink>
        <NuxtLink to="/ueberuns" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Über uns</NuxtLink>
        <a href="https://www.waren-ankauf.de/" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Ankauf</a>
        <NuxtLink to="/team" class="hover:text-blue-600 transition-colors flex items-center gap-1"><span>•</span>Team</NuxtLink>
      </div>

      <div
        class="absolute top-[100%] left-0 w-full bg-white border-t border-gray-100 shadow-md flex flex-col gap-2 px-2 sm:px-3 py-2.5 z-[90]"
      >
        <div class="flex flex-row items-center justify-between w-full gap-2">
          <div class="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0">
            <NuxtLink
              to="/leasing-finanzierung"
              aria-label="Finanzieren und Leasen"
              class="active:scale-95 transition-transform duration-200 flex-shrink-0"
            >
              <img
                src="/_nuxt-plenty/images/image009-2.png"
                alt="Jetzt günstig finanzieren und leasen"
                class="h-10 sm:h-12 w-auto object-contain rounded shadow-sm"
              />
            </NuxtLink>
            <NuxtLink
              to="https://www.waren-ankauf.de/ankauf/"
              target="_blank"
              rel="noopener noreferrer"
              class="active:scale-95 transition-transform duration-200 flex-shrink-0"
            >
              <img
                src="/_nuxt-plenty/images/image010.png"
                alt="Ankaufsformular"
                class="h-11 sm:h-14 w-auto object-contain drop-shadow-sm"
              />
            </NuxtLink>
          </div>

          <div class="flex flex-col items-end gap-0.5 flex-shrink-0">
            <div class="flex flex-row items-center gap-0">
              <div class="scale-[0.85] transform origin-right">
                <GoogleTranslate />
              </div>
            </div>

            <a
              href="tel:+492862587950"
              class="text-[12px] sm:text-[14px] font-black transition-colors whitespace-nowrap hover:text-blue-600 pr-1 mt-0.5"
              style="color: #062633"
            >
              +49 2862 58795 0
            </a>
          </div>
        </div>

        <div v-if="!isHomePage" class="w-full min-[992px]:max-w-[280px] min-[992px]:ml-auto">
          <UiSearch />
        </div>
      </div>
    </div>
  </MegaMenu>
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
</template>

<script setup lang="ts">
import {
  SfBadge,
  SfDropdown,
  SfIconClose,
  SfIconLanguage,
  SfIconPerson,
  SfIconShoppingCart,
  SfListItem,
  SfIconFavorite,
  useDisclosure,
} from '@storefront-ui/vue';
import LanguageSelector from '~/components/LanguageSelector/LanguageSelector.vue';
import { paths } from '~/utils/paths';
import { handleLogout } from '~/utils/logout';
import GoogleTranslate from '~/components/GoogleTranslate.vue';

const isLogin = ref(true);
const { data: cart } = useCart();
const { wishlistItemIds } = useWishlist();
const cartItemsCount = ref(0);
const { getSetting: getIconColor } = useSiteSettings('iconColor');
const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');

const iconColor = computed(() => getIconColor());
const headerBackgroundColor = computed(() => getHeaderBackgroundColor());

const NuxtLink = resolveComponent('NuxtLink');
const { localeCodes } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure();
const { isOpen: isAuthenticationOpen, open: openAuthentication, close: closeAuthentication } = useDisclosure();
const { toggle: toggleLanguageSelect, isOpen: isLanguageSelectOpen } = useLocalization();
const { data: categoryTree } = useCategoryTree();
const allowedCategoryIds = [895, 490, 1505, 208, 81, 217, 97];
const filteredCategoryTree = computed(() => {
  if (!categoryTree.value) return [];

  // Filter the main top-level categories
  return categoryTree.value.filter((category: { id: number }) => {
    return allowedCategoryIds.includes(category.id);
  });
});
const { user, isAuthorized, logout } = useCustomer();
const viewport = useViewport();
const runtimeConfig = useRuntimeConfig();
const showConfigurationDrawer = runtimeConfig.public.showConfigurationDrawer;
const { isEditing, disableActions } = useEditor();
const isActive = computed(() => isLanguageSelectOpen);

onNuxtReady(() => {
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
  async () => {
    isLogin.value = true;
  },
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
watch(
  categoryTree,
  (tree) => {
    // eslint-disable-next-line no-console
    console.log('Category List:', tree);
  },
  { immediate: true },
);

const isHomePage = computed(() => {
  const home = localePath(paths.home);
  return route.path === home || route.path === `${home}/`;
});
</script>
