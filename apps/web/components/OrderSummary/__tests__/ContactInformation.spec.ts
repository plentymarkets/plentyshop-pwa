import { mount } from '@vue/test-utils';
import { OrderSummary } from '#components';
import type { Cart } from '@plentymarkets/shop-api';

const cart: Cart =   {
  "id": 1,
  "sessionId": '1',
  "orderId": null,
  "customerId": null,
  "customerShippingAddressId": null,
  "currency": '1',
  "referrerId": 1,
  "shippingCountryId": 12,
  "methodOfPaymentId": 6000,
  "shippingProviderId": 101,
  "shippingProfileId": 6,
  "itemSum": 1,
  "itemSumNet": 1,
  "basketAmount": 1,
  "basketAmountNet": 1,
  "shippingAmount": 1,
  "shippingAmountNet": 1,
  "paymentAmount": 0,
  "couponCode": "",
  "couponDiscount": 0,
  "shippingDeleteByCoupon": false,
  "basketRebate": 0,
  "maxFsk": 0,
  "orderTimestamp": null,
  "createdAt": '1',
  "updatedAt": '1',
  "basketRebateType": "0",
  "customerInvoiceAddressId": null,
  "itemQuantity": 1,
  "totalVats": [
    {
      "vatAmount": 1,
      "vatValue": 19
    }
  ],
  "subAmount": 1,
  "isExportDelivery": true,
  "shopCountryId": 1,
  "itemWishListIds": {},
  "items": [
    {
      "id": 1,
      "quantity": 1,
      "price": 180,
      "itemId": 157,
      "variation": null,
      "variationId": 1100,
      "basketItemOrderParams": [],
      "inputLength": 0,
      "inputWidth": 0,
      "setComponents": [],
      "itemType": 1
    }
  ],
  "maxDeliveryDays": []
};

describe('<OrderSummary />', () => {
  it('should render component', () => {
    const wrapper = mount(OrderSummary, {
      props: {
        cart,
      }
    });

    expect(wrapper.getByTestId('order-summary'));
  });
});
