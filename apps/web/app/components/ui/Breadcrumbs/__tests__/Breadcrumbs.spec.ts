import { mount } from '@vue/test-utils';
import { UiBreadcrumbs } from '#components';

describe('<Breadcrumbs />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiBreadcrumbs, {
      props: {
        breadcrumbs: [],
      },
    });

    expect(getByTestId('breadcrumbs'));
  });
});
