<template>
    <UiProductCard
        :product="productCross"
        :key="productGetters.getId(productCross)"
        :name="productGetters.getName(productCross)"
        :slug="productGetters.getSlug(productCross) + `-${productGetters.getId(productCross)}`"
        :image-url="addModernImageExtension(productGetters.getMiddleImage(productCross))"
        :image-alt="productGetters.getName(productCross)"
        :image-height="productGetters.getImageHeight(productCross) ?? 600"
        :image-width="productGetters.getImageWidth(productCross) ?? 600"
        :price="productGetters.getSpecialPrice(productCross)"
        :rating-count="productGetters.getTotalReviews(productCross)"
        :rating="productGetters.getAverageRating(productCross)" 
    />
</template>

<script setup lang="ts">
    import { productGetters } from '@plentymarkets/shop-sdk';
    //import type { Product } from '@plentymarkets/shop-api';
    import type { ProductByIdProps } from '~/components/ProductById/types';
    console.log("drinne")
    const props = defineProps<ProductByIdProps>();

    const { addModernImageExtension, getImageForViewport } = useModernImage();
    //const productParams = {"slug":"","slug_2":"","slug_3":"","slug_4":"","slug_5":"","slug_6":"hut-breiter-h-sonnenschilder-sonnenschild","itemId":"14602"};
    const { productParams, productId } = createProductParams({"itemId":props.itemId});
    const { data: productCross } = useProduct(props.itemId);

  
</script>