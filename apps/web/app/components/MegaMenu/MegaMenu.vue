<template>
  <header ref="referenceRef" :class="headerClass" class="relative w-full md:sticky md:shadow-md z-[100]">
    <div
      class="flex justify-between items-center max-w-screen-3xl mx-auto lg:px-0 md:px-10 py-2 md:py-5 w-full border-0 border-neutral-200"
      :style="{ backgroundColor: headerBackgroundColor }"
      data-testid="navbar-top"
    >
      <div class="flex items-center">
        <UiButton
          v-if="viewport.isLessThan('lg')"
          variant="tertiary"
          square
          :aria-label="t('common.navigation.closeMenu')"
          class="mr-3 hover:!bg-header-400"
          :style="{ color: iconColor }"
          @click="openMenu([])"
        >
          <SfIconMenu />
        </UiButton>

        <NuxtLink
          :to="localePath(paths.home)"
          :aria-label="t('common.actions.goToHomepage')"
          class="flex shrink-0 w-full max-w-[160px] md:max-w-none lg:w-auto items-center mr-auto text-white focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
        >
          <UiLogo />
        </NuxtLink>
      </div>

      <slot />
    </div>

    <nav v-if="viewport.isGreaterOrEquals('lg')" ref="floatingRef">
      <ul
        class="flex flex-wrap justify-center px-2 py-2 bg-white border-b border-b-neutral-200 border-b-solid w-full"
        @blur="
          (event: FocusEvent) => {
            if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
              close();
            }
          }
        "
      >
        <li v-if="categoryTree.length === 0" class="h-10" />

<li v-for="(menuNode, index) in categoryTree" v-else :key="index" class="relative" @mouseenter="onCategoryMouseEnter(menuNode)" @mouseleave="onMouseLeave">
            <div
            ref="triggerReference"
            data-testid="category-button"
            class="inline-flex items-center justify-center gap-1 font-medium text-sm xl:text-base min-[2500px]:text-[2rem] min-[2500px]:px-6 tracking-tight rounded-md py-2 px-2 group mr-1 !text-neutral-900 hover:bg-secondary-100 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900 cursor-pointer whitespace-nowrap"
          >
            <NuxtLink 
              :to="localePath(generateCategoryLink(menuNode))" 
              class="flex items-center gap-1 w-full"
              @click="close()"
            >
              <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
            </NuxtLink>

            <SfIconChevronRight
              v-if="menuNode.childCount > 0"
              class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900 w-4 h-4 min-[2500px]:w-6 min-[2500px]:h-6"
            />
          </div>

          <div
            v-if="
              isOpen &&
              activeMenu &&
              activeNode.length === 1 &&
              activeNode[0] === menuNode.id &&
              menuNode.childCount > 0
            "
            :key="activeMenu.id"
            ref="megaMenuReference"
            class="hidden md:flex flex-col absolute top-full left-0 min-w-[280px] bg-white shadow-xl p-3 outline-none z-[110] rounded-b-md border border-neutral-100"
            tabindex="0"
            @mouseleave="onMouseLeave"
            @keydown.esc="focusTrigger(index)"
          >
            <template v-for="node in activeMenu.children" :key="node.id">
              <SfListItem
                :tag="NuxtLink"
                size="sm"
                :to="localePath(generateCategoryLink(node))"
                class="mb-1 hover:bg-secondary-100 rounded font-medium typography-text-base min-[2500px]:text-[2rem] min-[2500px]:py-3 min-[2500px]:px-4 text-left"
                @click="close()"
              >
                {{ categoryTreeGetters.getName(node) }}
              </SfListItem>
            </template>
          </div>
        </li>
      </ul>
    </nav>

    <template v-else>
      <div v-if="isOpen" class="fixed z-[50] inset-0 bg-neutral-500 bg-opacity-50" />
      <SfDrawer
        ref="drawerReference"
        v-model="isOpen"
        placement="left"
        class="right-12 max-w-96 bg-white overflow-y-auto z-[1000]"
      >
        <nav>
          <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid bg-neutral-50">
            <div class="flex items-center gap-3">
              <p class="typography-text-base font-medium">{{ t('common.actions.browseProducts') }}</p>
              
              <UiButton
                variant="tertiary"
                class="relative text-neutral-600 hover:bg-neutral-200 rounded-md !p-1.5"
                square
                :aria-label="t('common.navigation.languageSelector')"
                @click="toggleLanguageSelect(); close();"
              >
                <SfIconLanguage />
              </UiButton>
            </div>

            <UiButton
              variant="tertiary"
              square
              :aria-label="t('common.navigation.closeMenu')"
              class="ml-2"
              @click="close()"
            >
              <SfIconClose class="text-neutral-500" />
            </UiButton>
          </div>
          <ul v-if="activeMenu" class="mt-2 mb-6">
            <li v-if="activeMenu.id !== 0">
              <SfListItem
                size="lg"
                tag="button"
                type="button"
                class="border-b border-b-neutral-200 border-b-solid hover:bg-secondary-100"
                @click="goBack()"
              >
                <div class="flex items-center">
                  <SfIconArrowBack class="text-neutral-500" />
                  <p class="ml-5 font-medium">{{ categoryTreeGetters.getName(activeMenu) }}</p>
                </div>
              </SfListItem>
            </li>
            <template v-for="node in activeMenu.children" :key="node.id">
              <li v-if="node.childCount === 0">
                <SfListItem
                  size="lg"
                  :tag="NuxtLink"
                  :href="localePath(generateCategoryLink(node))"
                  class="hover:bg-secondary-100"
                  @click="close()"
                >
                  <div class="flex items-center">
                    <p class="text-left">{{ categoryTreeGetters.getName(node) }}</p>
                    <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                  </div>
                </SfListItem>
              </li>
              <li v-else>
                <SfListItem size="lg" tag="button" type="button" class="!p-0 hover:bg-secondary-100">
                  <div class="flex items-center w-100">
                    <NuxtLink class="flex-1 m-0 p-4 pr-0" :to="localePath(generateCategoryLink(node))" @click="close()">
                      <div class="flex items-center">
                        <p class="text-left">{{ categoryTreeGetters.getName(node) }}</p>
                        <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                      </div>
                    </NuxtLink>
                    <div class="flex justify-center items-center h-8 w-16" @click="goNext(node.id)">
                      <SfIconChevronRight class="text-neutral-500" />
                    </div>
                  </div>
                </SfListItem>
              </li>
            </template>
          </ul>
        </nav>
      </SfDrawer>
    </template>
  </header>
