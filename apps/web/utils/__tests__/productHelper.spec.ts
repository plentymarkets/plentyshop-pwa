import { generateBreadcrumbs } from "../productHelper";
import { CategoryTreeFixture } from "./__fixtures__/CategoryTree";
import ProductFixture from "./__fixtures__/Product";

describe('product helper', () => {
  it('generates breadcrumbs', () => {
    const breadcrumbs = generateBreadcrumbs(CategoryTreeFixture, ProductFixture, 'home');

    expect(breadcrumbs).toStrictEqual([
      { name: 'home', link: '/' },
      { name: 'Gear', link: '/gear' },
      { name: "Headphones Capybara", link: "#" }
    ]);
  })
})
