import { mount } from '@vue/test-utils';
import { Gallery } from '#components';

describe('<Gallery />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(Gallery, {
      props: {
        images: [{ 
          url: '/images/test.webp',
          urlMiddle:'',
          urlPreview:'',
          urlSecondPreview: '',
          cleanImageName: '',
          path: '',
          names: [''],
          position: 1
        }],
      },
    });

    expect(getByTestId('gallery'));
  });
});
