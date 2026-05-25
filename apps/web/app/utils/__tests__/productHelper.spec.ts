import { generateBreadcrumbs } from '../productHelper';
import ProductFixture from './__fixtures__/Product';

describe('product helper', () => {
  it('should generate breadcrumbs', () => {
    const breadcrumbs = generateBreadcrumbs(ProductFixture, 'home');

    expect(breadcrumbs).toStrictEqual([
      { name: 'home', link: '/' },
      { name: 'Gear', link: '/gear' },
      { name: 'Headphones Capybara', link: '#' },
    ]);
  });
});
