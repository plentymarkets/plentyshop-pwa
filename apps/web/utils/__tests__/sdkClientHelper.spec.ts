import { updateVsfLocale } from "../sdkClientHelper";

describe('sdk client helper', () => {
    it('should update the locale', () => {
        const cookie = 'vsf-locale=en';
        const locale = 'fr';
        const result = updateVsfLocale(cookie, locale);
        expect(result).toBe('vsf-locale=fr');
    });

    it('should update the cookie in existing cookie string', () =>{
        const cookie = 'vsf-locale=en; test=123';
        const locale = 'de';
        const result = updateVsfLocale(cookie, locale);
        expect(result).toBe('vsf-locale=de;  test=123');
    });

    it('should update the locale when cookie is empty', () => {
        const cookie = '';
        const locale = 'de';
        const result = updateVsfLocale(cookie, locale);
        expect(result).toBe('; vsf-locale=de');
    });
});