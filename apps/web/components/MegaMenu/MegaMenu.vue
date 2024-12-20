<template>
  <header ref="referenceRef" class="relative w-full z-40 lg:sticky top-0 border-b z-50">
    <div
         class="flex justify-between items-center flex-wrap md:flex-nowrap px-4 md:px-10 py-2 md:py-5 w-full h-full border-0 bg-white border-neutral-200 md:h-20 md:z-10"
         data-testid="navbar-top">
      <div class="flex items-center">
        <UiButton
                  v-if="viewport.isLessThan('lg')"
                  variant="tertiary"
                  square
                  :aria-label="t('closeMenu')"
                  class="mr-5"
                  @click="openMenu([])">
          <SfIconMenu class="text-black" />
        </UiButton>

        <NuxtLink
                  :to="localePath(paths.home)"
                  :aria-label="t('goToHomepage')"
                  class="flex shrink-0 w-full h-8 items-center mr-auto text-white focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm">
          <UiVsfLogo />
        </NuxtLink>
      </div>

      <nav v-if="viewport.isGreaterOrEquals('lg')" ref="floatingRef" class="flex flex-grow">
        <ul
            class="flex px-6 py-2 ml-2"
            @blur="(event) => {
              if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
                close();
              }
            }
              ">
          <li v-if="categoryTree.length === 0" class="h-10"></li>

          <li v-else v-for="(menuNode, index) in categoryTree" :key="index">
            <UiButton
                      ref="triggerReference"
                      variant="tertiary"
                      data-testid="category-button"
                      class="group mr-2 !text-black hover:underline !py-1.5 !px-5"
                      :class="{ '!bg-primary-500 !text-white !no-underline': activeNode[0] === menuNode.id && isOpen }"
                      @click="menuNode.childCount > 0 ? openMenu([menuNode.id]) : openMenu([])">
              <span class="g-16">{{ categoryTreeGetters.getName(menuNode) }}</span>
            </UiButton>

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
                 class="hidden md:flex gap-x-6 bg-white shadow-lg p-6 left-0 right-0 outline-none z-40"
                 tabindex="0"
                 @click.passive="close"
                 @keydown.esc="focusTrigger(index)">
              <template v-for="node in activeMenu.children" :key="node.id">
                <template v-if="node.childCount === 0">
                  <ul>
                    <SfListItem
                                :tag="NuxtLink"
                                size="sm"
                                :href="localePath(generateCategoryLink(node))"
                                class="kl-mega-menu-item g-16-m flex flex-col mb-2 hover:bg-white"
                                :id="categoryTreeGetters.getSlug(node)">
                      {{ categoryTreeGetters.getName(node) }}
                    </SfListItem>
                  </ul>
                </template>
                <div v-else>
                  <SfListItem :tag="NuxtLink" size="sm" :href="localePath(generateCategoryLink(node))"
                              class="typography-text-base font-medium text-neutral-900 whitespace-nowrap px-4 py-1.5 g-24">
                    {{ categoryTreeGetters.getName(node) }}
                  </SfListItem>
                  <ul class="flex mt-2">
                    <li v-for="child in node.children" :key="child.id">
                      <SfListItem v-if="categoryTreeGetters.getName(child)" :tag="NuxtLink" size="sm"
                                  :href="localePath(generateCategoryLink(child))" class="py-1.5 g-16-m">
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

      <slot />


    </div>

    <template v-if="!viewport.isGreaterOrEquals('lg')">
      <div v-if="isOpen" class="fixed z-[50] inset-0 bg-black bg-opacity-75">
        <UiButton variant="tertiary" square :aria-label="t('closeMenu')" class="ml-2 fixed top-2 right-2 z-100 "
                  @click="close()">
          <SfIconClose size="xl" class="text-white" />
        </UiButton>
      </div>
      <SfDrawer
                ref="drawerReference"
                v-model="isOpen"
                placement="left"
                class="right-12 max-w-96 bg-white overflow-y-auto z-[1000]">
        <nav>
          <ul class="mt-2 mb-6" v-if="activeMenu">
            <li v-if="activeMenu.id !== 0">
              <SfListItem
                          size="lg"
                          tag="button"
                          type="button"
                          class="border-b border-b-neutral-200 border-b-solid"
                          @click="goBack()">
                <div class="flex items-center">
                  <SfIconArrowBack class="text-neutral-500" />
                  <p class="ml-5 font-medium">{{ categoryTreeGetters.getName(activeMenu) }}</p>
                </div>
              </SfListItem>
            </li>
            <template v-for="node in activeMenu.children" :key="node.id">
              <li v-if="node.childCount === 0">
                <SfListItem size="lg" :tag="NuxtLink" :href="localePath(generateCategoryLink(node))" @click="close()">
                  <div class="flex items-center">
                    <p class="text-left">{{ categoryTreeGetters.getName(node) }}</p>
                    <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                  </div>
                </SfListItem>
              </li>
              <li v-else>
                <SfListItem size="lg" tag="button" type="button" class="!p-0">
                  <div class="flex items-center w-100">
                    <NuxtLink class="flex-1 m-0 p-4 pr-0" :to="localePath(generateCategoryLink(node))" @click.stop="goNext(node.id)">
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
import { type CategoryTreeItem, categoryTreeGetters } from '@plentymarkets/shop-api';
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
import type { MegaMenuProps } from '~/components/MegaMenu/types';
import { paths } from '~/utils/paths';
import { onBeforeRouteLeave } from 'vue-router';

const { t } = useI18n();
const viewport = useViewport();
const localePath = useLocalePath();
const { buildCategoryMenuLink } = useLocalization();
const NuxtLink = resolveComponent('NuxtLink');
const props = defineProps<MegaMenuProps>();
const { close, open, isOpen, activeNode, category, setCategory } = useMegaMenu();
const { referenceRef, floatingRef, style } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});
const categoryTree = ref(categoryTreeGetters.getTree(props.categories));

// onBeforeRouteLeave((to, from) => {
//   // Close mega menu when user navigates to new page
//   close();
// });

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

const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();

const activeMenu = computed(() => (category.value ? findNode(activeNode.value, category.value) : null));

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
} as const;
useTrapFocus(
  computed(() => megaMenuReference.value?.[0]),
  trapFocusOptions,
);
useTrapFocus(drawerReference, trapFocusOptions);

const openMenu = (menuType: number[]) => {
  activeNode.value = menuType;
  open();
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

setCategory(categoryTree.value);

watch(
  () => props.categories,
  async (categories: CategoryTreeItem[]) => {
    categoryTree.value = categoryTreeGetters.getTree(categories);
    setCategory(categoryTree.value);
  },
);
</script>
