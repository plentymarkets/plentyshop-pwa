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
          :aria-label="t('common.navigation.closeMenu')"
          class="mr-5 hover:!bg-header-400"
          :style="{ color: iconColor }"
          @click="openMenu()"
        >
          <SfIconMenu />
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
        <li v-for="(menuItem, index) in hardcodedMenuItems" :key="menuItem.id" @mouseenter="onCategoryMouseEnter(menuItem)">
          <div
            ref="triggerReference"
            data-testid="category-button"
            class="inline-flex items-center justify-center gap-2 font-medium text-base rounded-md py-2 px-4 group mr-2 !text-neutral-900 hover:bg-secondary-100 hover:!text-neutral-700 active:!bg-neutral-300 active:!text-neutral-900 cursor-pointer"
            @click="onCategoryTap(menuItem)"
          >
            <template v-if="menuItem.hasChildren">
              <span>{{ menuItem.name }}</span>
              <SfIconChevronRight
                class="rotate-90 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-900"
              />
            </template>
            <template v-else>
              <NuxtLink :to="menuItem.url" class="flex items-center gap-2 w-full">
                <span>{{ menuItem.name }}</span>
              </NuxtLink>
            </template>
          </div>

          <div
            v-if="isOpen && activeMenuData && activeMenuId === menuItem.id && menuItem.hasChildren"
            :key="menuItem.id"
            ref="megaMenuReference"
            :style="style"
            class="hidden md:grid gap-x-6 grid-cols-4 bg-white shadow-lg p-6 pt-5 left-0 right-0 outline-none z-40"
            tabindex="0"
            @mouseleave="onMouseLeave"
            @keydown.esc="focusTrigger(index)"
          >
            <template v-for="child in activeMenuData.children" :key="child.id">
              <template v-if="!child.hasGrandchildren">
                <ul>
                  <SfListItem
                    :tag="NuxtLink"
                    size="sm"
                    :href="child.url"
                    class="mb-2 hover:bg-secondary-100 rounded font-medium typography-text-base"
                  >
                    {{ child.name }}
                  </SfListItem>
                </ul>
              </template>
              <div v-else>
                <SfListItem
                  :tag="NuxtLink"
                  size="sm"
                  :href="child.url"
                  class="typography-text-base font-medium text-neutral-900 whitespace-nowrap px-4 py-1.5 border-b border-b-neutral-200 border-b-solid hover:bg-secondary-100 rounded"
                >
                  {{ child.name }}
                </SfListItem>
                <ul class="mt-2 mb-3">
                  <li v-for="grandchild in child.children" :key="grandchild.id">
                    <SfListItem
                      :tag="NuxtLink"
                      size="sm"
                      :href="grandchild.url"
                      class="typography-text-sm py-1.5 hover:bg-secondary-100 rounded"
                    >
                      {{ grandchild.name }}
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
            <p class="typography-text-base font-medium">Browse Products</p>
            <UiButton
              variant="tertiary"
              square
              aria-label="Close menu"
              class="ml-2"
              @click="close()"
            >
              <SfIconClose class="text-neutral-500" />
            </UiButton>
          </div>
          <ul class="mt-2 mb-6">
            <li v-for="menuItem in hardcodedMenuItems" :key="menuItem.id">
              <SfListItem
                v-if="!menuItem.hasChildren"
                size="lg"
                :tag="NuxtLink"
                :href="menuItem.url"
                class="hover:bg-secondary-100"
                @click="close()"
              >
                <div class="flex items-center">
                  <p class="text-left">{{ menuItem.name }}</p>
                </div>
              </SfListItem>
              <SfListItem v-else size="lg" tag="button" type="button" class="!p-0 hover:bg-secondary-100">
                <div class="flex items-center w-100">
                  <NuxtLink class="flex-1 m-0 p-4 pr-0" :to="menuItem.url" @click="close()">
                    <div class="flex items-center">
                      <p class="text-left">{{ menuItem.name }}</p>
                    </div>
                  </NuxtLink>
                  <div class="flex justify-center items-center h-8 w-16">
                    <SfIconChevronRight class="text-neutral-500" />
                  </div>
                </div>
              </SfListItem>
            </li>
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

