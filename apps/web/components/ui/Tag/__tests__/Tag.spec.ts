import { mount } from '@vue/test-utils';
import { UiTag } from '#components';

describe('<Tag />', () => {
  it('should render component', () => {
    const wrapper = mount(UiTag);

    expect(wrapper.getByTestId('tag'));
  });
});
