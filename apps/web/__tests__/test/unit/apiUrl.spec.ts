import { describe, expect, it } from 'vitest'
import { validateApiUrl } from '../../../utils/pathHelper';

describe('validateApiUrl function', () => {
    const expectedApiUrl = 'http://localhost:8181';

    it('should remove one trailing slash', () => {
        const apiUrl = `${expectedApiUrl}/`;
        expect(validateApiUrl(apiUrl)).toEqual(expectedApiUrl);
    });

    it('should remove multiple trailing slashes', () => {
        const apiUrl = `${expectedApiUrl}///`;
        expect(validateApiUrl(apiUrl)).toEqual(expectedApiUrl);
    });

    it('should return the same URL if there is no trailing slash', () => {
        const apiUrl = expectedApiUrl;
        expect(validateApiUrl(apiUrl)).toEqual(apiUrl);
    });
});