</template>

<script lang="ts" setup>
import {
  SfIconClose,
  SfDrawer,
  SfListItem,
  SfIconChevronRight,
  SfCounter,
  SfIconArrowBack,
  SfIconMenu,
  SfIconLanguage, // <-- Imported the Icon
  useTrapFocus,
  useDropdown,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';
import { type CategoryTreeItem, categoryTreeGetters } from '@plentymarkets/shop-api';
import { paths } from '~/utils/paths';
import type { MegaMenuProps } from '~/components/MegaMenu/types';

const props = defineProps<MegaMenuProps>();
const NuxtLink = resolveComponent('NuxtLink');

const viewport = useViewport();
const localePath = useLocalePath();
const { buildCategoryMenuLink } = useLocalization();
const router = useRouter();
const { close, open, isOpen, activeNode, category, setCategory } = useMegaMenu();
const { setDrawerOpen } = useDrawerState();
const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');
const { getSetting: getIconColor } = useSiteSettings('iconColor');

// <-- Initialized Localization for the language button
const { toggle: toggleLanguageSelect } = useLocalization(); 

const { referenceRef, floatingRef } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});
const iconColor = computed(() => getIconColor());

const headerBackgroundColor = computed(() => getHeaderBackgroundColor());

const isTouchDevice = ref(false);

const sortTreeAlphabetically = (nodes: CategoryTreeItem[]): CategoryTreeItem[] => {
  if (!nodes || nodes.length === 0) return [];

  const processedNodes = [...nodes].sort((a, b) => {
    const nameA = categoryTreeGetters.getName(a) || '';
    const nameB = categoryTreeGetters.getName(b) || '';
    return nameA.localeCompare(nameB, 'de'); 
  });

  return processedNodes.map((node) => ({
    ...node,
    children: sortTreeAlphabetically(node.children || [])
  }));
};

const categoryTree = ref(sortTreeAlphabetically(categoryTreeGetters.getTree(props.categories)));

const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();
const tappedCategories = ref<Map<number, boolean>>(new Map());
let removeHook: () => void;

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: false,
} as const;

const activeMenu = computed(() => (category.value ? findNode(activeNode.value, category.value) : null));

// 4. PREVENT Z-INDEX DROP ON MOBILE
const headerClass = computed(() => ({ 'z-[110]': isOpen.value })); 

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

const focusTrigger = (index: number) => {
  unrefElement(triggerReference.value[index]).focus();
};

const onMouseLeave = () => {
  close();
  tappedCategories.value.clear();
};

const onCategoryMouseEnter = (menuNode: CategoryTreeItem) => {
  if (!viewport.isGreaterOrEquals('lg')) return;

  if (menuNode.childCount > 0) {
    activeNode.value = [menuNode.id];
    open();
    setCategory([menuNode]);
    return;
  }

  if (category.value !== null) category.value = null;
};

const handleFirstTouch = (menuNode: CategoryTreeItem) => {
  tappedCategories.value.set(menuNode.id, true);
  onCategoryMouseEnter(menuNode);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onCategoryTap = (menuNode: CategoryTreeItem) => {
  if (menuNode.childCount > 0 && isTouchDevice.value && !tappedCategories.value.get(menuNode.id)) {
    return handleFirstTouch(menuNode);
  }

  router.push(localePath(generateCategoryLink(menuNode)));
};

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  removeHook = router.afterEach(() => close());
});

onBeforeUnmount(() => removeHook?.());

watch(
  () => props.categories,
  (categories: CategoryTreeItem[]) => {
    categoryTree.value = sortTreeAlphabetically(categoryTreeGetters.getTree(categories));
    setCategory(categoryTree.value);
  },
);

setCategory(categoryTree.value);

useTrapFocus(
  computed(() => megaMenuReference.value?.[0]),
  trapFocusOptions,
);

useTrapFocus(drawerReference, trapFocusOptions);
</script>