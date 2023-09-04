import { mount } from '@vue/test-utils';
import Notifications from '../Notifications.vue';

describe('<Notifications />', () => {
  it('should render component', () => {
    const wrapper = mount(Notifications);

    expect(wrapper.getByTestId('notifications'));    
  });
});