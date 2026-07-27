<template>
  <header ref="referenceRef" :class="headerClass" class="relative w-full md:sticky z-10 bg-white">
    <!-- ROW 1: Üst bilgi şeridi -->
    <div class="hidden md:block bg-neutral-50 border-b border-neutral-200">
      <div class="max-w-[1536px] mx-auto px-6 lg:px-8 flex items-center justify-between h-9 text-xs">
        <div class="flex items-center gap-5 text-neutral-500">
          <span class="inline-flex items-center gap-1.5 font-medium">
            <svg class="w-3.5 h-3.5 shrink-0 text-[#384d37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
            {{ t('header.internationalShipping') }}
          </span>
          <span class="w-px h-3 bg-neutral-300" />
          <span class="inline-flex items-center gap-1.5 font-medium">
            <svg class="w-3.5 h-3.5 shrink-0 text-[#384d37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.747L21.066 3.403A2.25 2.25 0 0 0 19.208 2.5H15M2.25 14.25V5.625c0-.621.504-1.125 1.125-1.125h7.5" /></svg>
            {{ t('header.fastShipping') }}
          </span>
        </div>
        <div class="flex items-center gap-4 text-neutral-500">
          <template v-if="isAuthorized && user">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full bg-[#384d37] flex items-center justify-center shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
              </div>
              <span class="font-semibold text-neutral-800">{{ t('header.welcome') }}, {{ user.firstName || user.email }}</span>
              <span class="w-px h-3 bg-neutral-300" />
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#384d37]/10 text-[#384d37] font-bold text-[10px] uppercase tracking-wider">
                <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>
                {{ pricePlanLabel }}
              </span>
            </div>
          </template>
          <button v-else class="hover:text-neutral-800 transition-colors cursor-pointer font-medium" @click="$emit('navigate-login')">
            {{ t('header.loginRegister') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ROW 2: Ana header (logo + telefon + arama + aksiyonlar) -->
    <div data-testid="navbar-top" class="bg-white border-b border-neutral-200">
      <div class="flex items-center gap-5 lg:gap-8 px-6 lg:px-8 py-4 w-full max-w-[1536px] mx-auto">
        <!-- Mobil: Hamburger -->
        <button
          type="button"
          :aria-label="t('common.navigation.openMenu')"
          class="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
          @click="openMenu([])"
        >
          <SfIconMenu aria-hidden="true" class="!w-7 !h-7" />
        </button>

        <!-- Logo -->
        <NuxtLink
          :to="localePath(paths.home)"
          :aria-label="t('common.actions.goToHomepage')"
          class="flex shrink-0 items-center"
        >
          <UiLogo />
        </NuxtLink>

        <!-- Telefon bilgisi (sadece desktop) -->
        <div class="hidden lg:flex items-center gap-3 shrink-0 pl-6 border-l border-neutral-200">
          <div class="w-10 h-10 rounded-full bg-[#384d37]/8 flex items-center justify-center">
            <svg class="w-5 h-5 text-[#384d37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
          </div>
          <div>
            <p class="text-base font-bold text-neutral-900 leading-tight">+49 7159 4591920</p>
            <p class="text-[11px] text-neutral-400 leading-tight mt-0.5">{{ t('header.phoneHours') }}</p>
          </div>
        </div>

        <!-- Arama (slot'tan gelir) -->
        <slot />
      </div>
    </div>

    <!-- ROW 3: Navigasyon barı + Mega Menü (sadece desktop) -->
    <div class="hidden lg:block bg-white border-b border-neutral-200 relative">
      <div class="max-w-[1536px] mx-auto px-6 lg:px-8 flex items-center justify-between">
        <nav class="flex flex-wrap items-center -ml-4">
          <NuxtLink
            v-for="cat in topCategories"
            :key="cat.id"
            :to="localePath(generateCategoryLink(cat))"
            class="relative px-4 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap"
            :class="megaMenuCat === cat.id ? 'text-[#384d37]' : 'text-neutral-800 hover:text-[#384d37]'"
            @mouseenter="onCatEnter(cat)"
            @mouseleave="scheduleMegaClose()"
          >
            {{ categoryTreeGetters.getName(cat) }}
            <span
              v-if="cat.children && cat.children.length > 0"
              class="ml-0.5 inline-block align-middle"
            >
              <svg class="w-3 h-3 inline-block" :class="megaMenuCat === cat.id ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
            </span>
            <span
              class="absolute bottom-0 left-4 right-4 h-0.5 bg-[#384d37] transition-transform origin-left"
              :class="megaMenuCat === cat.id ? 'scale-x-100' : 'scale-x-0'"
            />
          </NuxtLink>
        </nav>
      </div>

      <!-- Mega Menü Dropdown -->
      <Transition name="mega-fade">
        <div
          v-if="megaMenuCat && megaMenuData"
          class="absolute left-0 right-0 top-full z-50 bg-white border-b border-neutral-200 shadow-lg shadow-black/5"
          @mouseenter="cancelMegaClose()"
          @mouseleave="scheduleMegaClose()"
        >
          <div class="max-w-[1536px] mx-auto px-6 lg:px-8 py-8">
            <div class="grid grid-cols-5 gap-8">
              <div v-for="child in megaMenuData.children?.slice(0, 5)" :key="child.id">
                <NuxtLink
                  :to="localePath(generateCategoryLink(child))"
                  class="text-sm font-bold text-neutral-900 hover:text-[#384d37] transition-colors"
                >
                  {{ categoryTreeGetters.getName(child) }}
                </NuxtLink>
                <ul v-if="child.children && child.children.length" class="mt-3 space-y-2">
                  <li v-for="sub in child.children.slice(0, 6)" :key="sub.id">
                    <NuxtLink
                      :to="localePath(generateCategoryLink(sub))"
                      class="text-[13px] text-neutral-500 hover:text-[#384d37] transition-colors"
                    >
                      {{ categoryTreeGetters.getName(sub) }}
                    </NuxtLink>
                  </li>
                  <li v-if="child.children.length > 6">
                    <NuxtLink
                      :to="localePath(generateCategoryLink(child))"
                      class="text-[13px] font-medium text-[#384d37] hover:underline"
                    >
                      {{ t('categoryShowcase.viewAll') }} &rarr;
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="megaMenuData.children && megaMenuData.children.length > 5" class="mt-6 pt-5 border-t border-neutral-100">
              <NuxtLink
                :to="localePath(generateCategoryLink(megaMenuData))"
                class="inline-flex items-center gap-2 text-sm font-semibold text-[#384d37] hover:underline"
              >
                {{ categoryTreeGetters.getName(megaMenuData) }} - {{ t('categoryShowcase.viewAll') }}
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Sol Sidebar (mobil) -->
    <Teleport to="body">
      <Transition name="overlay-fade">
        <div
          v-if="isOpen"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
          @click="close()"
        />
      </Transition>
      <Transition name="slide-left">
        <div
          v-if="isOpen"
          ref="drawerReference"
          class="fixed top-0 left-0 h-full w-full max-w-[360px] bg-white z-[1000] shadow-2xl flex flex-col"
        >
          <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
            <NuxtLink :to="localePath(paths.home)" class="flex items-center" @click="close()">
              <UiLogo />
            </NuxtLink>
            <button
              type="button"
              :aria-label="t('common.navigation.closeMenu')"
              class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              @click="close()"
            >
              <SfIconClose aria-hidden="true" class="text-neutral-400 !w-5 !h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <div class="py-3">
              <p class="px-5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                {{ t('sidebar.categories') }}
              </p>
              <ul v-if="activeMenu">
                <li v-if="activeMenu.id !== 0">
                  <button
                    type="button"
                    class="flex items-center w-full px-5 py-2.5 text-left hover:bg-neutral-50 transition-colors cursor-pointer"
                    @click="goBack()"
                  >
                    <SfIconArrowBack aria-hidden="true" class="text-neutral-400 !w-4 !h-4" />
                    <span class="ml-3 text-sm font-medium text-neutral-700">{{ categoryTreeGetters.getName(activeMenu) }}</span>
                  </button>
                </li>
                <template v-for="node in activeMenu.children" :key="node.id">
                  <li v-if="node.childCount === 0">
                    <NuxtLink
                      :to="localePath(generateCategoryLink(node))"
                      class="flex items-center px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                      @click="close()"
                    >
                      {{ categoryTreeGetters.getName(node) }}
                    </NuxtLink>
                  </li>
                  <li v-else>
                    <div class="flex items-center hover:bg-neutral-50 transition-colors">
                      <NuxtLink
                        class="flex-1 px-5 py-2.5 text-sm font-medium text-neutral-700"
                        :to="localePath(generateCategoryLink(node))"
                        @click="close()"
                      >
                        {{ categoryTreeGetters.getName(node) }}
                      </NuxtLink>
                      <button
                        type="button"
                        class="flex justify-center items-center w-12 py-2.5 cursor-pointer"
                        @click="goNext(node.id)"
                      >
                        <SfIconChevronRight aria-hidden="true" class="text-neutral-300 !w-4 !h-4" />
                      </button>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
            <div class="mx-5 border-t border-neutral-100" />
            <div class="py-3">
              <p class="px-5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                {{ t('sidebar.pages') }}
              </p>
              <ul>
                <li>
                  <NuxtLink :to="localePath(paths.home)" class="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors" @click="close()">
                    {{ t('sidebar.home') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath(paths.wishlist)" class="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors" @click="close()">
                    {{ t('sidebar.wishlist') }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="localePath(paths.account)" class="flex items-center gap-3 px-5 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors" @click="close()">
                    {{ t('sidebar.myAccount') }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<script lang="ts" setup>
import {
  SfIconClose,
  SfIconChevronRight,
  SfIconArrowBack,
  SfIconMenu,
  useTrapFocus,
  useDropdown,
} from '@storefront-ui/vue';
import { type CategoryTreeItem, categoryTreeGetters } from '@plentymarkets/shop-api';
import { paths } from '~/utils/paths';
import type { MegaMenuProps } from '~/components/MegaMenu/types';

const props = defineProps<MegaMenuProps>();
defineEmits<{
  'toggle-language': [];
  'navigate-login': [];
}>();

const NuxtLink = resolveComponent('NuxtLink');
const viewport = useViewport();
const localePath = useLocalePath();
const { user, isAuthorized } = useCustomer();
const { data: customerClasses, fetchCustomerClasses } = useCustomerClass();

const customerClassName = computed(() => {
  if (!user.value?.classId || !customerClasses.value.length) return '';
  const cls = customerClasses.value.find((c) => String(c.id) === String(user.value?.classId));
  return cls?.name ?? '';
});

const userDiscountPercent = computed(() => user.value?.discountPercent ?? 0);

const pricePlanLabel = computed(() => {
  const name = customerClassName.value;
  const discount = userDiscountPercent.value;
  if (name && discount) return `${name} (${discount}% ${t('header.discountLabel')})`;
  if (name) return name;
  if (discount) return `${discount}% ${t('header.discountLabel')}`;
  return t('header.pricePlan');
});

if (isAuthorized.value) {
  fetchCustomerClasses();
}

const { buildCategoryMenuLink } = useLocalization();
const router = useRouter();
const { close, open, isOpen, activeNode, category, setCategory } = useMegaMenu();
const { setDrawerOpen } = useDrawerState();
const { referenceRef } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});

const categoryTree = ref(categoryTreeGetters.getTree(props.categories));
const drawerReference = ref();
const megaMenuCat = ref<number | null>(null);

let megaCloseTimer: ReturnType<typeof setTimeout> | null = null;

const megaMenuData = computed(() => {
  if (!megaMenuCat.value) return null;
  return topCategories.value.find((cat: CategoryTreeItem) => cat.id === megaMenuCat.value) || null;
});

const cancelMegaClose = () => {
  if (megaCloseTimer) {
    clearTimeout(megaCloseTimer);
    megaCloseTimer = null;
  }
};

const scheduleMegaClose = () => {
  cancelMegaClose();
  megaCloseTimer = setTimeout(() => {
    megaMenuCat.value = null;
  }, 150);
};

const closeMegaMenu = () => {
  cancelMegaClose();
  megaMenuCat.value = null;
};

const onCatEnter = (cat: CategoryTreeItem) => {
  cancelMegaClose();
  if (cat.children && cat.children.length > 0) {
    megaMenuCat.value = cat.id;
  } else {
    megaMenuCat.value = null;
  }
};

const topCategories = computed(() =>
  categoryTree.value.filter((cat: CategoryTreeItem) => cat.type === 'item'),
);

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: false,
  initialFocus: false,
} as const;

const activeMenu = computed(() => (category.value ? findNode(activeNode.value, category.value) : null));
const headerClass = computed(() => ({ 'z-[10]': isOpen.value }));

const findNode = (keys: number[], node: CategoryTreeItem): CategoryTreeItem => {
  if (keys.length > 1) {
    const [currentKey, ...restKeys] = keys;
    return findNode(restKeys, node.children?.find((child) => child.id === currentKey) || node);
  } else {
    return node.children?.find((child) => child.id === keys[0]) || node;
  }
};

const generateCategoryLink = (category: CategoryTreeItem) => {
  return buildCategoryMenuLink(category, categoryTree.value);
};

const openMenu = (menuType: number[]) => {
  activeNode.value = menuType;
  open();
  setDrawerOpen(true);
};

const goBack = () => {
  activeNode.value = activeNode.value.slice(0, -1);
};

const goNext = (key: number) => {
  activeNode.value = [...activeNode.value, key];
};

let removeHook: () => void;

onMounted(() => {
  removeHook = router.afterEach(() => {
    close();
    closeMegaMenu();
  });
});

onBeforeUnmount(() => removeHook?.());

watch(
  () => props.categories,
  (categories: CategoryTreeItem[]) => {
    categoryTree.value = categoryTreeGetters.getTree(categories);
    setCategory(categoryTree.value);
  },
);

setCategory(categoryTree.value);
useTrapFocus(drawerReference, trapFocusOptions);
</script>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
.mega-fade-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mega-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.mega-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.mega-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
