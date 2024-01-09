 import { mount } from '@vue/test-utils';
 import ProductProperties from '~/components/AttributeSelect/AttributeSelect.vue';
import { ProductMock } from '../../../__tests__/fixtures/product.mock';
 describe('<ProductProperties />', () => {
   it('should render component', () => {
     const { getByTestId } = mount(ProductProperties, {
       props: {
         product: ProductMock
       }
     })
     expect(getByTestId('product-attributes'));
   });
 });
