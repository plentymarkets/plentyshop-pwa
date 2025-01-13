import type { Product } from '@plentymarkets/shop-api';
import { ProductPriceFixture } from '../../../__tests__/__mocks__/product-price.mock';

const productWithPrices = {
    ...ProductPriceFixture,
    prices: {
        ...ProductPriceFixture.prices,
        specialOffer: { unitPrice: { value: 0 } },
        rrp: { unitPrice: { value: 120 } },
        graduatedPrices: [
            {
                price: {
                    value: 90,
                    formatted: "EUR 90.00"
                },
                unitPrice: {
                    value: 90,
                    formatted: "EUR 90.00"
                },
            }
        ]
    }
};

let product = { ...productWithPrices };
describe('useProductPrice', () => {

    beforeEach(() => {
        product = { ...productWithPrices };
    });

    it('should return price (first graduated price)', () => {
        const { price } = useProductPrice(product as Product);

        expect(price.value).toBe(90);
    });

    it('should return special offer price', () => {
        product.prices.specialOffer.unitPrice.value = 70;
        const { price } = useProductPrice(product as Product);

        expect(price.value).toBe(70);
    });

    it('should return graduated price if its cheaper than the special offer', () => {
        product.prices.specialOffer.unitPrice.value = 91;
        const { price } = useProductPrice(product as Product);

        expect(price.value).toBe(90);
    });

    it('should return crossed price', () => {
        product.prices.specialOffer.unitPrice.value = 0;
        const { crossedPrice } = useProductPrice(product as Product);

        expect(crossedPrice.value).toBe(120);
    });

    it('should return price instead of crossed price if there is a special offer', () => {
        product.prices.specialOffer.unitPrice.value = 70;
        const { crossedPrice } = useProductPrice(product as Product);

        expect(crossedPrice.value).toBe(100);
    });

    it('should return crossed price if there is no special offer', () => {
        product.prices.specialOffer.unitPrice.value = 0;

        const { crossedPrice } = useProductPrice(product as Product);

        expect(crossedPrice.value).toBe(120);
    });
});