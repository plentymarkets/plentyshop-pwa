import { describe, it, expect } from 'vitest';

const factory = (name: string) => () => [{ name }];

describe('collectBlockTemplateOverrides', () => {
  it('should map file names to template kinds', () => {
    const homepage = factory('Custom');

    const result = collectBlockTemplateOverrides([
      { '/modules/demo/runtime/utils/blockTemplates/homepage.ts': { default: homepage as never } },
    ]);

    expect(result.homepage).toBe(homepage);
  });

  it('should prefer later sources over earlier ones', () => {
    const moduleFactory = factory('Module');
    const customerFactory = factory('Customer');

    const result = collectBlockTemplateOverrides([
      { '/modules/a/runtime/utils/blockTemplates/product.ts': { default: moduleFactory as never } },
      { '/node_modules/b/runtime/utils/blockTemplates/product.ts': { default: customerFactory as never } },
    ]);

    expect(result.product).toBe(customerFactory);
  });

  it('should ignore unknown file names and modules without a default export', () => {
    const result = collectBlockTemplateOverrides([
      {
        '/modules/a/runtime/utils/blockTemplates/unknown.ts': { default: factory('X') as never },
        '/modules/a/runtime/utils/blockTemplates/header.ts': {},
      },
    ]);

    expect(result).toEqual({});
  });
});

describe('resolveBlockTemplate', () => {
  it('should return the core factory when no override exists', () => {
    const core = factory('Core');

    expect(resolveBlockTemplate('category', core as never, {})).toBe(core);
  });

  it('should return the override when one exists', () => {
    const core = factory('Core');
    const override = factory('Override');

    expect(resolveBlockTemplate('category', core as never, { category: override as never })).toBe(override);
  });
});
