import { mount } from '@vue/test-utils';
import { CategoryEmptyState } from '#components';

describe('<CategoryEmptyState />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategoryEmptyState);

    expect(getByTestId('category-empty-state'));
  });
});
