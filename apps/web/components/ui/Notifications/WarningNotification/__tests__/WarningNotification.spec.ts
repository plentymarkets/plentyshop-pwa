import { mount } from '@vue/test-utils';
import { UiNotificationsWarningNotification } from '#components';

describe('<WarningNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(UiNotificationsWarningNotification, {
      props: {
        notification: {
            message: 'Test alert warning',
            type: 'warning',
            persist: true,
            action: {
              text: 'action',
              onClick: () => {},
            }
        },
      },
    });

    expect(wrapper.getByTestId('WarningNotification'));    
  });
});