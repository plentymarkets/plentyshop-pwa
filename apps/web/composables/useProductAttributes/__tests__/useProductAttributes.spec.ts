describe('useProductAttributes', () => {
    it('initializes state correctly', () => {
        const { attributes, attributeValues, combinations, itemId, variationId } = useProductAttributes();

        expect(attributes.value).toEqual([]);
        expect(attributeValues.value).toEqual({});
        expect(combinations.value).toEqual([]);
        expect(itemId.value).toBe(0);
        expect(variationId.value).toBe(0);
    });

    it('updateValue updates attribute values', () => {
        const { updateValue, attributeValues } = useProductAttributes();
        updateValue(1, 1);

        expect(attributeValues.value).toEqual({});

        updateValue(1, 2);

        expect(attributeValues.value).toEqual({});
    });

    it('getCombination returns the correct combination', () => {
        const { getCombination } = useProductAttributes();
        const combination = getCombination();

        expect(combination).toEqual(null);
    });

    it('getValue returns the correct attribute value', () => {
        const { getValue } = useProductAttributes();
        const value = getValue(1);

        expect(value).toBe(undefined);
    });
});
