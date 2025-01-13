import { useProduct } from "../useProduct";
import { ProductMock } from "../../../__tests__/__mocks__/product.mock";

const expected_product = ProductMock;
const productId = expected_product.item.id.toString();


describe('useProduct', () => {
    it('should return Product', async () => {
        const { data: product } = useProduct(productId);

        expect(product.value).not.toBeUndefined();
    });
});
