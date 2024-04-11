import { mount } from '@vue/test-utils';
import { UiNotificationsNegativeNotification } from '#components';


describe('<NegativeNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(UiNotificationsNegativeNotification, {
      props: {
        notification: {
            message: 'Test alert negative',
            type: 'negative',
            persist: true,
            action: {
              text: 'action',
              onClick: () => {},
            }
        },
      },
    });

    expect(wrapper.getByTestId('NegativeNotification'));    
  });
});