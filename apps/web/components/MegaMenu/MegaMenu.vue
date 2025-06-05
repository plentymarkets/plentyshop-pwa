<template>
  <header ref="referenceRef" :class="headerClass" class="relative w-full md:sticky md:shadow-md z-10">
    <div
      class="flex justify-between items-center flex-wrap md:flex-nowrap px-4 md:px-10 py-2 md:py-5 w-full border-0 border-neutral-200"
      :style="{ backgroundColor: headerBackgroundColor }"
      data-testid="navbar-top"
    >
      <div class="flex items-center">
        <UiButton
          v-if="viewport.isLessThan('lg')"
          variant="tertiary"
          square
          :aria-label="t('closeMenu')"
          class="mr-5 bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-700 active:text-white"
          @click="openMenu([])"
        >
          <SfIconMenu class="text-white" />
        </UiButton>

        <NuxtLink
          :to="localePath(paths.home)"
          :aria-label="t('goToHomepage')"
          class="flex shrink-0 w-full lg:w-48 items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
        >
          <UiVsfLogo />
        </NuxtLink>
      </div>

      <slot />
    </div>

    <div v-if="viewport.isGreaterOrEquals('lg')">
      <nav ref="floatingRef">
        <ul
          class="flex flex-wrap px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid"
          @blur="
            (event) => {
              if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
                close();
              }
            }
          "
        >
          <li v-if="categoryTree.length === 0" class="h-10" />

          <li
            v-for="(menuNode, index) in categoryTree"
            v-else
            :key="index"
            @mouseenter="onCategoryMouseEnter(menuNode)"
          >
            <div
              ref="triggerReference"
              data-testid="category-button"
              class="inline-flex items-center justify-center gap-2 font-medium text-base rounded-md py-2 px-4 group mr-2 !text-neutral-900 hover:bg-secondary-100 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900 cursor-pointer"
              @click="onCategoryTap(menuNode)"
            >
              <template v-if="menuNode.childCount > 0">
                <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
                <SfIconChevronRight
                  class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
                />
              </template>
              <template v-else>
                <NuxtLink :to="localePath(generateCategoryLink(menuNode))" class="flex items-center gap-2 w-full">
                  <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
                </NuxtLink>
              </template>
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
              :style="style"
              class="hidden md:grid gap-x-6 grid-cols-4 bg-white shadow-lg p-6 left-0 right-0 outline-none z-40"
              tabindex="0"
              @mouseleave="onMouseLeave"
              @keydown.esc="focusTrigger(index)"
            >
              <template v-for="node in activeMenu.children" :key="node.id">
                <template v-if="node.childCount === 0">
                  <ul>
                    <SfListItem
                      :tag="NuxtLink"
                      size="sm"
                      :href="localePath(generateCategoryLink(node))"
                      class="typography-text-sm mb-2 hover:bg-secondary-100 rounded"
                    >
                      {{ categoryTreeGetters.getName(node) }}
                    </SfListItem>
                  </ul>
                </template>
                <div v-else>
                  <SfListItem
                    :tag="NuxtLink"
                    size="sm"
                    :href="localePath(generateCategoryLink(node))"
                    class="typography-text-base font-medium text-neutral-900 whitespace-nowrap px-4 py-1.5 border-b border-b-neutral-200 border-b-solid hover:bg-secondary-100 rounded"
                  >
                    {{ categoryTreeGetters.getName(node) }}
                  </SfListItem>
                  <ul class="mt-2">
                    <li v-for="child in node.children" :key="child.id">
                      <SfListItem
                        v-if="categoryTreeGetters.getName(child)"
                        :tag="NuxtLink"
                        size="sm"
                        :href="localePath(generateCategoryLink(child))"
                        class="typography-text-sm py-1.5 hover:bg-secondary-100 rounded"
                      >
                        {{ categoryTreeGetters.getName(child) }}
                      </SfListItem>
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </li>
        </ul>
      </nav>
    </div>

    <template v-else>
      <div v-if="isOpen" class="fixed z-[50] inset-0 bg-neutral-500 bg-opacity-50" />
      <SfDrawer
        ref="drawerReference"
        v-model="isOpen"
        placement="left"
        class="right-12 max-w-96 bg-white overflow-y-auto z-[1000]"
      >
        <nav>
          <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid">
            <p class="typography-text-base font-medium">{{ t('browseProducts') }}</p>
            <UiButton variant="tertiary" square :aria-label="t('closeMenu')" class="ml-2" @click="close()">
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
  useTrapFocus,
  useDropdown,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';
import { type CategoryTreeItem, categoryTreeGetters } from '@plentymarkets/shop-api';
import { paths } from '~/utils/paths';
import type { MegaMenuProps } from '~/components/MegaMenu/types';

const props = defineProps<MegaMenuProps>();
const NuxtLink = resolveComponent('NuxtLink');

const { t } = useI18n();
const viewport = useViewport();
const localePath = useLocalePath();
const { buildCategoryMenuLink } = useLocalization();
const { headerBackgroundColor } = useSiteConfiguration();
const router = useRouter();
const { close, open, isOpen, activeNode, category, setCategory } = useMegaMenu();
const { setDrawerOpen } = useDrawerState();
const { referenceRef, floatingRef, style } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});

const isTouchDevice = ref(false);
const categoryTree = ref(categoryTreeGetters.getTree(props.categories));
const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();
const tappedCategories = ref<Map<number, boolean>>(new Map());
let removeHook: () => void;

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
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
    categoryTree.value = categoryTreeGetters.getTree(categories);
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
