import { AccountData } from '#components';
import { mount } from '@vue/test-utils';

describe('<AccountData />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(AccountData, {
      props: {
        header: 'Header',
        buttonText: 'Button Text',
      },
    });

    expect(getByTestId('account-data'));
  });
});
