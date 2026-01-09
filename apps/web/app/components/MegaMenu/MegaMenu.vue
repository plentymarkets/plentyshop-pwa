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
          :aria-label="t('common.navigation.openMenu')"
          class="mr-5 hover:!bg-header-400"
          :style="{ color: iconColor }"
          @click="openMenu([])"
        >
          <SfIconMenu aria-hidden="true" />
        </UiButton>

        <NuxtLink
          :to="localePath(paths.home)"
          :aria-label="t('common.actions.goToHomepage')"
          class="flex shrink-0 w-full lg:w-48 items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
        >
          <UiLogo />
        </NuxtLink>
      </div>

      <slot />
    </div>

    <nav v-if="viewport.isGreaterOrEquals('lg')" ref="floatingRef">
      <ul
        class="flex flex-wrap px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid"
        @blur="
          (event: FocusEvent) => {
            if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
              close();
            }
          }
        "
      >
        <li v-if="categoryTree.length === 0" class="h-10" />

        <li v-for="(menuNode, index) in categoryTree" v-else :key="index" @mouseenter="onCategoryMouseEnter(menuNode)">
          <button
            v-if="menuNode.childCount > 0"
            ref="triggerReference"
            type="button"
            data-testid="category-button"
            :class="categoryButtonClasses"
            aria-haspopup="true"
            :aria-expanded="isOpen && activeNode[0] === menuNode.id ? 'true' : 'false'"
            @touchstart="onTouchStart"
            @mousedown="onMouseDown"
            @click="onCategoryTap(menuNode)"
            @keydown.down.prevent="openMenuAndFocusFirst(menuNode)"
            @keydown.left="focusPreviousCategory(index)"
            @keydown.right="focusNextCategory(index)"
          >
            <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
            <SfIconChevronRight
              aria-hidden="true"
              class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
            />
          </button>

          <NuxtLink
            v-else
            ref="triggerReference"
            :to="localePath(generateCategoryLink(menuNode))"
            data-testid="category-button"
            :class="categoryButtonClasses"
            @keydown.left="focusPreviousCategory(index)"
            @keydown.right="focusNextCategory(index)"
          >
            <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
          </NuxtLink>

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
            class="hidden md:grid gap-x-6 grid-cols-4 bg-white shadow-lg p-6 pt-5 left-0 right-0 outline-none z-40 max-h-[calc(100vh-300px)] overflow-y-auto"
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
                    class="mb-2 hover:bg-secondary-100 rounded font-medium typography-text-base"
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
                  class="typography-text-base font-medium text-neutral-900 px-4 py-1.5 border-b border-b-neutral-200 border-b-solid hover:bg-secondary-100 rounded whitespace-normal break-words"
                >
                  {{ categoryTreeGetters.getName(node) }}
                </SfListItem>
                <ul class="mt-2 mb-3">
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
            <p class="typography-text-base font-medium">{{ t('common.actions.browseProducts') }}</p>
            <UiButton
              variant="tertiary"
              square
              :aria-label="t('common.navigation.closeMenu')"
              class="ml-2"
              @click="close()"
            >
              <SfIconClose aria-hidden="true" class="text-neutral-500" />
            </UiButton>
          </div>
          <ul v-if="activeMenu" class="mt-2 mb-6">
            <li v-if="activeMenu.id !== 0">
              <SfListItem
                size="lg"
                tag="button"
                type="button"
                class="border-b border-b-neutral-200 border-b-solid hover:bg-secondary-100"
                :aria-label="t('common.actions.back') + ' - ' + categoryTreeGetters.getName(activeMenu)"
                @click="goBack()"
              >
                <div class="flex items-center">
                  <SfIconArrowBack aria-hidden="true" class="text-neutral-500" />
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
                <div class="flex items-center hover:bg-secondary-100">
                  <NuxtLink
                    class="flex-1 m-0 px-4 py-3 text-left"
                    :to="localePath(generateCategoryLink(node))"
                    @click="close()"
                  >
                    <div class="flex items-center">
                      <p class="text-left typography-text-lg">{{ categoryTreeGetters.getName(node) }}</p>
                      <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                    </div>
                  </NuxtLink>
                  <button
                    type="button"
                    class="flex justify-center items-center h-full w-16 px-4"
                    :aria-label="t('common.navigation.showSubcategories') + ' - ' + categoryTreeGetters.getName(node)"
                    @click="goNext(node.id)"
                  >
                    <SfIconChevronRight aria-hidden="true" class="text-neutral-500" />
                  </button>
                </div>
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

const viewport = useViewport();
const localePath = useLocalePath();
const { buildCategoryMenuLink } = useLocalization();
const router = useRouter();
const { close, open, isOpen, activeNode, category, setCategory } = useMegaMenu();
const { setDrawerOpen } = useDrawerState();
const { getSetting: getHeaderBackgroundColor } = useSiteSettings('headerBackgroundColor');
const { getSetting: getIconColor } = useSiteSettings('iconColor');
const { referenceRef, floatingRef, style } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});
const iconColor = computed(() => getIconColor());
const headerBackgroundColor = computed(() => getHeaderBackgroundColor());

const isUsingTouch = ref(false);
const lastTouchTime = ref(0);
const categoryTree = ref(categoryTreeGetters.getTree(props.categories));
const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();
const tappedCategories = ref<Map<number, boolean>>(new Map());
const TOUCH_DETECTION_THRESHOLD = 500;
const categoryButtonClasses =
  'inline-flex items-center justify-center gap-2 font-medium text-base rounded-md py-2 px-4 group mr-2 !text-neutral-900 hover:bg-secondary-100 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900';
let removeHook: () => void;

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'autofocus',
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
  unrefElement(triggerReference.value[index])?.focus();
};

const focusNextCategory = (currentIndex: number) => {
  const nextIndex = (currentIndex + 1) % categoryTree.value.length;
  focusTrigger(nextIndex);
};

const focusPreviousCategory = (currentIndex: number) => {
  const prevIndex = currentIndex === 0 ? categoryTree.value.length - 1 : currentIndex - 1;
  focusTrigger(prevIndex);
};

const openMenuAndFocusFirst = (menuNode: CategoryTreeItem) => {
  if (menuNode.childCount > 0) onCategoryMouseEnter(menuNode);
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

const onTouchStart = () => {
  isUsingTouch.value = true;
  lastTouchTime.value = Date.now();
};

const onMouseDown = () => {
  if (Date.now() - lastTouchTime.value > TOUCH_DETECTION_THRESHOLD) isUsingTouch.value = false;
};

const handleFirstTouch = (menuNode: CategoryTreeItem) => {
  tappedCategories.value.clear();
  tappedCategories.value.set(menuNode.id, true);
  onCategoryMouseEnter(menuNode);
};

const onCategoryTap = (menuNode: CategoryTreeItem) => {
  if (isUsingTouch.value && menuNode.childCount > 0 && !tappedCategories.value.get(menuNode.id)) {
    return handleFirstTouch(menuNode);
  }

  close();
  tappedCategories.value.clear();
  router.push(localePath(generateCategoryLink(menuNode)));
};

onMounted(() => {
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
