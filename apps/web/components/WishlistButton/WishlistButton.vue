<template>
  <SfButton
    variant="tertiary"
    size="sm"
    :aria-label="
      isWishlistItem(variationId)
        ? t('removeProductFromWishlist', { label: productName })
        : t('addProductToWishlist', { label: productName })
    "
    :class="{ 'p-[0.9rem]': !isCloseButton }"
    class="m-2"
    :disabled="wishlistLoading"
    @click="onWishlistClick"
    data-testid="wishlist-trigger"
  >
    <SfLoaderCircular v-if="actionLoading" class="flex justify-center items-center" size="sm" />
    <template v-else>
      <SfIconClose v-if="isCloseButton" size="sm" />
      <SfIconFavoriteFilled v-else-if="isWishlistItem(variationId)" size="sm" />
      <SfIconFavorite v-else size="sm" />
      <slot />
    </template>
  </SfButton>
</template>

<script setup lang="ts">
import type { WishlistButtonProps } from '~/components/WishlistButton/types';
import { SfButton, SfIconFavorite, SfIconFavoriteFilled, SfLoaderCircular, SfIconClose } from '@storefront-ui/vue';
import { productGetters } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<WishlistButtonProps>(), { quantity: 1, discard: false });
const { product, quantity, discard } = toRefs(props);
const { t } = useI18n();
const { isWishlistItem, interactWithWishlist, loading: wishlistLoading } = useWishlist();
const actionLoading = ref(false);

const productName = computed(() => productGetters.getName(product.value));
const variationId = computed(() => productGetters.getVariationId(product.value));
const isCloseButton = computed(() => isWishlistItem(variationId.value) && discard.value);
const onWishlistClick = async () => {
  actionLoading.value = true;
  await interactWithWishlist(variationId.value, quantity.value);
  actionLoading.value = false;
};
</script>
