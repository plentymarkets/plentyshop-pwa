import { mount } from '@vue/test-utils';
import WarningNotification from '../WarningNotification.vue';

describe('<WarningNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(WarningNotification, {
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