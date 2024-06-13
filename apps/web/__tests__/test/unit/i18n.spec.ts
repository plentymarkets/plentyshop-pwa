import { describe, expect, it } from 'vitest'

const en = require('../../../lang/en.json')
const de = require('../../../lang/de.json')

describe('i18n', () => {
    it('has the same keys in English and German', () => {
        haveEqualStructure(en, de);
    });

    it('has values for all English keys', () => {
        const valuesEn: Array<string | object> = Object.values(en);

        valuesEn.forEach(value => {
            hasText(value);
        })
    });

    it('has values for all German keys', () => {
        const valuesDe: Array<string | object> = Object.values(de);

        valuesDe.forEach(value => {
            hasText(value);
        })
    });
});

const haveEqualStructure = (lang1: object, lang2: object) => {
    hasAllKeys(lang1, lang2);
    hasAllKeys(lang2, lang1);
}

const hasAllKeys = (obj1: object, obj2: object)  => {
    const obj1WorkingCopy = structuredClone(obj1)
    const obj2WorkingCopy = structuredClone(obj2)

    const obj1Skeleton = setValuesToEmptyString(obj1WorkingCopy);
    const obj2Skeleton = setValuesToEmptyString(obj2WorkingCopy);

    expect(obj1Skeleton).toEqual(obj2Skeleton);
}

const setValuesToEmptyString = (obj: Record<string, any>) => {
    Object.keys(obj).forEach((key) => {
        if (isObject(obj[key]) && obj[key] !== null) {
            setValuesToEmptyString(obj[key]);
        }
        if (typeof obj[key] === 'string') {
            obj[key] = '';
        }
    });

    return obj;
  }

const isObject = (item: any) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

const hasText = (value: string | object) => {
    if (isObject(value)) {
        expect(JSON.stringify(value)).not.toEqual('{}');

        Object.values(value).forEach(childValue => {
            hasText(childValue);
        })
    }

    expect(value).not.toEqual('');
}
