import { mount } from '@vue/test-utils';
import { CategoryFiltersFilter } from '#components';

describe('<Filter />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CategoryFiltersFilter, {
      props: {
        facet: {
          id: '1',
          count: 3,
          name: 'test facet',
          names: [
            {
              lang: 'en',
              name: 'test facet translation name',
            },
          ],
          type: 'color',
          values: [
            {
              id: 1,
              name: 'red',
              names: [
                {
                  lang: 'en',
                  name: 'red',
                },
              ],
              cssClass: 'string',
              position: 0,
              count: 3,
            },
          ],
        },
      },
    });

    expect(getByTestId('accordion-item'));
  });
});
