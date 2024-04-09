import { mount } from '@vue/test-utils';
import { UiNotificationsSecondaryNotification } from '#components';

describe('<SecondaryNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(UiNotificationsSecondaryNotification, {
      props: {
        notification: {
            message: 'Test alert secondary',
            type: 'secondary',
            persist: true,
            action: {
              text: 'action',
              onClick: () => {},
            }
        },
      },
    });

    expect(wrapper.getByTestId('SecondaryNotification'));    
  });
});