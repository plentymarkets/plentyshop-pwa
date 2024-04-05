import { mount } from '@vue/test-utils';
import { NarrowContainer } from '#components';

describe('<NarrowContainer />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(NarrowContainer);

    expect(getByTestId('narrow-container'));
  });
});
