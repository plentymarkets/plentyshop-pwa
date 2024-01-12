import { mount } from '@vue/test-utils';
import Filter from '~/components/CategoryFilters/Filter.vue';

describe('<Filter />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(Filter, {
      props: {
        facet: {
          id: '1',
          count: 3,
          name: 'test facet',
          names:[ {
              lang: 'en',
              name: 'test facet translation name'
          }],
          type: 'color',
          values: [
            {
              id: 1,
              name: 'red',
              names: [
                {
                  lang: 'en',
                  name: 'red',
                }
              ],
              cssClass: 'string',
              position: 0,
              count: 3
            }
          ],
        }
      },
    });

    expect(getByTestId('accordion-item'));
  });
});

