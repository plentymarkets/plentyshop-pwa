import { mount } from '@vue/test-utils';
import { UiFormLabel } from '#components';

describe('<FormLabel />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiFormLabel);

    expect(getByTestId('form-label'));
  });
});