// const hardcodedMenuItems = ref(
//   Array.from({ length: 7 }, (_, i) => ({
//     id: i + 1,
//     name: `Category ${i + 1}`,
//     url: `/category-${i + 1}`,
//     hasChildren: true,
//     children: Array.from({ length: 10 }, (_, j) => ({
//       id: (i + 1) * 1000 + j,
//       name: `Subcategory ${i + 1}.${j + 1}`,
//       url: `/category-${i + 1}/sub-${j + 1}`,
//       hasGrandchildren: j % 2 === 0,
//       children: j % 2 === 0 ? Array.from({ length: 4 }, (_, k) => ({
//         id: (i + 1) * 10000 + j * 100 + k,
//         name: `Sub-subcategory ${i + 1}.${j + 1}.${k + 1}`,
//         url: `/category-${i + 1}/sub-${j + 1}/item-${k + 1}`
//       })) : []
//     }))
//   }))
// );

// const hardcodedMenuItems = ref(
//   Array.from({ length: 7 }, (_, i) => ({
//     id: i + 1,
//     name: `Category ${i + 1}`,
//     url: `/category-${i + 1}`,
//     hasChildren: true,
//     children: Array.from({ length: 10 }, (_, j) => ({
//       id: (i + 1) * 1000 + j,
//       name: `Subcategory Long Text Long Text Long Text ${i + 1}.${j + 1}`,
//       url: `/category-${i + 1}/sub-${j + 1}`,
//       hasGrandchildren: true,
//       children: Array.from({ length: 20 }, (_, k) => ({
//         id: (i + 1) * 10000 + j * 100 + k,
//         name: `Sub-subcategory a lot of text a lot of text a lot of text  a lot of text  a lot of text  a lot of text huge strings huge huge strings${i + 1}.${j + 1}.${k + 1}`,
//         url: `/category-${i + 1}/sub-${j + 1}/item-${k + 1}`
//       }))
//     }))
//   }))
// );

// ...existing code...
const hardcodedMenuItems = ref(
  Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    name: `Category ${i + 1}`,
    url: `/category-${i + 1}`,
    hasChildren: true,
    children: Array.from({ length: 8 }, (_, j) => {
      const grandchildrenCount = 5 + (j * 5); 
      return {
        id: (i + 1) * 1000 + j,
        name: `Subcategory Long Text Long Text Long Text ${i + 1}.${j + 1}`,
        url: `/category-${i + 1}/sub-${j + 1}`,
        hasGrandchildren: true,
        children: Array.from({ length: grandchildrenCount }, (_, k) => ({
          id: (i + 1) * 10000 + j * 100 + k,
          name: `Sub-subcategory a lot of text a lot of text a lot of text  a lot of text  a lot of text  a lot of text huge strings huge huge strings${i + 1}.${j + 1}.${k + 1}`,
          url: `/category-${i + 1}/sub-${j + 1}/item-${k + 1}`
        }))
      };
    })
  }))
);

// ...existing code...
// const hardcodedMenuItems = ref(
//   Array.from({ length: 7 }, (_, i) => ({
//     id: i + 1,
//     name: `Category ${i + 1}`,
//     url: `/category-${i + 1}`,
//     hasChildren: true,
//     children: Array.from({ length: 10 }, (_, j) => {
//       // Special cases for first two subcategories (no name, single grandchild)
//       if (j === 0) {
//         return {
//           id: (i + 1) * 1000 + j,
//           name: '',
//           url: `/category-${i + 1}/sub-${j + 1}`,
//           hasGrandchildren: true,
//           children: [{
//             id: (i + 1) * 10000 + j * 100,
//             name: 'Cobblers Tools & Supplies',
//             url: `/category-${i + 1}/sub-${j + 1}/cobblers-tools`
//           }]
//         };
//       }
      
//       if (j === 1) {
//         return {
//           id: (i + 1) * 1000 + j,
//           name: '',
//           url: `/category-${i + 1}/sub-${j + 1}`,
//           hasGrandchildren: true,
//           children: [{
//             id: (i + 1) * 10000 + j * 100,
//             name: 'Leather Edge Bevelers',
//             url: `/category-${i + 1}/sub-${j + 1}/leather-bevelers`
//           }]
//         };
//       }
      
