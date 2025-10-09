<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer :class="['mb-20 md:px-0', { 'px-4': !isRoot }]" data-testid="account-layout">
      <h1
        v-if="viewport.isGreaterOrEquals('md') || (viewport.isLessThan('md') && isRoot)"
        class="mt-4 mb-10 md:my-10 mx-4 md:mx-0 font-bold typography-headline-3 md:typography-headline-2"
        data-testid="account-layout-heading"
      >
        {{ t('account.heading') }}
      </h1>

      <div v-else class="flex justify-start items-center mb-10 mt-4">
        <h1 class="font-bold typography-headline-3">{{ currentSectionLabel }}</h1>

        <UiButton
          :tag="NuxtLink"
          :to="localePath(paths.account)"
          class="flex md:hidden whitespace-nowrap justify-self-end ml-auto"
          size="sm"
          variant="tertiary"
        >
          <template #prefix>
            <SfIconArrowBack />
          </template>
          {{ t('account.back') }}
        </UiButton>
      </div>

      <div class="md:flex gap-10" data-testid="account-page-sidebar">
        <div
          :class="[
            'border-t md:border border-neutral-200 pt-4 pb-4 md:p-4 md:rounded-md min-w-[300px] md:block',
            { hidden: !isRoot },
          ]"
        >
          <ul
            v-for="({ title, icon, subsections }, secIndex) in sections"
            :key="`section-${secIndex}`"
            class="[&:not(:last-child)]:mb-4"
          >
            <SfListItem class="py-4 md:py-2 hover:!bg-transparent font-medium !cursor-auto select-none">
              <template #prefix><Component :is="icon" /></template>
              {{ title }}
            </SfListItem>

            <li v-for="({ label, link }, subIndex) in getSubsections(subsections)" :key="`subsection-${subIndex}`">
              <SfListItem
                :tag="NuxtLink"
                :to="localePath(link)"
                :class="[
                  'first-of-type:py-4 md:first-of-type:px-4 md:first-of-type:py-2 rounded-md active:bg-primary-100 !text-neutral-900',
                  {
                    'font-medium bg-primary-100': router.currentRoute.value.path === localePath(link),
                  },
                ]"
              >
                <template #prefix><SfIconBase /></template>
                {{ label }}
                <template #suffix><SfIconChevronRight class="md:hidden" /></template>
              </SfListItem>
            </li>
          </ul>
          <UiDivider />
          <ul>
            <SfListItem
              class="py-4 md:py-2 mt-4 rounded-md active:bg-primary-100 !text-neutral-900"
              data-testid="account-logout-button"
              @click="logOut"
            >
              <template #prefix><SfIconBase /></template>
              {{ t('account.logout') }}
            </SfListItem>
          </ul>
        </div>

        <div class="flex-1">
          <section
            class="grid grid-cols-1 2xs:grid-cols-2 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 mb-10 md:mb-5"
            data-testid="category-grid"
          >
            <NuxtPage />
          </section>
        </div>
      </div>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  SfIconBase,
  SfIconPerson,
  SfIconShoppingCart,
  SfListItem,
  SfIconArrowBack,
  SfIconChevronRight,
  SfIconFavorite,
} from '@storefront-ui/vue';
import type { MyAccountSubsection } from '~/layouts/types';
import { paths } from '~/utils/paths';

const localePath = useLocalePath();
const viewport = useViewport();
const { t } = useI18n();
const router = useRouter();
const { logout } = useCustomer();

const sections = computed(() => [
  {
    title: t('account.accountSettings.heading'),
    icon: SfIconPerson,
    subsections: [
      {
        label: t('account.accountSettings.section.personalData'),
        link: localePath(paths.accountPersonalData),
      },
      {
        label: t('account.accountSettings.section.billingDetails'),
        link: localePath(paths.accountBillingDetails),
      },
      {
        label: t('account.accountSettings.section.shippingDetails'),
        link: localePath(paths.accountShippingDetails),
      },
    ],
  },
  {
    title: t('account.ordersAndReturns.heading'),
    icon: SfIconShoppingCart,
    subsections: [
      {
        label: t('account.ordersAndReturns.section.myOrders'),
        link: localePath(paths.accountMyOrders),
      },
      {
        label: t('account.ordersAndReturns.section.returns'),
        link: localePath(paths.accountReturns),
      },
      {
        label: t('returns.return'),
        link: localePath(paths.accountNewReturn),
        hide: true,
      },
    ],
  },
  {
    title: t('account.wishlist.heading'),
    icon: SfIconFavorite,
    subsections: [
      {
        label: t('account.wishlist.section.myWishlist'),
        link: localePath(paths.accountMyWishlist),
      },
    ],
  },
]);

const currentPath = computed(() => router.currentRoute.value.path);
const isRoot = computed(() => currentPath.value === localePath(paths.account));

const findCurrentPage = computed(() =>
  sections.value.flatMap(({ subsections }) => subsections).find(({ link }) => currentPath.value.includes(link)),
);

const currentSectionLabel = computed(() => findCurrentPage.value?.label || '');

const getSubsections = (sections: MyAccountSubsection[]) => {
  return sections.filter((section) => !section.hide);
};

const breadcrumbs = computed(() => [
  { name: t('home'), link: localePath(paths.home) },
  { name: t('account.heading'), link: localePath(paths.account) },
  ...(isRoot.value ? [] : [{ name: findCurrentPage.value?.label || '', link: currentPath.value }]),
]);

const NuxtLink = resolveComponent('NuxtLink');

const logOut = async () => {
  await logout();
  navigateTo(localePath(paths.home));
};
</script>
