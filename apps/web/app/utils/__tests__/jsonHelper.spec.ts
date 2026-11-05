describe('deepMergeExisting', () => {
  it('should overwrite primitive properties with source values', () => {
    const target = { name: 'John', age: 30 };
    const source = { age: 31 };

    const result = deepMergeExisting(target, source);

    expect(result).toEqual({ name: 'John', age: 31 });
  });

  it('should keep target properties missing from source untouched', () => {
    const target = { name: 'John', age: 30 };
    const source = {};

    const result = deepMergeExisting(target, source);

    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('should recursively merge nested objects without dropping sibling keys', () => {
    const target = { user: { name: 'John', address: { city: 'Berlin', zip: '10115' } } };
    const source = { user: { address: { zip: '20095' } } };

    const result = deepMergeExisting(target, source);

    expect(result).toEqual({ user: { name: 'John', address: { city: 'Berlin', zip: '20095' } } });
  });

  it('should replace arrays instead of merging them', () => {
    const target = { items: [1, 2, 3] };
    const source = { items: [4] };

    const result = deepMergeExisting(target, source);

    expect(result).toEqual({ items: [4] });
  });

  it('should not mutate the original target object', () => {
    const target = { user: { name: 'John' } };
    const source = { user: { name: 'Jane' } };

    deepMergeExisting(target, source);

    expect(target).toEqual({ user: { name: 'John' } });
  });
});
