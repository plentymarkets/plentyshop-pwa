import { mount } from '@vue/test-utils';
import { AccountFormsName } from '#components';

describe('<AccountFormsName />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(AccountFormsName);

    expect(getByTestId('account-forms-name'));    
  });
});