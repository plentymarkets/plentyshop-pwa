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
    const objectCombined = mergeDeep(obj1, obj2);

    expect(objectCombined).toEqual(obj2);
}

const mergeDeep = (...objects: any) => {
    return objects.reduce((prev: any, obj: any) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, {});
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
