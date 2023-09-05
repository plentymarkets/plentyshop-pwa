import { mount } from '@vue/test-utils';
import NegativeNotification from '../NegativeNotification.vue';

describe('<NegativeNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(NegativeNotification, {
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