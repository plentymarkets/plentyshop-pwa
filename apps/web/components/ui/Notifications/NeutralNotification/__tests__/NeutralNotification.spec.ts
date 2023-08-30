import { mount } from '@vue/test-utils';
import NeutralNotification from '../NeutralNotification.vue';

describe('<NeutralNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(NeutralNotification, {
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