//       // Subcategories 1.3 and 1.4 (3 grandchildren)
//       if (j === 2 || j === 3) {
//         return {
//           id: (i + 1) * 1000 + j,
//           name: `Subcategory Long Text Long Text Long Text ${i + 1}.${j + 1}`,
//           url: `/category-${i + 1}/sub-${j + 1}`,
//           hasGrandchildren: true,
//           children: Array.from({ length: 3 }, (_, k) => ({
//             id: (i + 1) * 10000 + j * 100 + k,
//             name: `Random Item ${Math.random().toString(36).substring(7)} ${i + 1}.${j + 1}.${k + 1}`,
//             url: `/category-${i + 1}/sub-${j + 1}/item-${k + 1}`
//           }))
//         };
//       }
      
//       // Subcategory 1.5 (8 grandchildren)
//       if (j === 4) {
//         return {
//           id: (i + 1) * 1000 + j,
//           name: `Subcategory Long Text Long Text Long Text ${i + 1}.${j + 1}`,
//           url: `/category-${i + 1}/sub-${j + 1}`,
//           hasGrandchildren: true,
//           children: Array.from({ length: 18 }, (_, k) => ({
//             id: (i + 1) * 10000 + j * 100 + k,
//             name: `Random Product ${Math.random().toString(36).substring(7)} ${i + 1}.${j + 1}.${k + 1}`,
//             url: `/category-${i + 1}/sub-${j + 1}/item-${k + 1}`
//           }))
//         };
//       }
      
//       // Rest of subcategories - progressive increase
//       const grandchildrenCount = 5 + (j * 5);
//       return {
//         id: (i + 1) * 1000 + j,
//         name: `Subcategory Long Text Long Text Long Text ${i + 1}.${j + 1}`,
//         url: `/category-${i + 1}/sub-${j + 1}`,
//         hasGrandchildren: true,
//         children: Array.from({ length: grandchildrenCount }, (_, k) => ({
//           id: (i + 1) * 10000 + j * 100 + k,
//           name: `Sub-subcategory a lot of text a lot of text ${i + 1}.${j + 1}.${k + 1}`,
//           url: `/category-${i + 1}/sub-${j + 1}/item-${k + 1}`
//         }))
//       };
//     })
//   }))
// );
// ...existing code...

const isTouchDevice = ref(false);
const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();
const tappedCategories = ref<Map<number, boolean>>(new Map());
const activeMenuId = ref<number | null>(null);
let removeHook: () => void;

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
} as const;

const activeMenuData = computed(() => 
  hardcodedMenuItems.value.find((item) => item.id === activeMenuId.value)
);
const headerClass = computed(() => ({ 'z-[10]': isOpen.value }));

const openMenu = () => {
  open();
  setDrawerOpen(true);
};

const focusTrigger = (index: number) => {
  unrefElement(triggerReference.value[index]).focus();
};

const onMouseLeave = () => {
  close();
  activeMenuId.value = null;
  tappedCategories.value.clear();
};

const onCategoryMouseEnter = (menuItem: any) => {
  if (!viewport.isGreaterOrEquals('lg')) return;

  if (menuItem.hasChildren) {
    activeMenuId.value = menuItem.id;
    open();
  } else {
    activeMenuId.value = null;
  }
};

const handleFirstTouch = (menuItem: any) => {
  tappedCategories.value.set(menuItem.id, true);
  onCategoryMouseEnter(menuItem);
};

const onCategoryTap = (menuItem: any) => {
  if (menuItem.hasChildren && isTouchDevice.value && !tappedCategories.value.get(menuItem.id)) {
    return handleFirstTouch(menuItem);
  }

  if (!menuItem.hasChildren) {
    router.push(menuItem.url);
  }
};

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  removeHook = router.afterEach(() => {
    close();
    activeMenuId.value = null;
  });
});

onBeforeUnmount(() => removeHook?.());

useTrapFocus(
  computed(() => megaMenuReference.value?.[0]),
  trapFocusOptions,
);

useTrapFocus(drawerReference, trapFocusOptions);
</script>

