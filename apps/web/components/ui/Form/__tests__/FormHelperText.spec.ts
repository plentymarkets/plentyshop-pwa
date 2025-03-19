import { mount } from '@vue/test-utils';
import { UiFormHelperText } from '#components';

describe('<FormHelperText />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiFormHelperText);

    expect(getByTestId('form-helper-text'));
  });
});
