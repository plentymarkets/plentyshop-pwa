import { describe, expect, it } from 'vitest'
import { getLocaleObject } from '../../../configuration/locale.config'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const en = require('../../../lang/en.json')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const de = require('../../../lang/de.json')

describe('i18n', () => {
    it('has the same keys in English and German', () => {
        haveEqualStructure(en, de);
    });

    it('has values for all English keys', () => {
        const valuesEn: Array<string | object> = Object.values(en);

        valuesEn.forEach((value) => {
            hasText(value);
        })
    });

    it('has values for all German keys', () => {
        const valuesDe: Array<string | object> = Object.values(de);

        valuesDe.forEach((value) => {
            hasText(value);
        })
    });
});

describe('locale configuration', () => {
    it('should create a locale configuration for each language', () => {
        const languages = 'en,de,fr';
        const EXPECTED = [
            { code: 'en', file: 'en.json' },
            { code: 'de', file: 'de.json' },
            { code: 'fr', file: 'fr.json' },
          ];
        const localeObject = getLocaleObject(languages);

        expect(localeObject).toEqual(EXPECTED);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const isObject = (item: unknown) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

const hasText = (value: string | object) => {
    if (isObject(value)) {
        expect(JSON.stringify(value)).not.toEqual('{}');

        Object.values(value).forEach((childValue) => {
            hasText(childValue);
        })
    }

    expect(value).not.toEqual('');
}
