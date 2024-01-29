<template>
  <SfButton
    variant="tertiary"
    size="sm"
    :aria-label="
      isWishlistItem(variationId) ? t('removeProductFromWishlist', productName) : t('addProductToWishlist', productName)
    "
    :disabled="wishlistLoading"
    @click="onWishlistClick()"
    data-testid="wishlist-trigger"
  >
    <SfLoaderCircular v-if="wishlistLoading" class="flex justify-center items-center" size="sm" />
    <template v-else>
      <SfIconClose v-if="isWishlistItem(variationId) && discard" size="sm" />
      <SfIconFavoriteFilled v-else-if="isWishlistItem(variationId)" size="sm" />
      <SfIconFavorite v-else size="sm" />
      <slot />
    </template>
  </SfButton>
</template>

<script setup lang="ts">
import { WishlistButtonProps } from '~/components/WishlistButton/types';
import { SfButton, SfIconFavorite, SfIconFavoriteFilled, SfLoaderCircular, SfIconClose } from '@storefront-ui/vue';
import { productGetters } from '@plentymarkets/shop-sdk';

const props = withDefaults(defineProps<WishlistButtonProps>(), {
  quantity: 1,
  discard: false,
});
const { product, quantity } = toRefs(props);

const { t } = useI18n();
const { isWishlistItem, interactWithWishlist } = useWishlist();
const wishlistLoading = ref(false);

const productName = computed(() => productGetters.getName(product.value));
const variationId = computed(() => productGetters.getVariationId(product.value));

const onWishlistClick = async () => {
  wishlistLoading.value = true;
  await interactWithWishlist(variationId.value, quantity.value);
  wishlistLoading.value = false;
};
</script>
