import { useProduct } from "../useProduct";
import { ProductMock } from "../../../__tests__/__mocks__/product.mock";

let expected_product = ProductMock;
let productId = expected_product.item.id.toString();


describe('useProduct', () => {
    it('should return Product', async () => {
        const { data: product } = useProduct(productId);

        expect(product.value).not.toBeUndefined();
    });
});
