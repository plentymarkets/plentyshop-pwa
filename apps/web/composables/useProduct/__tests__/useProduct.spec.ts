import { useProduct } from "../useProduct";
import { ProductMock } from "../../../__tests__/__mocks__/product.mock";

let expected_product = ProductMock;
let productId = expected_product.item.id.toString();


describe('useProduct', () => {
    it('should return Product', async () => {
        const { data: product } = useProduct(productId);

        expect(product.value).not.toBeUndefined();
    });
 
    it('should return breadcrumbs', async () => {
        const { breadcrumbs: breadcrumbs, generateBreadcrumbs } = useProduct(productId);
        const expected_Breadcrumbs = [
            { name: 'Home', link: '/' },
            { name: 'Gear', link: '/gear' },
            { name: 'Headphones Capybara', link: '#' }
        ];
    
        await generateBreadcrumbs();
    
        expect(breadcrumbs.value).toEqual(expected_Breadcrumbs);
    });
    
});
