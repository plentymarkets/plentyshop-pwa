import { describe, expect, it } from 'vitest'
import de from '../../../lang/de.json';
import en from '../../../lang/en.json';

describe('i18n', () => {
    it('has the same keys in English and German', () => {
        haveEqualStructure(en, de);
    });
    
    it('has values for all English keys', () => {
        const valuesEn = Object.values(en);

        valuesEn.forEach(value => {
            hasText(value);
        })
    });

    it('has values for all German keys', () => {
        const valuesDe = Object.values(de);

        valuesDe.forEach(value => {
            hasText(value);
        })
    });
});

const haveEqualStructure = (lang1: object, lang2: object) => {
    hasAllKeys(lang1, lang2);
    hasAllKeys(lang2, lang1);
}

const hasAllKeys = (obj1: object, obj2: object) => {
    const object1Keys = Object.keys(obj1);

    object1Keys.forEach(key => {
        const nestedKey = obj1[key as keyof Object];

        if (isObject(nestedKey)) {
            hasAllKeys(nestedKey, obj2[key as keyof Object]);
        }

        expect(obj2).toHaveProperty(key);
    });
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

const isObject = (property: unknown) => {
    if (typeof property === 'object' && property !== null) {
        return true;
    }

    return false;
}
