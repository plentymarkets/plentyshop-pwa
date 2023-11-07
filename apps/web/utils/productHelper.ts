import { RouteParams } from '.nuxt/vue-router';
import { ProductParams } from '@plentymarkets/shop-api';

export const createProductParams = (params: RouteParams) => {
  const productPieces = (params.itemId as string).split('_');

  const productParams: ProductParams = {
    id: productPieces[0],
  };

  if (productPieces[1]) {
    productParams.variationId = productPieces[1];
  }

  return { productParams, productId: productParams.id.toString() };
};
