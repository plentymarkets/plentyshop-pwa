import { mount } from '@vue/test-utils';
import { UiNotificationsNeutralNotification } from '#components';

describe('<NeutralNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(UiNotificationsNeutralNotification, {
      props: {
        notification: {
            message: 'Test alert neutral',
            type: 'neutral',
            persist: true,
            action: {
              text: 'action',
              onClick: () => {},
            }
        },
      },
    });

    expect(wrapper.getByTestId('NeutralNotification'));    
  });
});