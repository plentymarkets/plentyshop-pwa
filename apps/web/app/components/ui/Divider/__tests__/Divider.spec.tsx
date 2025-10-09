import { mount } from '@vue/test-utils';
import { UiDivider } from '#components';

describe('<Divider />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiDivider);

    expect(getByTestId('divider'));
  });
});
