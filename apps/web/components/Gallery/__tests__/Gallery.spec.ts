import { mount } from '@vue/test-utils';
import Gallery from '~/components/Gallery/Gallery.vue';

describe('<Gallery />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(Gallery, {
      props: {
        images: [{ alt: 'Test', url: '/images/test.webp', width: 400, height: 573 }],
      },
    });

    expect(getByTestId('gallery'));
  });
});
