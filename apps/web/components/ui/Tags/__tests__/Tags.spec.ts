import { mount } from '@vue/test-utils';
import Tags from '~/components/ui/Tags/Tags.vue';

describe('<Tags />', () => {
  it('should render component', () => {
    const wrapper = mount(Tags);

    expect(wrapper.getByTestId('tags'));
  });
});