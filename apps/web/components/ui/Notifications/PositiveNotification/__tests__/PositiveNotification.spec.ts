import { mount } from '@vue/test-utils';
import { UiNotificationsPositiveNotification } from '#components';
describe('<PositiveNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(UiNotificationsPositiveNotification, {
      props: {
        notification: {
            message: 'Test alert positive',
            type: 'positive',
            persist: true,
            action: {
              text: 'action',
              onClick: () => {},
            }
        },
      },
    });

    expect(wrapper.getByTestId('PositiveNotification'));    
  });
});