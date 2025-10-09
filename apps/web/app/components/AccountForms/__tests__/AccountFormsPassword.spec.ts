import { mount } from '@vue/test-utils';
import { AccountFormsPassword } from '#components';

describe('<AccountFormsPassword />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(AccountFormsPassword);

    expect(getByTestId('account-forms-password'));
  });
});
