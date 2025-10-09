import { mount } from '@vue/test-utils';
import { Gallery } from '#components';

describe('<Gallery />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(Gallery, {
      props: {
        images: [
          {
            url: '/images/test.webp',
            width: 400,
            height: 573,
            urlMiddle: '',
            urlPreview: '',
            urlSecondPreview: '',
            cleanImageName: '',
            path: '',
            names: [''],
            position: 1,
          },
        ],
      },
      global: {
        stubs: {
          Drift: {
            template: '<div><slot /></div>',
          },
        },
      },
    });

    expect(getByTestId('gallery'));
  });
});
