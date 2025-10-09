import { mount } from '@vue/test-utils';
import { UiNotifications } from '#components';

describe('<Notifications />', () => {
  it('should render component', () => {
    const wrapper = mount(UiNotifications);

    expect(wrapper.getByTestId('notifications'));
  });
});
