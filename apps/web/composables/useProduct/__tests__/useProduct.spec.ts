import type { Product, ProductParams } from '@plentymarkets/shop-api';
import { useProduct } from "../useProduct";
import { ProductMock } from "../../../__tests__/__mocks__/product.mock";
import { fetch } from '@nuxt/test-utils';

let expected_product = ProductMock;
let productId = ProductMock.item.id;
let productParams: ProductParams = {id: productId};


describe('useProduct works properly', () => {
    it('should return Product', async () => {
        const { data: product, fetchProduct } = useProduct(productId.toString());

        await fetchProduct(productParams);

        expect(product.value).toBe(expected_product);
    });
});
