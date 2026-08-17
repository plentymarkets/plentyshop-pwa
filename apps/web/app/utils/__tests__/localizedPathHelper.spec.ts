import { decodeLocalizedPathSlashes } from '../localizedPathHelper';

describe('decodeLocalizedPathSlashes', () => {
  it('should return the resolved path unchanged when it contains no encoded slash', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt/a-42', '/shirt/a-42')).toBe('/de/shirt/a-42');
  });

  it('should decode encoded slashes introduced while resolving the localized route', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42', '/shirt/a-42')).toBe('/de/shirt/a-42');
  });

  it('should decode every encoded slash of a nested category path', () => {
    expect(decodeLocalizedPathSlashes('/de/living-room%2Fchairs%2Fa-171', '/living-room/chairs/a-171')).toBe(
      '/de/living-room/chairs/a-171',
    );
  });

  it('should decode lowercase encoded slashes', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2fa-42', '/shirt/a-42')).toBe('/de/shirt/a-42');
  });

  it('should keep encoded slashes that were already present in the requested path', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42', '/shirt%2Fa-42')).toBe('/de/shirt%2Fa-42');
  });

  it('should decode the path while leaving encoded slashes in the query string untouched', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42?term=a%2Fb', '/shirt/a-42?term=a%2Fb')).toBe(
      '/de/shirt/a-42?term=a%2Fb',
    );
  });

  it('should not decode the path when only the query string contains an encoded slash', () => {
    expect(decodeLocalizedPathSlashes('/de/search?term=a%2Fb', '/search?term=a%2Fb')).toBe('/de/search?term=a%2Fb');
  });

  it('should keep the hash fragment intact', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42#reviews', '/shirt/a-42#reviews')).toBe(
      '/de/shirt/a-42#reviews',
    );
  });

  it('should keep both the query string and the hash fragment when decoding', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42?color=red#reviews', '/shirt/a-42?color=red#reviews')).toBe(
      '/de/shirt/a-42?color=red#reviews',
    );
  });

  it('should treat a hash placed before a question mark as the start of the fragment', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42#tab?x=1', '/shirt/a-42#tab?x=1')).toBe(
      '/de/shirt/a-42#tab?x=1',
    );
  });

  it('should not decode an encoded slash that only appears in the hash fragment', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt#a%2Fb', '/shirt#a%2Fb')).toBe('/de/shirt#a%2Fb');
  });

  it('should decode a path that consists only of an encoded slash', () => {
    expect(decodeLocalizedPathSlashes('%2F', '/')).toBe('/');
  });

  it('should return an empty resolved path unchanged', () => {
    expect(decodeLocalizedPathSlashes('', '/shirt/a-42')).toBe('');
  });

  it('should decode the path when the requested path is empty', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2Fa-42', '')).toBe('/de/shirt/a-42');
  });

  it('should decode consecutive encoded slashes', () => {
    expect(decodeLocalizedPathSlashes('/de/shirt%2F%2Fa-42', '/shirt//a-42')).toBe('/de/shirt//a-42');
  });

  it('should leave other percent encoded characters untouched', () => {
    expect(decodeLocalizedPathSlashes('/de/my%20shirt%2Fa-42', '/my%20shirt/a-42')).toBe('/de/my%20shirt/a-42');
  });
});
