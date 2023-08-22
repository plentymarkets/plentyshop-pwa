<template>
  <div class="w-full h-full z-50 md:sticky md:-top-5 md:pt-2.5 md:shadow-md">
    <header ref="referenceRef" class="relative">
      <div
        class="flex justify-between items-center flex-wrap md:flex-nowrap px-4 md:px-10 py-2 md:py-5 w-full h-full border-0 bg-primary-700 border-neutral-200 md:h-20 md:z-10"
      >
        <div class="flex items-center">
          <SfButton
            variant="tertiary"
            square
            aria-label="Close menu"
            class="block md:hidden mr-5 bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
            @click="openMenu([])"
          >
            <SfIconMenu class="text-white" />
          </SfButton>

          <NuxtLink
            :to="paths.home"
            aria-label="Sf Homepage"
            class="flex shrink-0 w-full h-8 lg:w-[12.5rem] lg:h-[1.75rem] items-center mr-auto text-white md:mr-10 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
          >
            <UiVsfLogo />
          </NuxtLink>
        </div>

        <slot />
      </div>
      <!-- Desktop dropdown -->
      <nav ref="floatingRef">
        <ul
          class="hidden md:flex px-6 py-2 bg-white border-b border-b-neutral-200 border-b-solid"
          @blur="
            (event) => {
              if (!(event.currentTarget as Element).contains((event.relatedTarget as Element))) {
                close();
              }
            }
          "
        >
          <li v-for="(menuNode, index) in categories" :key="menuNode.id">
            <SfButton
              ref="triggerReference"
              variant="tertiary"
              class="group mr-2 !text-neutral-900 hover:!bg-neutral-200 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900"
              @mouseenter="menuNode.childCount > 0 ? openMenu([menuNode.id]) : openMenu([])"
              @click="menuNode.childCount > 0 ? openMenu([menuNode.id]) : openMenu([])"
            >
              <NuxtLink :to="generateCategoryLink(menuNode)">
                <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
                <SfIconChevronRight
                  v-if="menuNode.childCount > 0"
                  class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
                />
              </NuxtLink>
            </SfButton>

            <div
              v-if="isOpen && activeNode.length === 1 && activeNode[0] === menuNode.id && menuNode.childCount > 0"
              :key="activeMenu.id"
              ref="megaMenuReference"
              :style="style"
              class="hidden md:grid gap-x-6 grid-cols-4 bg-white shadow-lg p-6 left-0 right-0 outline-none z-[1000]"
              tabindex="0"
              @mouseleave="close()"
              @keydown.esc="focusTrigger(index)"
            >
              <template v-for="node in activeMenu.children" :key="node.key">
                <template v-if="node.childCount === 0">
                  <ul>
                    <SfListItem
                      :tag="NuxtLink"
                      size="sm"
                      :href="generateCategoryLink(node)"
                      class="typography-text-sm mb-2"
                    >
                      {{ categoryTreeGetters.getName(node) }}
                    </SfListItem>
                  </ul>
                </template>
                <div v-else>
                  <p
                    class="typography-text-base font-medium text-neutral-900 whitespace-nowrap px-4 py-1.5 border-b border-b-neutral-200 border-b-solid"
                  >
                    {{ categoryTreeGetters.getName(node) }}
                  </p>
                  <ul class="mt-2">
                    <li v-for="child in node.children" :key="child.id">
                      <SfListItem
                        v-if="categoryTreeGetters.getName(child)"
                        :tag="NuxtLink"
                        size="sm"
                        :href="generateCategoryLink(child)"
                        class="typography-text-sm py-1.5"
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

      <!-- Mobile drawer -->
      <div v-if="isOpen" class="md:hidden fixed inset-0 bg-neutral-500 bg-opacity-50" />
      <SfDrawer
        ref="drawerReference"
        v-model="isOpen"
        placement="left"
        class="md:hidden right-[50px] max-w-[376px] bg-white overflow-y-auto z-[1000]"
      >
        <nav>
          <div class="flex items-center justify-between p-4 border-b border-b-neutral-200 border-b-solid">
            <p class="typography-text-base font-medium">Browse products</p>
            <SfButton variant="tertiary" square aria-label="Close menu" class="ml-2" @click="close()">
              <SfIconClose class="text-neutral-500" />
            </SfButton>
          </div>
          <ul class="mt-2 mb-6">
            <li v-if="activeMenu.id !== 0">
              <SfListItem
                size="lg"
                tag="button"
                type="button"
                class="border-b border-b-neutral-200 border-b-solid"
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
                <SfListItem size="lg" :tag="NuxtLink" :href="generateCategoryLink(node)">
                  <div class="flex items-center">
                    <p class="text-left">{{ categoryTreeGetters.getName(node) }}</p>
                    <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                  </div>
                </SfListItem>
              </li>
              <li v-else>
                <SfListItem size="lg" tag="button" type="button" class="!p-0">
                  <div class="flex items-center w-100">
                    <NuxtLink class="flex-1 m-0 p-4 pr-0" :to="generateCategoryLink(node)">
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
    </header>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { CategoryTreeItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { categoryTreeGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import {
  SfIconClose,
  SfButton,
  SfDrawer,
  SfListItem,
  SfIconChevronRight,
  SfCounter,
  SfIconArrowBack,
  SfIconMenu,
  useDisclosure,
  useTrapFocus,
  useDropdown,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';
import { MegaMenuProps } from '~/components/MegaMenu/types';

const NuxtLink = resolveComponent('NuxtLink');
const props = defineProps<MegaMenuProps>();
const categories = computed(() => categoryTreeGetters.getTree(props.categories));
const category = {
  id: 0,
  type: 'root',
  itemCount: [],
  childCount: categories.value.length,
  details: [],
  children: categories.value,
} as CategoryTreeItem;

const findNode = (keys: number[], node: CategoryTreeItem): CategoryTreeItem => {
  if (keys.length > 1) {
    const [currentKey, ...restKeys] = keys;
    return findNode(restKeys, node.children?.find((child) => child.id === currentKey) || node);
  } else {
    return node.children?.find((child) => child.id === keys[0]) || node;
  }
};

const generateCategoryLink = (category: CategoryTreeItem) => {
  return categoryTreeGetters.generateCategoryLink(categories.value, category);
};

const { close, open, isOpen } = useDisclosure();
const { referenceRef, floatingRef, style } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});

const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();
const activeNode = ref<number[]>([]);

const activeMenu = computed(() => findNode(activeNode.value, category));

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
</script>
