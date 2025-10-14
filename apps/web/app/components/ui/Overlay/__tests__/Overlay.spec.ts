import { mount } from '@vue/test-utils';
import { UiOverlay } from '#components';

describe('<Overlay />', () => {
  it('should render component', () => {
    const wrapper = mount(UiOverlay, {
      props: {
        visible: true,
      },
    });

    expect(wrapper.getByTestId('overlay'));
  });
});
