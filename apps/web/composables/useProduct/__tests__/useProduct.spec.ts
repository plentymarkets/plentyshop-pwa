import type { Product, ProductParams } from '@plentymarkets/shop-api';
import { useProduct } from "../useProduct";
import { ProductMock } from "../../../__tests__/__mocks__/product.mock";

let expected_product : Product = ProductMock;
let productId = ProductMock.item.id.toString();
let productParams: ProductParams = {id: productId};


describe('useProduct works properly', () => {
    it('should return Product', async () => {
        const { data: product, fetchProduct } = useProduct(productId);

        await fetchProduct(productParams);

        expect(product.value).toBe(expected_product);
    });
});
