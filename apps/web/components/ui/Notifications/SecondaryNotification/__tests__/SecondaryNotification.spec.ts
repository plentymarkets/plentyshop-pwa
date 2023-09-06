import { mount } from '@vue/test-utils';
import SecondaryNotification from '../SecondaryNotification.vue';

describe('<SecondaryNotification />', () => {
  it('should render component', () => {
    const wrapper = mount(SecondaryNotification, {
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